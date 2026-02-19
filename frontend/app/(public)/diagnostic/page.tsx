"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PlanKey = "start" | "pro" | "intensive";

const STEPS = [
  { key: "topic", title: "Тема подготовки", hint: "Alkohol / Drogen / Punkte / Verhalten" },
  { key: "history", title: "Краткая история", hint: "Что произошло и какие выводы уже сделаны" },
  { key: "changes", title: "Изменения", hint: "Какие шаги уже предприняты" },
  { key: "docs", title: "Документы", hint: "Что готово сейчас" },
];

function detectPlan(answers: Record<string, string>): PlanKey {
  const text = Object.values(answers).join(" ").toLowerCase();
  const intenseKeywords = ["повтор", "отказ", "сложно", "долго", "стресс", "противореч"];
  const proKeywords = ["документ", "план", "трениров", "ошиб", "формулиров"];

  if (intenseKeywords.some((k) => text.includes(k))) return "intensive";
  if (proKeywords.some((k) => text.includes(k))) return "pro";
  return "start";
}

export default function DiagnosticPage() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const step = STEPS[i];
  const value = answers[step.key] ?? "";
  const canNext = value.trim().length >= 8;
  const progress = useMemo(() => Math.round(((i + 1) / STEPS.length) * 100), [i]);
  const recommended = useMemo(() => detectPlan(answers), [answers]);

  return (
    <div className="public-page-stack">
      <section className="card pad">
        <h1 className="h2">Диагностика</h1>
        <p className="p mt-8">
          Шаг {i + 1} из {STEPS.length} • {progress}%
        </p>
        <h2 className="h3 mt-12">{step.title}</h2>
        <p className="small mt-8">{step.hint}</p>

        <div className="mt-12">
          <Input
            placeholder="Ответьте коротко и по делу"
            value={value}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [step.key]: e.target.value }))}
          />
        </div>

        <div className="hero-actions">
          <Button variant="ghost" disabled={i === 0} onClick={() => setI((prev) => Math.max(0, prev - 1))}>
            Назад
          </Button>

          {i < STEPS.length - 1 ? (
            <Button disabled={!canNext} onClick={() => setI((prev) => Math.min(STEPS.length - 1, prev + 1))}>
              Далее
            </Button>
          ) : (
            <Button
              disabled={!canNext}
              onClick={() => {
                localStorage.setItem("diagnostic_answers", JSON.stringify(answers));
                localStorage.setItem("recommended_plan", recommended);
                setDone(true);
              }}
            >
              Показать результат
            </Button>
          )}
        </div>
      </section>

      {done ? (
        <section className="card pad soft">
          <h2 className="h3">Результат диагностики</h2>
          <p className="p mt-10">
            Рекомендуемый формат подготовки:{" "}
            <strong>{recommended === "start" ? "Start" : recommended === "pro" ? "Pro" : "Intensive"}</strong>. Вы
            можете перейти к оплате или выбрать другой вариант вручную.
          </p>
          <div className="hero-actions">
            <Link href={`/pricing?plan=${recommended}`}>
              <Button>Выбрать формат и оплатить</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary">Смотреть все тарифы</Button>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
