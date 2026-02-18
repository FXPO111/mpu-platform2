import Link from "next/link";
import { Button } from "@/components/ui/Button";

const modules = [
  {
    title: "Модуль 1 — Диагностика",
    text: "Сбор исходных данных, аудит документов, первичная оценка рисков и постановка приоритетов.",
  },
  {
    title: "Модуль 2 — План подготовки",
    text: "Недели подготовки, обязательные действия, контрольные точки и критерии качества ответов.",
  },
  {
    title: "Модуль 3 — Тренировки",
    text: "Сценарные интервью, сложные follow-up, разбор типовых ошибок и улучшение формулировок.",
  },
  {
    title: "Модуль 4 — Финальный контроль",
    text: "Проверка устойчивости перед MPU, закрытие оставшихся рисков и итоговые рекомендации.",
  },
];

export default function ServicesPage() {
  return (
    <div className="public-page-stack services-page-xl">
      <section className="card pad service-hero service-hero-xl">
        <div className="badge">Архитектура программы</div>
        <h1 className="h2 mt-10">Полноценный рабочий цикл подготовки вместо точечных консультаций</h1>
        <p className="lead mt-12">
          Вся программа разделена на модули, каждый из которых имеет понятную цель, критерии завершения
          и влияет на итоговую готовность к MPU.
        </p>
      </section>

      <section className="cards3 services-grid services-grid-xl">
        {modules.map((module) => (
          <article className="card pad soft service-card" key={module.title}>
            <div className="badge">{module.title}</div>
            <p className="p mt-10">{module.text}</p>
          </article>
        ))}
      </section>

      <section className="grid2">
        <article className="card pad soft">
          <div className="badge">Контроль качества</div>
          <p className="p mt-10">
            На каждом этапе система фиксирует прогресс по ключевым параметрам:
            полнота кейса, качество аргументации, стабильность ответов и готовность к стрессовым вопросам.
          </p>
        </article>
        <article className="card pad soft">
          <div className="badge">Логика монетизации</div>
          <p className="p mt-10">
            Глубина сопровождения зависит от пакета: чем выше пакет, тем больше тренировок,
            дольше доступ к кабинету и глубже контроль готовности.
          </p>
        </article>
      </section>

      <section className="card pad soft">
        <div className="section-head">
          <div>
            <div className="badge">Старт</div>
            <h2 className="h2 mt-10">Выберите пакет и начните подготовку без задержек</h2>
          </div>
          <Link href="/pricing"><Button>Перейти к пакетам</Button></Link>
        </div>
      </section>
    </div>
  );
}
