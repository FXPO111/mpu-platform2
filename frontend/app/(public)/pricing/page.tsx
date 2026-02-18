import Link from "next/link";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    title: "Start",
    price: "€79",
    period: "14 дней",
    items: ["Стартовая диагностика", "Персональный план", "3 тренировки", "Чек-лист документов"],
  },
  {
    title: "Progress",
    price: "€169",
    period: "30 дней",
    items: ["Расширенный маршрут", "8 тренировок", "Контрольные точки", "Корректировка плана"],
    featured: true,
  },
  {
    title: "Premium",
    price: "€289",
    period: "45 дней",
    items: ["Интенсивный формат", "Без лимита тренировок", "Приоритетная поддержка", "Финальная репетиция"],
  },
];

export default function PricingPage() {
  return (
    <div className="public-page-stack pricing-clean">
      <section className="card pad pricing-clean-hero">
        <div className="badge">Тарифы</div>
        <h1 className="h1 mt-14">Понятная стоимость и наполнение каждого пакета</h1>
        <p className="lead mt-12">
          Никаких скрытых уровней и сложных условий: пользователь сразу понимает,
          какой объём подготовки получает в каждом пакете.
        </p>
      </section>

      <section className="plan-grid clean-grid">
        {plans.map((plan) => (
          <article key={plan.title} className={`clean-plan card pad ${plan.featured ? "clean-plan-featured" : ""}`}>
            <div className="badge">{plan.title}</div>
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
              <Link href="/start" className="w-full">
                <Button className="w-full" variant={plan.featured ? "primary" : "secondary"}>Выбрать {plan.title}</Button>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="card pad soft">
        <div className="badge">После оплаты</div>
        <div className="journey-grid mt-16">
          <article className="journey-card">
            <div className="journey-top"><span className="journey-num">01</span><p className="faq-q">Открывается кабинет</p></div>
            <p className="faq-a">Доступ к маршруту, этапам и материалам запускается сразу.</p>
          </article>
          <article className="journey-card">
            <div className="journey-top"><span className="journey-num">02</span><p className="faq-q">Заполняется профиль</p></div>
            <p className="faq-a">На основе диагностики формируется персональный рабочий план.</p>
          </article>
          <article className="journey-card">
            <div className="journey-top"><span className="journey-num">03</span><p className="faq-q">Стартует программа</p></div>
            <p className="faq-a">Пошаговая подготовка и контроль качества до финального этапа.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
