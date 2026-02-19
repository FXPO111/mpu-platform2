from secrets import token_urlsafe
from typing import Literal

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.repo import Repo
from app.db.session import get_db
from app.domain.models import APIError
from app.integrations.payments_stripe import StripeError, create_checkout_session, is_stripe_configured
from app.security.auth import hash_password
from app.settings import settings

router = APIRouter(prefix="/api/public", tags=["public"])

PLAN_TO_PRODUCT_CODE: dict[str, str] = {
    "start": "PLAN_START",
    "pro": "PLAN_PRO",
    "intensive": "PLAN_INTENSIVE",
}


class DiagnosticSubmitIn(BaseModel):
    reasons: list[str] = Field(default_factory=list, min_length=1, max_length=2)
    other_reason: str | None = Field(default=None, max_length=120)
    situation: str = Field(min_length=12, max_length=2000)
    history: str = Field(min_length=12, max_length=2000)
    goal: str = Field(min_length=8, max_length=2000)


class DiagnosticSubmitOut(BaseModel):
    id: str
    recommended_plan: str


class PublicCheckoutIn(BaseModel):
    plan: Literal["start", "pro", "intensive"]
    email: str = Field(min_length=5, max_length=320)
    name: str | None = Field(default=None, max_length=120)


class PublicCheckoutOut(BaseModel):
    order_id: str
    checkout_session_id: str
    checkout_url: str | None


def detect_plan(payload: DiagnosticSubmitIn) -> str:
    text = " ".join(payload.reasons + [payload.other_reason or "", payload.situation, payload.history, payload.goal]).lower()
    intense_keywords = ["повтор", "отказ", "сложно", "долго", "стресс", "срочно", "конфликт", "инцидент"]
    pro_keywords = ["документ", "план", "трениров", "ошиб", "формулиров", "подготов"]

    if any(k in text for k in intense_keywords):
        return "intensive"
    if any(k in text for k in pro_keywords):
        return "pro"
    return "start"


@router.get("/expert")
def expert():
    return {
        "data": {
            "bio": "Certified MPU consultant",
            "languages": ["de", "en"],
            "city_for_offline": "Berlin",
            "pricing_summary": "AI packs + paid consultation slots",
        }
    }


@router.get("/products")
def products(db: Session = Depends(get_db)):
    repo = Repo(db)
    rows = repo.list_products()
    return {
        "data": [
            {"id": str(p.id), "code": p.code, "price_cents": p.price_cents, "currency": p.currency, "type": p.type}
            for p in rows
        ]
    }


@router.get("/slots")
def slots(db: Session = Depends(get_db)):
    repo = Repo(db)
    rows = repo.list_open_slots()
    return {"data": [{"id": str(s.id), "starts_at_utc": s.starts_at_utc.isoformat(), "duration_min": s.duration_min, "title": s.title} for s in rows]}


@router.post("/diagnostic", response_model=DiagnosticSubmitOut)
def submit_diagnostic(payload: DiagnosticSubmitIn, request: Request, db: Session = Depends(get_db)):
    recommended_plan = detect_plan(payload)
    row = Repo(db).create_diagnostic_submission(
        reasons=payload.reasons,
        other_reason=payload.other_reason,
        situation=payload.situation,
        history=payload.history,
        goal=payload.goal,
        recommended_plan=recommended_plan,
        meta_json={
            "source": "public_diagnostic",
            "ip": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
        },
    )
    db.commit()
    return DiagnosticSubmitOut(id=str(row.id), recommended_plan=row.recommended_plan)


@router.post("/checkout", response_model=PublicCheckoutOut)
def public_checkout(payload: PublicCheckoutIn, db: Session = Depends(get_db)):
    repo = Repo(db)
    product_code = PLAN_TO_PRODUCT_CODE[payload.plan]
    product = repo.get_product_by_code(product_code)
    if not product:
        raise APIError(
            "PRODUCT_NOT_FOUND",
            "Product is not configured",
            {"expected_codes": sorted(PLAN_TO_PRODUCT_CODE.values())},
            status_code=404,
        )

    if not is_stripe_configured(settings.stripe_secret_key):
        raise APIError("STRIPE_NOT_CONFIGURED", "Stripe keys are missing", status_code=503)

    user = repo.get_user_by_email(payload.email)
    if not user:
        name = (payload.name or payload.email.split("@")[0] or "Client")[:120]
        user = repo.create_user(
            email=payload.email,
            password_hash=hash_password(token_urlsafe(24)),
            name=name,
            locale="de",
        )

    order = repo.create_order(user.id, product, provider_ref=f"tmp_{token_urlsafe(18)}")
    order.provider = "stripe"
    order.status = "pending"

    try:
        session = create_checkout_session(
            secret_key=settings.stripe_secret_key,
            order_id=str(order.id),
            product_id=str(product.id),
            product_name=product.name_de,
            unit_amount_cents=product.price_cents,
            currency=product.currency,
            stripe_price_id=product.stripe_price_id,
            frontend_url=settings.frontend_url,
            customer_email=user.email,
        )
    except StripeError as exc:
        db.rollback()
        raise APIError("CHECKOUT_FAILED", "Stripe checkout failed", status_code=502) from exc

    order.provider_ref = session["id"]
    db.commit()

    return PublicCheckoutOut(
        order_id=str(order.id),
        checkout_session_id=session["id"],
        checkout_url=session.get("url"),
    )
