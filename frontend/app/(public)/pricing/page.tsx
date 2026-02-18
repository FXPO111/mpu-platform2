import Link from "next/link";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    title: "Start",
    price: "€79",
    period: "14 дней",
    desc: "Базовый старт для структурирования кейса и первых тренировок.",
    items: [
      "Стартовая диагностика",
      "Персональный план",
      "3 тренировочные сессии",
      "Чек-лист документов",
      "Доступ к кабинету на 14 дней",
    ],
  },
  {
    title: "Progress",
    price: "€169",
    period: "30 дней",
    desc: "Основной пакет для системной подготовки и устойчивого результата.",
    items: [
      "Расширенная диагностика",
      "8 тренировочных сессий",
      "Промежуточная оценка готовности",
      "Корректировка плана по результатам",
      "Доступ к кабинету на 30 дней",
    ],
    primary: true,
  },
  {
    title: "Premium",
    price: "€289",
    period: "45 дней",
    desc: "Интенсивное сопровождение до финального этапа MPU.",
    items: [
      "Приоритетное сопровождение",
      "Неограниченные тренировки",
      "Расширенный контроль рисков",
      "Финальная репетиция интервью",
      "Доступ к кабинету на 45 дней",
    ],
  },
];

const compare = [
  ["Диагностика", "Базовая", "Расширенная", "Расширенная + контроль рисков"],
  ["Тренировки", "3", "8", "Без лимита"],
  ["Срок доступа", "14 дней", "30 дней", "45 дней"],
  ["Контроль готовности", "—", "1 этап", "2 этапа + финальный"],
];

export default function PricingPage() {
  return (
    <div className="public-page-stack pricing-page-xl">
      <section className="card pad pricing-hero pricing-hero-xl">
        <div className="badge">Пакеты и оплата</div>
        <h1 className="h1 mt-14">Продуктовая тарификация без тумана и «созвонов ради цены»</h1>
        <p className="lead mt-12">
          Пользователь сразу видит стоимость, срок и конкретное наполнение пакета. После оплаты — моментальный запуск
          маршрута подготовки в личном кабинете.
        </p>
      </section>

      <section className="plan-grid plan-grid-xl">
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
                <Button className="w-full" variant={plan.primary ? "primary" : "secondary"}>
                  Выбрать {plan.title}
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="card pad soft compare-wrap">
        <div className="badge">Сравнение пакетов</div>
        <div className="compare-table-wrap mt-16">
          <table className="table compare-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>Start</th>
                <th>Progress</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card pad soft">
        <div className="badge">После оплаты</div>
        <div className="steps mt-16">
          <article className="faq-item">
            <p className="faq-q">1. Открывается кабинет и маршрут</p>
            <p className="faq-a">Пользователь видит персональные шаги, дедлайны и блоки подготовки.</p>
          </article>

          <article className="faq-item">
            <p className="faq-q">2. Заполняется входной профиль</p>
            <p className="faq-a">На основе ответов система формирует приоритеты и порядок работы по кейсу.</p>
          </article>

          <article className="faq-item">
            <p className="faq-q">3. Запускается сопровождение</p>
            <p className="faq-a">Тренировки, контроль прогресса и регулярные проверки готовности до MPU.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
