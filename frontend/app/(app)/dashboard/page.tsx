"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toPublicApiUrl } from "@/lib/public-api-base";

type PlanKey = "start" | "pro" | "intensive";
type ChatMessage = { id: string; role: "assistant" | "user"; content: string };
type Task = { id: string; text: string; done: boolean };
type DashboardView = "overview" | "plan" | "training" | "readiness";

const STORAGE = {
  submissionId: "diagnostic_submission_id",
  plan: "recommended_plan",
  session: "prep_session_v6",
  diagnostic: "diagnostic_answers",
};

const PLAN_LABEL: Record<PlanKey, string> = { start: "Start", pro: "Pro", intensive: "Intensive" };

function isUuid(v: string | null): boolean {
  if (!v) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function toView(v: string | null): DashboardView {
  if (v === "plan" || v === "training" || v === "readiness" || v === "overview") return v;
  return "overview";
}

export default function DashboardPage() {
  const params = useSearchParams();
  const view = toView(params.get("view"));

  const [plan, setPlan] = useState<PlanKey>("start");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readiness, setReadiness] = useState(48);
  const [focus, setFocus] = useState("алкоголь");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const p = localStorage.getItem(STORAGE.plan);
    if (p === "start" || p === "pro" || p === "intensive") setPlan(p);
    setSubmissionId(localStorage.getItem(STORAGE.submissionId));

    try {
      const d = JSON.parse(localStorage.getItem(STORAGE.diagnostic) || "{}") as { reasons?: string[] };
      if (d.reasons?.[0]) setFocus(d.reasons[0].toLowerCase());
    } catch {
      // ignore broken diagnostic in storage
    }

    const saved = localStorage.getItem(STORAGE.session);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { messages?: ChatMessage[]; tasks?: Task[]; readiness?: number };
        if (parsed.messages?.length) setMessages(parsed.messages);
        if (parsed.tasks?.length) setTasks(parsed.tasks);
        if (typeof parsed.readiness === "number") setReadiness(parsed.readiness);
        return;
      } catch {
        // ignore broken session in storage
      }
    }

    setMessages([{ id: "m0", role: "assistant", content: "Начнем. Расскажите коротко, что изменилось в вашей жизни за последний год." }]);
    setTasks([
      { id: "t1", text: "Короткий ответ о причинах прошлых ошибок", done: false },
      { id: "t2", text: "Ответ о том, что конкретно изменилось", done: false },
      { id: "t3", text: "Повтор ответа без пауз и противоречий", done: false },
    ]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!messages.length || !tasks.length) return;
    localStorage.setItem(STORAGE.session, JSON.stringify({ messages, tasks, readiness }));
  }, [messages, tasks, readiness]);

  const completed = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const stability = useMemo(() => Math.min(100, 45 + completed * 15), [completed]);
  const consistency = useMemo(() => Math.min(100, readiness + Math.floor(completed * 2)), [readiness, completed]);

  const send = async (prefill?: string) => {
    const text = (prefill ?? input).trim();
    if (!text || sending) return;

    const next = [...messages, { id: `u-${Date.now()}`, role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      let res: Response;
      try {
        res = await fetch(toPublicApiUrl("/api/public/therapy"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            diagnostic_submission_id: isUuid(submissionId) ? submissionId : undefined,
            locale: "ru",
            history: next.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      if (!res.ok) throw new Error("bad_response");
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: data.reply }]);
      setReadiness((v) => Math.min(100, v + 3));
    } catch {
      setError("Сервис временно занят. Повторите через пару секунд.");
      setMessages((prev) => [
        ...prev,
        { id: `f-${Date.now()}`, role: "assistant", content: "Добавьте конкретные факты: сроки, действия и результат." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const quick = (kind: "check" | "risk" | "strong") => {
    const map = {
      check: "Проверь мой ответ:",
      risk: "Найди противоречия и риски:",
      strong: "Усиль аргументы в ответе:",
    } as const;
    void send(`${map[kind]} ${input || "Мой ответ"}`);
  };

  return (
    <main className="cabinet-v2-main">
      <section className="cabinet-v2-hero">
        <div>
          <h1 className="cabinet-v2-title">Рабочий кабинет подготовки к MPU</h1>
          <p className="cabinet-v2-subtitle">Маршрут подготовки, практика ответов и текущий прогресс.</p>
        </div>
        <div className="cabinet-v2-chips">
          <span className="chip">План: {PLAN_LABEL[plan]}</span>
          <span className="chip">Этап: 2/4</span>
          <span className="chip">Направление: {focus}</span>
        </div>
      </section>

      {view === "overview" ? (
        <section className="cabinet-v2-overview-grid">
          <div className="cabinet-v2-status" id="readiness">
            <div className="cabinet-v2-status-top">
              <h2 className="h3">Общий прогресс</h2>
              <span className="cabinet-v2-score">{readiness}/100</span>
            </div>
            <div className="cabinet-v2-progress"><div style={{ width: `${readiness}%` }} /></div>
            <p className="small">Дальше: короткая тренировка и один уверенный повтор ответа.</p>
          </div>

          <div className="cabinet-v2-status">
            <div className="cabinet-v2-status-top"><h2 className="h3">Стабильность ответов</h2><span className="cabinet-v2-score">{stability}%</span></div>
            <div className="cabinet-v2-progress"><div style={{ width: `${stability}%` }} /></div>
            <p className="small">Чем выше показатель, тем увереннее и ровнее ответы на интервью.</p>
          </div>

          <div className="cabinet-v2-status">
            <div className="cabinet-v2-status-top"><h2 className="h3">Согласованность истории</h2><span className="cabinet-v2-score">{consistency}%</span></div>
            <div className="cabinet-v2-progress"><div style={{ width: `${consistency}%` }} /></div>
            <p className="small">Проверка на противоречия между разными ответами и блоками интервью.</p>
          </div>

          <div className="cabinet-v2-status">
            <div className="cabinet-v2-status-top"><h2 className="h3">Дневной ритм</h2><span className="cabinet-v2-score">{completed}/{tasks.length}</span></div>
            <div className="cabinet-v2-progress"><div style={{ width: `${(completed / Math.max(tasks.length,1)) * 100}%` }} /></div>
            <p className="small">Выполнение коротких ежедневных шагов повышает качество подготовки.</p>
          </div>
        </section>
      ) : null}

      {view === "plan" ? (
        <section className="cabinet-v2-block" id="plan">
          <h2 className="h3">План на сегодня</h2>
          <div className="cabinet-v2-task-list">
            {tasks.map((t) => (
              <label key={t.id} className="cabinet-v2-task-item">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => {
                    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
                    setReadiness((v) => Math.min(100, v + (t.done ? -2 : 2)));
                  }}
                />
                <span>{t.text}</span>
              </label>
            ))}
          </div>
          <p className="small">Выполнено: {completed}/{tasks.length}</p>
        </section>
      ) : null}

      {view === "training" ? (
        <section className="cabinet-v2-block" id="training">
          <h2 className="h3">Тренировка интервью</h2>

          <div className="cabinet-v2-actions">
            <Button variant="secondary" size="sm" onClick={() => quick("check")}>Проверить ответ</Button>
            <Button variant="secondary" size="sm" onClick={() => quick("risk")}>Найти риски</Button>
            <Button variant="secondary" size="sm" onClick={() => quick("strong")}>Усилить ответ</Button>
          </div>

          <div className="cabinet-v2-chat">
            {messages.map((m) => (
              <div key={m.id} className="cabinet-v2-msg">
                <div className="badge">{m.role === "assistant" ? "Эксперт" : "Вы"}</div>
                <p className="p">{m.content}</p>
              </div>
            ))}
          </div>

          <div className="cabinet-v2-input-wrap">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите ваш ответ..."
              className="cabinet-v2-input"
            />
            <Button onClick={() => void send()} disabled={sending || !input.trim()}>
              {sending ? "Идет проверка..." : "Отправить ответ"}
            </Button>
            {error ? <p className="help" style={{ color: "#9a4040" }}>{error}</p> : null}
          </div>
        </section>
      ) : null}

      {view === "readiness" ? (
        <section className="cabinet-v2-block" id="readiness">
          <h2 className="h3">Контроль готовности</h2>
          <div className="cabinet-v2-task-list">
            <div className="cabinet-v2-task-item"><span>Общий прогресс: {readiness}/100</span></div>
            <div className="cabinet-v2-task-item"><span>Стабильность ответов: {stability}%</span></div>
            <div className="cabinet-v2-task-item"><span>Согласованность истории: {consistency}%</span></div>
            <div className="cabinet-v2-task-item"><span>Шагов выполнено: {completed}/{tasks.length}</span></div>
          </div>
          <p className="small">Если все показатели выше 75, можно переходить к финальному прогону интервью.</p>
        </section>
      ) : null}
    </main>
  );
}
