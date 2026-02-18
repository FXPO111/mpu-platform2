"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type EventName =
  | "cta_start_diagnostic_click"
  | "view_pricing_section"
  | "select_plan_start"
  | "select_plan_pro"
  | "select_plan_intensive"
  | `faq_open_question_${number}`;

function track(event: EventName, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const body = { event, ...payload };
  window.dispatchEvent(new CustomEvent("analytics:event", { detail: body }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) gtag("event", event, payload || {});
}

const HERO_CHIPS = [
  "Alkohol",
  "Drogen",
  "Punkte",
  "Verhalten",
  "Конфиденциально",
  "Онлайн 24/7",
  "Старт после оплаты",
];

const HERO_CARDS = [
  {
    title: "Старт после оплаты",
    text: "До 5 минут — кабинет и программа активируются автоматически.",
  },
  {
    title: "Тренировки интервью",
    text: "Сценарии вопросов + разбор ваших формулировок и логики истории.",
  },
  {
    title: "Контроль готовности",
    text: "Итоговый чеклист и отчёт по рискам перед MPU.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Диагностика и сбор кейса",
    text: "Фиксируем факты, причины, изменения, контрольные точки и риски.",
  },
  {
    title: "План подготовки по неделям",
    text: "Задания, дедлайны, обязательные блоки и прогресс.",
  },
  {
    title: "Тренировки интервью",
    text: "Вопросы Gutachter + оценка ответов на риск и корректировка формулировок.",
  },
  {
    title: "Финальная готовность",
    text: "Итоговый контроль: что закрыто, что не закрыто, что повторить перед MPU.",
  },
];

const SCENARIOS = [
  {
    title: "Alkohol",
    text: "Причины, изменения, контроль, типовые вопросы, документы.",
  },
  {
    title: "Drogen",
    text: "Последовательность событий, отказ/контроль, риски формулировок.",
  },
  {
    title: "Punkte",
    text: "Поведение, выводы, профилактика, устойчивость ответов.",
  },
  {
    title: "Verhalten",
    text: "Мотивация изменений, критические триггеры, доказуемость прогресса.",
  },
];

const PROCESS_CHECKS = [
  "Выявляет слабые места и противоречия в истории.",
  "Помогает собрать причинно-следственную цепочку (до → событие → выводы → изменения).",
  "Проводит тренировки интервью и отмечает ответы с повышенным риском.",
  "Формирует план действий по неделям и фиксирует прогресс.",
  "Собирает чеклист документов под ваш сценарий.",
  "Перед финалом делает контроль готовности и рекомендации по доработке.",
];

const DELIVERABLES = [
  "Оформленная история кейса в рабочей структуре.",
  "Рекомендуемые формулировки и “опасные формулировки” (что не говорить).",
  "Тренировки интервью: вопросы + ваши ответы + разбор.",
  "План по неделям и прогресс выполнения.",
  "Чеклист документов под сценарий.",
  "Итоговый отчёт по рискам перед MPU.",
];

const PLANS = [
  {
    key: "start",
    title: "Start",
    items: [
      "Диагностика и карта рисков",
      "План подготовки по неделям",
      "Базовые модули",
      "Тренировки интервью (лимит N сессий)",
      "Чеклист документов",
    ],
  },
  {
    key: "pro",
    title: "Pro",
    featured: true,
    badge: "Рекомендуемый",
    items: [
      "Всё из Start",
      "Тренировки интервью без лимита",
      "Расширенная проверка формулировок и логики истории",
      "Финальный контроль готовности + отчёт",
    ],
  },
  {
    key: "intensive",
    title: "Intensive",
    items: [
      "Всё из Pro",
      "Усиленный финальный контроль (доп. итерации проверки)",
      "Приоритетная поддержка",
    ],
  },
] as const;

const FAQ = [
  {
    q: "Сколько времени занимает подготовка?",
    a: "Обычно от нескольких недель до нескольких месяцев — зависит от сценария и исходной готовности.",
  },
  {
    q: "Подойдёт ли мне, если я не знаю, как правильно сформулировать историю?",
    a: "Да. Диагностика и структура помогут собрать последовательную версию кейса.",
  },
  {
    q: "Это консультация или кабинет подготовки?",
    a: "Это кабинет подготовки с планом, тренировками интервью и контролем прогресса.",
  },
  {
    q: "Что происходит после оплаты?",
    a: "Активируется кабинет и программа подготовки, появляется план и задания.",
  },
  {
    q: "Как защищены данные?",
    a: "Данные используются только для подготовки и не публикуются. Юридические условия — в Datenschutz.",
  },
  {
    q: "Можно ли подготовиться полностью онлайн?",
    a: "Да. Все этапы доступны в кабинете 24/7.",
  },
  {
    q: "Какие сценарии покрываются?",
    a: "Alkohol, Drogen, Punkte, Verhalten и смежные случаи — уточняется на диагностике.",
  },
  {
    q: "Если я уже проходил подготовку раньше — это поможет?",
    a: "Да. Система выявит пробелы и соберёт план закрытия рисков.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const pricingRef = useRef<HTMLElement | null>(null);
  const pricingViewed = useRef(false);

  useEffect(() => {
    if (!pricingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !pricingViewed.current) {
            pricingViewed.current = true;
            track("view_pricing_section");
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(pricingRef.current);
    return () => observer.disconnect();
  }, []);

  const selectPlanEvent = useMemo(
    () =>
      ({
        start: "select_plan_start",
        pro: "select_plan_pro",
        intensive: "select_plan_intensive",
      }) as const,
    [],
  );

  return (
    <div className="public-page-stack premium-home">
      <section className="section" id="hero">
        <div className="premium-hero card pad">
          <div className="badge">MPU Praxis DP • Product Edition</div>
          <h1 className="h1 mt-14">
            Подготовка к MPU по протоколу: план, тренировки интервью, контроль готовности
          </h1>
          <p className="lead mt-12">
            Собираем ваш кейс в последовательную историю, отрабатываем интервью по вопросам Gutachter и закрываем риски:
            документы, формулировки, противоречия. Всё в одном кабинете.
          </p>

          <div className="chips mt-16">
            {HERO_CHIPS.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link href="/diagnostic" onClick={() => track("cta_start_diagnostic_click", { place: "hero" })}>
              <Button size="lg">Начать диагностику (5 минут)</Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="secondary">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>

          <p className="small mt-12">Диагностика бесплатная. На выходе — карта рисков и план подготовки.</p>

          <div className="cards3 mt-16">
            {HERO_CARDS.map((card) => (
              <article className="card pad soft" key={card.title}>
                <div className="badge">{card.title}</div>
                <p className="p mt-8">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="program">
        <div className="card pad soft">
          <div className="badge">Конфиденциальность и контроль процесса</div>
          <ul className="list mt-12">
            <li>Данные хранятся в рабочем кабинете и не публикуются.</li>
            <li>Минимум личных данных: только то, что нужно для подготовки.</li>
            <li>Прозрачный процесс: видны этапы, дедлайны и прогресс.</li>
            <li>Без обязательных звонков: старт через диагностику.</li>
          </ul>
          <p className="small mt-12">Юридические страницы: Impressum и Datenschutz — доступны в футере.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">How it works</div>
            <h2 className="h2 mt-10">Понятная цепочка действий от входа до финальной проверки</h2>
          </div>
        </div>
        <div className="journey-grid journey-grid-4 mt-16">
          {HOW_IT_WORKS.map((step, idx) => (
            <article className="journey-card" key={step.title}>
              <div className="journey-top">
                <span className="journey-num">0{idx + 1}</span>
                <p className="faq-q">{step.title}</p>
              </div>
              <p className="faq-a">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="badge">Сценарии подготовки</div>
        <div className="journey-grid journey-grid-4 mt-16">
          {SCENARIOS.map((scenario) => (
            <article className="journey-card" key={scenario.title}>
              <p className="faq-q">{scenario.title}</p>
              <p className="faq-a mt-8">{scenario.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card pad soft">
          <div className="badge">Процесс с проверками</div>
          <h2 className="h2 mt-10">Подготовка построена как процесс — с проверками, а не “советами”</h2>
          <ul className="list mt-12">
            {PROCESS_CHECKS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="badge">Deliverables</div>
        <h2 className="h2 mt-10">На выходе — пакет готовности к MPU</h2>
        <div className="journey-grid mt-16">
          {DELIVERABLES.map((item) => (
            <article className="journey-card" key={item}>
              <p className="faq-a">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="pricing" ref={pricingRef}>
        <div className="badge">Pricing</div>
        <h2 className="h2 mt-10">Выберите формат подготовки</h2>
        <p className="p mt-10">Начните с диагностики — система предложит рекомендованный формат по рискам.</p>

        <div className="plan-grid clean-grid mt-16">
          {PLANS.map((plan) => (
            <article
              className={`clean-plan card pad ${plan.featured ? "clean-plan-featured" : ""}`}
              key={plan.title}
            >
              <div className="badge">{plan.title}</div>
              {plan.badge ? <p className="small mt-8">{plan.badge}</p> : null}
              <ul className="plan-list mt-12">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="hero-actions mt-16">
                <Link
                  href="/diagnostic"
                  className="w-full"
                  onClick={() => track(selectPlanEvent[plan.key])}
                >
                  <Button className="w-full" variant={plan.featured ? "primary" : "secondary"}>
                    Выбрать {plan.title}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="small mt-12">
          Результат зависит от исходных данных и выполнения программы. Платформа снижает риск провала за счёт структуры,
          тренировок и контроля.
        </p>
      </section>

      <section className="section" id="faq">
        <div className="badge">FAQ</div>
        <h2 className="h2 mt-10">Частые вопросы</h2>
        <div className="faq-accordion mt-16">
          {FAQ.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <article className="faq-acc-item" key={item.q}>
                <button
                  className="faq-acc-btn"
                  onClick={() => {
                    setOpenFaq(open ? -1 : idx);
                    if (!open) track(`faq_open_question_${idx + 1}` as const);
                  }}
                  type="button"
                >
                  <span>{item.q}</span>
                  <span>{open ? "−" : "+"}</span>
                </button>
                {open ? <p className="faq-acc-body">{item.a}</p> : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="card pad premium-cta">
          <div className="badge">Bottom CTA</div>
          <h2 className="h2 mt-10">Начните с диагностики — это 5 минут</h2>
          <p className="p mt-10">
            Ответьте на ключевые вопросы по кейсу. На выходе получите карту рисков и план подготовки.
          </p>
          <div className="hero-actions">
            <Link href="/diagnostic" onClick={() => track("cta_start_diagnostic_click", { place: "bottom" })}>
              <Button size="lg">Начать диагностику</Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="secondary">
                Посмотреть тарифы
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
