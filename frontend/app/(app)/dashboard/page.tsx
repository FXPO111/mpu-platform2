"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type PlanKey = "start" | "pro" | "intensive";

type DiagnosticAnswers = {
  reasons?: string[];
  otherReason?: string;
  situation?: string;
  history?: string;
  goal?: string;
};

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
};

const PLAN_LABEL: Record<PlanKey, string> = {
  start: "Start",
  pro: "Pro",
  intensive: "Intensive",
};

function resolveFocus(answers: DiagnosticAnswers): string[] {
  const reasons = answers.reasons ?? [];
  const focus = [
    reasons[0] ? `Триггер: ${reasons[0]}` : "Стабилизация эмоций",
    answers.goal ? `Цель: ${answers.goal}` : "Фокус на безопасных шагах",
    answers.situation ? "Разбор текущей ситуации" : "Определение контекста",
  ];

  if (answers.otherReason?.trim()) {
    focus.push(`Доп. фактор: ${answers.otherReason.trim()}`);
  }

  return focus;
}

function makeAiReply(userText: string, focus: string[]) {
  const normalized = userText.toLowerCase();

  if (normalized.includes("трев") || normalized.includes("страх")) {
    return "Понимаю, что тревога сейчас сильная. Давайте зафиксируем: что из происходящего вы можете контролировать сегодня, а что пока нет?";
  }

  if (normalized.includes("не знаю") || normalized.includes("не понимаю")) {
    return "Это нормально. Предлагаю микрошаг: опишите одну конкретную ситуацию за последние 24 часа, где было сложнее всего, и мы разложим её на части.";
  }

  return `Хороший шаг. Я зафиксировал это в вашем плане. Дальше предлагаю короткое упражнение по теме «${focus[0]}»: 3 минуты на факты, чувства и действие на сегодня.`;
}

export default function DashboardPage() {
  const diagnosticRaw = typeof window !== "undefined" ? localStorage.getItem("diagnostic_answers") : null;
  const submissionId = typeof window !== "undefined" ? localStorage.getItem("diagnostic_submission_id") : null;
  const recommendedRaw = typeof window !== "undefined" ? localStorage.getItem("recommended_plan") : null;

  const diagnostic = useMemo<DiagnosticAnswers>(() => {
    if (!diagnosticRaw) return {};
    try {
      return JSON.parse(diagnosticRaw) as DiagnosticAnswers;
    } catch {
      return {};
    }
  }, [diagnosticRaw]);

  const plan = (recommendedRaw === "start" || recommendedRaw === "pro" || recommendedRaw === "intensive"
    ? recommendedRaw
    : "start") as PlanKey;

  const focus = useMemo(() => resolveFocus(diagnostic), [diagnostic]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-1",
      role: "ai",
      text: "Привет. Я изучил вашу диагностику и собрал персональный план. Начнем с короткой проверки состояния: как вы сейчас себя чувствуете по шкале 1–10?",
    },
  ]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: makeAiReply(trimmed, focus),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  const riskLevel = diagnostic.history && diagnostic.history.length > 140 ? "Повышенный" : "Умеренный";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card pad">
        <div className="badge">После оплаты • Dashboard</div>
        <h1 className="h2" style={{ marginTop: 10 }}>Индивидуальный терапевтический маршрут</h1>
        <p className="p" style={{ marginTop: 8 }}>
          Диагностика сохранена. AI подбирает персональный подход и ведет с вами ежедневную психологическую практику.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <span className="chip">План: {PLAN_LABEL[plan]}</span>
          <span className="chip">Риск: {riskLevel}</span>
          {submissionId ? <span className="chip">ID: {submissionId}</span> : null}
        </div>
      </div>

      <div className="grid2">
        <section className="card pad">
          <h2 className="h3">Профиль на основе диагностики</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <div className="card pad" style={{ boxShadow: "none" }}>
              <div className="badge">Фокус терапии</div>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--muted)", lineHeight: 1.6 }}>
                {focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card pad" style={{ boxShadow: "none" }}>
              <div className="badge">Что AI делает дальше</div>
              <div className="p" style={{ marginTop: 8 }}>
                1) Ежедневный check-in. 2) Упражнения на саморегуляцию. 3) Разбор триггеров и формирование новых реакций.
              </div>
            </div>
          </div>

          <div className="hr" />
          <div className="small">
            Важно: это цифровая психологическая поддержка и тренировка навыков, не экстренная помощь.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link href="/booking">
              <Button variant="secondary">Запланировать сессию с куратором</Button>
            </Link>
          </div>
        </section>

        <section className="card pad">
          <h2 className="h3">AI-терапия: первая сессия</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 14, maxHeight: 420, overflow: "auto", paddingRight: 4 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                className="card pad"
                style={{
                  boxShadow: "none",
                  borderColor: m.role === "ai" ? "rgba(34,197,94,.35)" : "rgba(255,255,255,.12)",
                  background: m.role === "ai" ? "rgba(34,197,94,.08)" : "rgba(255,255,255,.04)",
                }}
              >
                <div className="badge">{m.role === "ai" ? "AI-психолог" : "Вы"}</div>
                <p className="p" style={{ marginTop: 8 }}>{m.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Опишите текущее состояние, мысль или сложную ситуацию..."
              style={{
                width: "100%",
                minHeight: 90,
                resize: "vertical",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(0,0,0,.26)",
                color: "var(--text)",
                padding: 12,
                outline: "none",
              }}
            />
            <Button onClick={sendMessage}>Отправить и продолжить сессию</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
