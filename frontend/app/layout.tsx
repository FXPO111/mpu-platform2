import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPU AI",
  description: "MPU AI platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="root-body">{children}</body>
    </html>
  );
}
