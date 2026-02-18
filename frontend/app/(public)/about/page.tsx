export default function AboutPage() {
  return (
    <section className="card pad about-page">
      <div className="badge">Обо мне</div>
      <h1 className="h2 mt-10">Дмитрий Пономаренко</h1>
      <p className="lead mt-12">
        Эксперт по подготовке к MPU. Работаю конфиденциально, под ваш кейс, с упором на практический результат
        и спокойную, убедительную коммуникацию на интервью.
      </p>

      <div className="about-facts mt-16">
        <div className="card pad soft">
          <p className="small">Подход</p>
          <p className="p mt-8">Структурируем историю клиента так, чтобы она звучала правдиво, последовательно и подтверждалась фактами.</p>
        </div>
        <div className="card pad soft">
          <p className="small">Формат</p>
          <p className="p mt-8">Личные и онлайн-консультации, подготовка документов, репетиции интервью, сопровождение до результата.</p>
        </div>
      </div>
    </section>
  );
}
