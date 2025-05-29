export default function Home() {
  const algorithms = [
    {
      name: 'Алгоритм Форда-Фалкерсона',
      description: 'Алгоритм для нахождения максимального потока в транспортной сети',
      href: '/ford-fulkerson',
      features: ['Максимальный поток', 'Транспортные сети', 'Графы']
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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Демонстрация алгоритмов
      </h1>
      
      <p className="text-lg text-gray-600 text-center mb-12">
        Интерактивная визуализация классических алгоритмов информатики
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algo) => (
          <a
            key={algo.href}
            href={algo.href}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {algo.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {algo.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {algo.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
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
