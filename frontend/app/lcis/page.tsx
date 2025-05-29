// --- Страница для работы с алгоритмом LCIS (наибольшая общая возрастающая подпоследовательность) ---
// Здесь пользователь может ввести несколько последовательностей, запустить алгоритм и увидеть результат.

'use client'

import { useState } from 'react'
import { algorithmAPI, LCISResponse } from '@/lib/api'

export default function LCISPage() {
  // --- Состояния компонента ---
  // sequences — массив строк, каждая строка это последовательность чисел, введённая пользователем
  const [sequences, setSequences] = useState<string[]>([
    '3 4 9 1 7 5 6',
    '8 4 2 1 3 5 6 7',
    '1 2 3 4 5 6 7',
    '4 1 5 3 6 7'
  ])
  // result — результат работы алгоритма (null, если еще не запускали)
  const [result, setResult] = useState<LCISResponse | null>(null)
  // loading — индикатор загрузки (true, пока идет запрос к серверу)
  const [loading, setLoading] = useState(false)
  // error — текст ошибки, если что-то пошло не так
  const [error, setError] = useState<string | null>(null)

  // --- Парсер строки в массив чисел ---
  // Преобразует строку вида '1 2 3' или '1,2,3' в массив чисел [1, 2, 3]
  const parseArray = (input: string): number[] => {
    return input.split(/[\s,]+/).map(n => parseInt(n)).filter(n => !isNaN(n))
  }

  // --- Добавить новую пустую последовательность ---
  const addSequence = () => {
    setSequences([...sequences, ''])
  }

  // --- Удалить последовательность по индексу ---
  // Можно удалять только если осталось больше 4 последовательностей
  const removeSequence = (index: number) => {
    if (sequences.length > 4) {
      setSequences(sequences.filter((_, i) => i !== index))
    }
  }

  // --- Обновить значение последовательности по индексу ---
  const updateSequence = (index: number, value: string) => {
    const newSequences = [...sequences]
    newSequences[index] = value
    setSequences(newSequences)
  }

  // --- Запуск алгоритма LCIS ---
  // Парсит все строки, проверяет корректность, отправляет на сервер и сохраняет результат
  const runAlgorithm = async () => {
    setLoading(true)
    setError(null)
    try {
      // Преобразуем все строки в массивы чисел
      const parsedSequences = sequences.map(seq => parseArray(seq)).filter(seq => seq.length > 0)
      
      // Проверка: минимум 4 последовательности
      if (parsedSequences.length < 4) {
        throw new Error('Необходимо минимум 4 последовательности')
      }
      
      // Проверка: все последовательности не пустые
      if (parsedSequences.some(seq => seq.length === 0)) {
        throw new Error('Все последовательности должны содержать хотя бы один элемент')
      }
      
      // Отправляем данные на сервер и сохраняем результат
      const response = await algorithmAPI.lcis({
        sequences: parsedSequences
      })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при выполнении алгоритма')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // --- Парсим все последовательности для отображения массива чисел под каждым инпутом ---
  const parsedSequences = sequences.map(seq => parseArray(seq))

  // --- Поиск позиции подпоследовательности в последовательности ---
  // Используется для подсветки LCIS в исходных последовательностях
  const findSubsequencePosition = (sequence: number[], subsequence: number[]): number => {
    if (subsequence.length === 0) return -1
    
    for (let i = 0; i <= sequence.length - subsequence.length; i++) {
      let match = true
      for (let j = 0; j < subsequence.length; j++) {
        if (sequence[i + j] !== subsequence[j]) {
          match = false
          break
        }
      }
      if (match) return i
    }
    return -1
  }

  // --- Основная разметка страницы ---
  return (
    <div className="max-w-7xl mx-auto">
      {/* Заголовок страницы */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        LCIS - Наибольшая общая возрастающая подпоследовательность для множества последовательностей
      </h1>
      
      {/* Блок ввода последовательностей */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Входные последовательности (минимум 4)</h2>
        
        <div className="space-y-4 mb-4">
          {sequences.map((seq, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Последовательность {index + 1}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seq}
                    onChange={(e) => updateSequence(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Числа через пробел или запятую"
                  />
                  {sequences.length > 4 && (
                    <button
                      onClick={() => removeSequence(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Удалить
                    </button>
                  )}
                </div>
                {/* Показываем распарсенный массив чисел под каждым инпутом */}
                {parsedSequences[index].length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Массив: [{parsedSequences[index].join(', ')}]
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка добавить новую последовательность */}
        <button
          onClick={addSequence}
          className="w-full mb-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          + Добавить последовательность
        </button>

        {/* Кнопка запуска алгоритма */}
        <button
          onClick={runAlgorithm}
          disabled={loading || parsedSequences.filter(seq => seq.length > 0).length < 4}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Выполнение...' : 'Найти LCIS'}
        </button>
        
        {/* Сообщение, если последовательностей недостаточно */}
        {parsedSequences.filter(seq => seq.length > 0).length < 4 && (
          <p className="text-red-500 text-sm mt-2">
            Добавьте минимум 4 последовательности с числами
          </p>
        )}
      </div>

      {/* Блок отображения ошибки, если она есть */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Блок с результатами работы алгоритма */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Результаты</h2>
          
          {/* Длина LCIS и сама подпоследовательность */}
          <div className="mb-6">
            <p className="text-lg mb-2">
              <span className="font-medium">Длина LCIS:</span>{' '}
              <span className="text-2xl font-bold text-blue-600">{result.length}</span>
            </p>
            
            {result.subsequence.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Наибольшая общая возрастающая подпоследовательность:</p>
                <p className="text-xl font-mono">
                  {result.subsequence.join(' → ')}
                </p>
              </div>
            )}
          </div>

          {/* Визуализация исходных последовательностей с подсветкой LCIS */}
          <div>
            <h3 className="text-lg font-medium mb-2">Исходные последовательности:</h3>
            <div className="space-y-2">
              {result.sequences.map((seq, index) => {
                const startPos = findSubsequencePosition(seq, result.subsequence)
                return (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-sm text-gray-600 mb-1">
                      Последовательность {index + 1}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {seq.map((num, numIndex) => {
                        // Подсвечиваем элементы, если они входят в LCIS
                        const isInLCIS = startPos !== -1 && 
                          numIndex >= startPos && 
                          numIndex < startPos + result.subsequence.length
                        return (
                          <span
                            key={numIndex}
                            className={`px-2 py-1 rounded ${
                              isInLCIS
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {num}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Элементы, выделенные синим цветом, показывают расположение LCIS в каждой последовательности
            </p>
          </div>
        </div>
      )}
    </div>
  )
}