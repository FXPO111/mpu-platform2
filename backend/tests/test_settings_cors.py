from app.settings import Settings


def test_cors_origins_accepts_plain_string_env(monkeypatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "*")
    s = Settings()
    assert s.cors_allow_origins == ["*"]


def test_cors_origins_accepts_comma_separated_env(monkeypatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "http://localhost:3000, https://example.com")
    s = Settings()
    assert s.cors_allow_origins == ["http://localhost:3000", "https://example.com"]
