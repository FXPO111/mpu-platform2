"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [ok, setOk] = useState(false);

  return (
    <div className="grid2 contact-grid">
      <section className="card pad">
        <div className="badge">Контакты</div>
        <h1 className="h2 mt-10">Свяжитесь со мной</h1>
        <p className="p mt-12">
          Телефон: <a href="tel:+491752730963">+49 175 27 30 963</a><br />
          Email: <a href="mailto:info@mpu-praxis-dp.de">info@mpu-praxis-dp.de</a><br />
          Адрес: Viktoriastraße 32-36, 56068 Koblenz
        </p>
      </section>

      <section className="card pad contact-form-card">
        <div className="badge">Заявка</div>

        {ok ? (
          <div className="card pad soft mt-12">
            <div className="badge">Готово</div>
            <p className="p mt-8">Заявка сохранена (пока демо). Дальше подключим backend и отправку.</p>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setOk(true);
            }}
          >
            <Input placeholder="Имя и фамилия" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Телефон" />
            <Input placeholder="Коротко: что случилось / тема" />
            <Button type="submit">Отправить</Button>
          </form>
        )}
      </section>
    </div>
  );
}
