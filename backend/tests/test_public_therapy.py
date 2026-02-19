from app.integrations.llm_openai import generate_therapy_reply


def test_generate_therapy_reply_fallback_when_no_key(monkeypatch):
    monkeypatch.setattr("app.integrations.llm_openai.settings.openai_api_key", "")

    reply = generate_therapy_reply(
        locale="ru",
        diagnostic_context={"focus": ["Триггер: алкоголь"]},
        history=[{"role": "user", "content": "Мне тревожно"}],
        user_message="Мне тревожно",
    )

    assert "Триггер: алкоголь" in reply
    assert len(reply) > 30
