from app.integrations.payments_stripe import create_checkout_session


def test_create_checkout_session_uses_redirect_overrides(monkeypatch):
    captured = {}

    def fake_create(**kwargs):
        captured.update(kwargs)
        return {"id": "cs_test_1", "url": "https://checkout.stripe.test/session"}

    monkeypatch.setattr("app.integrations.payments_stripe.stripe.checkout.Session.create", fake_create)

    result = create_checkout_session(
        secret_key="sk_test_123",
        order_id="order-1",
        product_id="product-1",
        product_name="Plan Pro",
        unit_amount_cents=16900,
        currency="EUR",
        stripe_price_id=None,
        frontend_url="http://localhost:3000",
        customer_email="user@example.com",
        success_url_override="https://app.example.com/dashboard?checkout=success",
        cancel_url_override="https://app.example.com/pricing?checkout=cancelled",
    )

    assert result["id"] == "cs_test_1"
    assert captured["success_url"] == "https://app.example.com/dashboard?checkout=success"
    assert captured["cancel_url"] == "https://app.example.com/pricing?checkout=cancelled"
