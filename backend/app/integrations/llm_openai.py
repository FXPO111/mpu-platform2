from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

from app.settings import settings

DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")


def _fallback(mode: str, question: str, locale: str) -> str:
    if (locale or "de").strip().lower().startswith("de"):
        return (
            "Feedback: Bitte antworten Sie konkreter (Fakten, Zeitpunkte, Ihr Anteil).\n\n"
            f"Nächste Frage: {question}"
        )
    return (
        "Feedback: Please be more concrete (facts, dates, your responsibility).\n\n"
        f"Next question: {question}"
    )


def generate_assistant_reply(mode: str, question: str, user_answer: str, locale: str) -> str:
    """
    Generates assistant reply for MPU training.
    Output contract:
      - short feedback on user's last answer (clarity/responsibility/specificity/consistency)
      - then asks the provided `question` as the next question
    """
    if not getattr(settings, "openai_api_key", None):
        return _fallback(mode=mode, question=question, locale=locale)

    loc = (locale or "de").strip().lower()
    is_de = loc.startswith("de")

    if is_de:
        system = (
            "Du bist ein strenger MPU-Interviewtrainer. "
            "Deine Aufgabe: kurze, konkrete Rückmeldung geben und dann die nächste Frage stellen. "
            "Keine langen Erklärungen, keine Floskeln. Keine erfundenen Fakten.\n"
            "Format:\n"
            "Feedback: 2-4 Sätze (Klarheit, Verantwortung, Konkretheit, evtl. Widerspruch).\n"
            "Nächste Frage: <genau eine Frage>\n"
        )
        user = (
            f"Modus: {mode}\n"
            f"Letzte Antwort des Nutzers:\n{user_answer}\n\n"
            f"Bitte stelle als nächste Frage exakt diese:\n{question}\n"
        )
    else:
        system = (
            "You are a strict MPU interview trainer. "
            "Your job: give short, concrete feedback, then ask the next question. "
            "No long explanations, no fluff. Do not invent facts.\n"
            "Format:\n"
            "Feedback: 2-4 sentences (clarity, responsibility, specificity, contradictions if any).\n"
            "Next question: <exactly one question>\n"
        )
        user = (
            f"Mode: {mode}\n"
            f"User's last answer:\n{user_answer}\n\n"
            f"Ask exactly this as the next question:\n{question}\n"
        )

    model = getattr(settings, "openai_model", None) or DEFAULT_MODEL

    # 1) Try Responses API (new)
    try:
        from openai import OpenAI  # type: ignore

        client = OpenAI(api_key=settings.openai_api_key)

        resp = client.responses.create(
            model=model,
            instructions=system,
            input=user,
        )

        text = getattr(resp, "output_text", None)
        if text and str(text).strip():
            return str(text).strip()

        # fallback: try to extract from structured output
        try:
            out: list[str] = []
            for item in getattr(resp, "output", []) or []:
                if getattr(item, "type", None) == "message":
                    for c in getattr(item, "content", []) or []:
                        if getattr(c, "type", None) in ("output_text", "text"):
                            out.append(getattr(c, "text", "") or "")
            joined = "\n".join([t for t in out if t]).strip()
            if joined:
                return joined
        except Exception:
            pass

        return _fallback(mode=mode, question=question, locale=locale)

    except Exception:
        pass

    # 2) Fallback to Chat Completions (older envs)
    try:
        from openai import OpenAI  # type: ignore

        client = OpenAI(api_key=settings.openai_api_key)
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        )
        content = resp.choices[0].message.content
        if content and content.strip():
            return content.strip()
    except Exception:
        pass

    return _fallback(mode=mode, question=question, locale=locale)


