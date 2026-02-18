"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const STEPS = [
  { key: "reason", title: "Причина MPU", hint: "Alkohol / Drogen / Punkte / Verhalten" },
  { key: "timeline", title: "Хронология", hint: "Когда произошло, какие изменения уже сделаны" },
  { key: "docs", title: "Документы", hint: "Что уже есть и что нужно подготовить" },
  { key: "goal", title: "Цель по срокам", hint: "Когда планируете выход на финальный этап MPU" },
];

export default function DiagnosticPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const step = STEPS[stepIndex];
  const value = answers[step.key] ?? "";
  const canMove = value.trim().length >= 8;
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / STEPS.length) * 100),
    [stepIndex]
  );

  return (
    <div className="public-page-stack">
      <section className="card pad">
        <div className="badge">
          Диагностика • шаг {stepIndex + 1}/{STEPS.length} • {progress}%
        </div>
        <h1 className="h2 mt-10">{step.title}</h1>
        <p className="p mt-8">{step.hint}</p>

        <div className="mt-12">
          <Input
            placeholder="Ответьте кратко и по существу"
            value={value}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [step.key]: e.target.value }))
            }
          />
        </div>

        <div className="hero-actions">
          <Button
            variant="ghost"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
          >
            Назад
          </Button>

          {stepIndex < STEPS.length - 1 ? (
            <Button
              disabled={!canMove}
              onClick={() =>
                setStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))
              }
            >
              Далее
            </Button>
          ) : (
            <Button
              disabled={!canMove}
              onClick={() => {
                localStorage.setItem("diagnostic_result", JSON.stringify(answers));
                setSaved(true);
              }}
            >
              Получить результат
            </Button>
          )}
        </div>
      </section>

      {saved ? (
        <section className="card pad soft">
          <div className="badge">Результат диагностики</div>
          <p className="p mt-10">
            Карта рисков и рекомендации сохранены. Следующий шаг — выбрать формат
            подготовки и запустить программу.
          </p>
          <div className="hero-actions">
            <Link href="/#pricing">
              <Button>Выбрать тариф</Button>
            </Link>
            <Link href="/#program">
              <Button variant="secondary">Посмотреть программу</Button>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
