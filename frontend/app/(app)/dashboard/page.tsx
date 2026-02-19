"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toPublicApiUrl } from "@/lib/public-api-base";

type PlanKey = "start" | "pro" | "intensive";

type DiagnosticAnswers = {
  reasons?: string[];
  otherReason?: string;
  situation?: string;
  history?: string;
  goal?: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type TherapySessionState = {
  messages: ChatMessage[];
};

const STORAGE_KEYS = {
  diagnostic: "diagnostic_answers",
  recommendedPlan: "recommended_plan",
  submissionId: "diagnostic_submission_id",
  session: "therapy_session_v2",
};

const PLAN_LABEL: Record<PlanKey, string> = {
  start: "Start",
  pro: "Pro",
  intensive: "Intensive",
};

function normalizePlan(value: string | null): PlanKey {
  if (value === "start" || value === "pro" || value === "intensive") return value;
  return "start";
}

function safeParseDiagnostic(raw: string | null): DiagnosticAnswers {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as DiagnosticAnswers;
  } catch {
    return {};
  }
}

function buildFocus(diagnostic: DiagnosticAnswers): string[] {
  const reasons = diagnostic.reasons ?? [];
  return [
    reasons[0] ? `Триггер: ${reasons[0]}` : "Триггер: эмоциональная перегрузка",
    diagnostic.goal ? `Цель: ${diagnostic.goal}` : "Цель: стабильное состояние перед MPU",
    diagnostic.situation ? "Разбор актуальной ситуации" : "Формирование безопасной поведенческой модели",
  ];
}

function getInitialAssistantMessage(focus: string[]): ChatMessage {
  return {
    id: "assistant-initial",
    role: "assistant",
    content:
      "Добро пожаловать в персональный терапевтический кабинет. Я ваш ИИ-специалист и веду полный индивидуальный прием. " +
      `Сегодня начинаем с фокуса «${focus[0]}». Оцените состояние по шкале 1–10 и опишите, что сейчас тяжелее всего.`,
  };
}

export default function DashboardPage() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticAnswers>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanKey>("start");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState("moderate");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const parsedDiagnostic = safeParseDiagnostic(localStorage.getItem(STORAGE_KEYS.diagnostic));
    const storedPlan = normalizePlan(localStorage.getItem(STORAGE_KEYS.recommendedPlan));
    const storedSubmissionId = localStorage.getItem(STORAGE_KEYS.submissionId);

    setDiagnostic(parsedDiagnostic);
    setPlan(storedPlan);
    setSubmissionId(storedSubmissionId);

    const focus = buildFocus(parsedDiagnostic);
    const storedSession = localStorage.getItem(STORAGE_KEYS.session);
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession) as TherapySessionState;
        if (parsed.messages?.length) {
          setMessages(parsed.messages);
          return;
        }
      } catch {
        // ignore broken state
      }
    }

    setMessages([getInitialAssistantMessage(focus)]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!messages.length) return;
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ messages }));
  }, [messages]);

  const focus = useMemo(() => buildFocus(diagnostic), [diagnostic]);

  const hasDiagnostic = Boolean(
    (diagnostic.reasons && diagnostic.reasons.length) || diagnostic.situation || diagnostic.history || diagnostic.goal,
  );

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setApiError(null);

    try {
      const apiUrl = toPublicApiUrl("/api/public/therapy");
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          diagnostic_submission_id: submissionId,
          locale: "ru",
          history: nextMessages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { reply: string; plan: PlanKey; risk_level: string };

      setRiskLevel(data.risk_level || "moderate");
      if (data.plan === "start" || data.plan === "pro" || data.plan === "intensive") {
        setPlan(data.plan);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setApiError("Не удалось получить ответ специалиста. Проверьте backend/OPENAI_API_KEY и повторите.");
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-fallback-${Date.now()}`,
          role: "assistant",
          content:
            "Сбой связи с сервером. Пока продолжим вручную: опишите одну конкретную ситуацию за последние 24 часа и ваше действие в этой ситуации.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section className="card pad">
        <div className="badge">После оплаты • Полноценный AI-прием</div>
        <h1 className="h2" style={{ marginTop: 10 }}>
          Личный кабинет психологической терапии MPU
        </h1>
        <p className="p" style={{ marginTop: 8 }}>
          Это не демо: здесь идет реальная сессия через backend + GPT API по вашей диагностике.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <span className="chip">План: {PLAN_LABEL[plan]}</span>
          <span className="chip">Риск: {riskLevel === "high" ? "Высокий" : "Умеренный"}</span>
          <span className="chip">Фокус: {focus[0]}</span>
          {submissionId ? <span className="chip">ID диагностики: {submissionId}</span> : null}
        </div>
      </section>

      {!hasDiagnostic ? (
        <section className="card pad soft">
          <h2 className="h3">Нет данных диагностики</h2>
          <p className="p" style={{ marginTop: 8 }}>
            Для персональной терапии сначала заполните диагностику, чтобы ИИ получил исходный клинический контекст.
          </p>
          <div style={{ marginTop: 12 }}>
            <Link href="/diagnostic">
              <Button>Пройти диагностику</Button>
            </Link>
          </div>
        </section>
      ) : null}

      <div className="grid2">
        <section className="card pad">
          <h2 className="h3">Клиническая карта случая</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {focus.map((item) => (
              <div key={item} className="card pad" style={{ boxShadow: "none" }}>
                <div className="badge">Терапевтический фокус</div>
                <p className="p" style={{ marginTop: 8 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div className="hr" />
          <div className="small">
            При признаках острого кризиса необходимо обращаться в экстренные службы по месту нахождения.
          </div>
        </section>

        <section className="card pad">
          <h2 className="h3">Сессия со специалистом AI</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 12, maxHeight: 430, overflow: "auto", paddingRight: 6 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                className="card pad"
                style={{
                  boxShadow: "none",
                  borderColor: m.role === "assistant" ? "rgba(34,197,94,.38)" : "rgba(255,255,255,.14)",
                  background: m.role === "assistant" ? "rgba(34,197,94,.08)" : "rgba(255,255,255,.05)",
                }}
              >
                <div className="badge">{m.role === "assistant" ? "AI-специалист" : "Вы"}</div>
                <p className="p" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                  {m.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Напишите состояние, мысли, эмоции, события и что хотите изменить..."
              style={{
                width: "100%",
                minHeight: 110,
                resize: "vertical",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(0,0,0,.26)",
                color: "var(--text)",
                padding: 12,
                outline: "none",
              }}
            />
            <Button onClick={() => void sendMessage()} disabled={isSending || !input.trim()}>
              {isSending ? "Специалист формирует ответ..." : "Отправить в терапию"}
            </Button>
            {apiError ? <p className="help">{apiError}</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
