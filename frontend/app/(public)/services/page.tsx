import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  return (
    <div className="public-page-stack">
      <section className="card pad service-hero">
        <div className="badge">Услуги</div>
        <h1 className="h2 mt-10">Форматы подготовки</h1>
        <p className="lead mt-12">
          Старт — информационная консультация (30€ / 30 минут), дальше выбираем формат под вашу ситуацию,
          опыт предыдущих попыток и уровень готовности.
        </p>
        <div className="hero-actions">
          <Link href="/contact">
            <Button>Записаться</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary">Посмотреть тарифы</Button>
          </Link>
        </div>
      </section>

      <section className="cards3 services-grid">
        <article className="card pad soft service-card">
          <div className="badge">Диагностика кейса</div>
          <h3 className="h3 mt-10">Старт с полной картины</h3>
          <p className="p mt-8">Разбираем историю, сроки, документы и формируем чёткий план работ по приоритетам.</p>
        </article>

        <article className="card pad soft service-card">
          <div className="badge">Тренировки интервью</div>
          <h3 className="h3 mt-10">Практика до уверенности</h3>
          <p className="p mt-8">Регулярная отработка вопросов, сложных follow-up и корректировка формулировок.</p>
        </article>

        <article className="card pad soft service-card">
          <div className="badge">Подготовка к MPU</div>
          <h3 className="h3 mt-10">Полная стратегия кейса</h3>
          <p className="p mt-8">Пошаговая работа: история изменений, документы, тренировка интервью и поддержка до сдачи.</p>
        </article>
      </section>

      <section className="card pad soft">
        <div className="section-head">
          <div>
            <div className="badge">Следующий шаг</div>
            <h2 className="h2 mt-10">Определите пакет и запустите подготовку</h2>
          </div>
          <Link href="/pricing">
            <Button>К пакетам</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
