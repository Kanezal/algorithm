// Определяем главную страницу приложения
export default function Home() {
  // Массив объектов, описывающих доступные алгоритмы
  const algorithms = [
    {
      name: 'Алгоритм Форда-Фалкерсона', // Название алгоритма
      description: 'Алгоритм для нахождения максимального потока в транспортной сети', // Краткое описание
      href: '/ford-fulkerson', // Ссылка на страницу с демонстрацией алгоритма
      features: ['Максимальный поток', 'Транспортные сети', 'Графы'] // Ключевые особенности или теги
    },
    {
      name: 'LCIS (Longest Common Increasing Subsequence)',
      description: 'Алгоритм для нахождения наибольшей общей возрастающей подпоследовательности',
      href: '/lcis',
      features: ['Динамическое программирование', 'Последовательности', 'Оптимизация']
    },
    {
      name: 'Алгоритм Мальгранжа для SCC',
      description: 'Алгоритм для поиска сильно связных компонент в ориентированном графе',
      href: '/malgrange-scc',
      features: ['Сильно связные компоненты', 'Ориентированные графы', 'Топологическая сортировка']
    }
  ]

  // Возвращаем JSX разметку для главной страницы
  return (
    <div className="max-w-7xl mx-auto"> {/* Контейнер с максимальной шириной и центрированием */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center"> {/* Заголовок страницы */}
        Демонстрация алгоритмов
      </h1>
      
      <p className="text-lg text-gray-600 text-center mb-12"> {/* Подзаголовок или описание */}
        Интерактивная визуализация классических алгоритмов информатики
      </p>

      {/* Сетка для отображения карточек алгоритмов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Итерация по массиву алгоритмов для создания карточек */}
        {algorithms.map((algo) => (
          <a
            key={algo.href} // Уникальный ключ для каждого элемента списка
            href={algo.href} // Ссылка на страницу алгоритма
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6" // Стили карточки
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3"> {/* Название алгоритма в карточке */}
              {algo.name}
            </h2>
            <p className="text-gray-600 mb-4"> {/* Описание алгоритма в карточке */}
              {algo.description}
            </p>
            {/* Контейнер для отображения тегов/ключевых особенностей */}
            <div className="flex flex-wrap gap-2">
              {/* Итерация по массиву тегов для их отображения */}
              {algo.features.map((feature, index) => (
                <span
                  key={index} // Уникальный ключ для каждого тега
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full" // Стили тега
                >
                  {feature}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
