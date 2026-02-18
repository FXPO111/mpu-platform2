import Link from "next/link";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    title: "Start",
    price: "€79",
    period: "за 14 дней",
    desc: "Для первичной подготовки и понимания слабых мест.",
    items: [
      "Стартовая диагностика",
      "Персональный план действий",
      "3 тренировки интервью",
      "Чек-лист документов",
    ],
  },
  {
    title: "Progress",
    price: "€169",
    period: "за 30 дней",
    desc: "Оптимальный пакет для системной подготовки.",
    items: [
      "Расширенная диагностика",
      "8 тренировок интервью",
      "Промежуточные проверки готовности",
      "Корректировка плана по прогрессу",
    ],
    primary: true,
  },
  {
    title: "Premium",
    price: "€289",
    period: "за 45 дней",
    desc: "Полное сопровождение до финального этапа.",
    items: [
      "Интенсивная программа подготовки",
      "Неограниченные тренировки",
      "Приоритетная поддержка",
      "Финальная репетиция перед MPU",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="public-page-stack">
      <section className="card pad pricing-hero">
        <div className="badge">Пакеты и оплата</div>
        <h1 className="h1 mt-14">Прозрачные тарифы: клиент сразу понимает, что получит</h1>
        <p className="lead mt-12">
          Каждый пакет включает рабочий маршрут подготовки. Никаких «свяжемся позже» —
          сначала выбор, затем оплата и моментальный запуск программы.
        </p>
      </section>

      <section className="plan-grid">
        {plans.map((plan) => (
          <article className={`card pad plan-card ${plan.primary ? "plan-card-primary" : ""}`} key={plan.title}>
            <div className="badge">{plan.title}</div>
            <div className="plan-price-wrap">
              <div className="plan-price">{plan.price}</div>
              <div className="small">{plan.period}</div>
            </div>
            <p className="p">{plan.desc}</p>

            <div className="hr" />

            <ul className="plan-list">
              {plan.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="hero-actions mt-16">
              <Link href="/start" className="w-full">
                <Button className="w-full" variant={plan.primary ? "primary" : "secondary"}>Оформить {plan.title}</Button>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="card pad soft">
        <div className="badge">Что дальше после оплаты</div>
        <div className="steps mt-16">
          <article className="faq-item">
            <p className="faq-q">1. Открывается личный кабинет</p>
            <p className="faq-a">Клиент сразу видит этапы подготовки и календарь ближайших шагов.</p>
          </article>
          <article className="faq-item">
            <p className="faq-q">2. Заполняется стартовая диагностика</p>
            <p className="faq-a">На основе данных формируется персональный маршрут и чек-листы.</p>
          </article>
          <article className="faq-item">
            <p className="faq-q">3. Запускается программа</p>
            <p className="faq-a">Регулярные тренировки и контроль готовности до финального этапа.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