def _therapy_fallback(locale: str, focus: list[str]) -> str:
    focus_text = focus[0] if focus else "стабилизация состояния"
    loc = (locale or "ru").strip().lower()
    if loc.startswith("de"):
        return (
            "Ich bin bei Ihnen. Für den heutigen Schritt konzentrieren wir uns auf innere Stabilität. "
            f"Fokus: {focus_text}. "
            "Beschreiben Sie bitte: 1) was passiert ist, 2) was Sie dabei gedacht haben, "
            "3) welche kleine sichere Handlung Sie heute machen."
        )
    if loc.startswith("en"):
        return (
            "I am with you. For today, we focus on stabilization. "
            f"Focus: {focus_text}. "
            "Please describe: 1) what happened, 2) what you thought, 3) one small safe action you can do today."
        )
    return (
        "Я рядом и веду вас по шагам. Сегодня фокус — стабилизация и снижение внутреннего напряжения. "
        f"Текущий акцент: {focus_text}. "
        "Опишите, пожалуйста: 1) что произошло, 2) какая мысль была в моменте, "
        "3) какое одно безопасное действие вы сделаете сегодня."
    )


def generate_therapy_reply(
    *,
    locale: str,
    diagnostic_context: dict[str, Any],
    history: list[dict[str, str]],
    user_message: str,
) -> str:
    if not getattr(settings, "openai_api_key", None):
        return _therapy_fallback(locale=locale, focus=diagnostic_context.get("focus", []))

    loc = (locale or "ru").strip().lower()
    is_ru = loc.startswith("ru")

    if is_ru:
        system = (
            "Ты — опытный ИИ-психолог для клиента MPU: ведешь полную терапевтическую сессию, "
            "говоришь профессионально и эмпатично, структурируешь разговор как специалист. "
            "Задача: снизить тревогу, повысить ответственность, сформировать реалистичный план изменений. "
            "Используй контекст диагностики. Отвечай на русском. "
            "Формат ответа: "
            "1) короткая валидация состояния (1-2 предложения), "
            "2) аналитика по сути запроса (2-4 предложения), "
            "3) конкретное упражнение/шаг на сегодня (нумерованный список 2-4 пункта), "
            "4) один точный вопрос для продолжения сессии. "
            "Не давай юридических обещаний и не выдумывай факты."
        )
    elif loc.startswith("de"):
        system = (
            "Du bist ein erfahrener KI-Psychologe für MPU-Klienten. "
            "Führe eine volle therapeutische Sitzung mit Empathie und klarer Struktur. "
            "Ziel: Anspannung reduzieren, Verantwortung stärken, realistischen Veränderungsplan aufbauen. "
            "Nutze Diagnostik-Kontext. Antworte auf Deutsch. "
            "Format: Validierung, kurze Analyse, konkrete 2-4 Schritte, eine präzise Folgefrage."
        )
    else:
        system = (
            "You are an experienced AI psychologist for MPU clients. "
            "Run a full therapy-style session with empathy and professional structure. "
            "Goal: reduce distress, increase responsibility, build realistic behavior change plan. "
            "Use diagnostic context. "
            "Format: validation, concise analysis, concrete 2-4 step exercise, one precise follow-up question."
        )

    snippets: list[str] = []
    for msg in history[-8:]:
        role = "Клиент" if msg.get("role") == "user" else "ИИ"
        snippets.append(f"{role}: {msg.get('content', '').strip()}")

    user_input = (
        f"Контекст диагностики: {diagnostic_context}\n\n"
        f"Недавняя история диалога:\n" + "\n".join(snippets) + "\n\n"
        f"Текущее сообщение клиента:\n{user_message.strip()}"
    )

    model = getattr(settings, "openai_model", None) or DEFAULT_MODEL
    client = OpenAI(api_key=settings.openai_api_key)

    try:
        resp = client.responses.create(
            model=model,
            instructions=system,
            input=user_input,
        )
        text = getattr(resp, "output_text", None)
        if text and str(text).strip():
            return str(text).strip()
    except Exception:
        pass

    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_input},
            ],
        )
        content = resp.choices[0].message.content
        if content and content.strip():
            return content.strip()
    except Exception:
        pass

    return _therapy_fallback(locale=locale, focus=diagnostic_context.get("focus", []))
