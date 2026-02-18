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

const PROCESS_TEXT = [
  "Находим слабые места и противоречия в вашей истории.",
  "Собираем ясную причинно-следственную цепочку: что было, что изменилось и почему.",
  "Проводим тренировки интервью и отмечаем рискованные ответы.",
  "Фиксируем прогресс по этапам и документам.",
  "Перед финалом делаем итоговую проверку и список доработок.",
] as const;

const PROCESS_RIGHT = [
  "Что проверяем: логику истории и устойчивость ответов.",
  "Что фиксируем: сроки, документы и этапы выполнения.",
  "Результат этапа: понятный список действий до следующего шага.",
] as const;

const RESULTS = [
  "Структуру вашей истории без противоречий.",
  "Рекомендованные формулировки и список фраз, которых лучше избегать.",
  "Тренировки интервью с разбором ответов.",
  "План действий по неделям с отметками прогресса.",
  "Чеклист документов под вашу ситуацию.",
  "Итоговую оценку рисков перед МПУ.",
] as const;

const PRIVACY_RIGHT = [
  "Доступ к материалам только в рабочем кабинете.",
  "Прозрачная структура шагов и сроков.",
  "Старт через диагностику без обязательных звонков.",
] as const;

const FAQ = [
  ["Сколько времени занимает подготовка?", "Обычно от нескольких недель до нескольких месяцев, в зависимости от исходной готовности."],
  ["Подойдёт ли мне формат, если сложно сформулировать историю?", "Да. Диагностика и структура помогают выстроить последовательный и понятный рассказ."],
  ["Это разовая консультация?", "Нет. Это кабинет подготовки с планом, тренировками и контролем прогресса."],
  ["Что происходит после оплаты?", "Активируется кабинет, появляется маршрут подготовки и список ближайших шагов."],
  ["Как защищены данные?", "Данные используются только для подготовки и не публикуются."],
  ["Можно ли пройти подготовку полностью онлайн?", "Да, все этапы доступны онлайн в любое время."],
  ["Какие ситуации покрываются?", "Алкоголь, Наркотики, Штрафные пункты, Поведение и смежные случаи."],
  ["Если уже был опыт подготовки ранее, это поможет?", "Да. Вы увидите пробелы и получите понятный план их закрытия."],
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

          <div className="hero-actions">
            <Link href="/diagnostic" onClick={() => track("cta_start_diagnostic_click", { place: "hero" })}>
              <Button size="lg">Начать диагностику</Button>
            </Link>
            <Link href="/pricing"><Button size="lg" variant="secondary">Посмотреть тарифы</Button></Link>
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
        <div className="grid2 clean-two-col mt-16">
          <article className="clean-section-block">
            <ul className="list">
              {PROCESS_TEXT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="clean-section-block side-summary">
            <h3 className="h3">Что фиксируем на каждом этапе</h3>
            <ul className="list mt-10">
              {PROCESS_RIGHT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
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
        <div className="grid2 clean-two-col mt-16">
          <article className="clean-section-block">
            <ul className="list">
              <li>Данные сохраняются только в рабочем кабинете.</li>
              <li>Используются только сведения, необходимые для подготовки.</li>
              <li>Этапы, сроки и прогресс видны в одном месте.</li>
              <li>Старт без обязательных звонков — через диагностику.</li>
            </ul>
          </article>
          <article className="clean-section-block side-summary">
            <h3 className="h3">Ключевые принципы</h3>
            <ul className="list mt-10">
              {PRIVACY_RIGHT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
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
                {open ? <p className="faq-acc-body">{a}</p> : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
