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

// Applies the saved theme, language (mathuni_state) and animation setting (mu_motion) before the first paint.
const prefsScript = `(function(){var d=document.documentElement;try{var s=JSON.parse(localStorage.getItem("mathuni_state")||"{}");if(s.theme==="dark"||s.theme==="light")d.setAttribute("data-theme",s.theme);if(s.lang)d.lang=s.lang==="kz"?"kk":s.lang}catch(e){}try{var m=localStorage.getItem("mu_motion");var r=m==="off"||(m!=="on"&&matchMedia("(prefers-reduced-motion: reduce)").matches);d.setAttribute("data-motion",r?"reduce":"full")}catch(e){}})()`;

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
