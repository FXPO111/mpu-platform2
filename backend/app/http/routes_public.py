from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.repo import Repo
from app.db.session import get_db

router = APIRouter(prefix="/api/public", tags=["public"])


class DiagnosticSubmitIn(BaseModel):
    reasons: list[str] = Field(default_factory=list, min_length=1, max_length=2)
    other_reason: str | None = Field(default=None, max_length=120)
    situation: str = Field(min_length=12, max_length=2000)
    history: str = Field(min_length=12, max_length=2000)
    goal: str = Field(min_length=8, max_length=2000)


class DiagnosticSubmitOut(BaseModel):
    id: str
    recommended_plan: str


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
    return {"data": [{"id": str(p.id), "code": p.code, "price_cents": p.price_cents, "currency": p.currency, "type": p.type} for p in rows]}


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
