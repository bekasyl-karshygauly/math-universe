import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Universe — Интерактивная образовательная платформа по математике",
  description: "Глубокое изучение математики от арифметики до университетского уровня: 3 уровня сложности, интерактивные 3D-модели, графики JSXGraph, пошаговые доказательства и вывод формул.",
  keywords: ["математика", "интерактивное обучение", "3D геометрия", "матанализ", "линейная алгебра", "формулы", "JSXGraph", "Three.js"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
