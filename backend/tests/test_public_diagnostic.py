from app.http.routes_public import DiagnosticSubmitIn, detect_plan


def test_detect_plan_intensive():
    payload = DiagnosticSubmitIn(
        reasons=["Поведение / инцидент"],
        situation="Был конфликт и высокий стресс в процессе.",
        history="Собрал документы и пробовал готовиться самостоятельно.",
        goal="Хочу быстро пройти MPU без повтора ошибок.",
    )

    assert detect_plan(payload) == "intensive"


def test_detect_plan_start_default():
    payload = DiagnosticSubmitIn(
        reasons=["Алкоголь"],
        situation="Собираю материалы и хочу понимать ближайшие шаги.",
        history="Есть базовая информация, дальше двигаюсь постепенно.",
        goal="Пройти процесс в комфортном темпе.",
    )

    assert detect_plan(payload) == "start"
