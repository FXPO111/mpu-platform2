import Link from "next/link";
import { Button } from "@/components/ui/Button";

const stages = [
  {
    title: "Онбординг и оценка кейса",
    text: "Клиент проходит структурированный вход: причины MPU, сроки, текущий статус и документы. На выходе — карта рисков и персональный маршрут.",
  },
  {
    title: "План по неделям",
    text: "Система формирует последовательность шагов: какие блоки проработать, что подготовить, что подтвердить документально и в какие сроки.",
  },
  {
    title: "Тренировочный цикл",
    text: "Регулярные тренировки интервью и разбор формулировок. Каждая сессия повышает устойчивость ответов и снижает риск провала.",
  },
  {
    title: "Финальная готовность",
    text: "Перед MPU клиент проходит итоговый контроль: критерии готовности, незакрытые риски и финальные рекомендации по кейсу.",
  },
];

const proof = [
  ["Прозрачная экономика", "Пакеты, срок и объём сопровождения видны до оплаты — без скрытых условий."],
  ["Видимый прогресс", "Клиент понимает, где он сейчас, что уже закрыто и что осталось до финальной готовности."],
  ["Единая рабочая среда", "Диагностика, программа, документы и история подготовки находятся в одном месте."],
  ["Фокус на результате", "Каждый этап ориентирован на успешное прохождение MPU, а не на «общие советы»."],
];

const kpi = [
  { label: "Время старта после оплаты", value: "< 5 мин", note: "Клиент сразу попадает в рабочий процесс." },
  { label: "Базовые сценарии подготовки", value: "4", note: "Алкоголь, вещества, баллы, поведенческие кейсы." },
  { label: "Пакеты сопровождения", value: "3", note: "От стартового до интенсивного формата." },
];

export default function HomePage() {
  return (
    <div className="public-page-stack product-page-xl">
      <section className="section">
        <div className="card pad product-hero product-hero-xl">
          <div className="badge">MPU Praxis DP • Product Edition</div>
          <h1 className="h1 mt-14">Платформа подготовки к MPU с полноценной продуктовой логикой</h1>
          <p className="lead mt-12">
            Здесь пользователь не теряется в контенте: сначала выбор пакета, затем оплата,
            после чего автоматически запускается маршрут подготовки с этапами, дедлайнами и контролем прогресса.
          </p>

          <div className="hero-actions">
            <Link href="/pricing">
              <Button size="lg">Смотреть пакеты и оплату</Button>
            </Link>
            <Link href="/start">
              <Button size="lg" variant="secondary">
                Пройти стартовую диагностику
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="ghost">
                Нужна консультация по выбору
              </Button>
            </Link>
          </div>

          <div className="kpis product-kpis product-kpis-xl">
            {kpi.map((item) => (
              <article className="kpi" key={item.label}>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value">{item.value}</div>
                <p className="small mt-8">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">Как работает система</div>
            <h2 className="h2 mt-10">Понятная цепочка действий от входа до финальной проверки</h2>
          </div>
          <Link href="/services">
            <Button variant="ghost">Открыть структуру программы</Button>
          </Link>
        </div>

        <div className="steps product-steps-xl">
          {stages.map((stage, idx) => (
            <article className="faq-item process-card" key={stage.title}>
              <div className="row">
                <span className="step-num">{idx + 1}</span>
                <p className="faq-q">{stage.title}</p>
              </div>
              <p className="faq-a">{stage.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">Почему это уже продукт, а не сайт-визитка</div>
            <h2 className="h2 mt-10">Логика удержания клиента построена на процессе и понятной ценности</h2>
          </div>
          <Link href="/pricing">
            <Button variant="secondary">Перейти к тарифам</Button>
          </Link>
        </div>

        <div className="features mt-16 features-4">
          {proof.map(([title, text]) => (
            <article className="card pad soft value-card value-card-xl" key={title}>
              <div className="badge">{title}</div>
              <p className="p mt-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card pad cta product-cta product-cta-xl">
          <div className="badge">Следующий шаг</div>
          <h2 className="h2 mt-10">Пакет выбирается за 1–2 минуты, программа запускается сразу после оплаты</h2>
          <p className="p mt-10">
            Мы убрали лишние сущности и запутанные сценарии: клиент чётко видит, за что платит,
            что именно получает и как будет выглядеть путь до финального этапа MPU.
          </p>
          <div className="hero-actions">
            <Link href="/pricing">
              <Button size="lg">Выбрать пакет</Button>
            </Link>
            <Link href="/start">
              <Button size="lg" variant="secondary">
                Начать с диагностики
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
