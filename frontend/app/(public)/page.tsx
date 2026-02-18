import Link from "next/link";
import { Button } from "@/components/ui/Button";

const steps = [
  ["Выбор пакета", "Клиент сразу видит цены, объём услуг и срок сопровождения."],
  ["Оплата", "После оплаты доступ открывается мгновенно: кабинет, программа и материалы."],
  ["Диагностика", "Стартовая анкета формирует персональный план, чек-лист и календарь подготовки."],
  ["Подготовка", "Регулярные сессии, тренировки интервью, контроль документов и итоговая проверка."],
];

const reasons = [
  ["Понятная модель оплаты", "Три пакета без скрытых условий. Клиент понимает, что покупает и какой результат получает."],
  ["Личный кабинет с прогрессом", "В одном месте: этапы, документы, история сессий, дедлайны и контроль готовности."],
  ["Практический формат", "Не теория, а разбор реального кейса: формулировки, ошибки и отработка ответов под MPU."],
];

export default function HomePage() {
  return (
    <div className="public-page-stack product-page">
      <section className="section">
        <div className="card pad product-hero">
          <div className="badge">Новый формат MPU Praxis DP</div>
          <h1 className="h1 mt-14">Онлайн-программа подготовки к MPU с чёткой логикой оплаты и сопровождения</h1>
          <p className="lead mt-12">
            Это не лендинг «оставьте заявку». Клиент выбирает пакет, оплачивает и получает рабочую систему подготовки:
            диагностика, план, тренировки, контроль прогресса и финальная проверка перед MPU.
          </p>

          <div className="hero-actions">
            <Link href="/pricing"><Button size="lg">Выбрать пакет</Button></Link>
            <Link href="/start"><Button size="lg" variant="secondary">Пройти диагностику</Button></Link>
            <Link href="/contact"><Button size="lg" variant="ghost">Задать вопрос перед оплатой</Button></Link>
          </div>

          <div className="kpis product-kpis">
            <div className="kpi">
              <div className="kpi-label">Пакеты</div>
              <div className="kpi-value">3</div>
              <p className="small mt-8">От базовой подготовки до полного сопровождения.</p>
            </div>
            <div className="kpi">
              <div className="kpi-label">Старт после оплаты</div>
              <div className="kpi-value">~5 мин</div>
              <p className="small mt-8">Сразу открывается доступ к кабинету и шагам программы.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">Как клиент проходит путь</div>
            <h2 className="h2 mt-10">Простой и прозрачный процесс без хаоса</h2>
          </div>
        </div>
        <div className="steps product-steps">
          {steps.map(([title, text], idx) => (
            <article className="faq-item process-card" key={title}>
              <div className="row">
                <span className="step-num">{idx + 1}</span>
                <p className="faq-q">{title}</p>
              </div>
              <p className="faq-a">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">Почему клиент остаётся в продукте</div>
            <h2 className="h2 mt-10">Бизнес-логика, которая удерживает и доводит до результата</h2>
          </div>
          <Link href="/services"><Button variant="ghost">Смотреть программу</Button></Link>
        </div>

        <div className="features mt-16">
          {reasons.map(([title, text]) => (
            <article className="card pad soft value-card" key={title}>
              <div className="badge">{title}</div>
              <p className="p mt-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card pad cta product-cta">
          <div className="badge">Оплата и запуск</div>
          <h2 className="h2 mt-10">Сначала выбор пакета, затем сразу работа по программе</h2>
          <p className="p mt-10">
            На странице пакетов клиент видит, что входит в каждый вариант и какую глубину сопровождения он получает.
            После оплаты не нужно ждать — программа запускается сразу.
          </p>
          <div className="hero-actions">
            <Link href="/pricing"><Button size="lg">Перейти к пакетам</Button></Link>
            <Link href="/contact"><Button size="lg" variant="secondary">Нужна консультация по выбору</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
