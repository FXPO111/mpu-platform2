import type { ReactNode } from "react";
import Link from "next/link";
import { NavLink } from "@/components/nav/NavLink";
import { Button } from "@/components/ui/Button";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="public-header">
        <div className="topstrip">
          <div className="container topstrip-inner">
            <span>MPU Praxis DP • полноценная онлайн-подготовка и сопровождение</span>
            <a href="mailto:info@mpu-praxis-dp.de">info@mpu-praxis-dp.de</a>
          </div>
        </div>

        <div className="container public-header-inner">
          <Link href="/" className="brand">
            <span className="brand-dot" />
            MPU Praxis DP
          </Link>

          <nav className="nav">
            <NavLink href="/" exact>Главная</NavLink>
            <NavLink href="/pricing" exact>Пакеты</NavLink>
            <NavLink href="/services" exact>Программа</NavLink>
            <NavLink href="/contact" exact>Контакты</NavLink>
          </nav>

          <div className="header-actions">
            <a href="tel:+491752730963">
              <Button variant="ghost" size="sm">Позвонить</Button>
            </a>
            <Link href="/start">
              <Button variant="secondary" size="sm">Начать диагностику</Button>
            </Link>
            <Link href="/pricing">
              <Button size="sm">Выбрать пакет</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container page">{children}</main>

      <footer className="container footer">
        <div className="footer-grid">
          <div>
            <div className="badge">Контакты</div>
            <div className="p mt-10">
              <a href="tel:+491752730963">+49 175 27 30 963</a><br />
              <a href="mailto:info@mpu-praxis-dp.de">info@mpu-praxis-dp.de</a>
            </div>
            <div className="p mt-10">
              Viktoriastraße 32-36, 56068 Koblenz
            </div>
          </div>

          <div>
            <div className="badge">Навигация</div>
            <div className="footer-links">
              <Link className="navlink" href="/pricing">Пакеты</Link>
              <Link className="navlink" href="/services">Программа</Link>
              <Link className="navlink" href="/start">Диагностика</Link>
              <Link className="navlink" href="/contact">Контакты</Link>
            </div>
          </div>

          <div>
            <div className="badge">Юридическое</div>
            <div className="footer-links">
              <Link className="navlink" href="/impressum">Impressum</Link>
              <Link className="navlink" href="/privacy">Datenschutz</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} MPU Praxis DP
        </div>
      </footer>
    </>
  );
}
