import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

// Display and UI faces are system serif/sans stacks (see DESIGN.md); only the mono face is loaded.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Universe — Интерактивная образовательная платформа по математике",
  description: "Глубокое изучение математики от арифметики до университетского уровня: 3 уровня сложности, интерактивные 3D-модели, графики JSXGraph, пошаговые доказательства и вывод формул.",
  keywords: ["математика", "интерактивное обучение", "3D геометрия", "матанализ", "линейная алгебра", "формулы", "JSXGraph", "Three.js"],
};

// Applies the saved theme and language from mathuni_state before the first paint (no flash).
const prefsScript = `(function(){try{var s=JSON.parse(localStorage.getItem("mathuni_state")||"{}");var d=document.documentElement;if(s.theme==="dark"||s.theme==="light")d.setAttribute("data-theme",s.theme);if(s.lang)d.lang=s.lang==="kz"?"kk":s.lang}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" data-theme="light" className={geistMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
