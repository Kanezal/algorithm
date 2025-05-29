// Импортируем необходимые типы и модули
import type { Metadata } from "next"; // Тип для метаданных страницы
import { Geist, Geist_Mono } from "next/font/google"; // Шрифты Geist Sans и Geist Mono
import "./globals.css"; // Глобальные стили
import Navigation from "@/components/Navigation"; // Компонент навигации

// Инициализация шрифта Geist Sans с переменной CSS
const geistSans = Geist({
  variable: "--font-geist-sans", // Имя CSS переменной для шрифта
  subsets: ["latin"], // Подмножества символов (латиница)
});

// Инициализация шрифта Geist Mono с переменной CSS
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Имя CSS переменной для моноширинного шрифта
  subsets: ["latin"], // Подмножества символов (латиница)
});

// Определяем метаданные для всех страниц приложения
export const metadata: Metadata = {
  title: "Демонстрация алгоритмов", // Заголовок по умолчанию для вкладок браузера
  description: "Визуализация алгоритмов Форд-Фалкерсон, LCIS и Мальгранж", // Описание для SEO
};

// Определяем корневой компонент макета приложения
export default function RootLayout({
  children, // Дочерние компоненты, которые будут отображаться внутри макета
}: Readonly<{
  children: React.ReactNode; // Тип для дочерних React-компонентов
}>) {
  // Возвращаем JSX разметку для корневого макета
  return (
    <html lang="ru"> {/* Устанавливаем язык документа как русский */}
      <body
        // Применяем классы для шрифтов и сглаживания, а также фоновый цвет
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navigation /> {/* Отображаем компонент навигации */}
        {/* Основной контейнер для контента страницы */}
        <main className="container mx-auto px-4 py-8">
          {children} {/* Отображаем дочерние компоненты (содержимое текущей страницы) */}
        </main>
      </body>
    </html>
  );
}
