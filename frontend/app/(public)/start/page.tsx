"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const STEPS = [
  { k: "reason", title: "Причина MPU", hint: "Алкоголь / наркотики / баллы / агрессия / другое" },
  { k: "timeline", title: "Хронология", hint: "Когда произошло, что было дальше, сроки" },
  { k: "changes", title: "Изменения", hint: "Что изменили: терапия, курсы, анализы, поведение" },
  { k: "docs", title: "Документы", hint: "Что есть на руках, чего не хватает" },
];

export default function StartPage() {
  const [i, setI] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});

  const step = STEPS[i];
  const value = data[step.k] ?? "";
  const canNext = value.trim().length >= 8;
  const progress = useMemo(() => Math.round(((i + 1) / STEPS.length) * 100), [i]);

  return (
    <div className="public-page-stack">
      <section className="card pad">
        <div className="badge">Диагностика • шаг {i + 1}/{STEPS.length} • {progress}%</div>
        <h1 className="h2 mt-10">{step.title}</h1>
        <p className="p mt-8">{step.hint}</p>

        <div className="mt-12">
          <Input
            placeholder="Введите кратко, но по сути"
            value={value}
            onChange={(e) => setData((p) => ({ ...p, [step.k]: e.target.value }))}
          />
        </div>

        <div className="hero-actions">
          <Button
            variant="ghost"
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(0, v - 1))}
          >
            Назад
          </Button>

          {i < STEPS.length - 1 ? (
            <Button disabled={!canNext} onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}>
              Далее
            </Button>
          ) : (
            <Button
              disabled={!canNext}
              onClick={() => {
                localStorage.setItem("mpu_draft", JSON.stringify(data));
                alert("Диагностика сохранена. Следующий шаг: выберите пакет и запустите программу подготовки.");
              }}
            >
              Сохранить и перейти к пакетам
            </Button>
          )}
        </div>
      </section>

      <section className="card pad soft">
        <div className="badge">После диагностики</div>
        <p className="p mt-10">
          Вы получаете базовый профиль кейса, а затем выбираете пакет сопровождения. После оплаты открывается
          полный маршрут подготовки с контролем этапов и тренировками.
        </p>
      </section>
    </div>
  );
}
