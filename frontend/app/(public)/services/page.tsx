import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  return (
    <div className="public-page-stack">
      <section className="card pad service-hero">
        <div className="badge">Как устроена программа</div>
        <h1 className="h2 mt-10">Не разовые консультации, а последовательная система подготовки</h1>
        <p className="lead mt-12">
          Программа построена вокруг результата: клиент шаг за шагом закрывает риски,
          отрабатывает ответы и выходит к финальному интервью в устойчивом состоянии.
        </p>
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
          <div className="badge">Контроль прогресса</div>
          <h3 className="h3 mt-10">Понимание готовности в цифрах</h3>
          <p className="p mt-8">Видно, какие блоки закрыты, где есть риски и что нужно завершить перед MPU.</p>
        </article>
      </section>

      <section className="card pad soft">
        <div className="section-head">
          <div>
            <div className="badge">Следующий шаг</div>
            <h2 className="h2 mt-10">Определите пакет и сразу запустите подготовку</h2>
          </div>
          <Link href="/pricing"><Button>К пакетам</Button></Link>
        </div>
      </section>
    </div>
  );
}
