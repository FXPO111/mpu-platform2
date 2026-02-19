"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { NavLink } from "@/components/nav/NavLink";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("client@mpu");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromCheckout = localStorage.getItem("checkout_email")?.trim().toLowerCase();
    if (fromCheckout && fromCheckout.includes("@")) {
      setEmail(fromCheckout);
    }
  }, []);

  return (
    <div className="cabinet-v2-shell">
      <header className="cabinet-v2-header">
        <div className="container cabinet-v2-header-inner">
          <Link href="/dashboard" className="cabinet-v2-brand">
            <span className="cabinet-v2-dot" /> MPU Praxis
          </Link>

          <nav className="cabinet-v2-nav" aria-label="Кабинет">
            <NavLink href="/dashboard" exact>
              Обзор
            </NavLink>
            <NavLink href="/dashboard#plan">План</NavLink>
            <NavLink href="/dashboard#training">Тренировка</NavLink>
            <NavLink href="/dashboard#readiness">Готовность</NavLink>
          </nav>

          <div className="cabinet-v2-email" title={email}>
            {email}
          </div>
        </div>
      </header>

      <main className="content">
        <div className="container page">{children}</div>
      </main>
    </div>
  );
}
