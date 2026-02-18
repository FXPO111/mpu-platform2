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
        <article className="card pad soft">
          <p className="small">Подход</p>
          <p className="p mt-8">
            Структурируем историю клиента так, чтобы она звучала правдиво, последовательно и подтверждалась фактами.
          </p>
        </article>

        <article className="card pad soft">
          <p className="small">Формат</p>
          <p className="p mt-8">
            Личные и онлайн-консультации, подготовка документов, репетиции интервью, сопровождение до результата.
          </p>
        </article>

        <article className="card pad soft">
          <p className="small">Продуктовый маршрут</p>
          <p className="p mt-8">
            Вместо хаотичных консультаций — управляемый процесс: от диагностики и оплаты до пошаговой подготовки и финальной проверки.
          </p>
        </article>

        <article className="card pad soft">
          <p className="small">Что получает клиент</p>
          <p className="p mt-8">
            Понятные этапы, контроль готовности, измеримый прогресс и ответы, которые звучат логично и доказуемо.
          </p>
        </article>
      </div>
    </section>
  );
}
