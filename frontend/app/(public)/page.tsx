import Link from "next/link";
import { Button } from "@/components/ui/Button";

const flowSteps = [
  ["Диагностика", "Сбор фактов: причина, сроки, поведение после случая, терапия/курсы, документы."],
  ["План", "Структура истории, чек-лист доказательств изменений, список рисков и действий."],
  ["Тренировка", "Интервью-симуляция: вопросы, follow-up, рекомендации по формулировкам."],
  ["Эксперт", "Если риск высокий — Zoom, запись, подготовленные системой вопросы и документы."],
];

const valueProps = [
  ["Понятная модель оплаты", "Три пакета без скрытых условий. Понятно, что входит и какой результат вы получаете."],
  ["Личный кабинет с прогрессом", "В одном месте: этапы, документы, история сессий, дедлайны и контроль готовности."],
  ["Практический формат", "Разбор реального кейса: формулировки, ошибки и отработка ответов под MPU."],
  ["Нет структуры рассказа", "Система выстраивает хронологию и смысл изменений, чтобы ответы звучали логично и доказуемо."],
  ["Слабые доказательства", "Чек-лист документов и действий: что подтвердить, как и чем, чтобы не было дыр."],
  ["Провал на follow-up", "Trainer давит уточняющими вопросами — так же, как на реальном интервью."],
];

export default function HomePage() {
  return (
    <div className="public-page-stack">
      <section className="section">
        <div className="hero-grid">
          <div className="card pad hero-main hero-primary">
            <div className="badge">MPU AI • подготовка и консультации</div>
            <h1 className="h1 mt-14">Подготовка к MPU как система: диагностика → план → тренировка интервью</h1>
            <p className="lead mt-12">
              Система собирает факты по вашему кейсу, строит персональный план и прогоняет через симуляцию интервью.
              Если риск высокий — предложит созвон с экспертом (Zoom).
            </p>

            <div className="chips mt-16">
              <span className="chip">конфиденциально</span>
              <span className="chip">структура реального интервью</span>
              <span className="chip">история и прогресс в кабинете</span>
              <span className="chip">эскалация к эксперту по триггерам</span>
            </div>

            <div className="hero-actions">
              <Link href="/start">
                <Button size="lg">Начать диагностику</Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="secondary">
                  Записаться к эксперту
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="ghost">
                  Тарифы
                </Button>
              </Link>
            </div>
          </div>

          <aside className="card pad hero-side">
            <div className="badge">Что вы получите</div>
            <div className="hr" />

            <div className="stack lg">
              <div className="card pad soft feature-snippet">
                <div className="badge">Персональный план</div>
                <p className="p mt-8">
                  Что говорить, что подтверждать документами, где слабые места, что подготовить заранее.
                </p>
              </div>

              <div className="card pad soft feature-snippet">
                <div className="badge">Trainer-интервью</div>
                <p className="p mt-8">
                  Симуляция вопросов, follow-up, оценка ответов, рекомендации как исправить формулировки.
                </p>
              </div>

              <div className="card pad soft feature-snippet">
                <div className="badge">Триггеры на Zoom</div>
                <p className="p mt-8">
                  Если кейс “красный” — система предложит консультацию и сформирует список вопросов эксперту.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="badge">Как работает</div>
            <h2 className="h2 mt-10">Флоу, который ведёт к результату</h2>
          </div>
          <Link href="/services">
            <Button variant="ghost">Подробнее</Button>
          </Link>
        </div>

        <div className="steps">
          {flowSteps.map(([title, text], idx) => (
            <article className="faq-item" key={title}>
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
        <div className="badge">Для чего это</div>
        <h2 className="h2 mt-10">Закрываем типовые причины провала</h2>

        <div className="features mt-16">
          {valueProps.map(([title, text]) => (
            <article className="card pad soft" key={title}>
              <div className="badge">{title}</div>
              <p className="p mt-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card pad cta">
          <div className="badge">Старт</div>
          <h2 className="h2 mt-10">Начать можно сейчас — 10–15 минут на диагностику</h2>
          <p className="p mt-10">
            Дальше система сама предложит: план, тренер, или консультацию в Zoom если кейс рискованный.
          </p>

          <div className="hero-actions">
            <Link href="/start">
              <Button size="lg">Начать диагностику</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="secondary">
                Посмотреть тарифы
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="ghost">
                Задать вопрос
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="badge">FAQ</div>
        <h2 className="h2 mt-10">Коротко о важном</h2>

        <div className="faq mt-16">
          <article className="faq-item">
            <p className="faq-q">ИИ заменяет эксперта?</p>
            <p className="faq-a">
              Нет. Он систематизирует кейс, строит план и тренирует интервью. Эксперт подключается по триггерам риска.
            </p>
          </article>

          <article className="faq-item">
            <p className="faq-q">Можно начать без документов?</p>
            <p className="faq-a">
              Да. Диагностика стартует с фактов, а дальше система выдаст список, что нужно собрать.
            </p>
          </article>

          <article className="faq-item">
            <p className="faq-q">Как это выглядит в кабинете?</p>
            <p className="faq-a">Кейсы, прогресс, план, файлы, тренировки, история. Всё по одному делу — в одном месте.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
