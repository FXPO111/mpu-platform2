export default function AboutPage() {
  return (
    <section className="card pad about-page">
      <div className="badge">О проекте</div>
      <h1 className="h2 mt-10">MPU Praxis DP — продуктовый подход к подготовке</h1>
      <p className="lead mt-12">
        Мы строим систему, где клиент получает не хаотичные консультации, а управляемый маршрут: от диагностики
        и оплаты до пошаговой подготовки и финальной проверки.
      </p>

      <div className="about-facts mt-16">
        <article className="card pad soft">
          <p className="small">Что меняем</p>
          <p className="p mt-8">Убираем формат «запишитесь и ждите». Клиент начинает работу сразу после выбора пакета.</p>
        </article>
        <article className="card pad soft">
          <p className="small">Что получает клиент</p>
          <p className="p mt-8">Понятный процесс, прозрачные этапы, контроль готовности и измеримый прогресс.</p>
        </article>
      </div>
    </section>
  );
}
