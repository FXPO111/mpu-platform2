"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

type PlanKey = "start" | "pro" | "intensive";

type Plan = {
  key: PlanKey;
  title: string;
  price: string;
  period: string;
  items: string[];
};

const PLANS: Plan[] = [
  {
    key: "start",
    title: "Start",
    price: "€79",
    period: "14 дней",
    items: [
      "Диагностика и карта рисков",
      "План подготовки по неделям",
      "Базовые модули",
      "Тренировки интервью (лимит N)",
      "Чеклист документов",
    ],
  },
  {
    key: "pro",
    title: "Pro",
    price: "€169",
    period: "30 дней",
    items: [
      "Всё из Start",
      "Тренировки интервью без лимита",
      "Расширенная проверка формулировок",
      "Финальный контроль готовности + отчёт",
    ],
  },
  {
    key: "intensive",
    title: "Intensive",
    price: "€289",
    period: "45 дней",
    items: [
      "Всё из Pro",
      "Дополнительные итерации финальной проверки",
      "Приоритетная поддержка",
    ],
  },
];

function track(event: "view_pricing_section" | "select_plan_start" | "select_plan_pro" | "select_plan_intensive") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("analytics:event", { detail: { event } }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) gtag("event", event, {});
}

export default function PricingPage() {
  const params = useSearchParams();
  const [recommended, setRecommended] = useState<PlanKey>("pro");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fromUrl = params.get("plan");
    const fromStorage = typeof window !== "undefined" ? localStorage.getItem("recommended_plan") : null;
    const value = (fromUrl || fromStorage) as PlanKey | null;
    if (value === "start" || value === "pro" || value === "intensive") {
      setRecommended(value);
    }
  }, [params]);

  useEffect(() => {
    if (!rootRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track("view_pricing_section");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    obs.observe(rootRef.current);
    return () => obs.disconnect();
  }, []);

  const eventByPlan = useMemo(
    () => ({
      start: "select_plan_start",
      pro: "select_plan_pro",
      intensive: "select_plan_intensive",
    }) as const,
    [],
  );

  return (
    <div className="public-page-stack pricing-clean" id="pricing" ref={rootRef}>
      <section className="card pad pricing-clean-hero">
        <h1 className="h1">Выберите формат подготовки</h1>
        <p className="lead mt-12">Начните с диагностики — рекомендованный вариант уже отмечен на основе результата.</p>
      </section>

      <section className="plan-grid clean-grid">
        {PLANS.map((plan) => {
          const isRecommended = plan.key === recommended;
          return (
            <article key={plan.key} className={`clean-plan card pad ${isRecommended ? "clean-plan-featured" : ""}`}>
              <h2 className="h3">{plan.title}</h2>
              {isRecommended ? <p className="small mt-8">Рекомендуемый формат</p> : null}

              <div className="plan-price-wrap">
                <div className="plan-price">{plan.price}</div>
                <div className="small">{plan.period}</div>
              </div>

              <ul className="plan-list mt-16">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="hero-actions mt-16">
                <Link
                  href="/dashboard"
                  className="w-full"
                  onClick={() => track(eventByPlan[plan.key])}
                >
                  <Button className="w-full" variant={isRecommended ? "primary" : "secondary"}>
                    Выбрать {plan.title} и оплатить
                  </Button>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <p className="small">
        Результат зависит от исходных данных и выполнения программы. Подготовка снижает риск провала за счёт структуры,
        тренировок и контроля.
      </p>
    </div>
  );
}
