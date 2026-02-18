"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type EventName =
  | "cta_start_diagnostic_click"
  | "faq_open_question_1"
  | "faq_open_question_2"
  | "faq_open_question_3"
  | "faq_open_question_4"
  | "faq_open_question_5"
  | "faq_open_question_6"
  | "faq_open_question_7"
  | "faq_open_question_8";

function track(event: EventName, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("analytics:event", { detail: { event, ...payload } }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) gtag("event", event, payload || {});
}

const STEPS = [
  ["1", "Диагностика", "Фиксируем вашу ситуацию, документы, сроки и ключевые риски."],
  ["2", "План", "Собираем понятный маршрут подготовки со сроками и контрольными точками."],
  ["3", "Тренировка интервью", "Отрабатываем вопросы эксперта и улучшаем формулировки ответов."],
  ["4", "Финальная проверка", "Проводим итоговый контроль готовности перед МПУ и отмечаем, что повторить."],
] as const;

const SCENARIOS = [
  ["Алкоголь", "Причины, изменения, самоконтроль, документы и типовые вопросы."],
  ["Наркотики", "Последовательность событий, отказ, контроль и устойчивость формулировок."],
  ["Штрафные пункты", "Поведение, выводы, профилактика и стабильность ответов."],
  ["Поведение", "Мотивация изменений, триггеры и доказуемость прогресса."],
] as const;

const PROCESS_CARDS = [
  "Разбираем последовательность событий и убираем противоречия, чтобы история звучала ровно и убедительно на интервью.",
  "Отмечаем ответы с повышенным риском и показываем, какие формулировки нужно усилить до следующей тренировки.",
  "Отрабатываем типовые и уточняющие вопросы эксперта, чтобы ответы оставались спокойными, ясными и устойчивыми.",
  "Фиксируем прогресс по этапам, документам и формируем список точек, которые важно закрыть до финальной проверки.",
] as const;

const RESULTS = [
  "Структуру вашей истории без противоречий.",
  "Рекомендованные формулировки и список фраз, которых лучше избегать.",
  "Тренировки интервью с разбором ответов.",
  "План действий по неделям с отметками прогресса.",
  "Чеклист документов под вашу ситуацию.",
  "Итоговую оценку рисков перед МПУ.",
] as const;

const PRIVACY_CARDS = [
  "Информация хранится только в рабочем кабинете и используется исключительно в рамках подготовки, без публичного доступа.",
  "Собирается только необходимый набор сведений, который действительно нужен для анализа ситуации и построения плана.",
  "По каждому этапу видно, что уже сделано, какие шаги впереди и какие сроки установлены для следующего блока работы.",
  "Запуск возможен сразу через диагностику: без обязательных звонков, без ожидания и без лишних промежуточных действий.",
] as const;

