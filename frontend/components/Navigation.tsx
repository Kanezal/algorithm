// --- Компонент Navigation ---
// Этот компонент отвечает за отображение верхнего меню навигации на сайте.
// Он позволяет пользователю переходить между страницами с разными алгоритмами.

'use client'

import Link from 'next/link' // Импорт компонента для навигации между страницами Next.js
import { usePathname } from 'next/navigation' // Хук для получения текущего пути (URL)

const Navigation = () => {
  // Получаем текущий путь (например, '/lcis'), чтобы подсвечивать активный пункт меню
  const pathname = usePathname()

  // --- Массив пунктов меню ---
  // Каждый объект описывает одну ссылку в меню: куда ведет (href) и как называется (label)
  const navItems = [
    { href: '/', label: 'Главная' },
    { href: '/ford-fulkerson', label: 'Форд-Фалкерсон' },
    { href: '/lcis', label: 'LCIS' },
    { href: '/malgrange-scc', label: 'Мальгранж SCC' },
  ]

  // --- Основной JSX для меню ---
  // Вся разметка отвечает за внешний вид и структуру меню
  return (
    // Обертка для меню с белым фоном и тенью
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Левая часть: название сайта */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Демонстрация алгоритмов
            </Link>
          </div>
          {/* Правая часть: сами пункты меню */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              // Для каждого пункта меню создаём ссылку
              <Link
                key={item.href}
                href={item.href}
                // Стилизация: если текущий путь совпадает с href, то выделяем пункт цветом
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-500 text-white' // Активный пункт
                    : 'text-gray-700 hover:bg-gray-100' // Неактивный пункт
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Экспортируем компонент для использования в других частях приложения
export default Navigation