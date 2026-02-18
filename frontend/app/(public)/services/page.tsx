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
          <Link href="/contact"><Button>Записаться</Button></Link>
          <Link href="/pricing"><Button variant="secondary">Посмотреть тарифы</Button></Link>
        </div>
      </section>

      <section className="cards3 services-grid">
        <article className="card pad soft service-card">
          <div className="badge">Проверка готовности</div>
          <h3 className="h3 mt-10">Контрольная сессия</h3>
          <p className="p mt-8">Проверяем ответы перед интервью, делаем финальные правки и фиксируем, что усилить в речи и доказательствах.</p>
        </article>

        <article className="card pad soft service-card">
          <div className="badge">Анализ неудачной попытки</div>
          <h3 className="h3 mt-10">Разбор ошибок и сценария отказа</h3>
          <p className="p mt-8">Анализируем отчёт, выделяем провалы и собираем чёткий маршрут для повторной успешной сдачи.</p>
        </article>

        <article className="card pad soft service-card">
          <div className="badge">Подготовка к MPU</div>
          <h3 className="h3 mt-10">Полная стратегия кейса</h3>
          <p className="p mt-8">Пошаговая работа: история изменений, документы, тренировка интервью и поддержка до сдачи.</p>
        </article>
      </section>
    </div>
  );
}