const FAQ = [
  [
    "Сколько времени занимает подготовка?",
    "Обычно от нескольких недель до нескольких месяцев. Срок зависит от исходной ситуации, уровня готовности и того, насколько последовательно выполняются шаги программы.",
  ],
  [
    "Подойдёт ли мне формат, если сложно сформулировать историю?",
    "Да. На этапе диагностики и в процессе тренировок выстраивается понятная логика рассказа: что произошло, какие выводы сделаны и какие изменения подтверждаются фактами.",
  ],
  [
    "Это разовая консультация?",
    "Нет. Это рабочий кабинет с последовательной подготовкой: план, тренировки, контроль прогресса и финальная проверка перед МПУ.",
  ],
  [
    "Что происходит после оплаты?",
    "После оплаты активируется доступ, появляется маршрут подготовки, список ближайших шагов и материалы для старта. Ничего дополнительно настраивать не нужно.",
  ],
  [
    "Как защищены данные?",
    "Данные не публикуются и используются только для подготовки. Доступ к рабочей информации ограничен рамками кабинета и задач программы.",
  ],
  [
    "Можно ли пройти подготовку полностью онлайн?",
    "Да. Все этапы, включая диагностику, тренировки и контроль готовности, доступны онлайн в удобное время.",
  ],
  [
    "Какие ситуации покрываются?",
    "Основные направления: Алкоголь, Наркотики, Штрафные пункты и Поведение. При необходимости программа адаптируется под смежные обстоятельства.",
  ],
  [
    "Если уже был опыт подготовки ранее, это поможет?",
    "Да. Повторный запуск особенно полезен: видно, где были пробелы, какие ответы уязвимы и что именно нужно доработать перед следующей попыткой.",
  ],
] as const;

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="public-page-stack premium-home">
      <section className="section" id="hero">
        <div className="premium-hero card pad premium-hero-compact">
          <h1 className="h1 premium-hero-title">Подготовка к МПУ без хаоса: разбор ситуации, тренировка интервью, финальная проверка</h1>
          <p className="lead mt-12 premium-hero-sub">
            Помогаем пройти путь подготовки последовательно: от диагностики и плана до практики и контроля готовности.
            Всё в одном рабочем кабинете.
          </p>

          <div className="hero-actions hero-actions-clean">
            <Link href="/diagnostic" onClick={() => track("cta_start_diagnostic_click", { place: "hero" })}>
              <Button className="btn-hero-flat" size="lg">Начать диагностику</Button>
            </Link>
            <Link href="/pricing"><Button className="btn-hero-flat" size="lg" variant="secondary">Посмотреть тарифы</Button></Link>
          </div>

          <div className="cards3 mt-16">
            <article className="card pad soft">
              <h3 className="h3">Старт после оплаты</h3>
              <p className="p mt-8">Кабинет и программа активируются автоматически.</p>
            </article>
            <article className="card pad soft">
              <h3 className="h3">Тренировки интервью</h3>
              <p className="p mt-8">Вопросы и разбор формулировок, чтобы ответы были устойчивыми.</p>
            </article>
            <article className="card pad soft">
              <h3 className="h3">Контроль готовности</h3>
              <p className="p mt-8">Финальный чек и перечень пунктов для доработки перед МПУ.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="program">
        <h2 className="h2">Этапы подготовки</h2>
        <div className="journey-grid journey-grid-4 mt-16 steps-grid">
          {STEPS.map(([n, title, text]) => (
            <article className="journey-card" key={title}>
              <div className="journey-top">
                <span className="journey-num">{n}</span>
                <p className="faq-q">{title}</p>
              </div>
              <p className="faq-a">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Сценарии подготовки</h2>
        <div className="journey-grid journey-grid-4 mt-16">
          {SCENARIOS.map(([title, text]) => (
            <article className="journey-card" key={title}>
              <p className="faq-q">{title}</p>
              <p className="faq-a mt-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Как проходит подготовка</h2>
        <div className="journey-grid journey-grid-4 mt-16 process-grid-wide">
          {PROCESS_CARDS.map((text, idx) => (
            <article className="journey-card" key={idx}>
              <p className="faq-a process-copy">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Что вы получите</h2>
        <div className="journey-grid mt-16 result-grid">
          {RESULTS.map((item) => (
            <article className="journey-card" key={item}>
              <p className="faq-a clamp-2">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Конфиденциальность</h2>
        <div className="journey-grid journey-grid-4 mt-16 process-grid-wide">
          {PRIVACY_CARDS.map((text, idx) => (
            <article className="journey-card" key={idx}>
              <p className="faq-a process-copy">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <h2 className="h2">FAQ</h2>
        <div className="faq-accordion mt-16">
          {FAQ.map(([q, a], idx) => {
            const open = openFaq === idx;
            return (
              <article className="faq-acc-item" key={q}>
                <button
                  className="faq-acc-btn"
                  onClick={() => {
                    setOpenFaq(open ? -1 : idx);
                    if (!open) track(`faq_open_question_${idx + 1}` as EventName);
                  }}
                  type="button"
                >
                  <span>{q}</span>
                  <span className="faq-chevron-wrap" aria-hidden>
                    <svg viewBox="0 0 24 24" className={`faq-chevron ${open ? "open" : ""}`}>
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {open ? <p className="faq-acc-body faq-acc-body-long">{a}</p> : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
