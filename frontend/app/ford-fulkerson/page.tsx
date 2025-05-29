'use client'

import { useState } from 'react'
import { algorithmAPI, FordFulkersonResponse } from '@/lib/api'

export default function FordFulkersonPage() {
  const [leftNodes, setLeftNodes] = useState(4)
  const [rightNodes, setRightNodes] = useState(4)
  const [adjacencyList, setAdjacencyList] = useState<number[][]>([
    [0, 1, 2],    // Вершина 0 соединена с 0, 1, 2 из правой доли
    [1, 2],       // Вершина 1 соединена с 1, 2 из правой доли
    [0, 3],       // Вершина 2 соединена с 0, 3 из правой доли
    [2, 3]        // Вершина 3 соединена с 2, 3 из правой доли
  ])
  const [result, setResult] = useState<FordFulkersonResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLeftNodesChange = (newNodes: number) => {
    const newAdjList = Array(newNodes).fill(null).map((_, i) => 
      i < adjacencyList.length && adjacencyList[i] ? adjacencyList[i] : []
    )
    setLeftNodes(newNodes)
    setAdjacencyList(newAdjList)
  }

  const handleRightNodesChange = (newNodes: number) => {
    // Фильтруем существующие списки смежности
    const newAdjList = adjacencyList.map(list => 
      list ? list.filter(node => node < newNodes) : []
    )
    setRightNodes(newNodes)
    setAdjacencyList(newAdjList)
  }

  const toggleEdge = (leftNode: number, rightNode: number) => {
    const newAdjList = [...adjacencyList]
    if (!newAdjList[leftNode]) {
      newAdjList[leftNode] = []
    }
    const index = newAdjList[leftNode].indexOf(rightNode)
    
    if (index === -1) {
      // Добавляем ребро
      newAdjList[leftNode] = [...newAdjList[leftNode], rightNode].sort((a, b) => a - b)
    } else {
      // Удаляем ребро
      newAdjList[leftNode] = newAdjList[leftNode].filter(node => node !== rightNode)
    }
    
    setAdjacencyList(newAdjList)
  }

  const hasEdge = (leftNode: number, rightNode: number): boolean => {
    return adjacencyList[leftNode]?.includes(rightNode) || false
  }

  const runAlgorithm = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await algorithmAPI.fordFulkerson({
        graph: adjacencyList
      })
      console.log('API Response:', response)
      setResult(response)
    } catch (err) {
      setError('Ошибка при выполнении алгоритма')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Алгоритм Форда-Фалкерсона - Максимальное паросочетание в двудольном графе
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Настройки двудольного графа</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вершины в левой доле: {leftNodes}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={leftNodes}
              onChange={(e) => handleLeftNodesChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вершины в правой доле: {rightNodes}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={rightNodes}
              onChange={(e) => handleRightNodesChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Рёбра двудольного графа</h3>
          <p className="text-sm text-gray-600 mb-3">
            Кликните на ячейку, чтобы добавить/удалить ребро между вершинами
          </p>
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-sm">Левая доля \ Правая доля</th>
                  {Array.from({ length: rightNodes }, (_, i) => (
                    <th key={i} className="px-2 py-1 text-sm bg-blue-50">R{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: leftNodes }, (_, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 font-medium text-sm bg-green-50">L{i}</td>
                    {Array.from({ length: rightNodes }, (_, j) => (
                      <td key={j} className="px-1 py-1">
                        <button
                          onClick={() => toggleEdge(i, j)}
                          className={`w-10 h-10 rounded ${
                            hasEdge(i, j) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          } hover:opacity-80 transition-colors`}
                        >
                          {hasEdge(i, j) ? '✓' : ''}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Список смежности (формат для API)</h3>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm">
            {adjacencyList.map((list, i) => (
              <div key={i}>
                L{i}: [{list.join(', ')}]
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={runAlgorithm}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Выполнение...' : 'Найти максимальное паросочетание'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Результаты</h2>
          
          <div className="mb-6">
            <p className="text-lg">
              <span className="font-medium">Максимальное паросочетание:</span>{' '}
              <span className="text-2xl font-bold text-blue-600">{result.max_matching}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Найденные пары:</h3>
              {result.matches && result.matches.length > 0 ? (
                <div className="space-y-2">
                  {result.matches.map(([left, right], index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">L{left}</span>
                      <span className="text-gray-500">↔</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">R{right}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Паросочетание не найдено</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Информация о долях:</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-gray-600">Левая доля:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.left_nodes?.map((node) => (
                      <span key={node} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        L{node}
                      </span>
                    )) || <span className="text-gray-500">Нет данных</span>}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-600">Правая доля:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.right_nodes?.map((node) => (
                      <span key={node} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        R{node}
                      </span>
                    )) || <span className="text-gray-500">Нет данных</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Визуализация паросочетания</h3>
            <div className="overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-sm">Левая \ Правая</th>
                    {result.right_nodes?.map((node) => (
                      <th key={node} className="px-2 py-1 text-sm bg-blue-50">R{node}</th>
                    )) || null}
                  </tr>
                </thead>
                <tbody>
                  {result.left_nodes?.map((leftNode) => (
                    <tr key={leftNode}>
                      <td className="px-2 py-1 font-medium text-sm bg-green-50">L{leftNode}</td>
                      {result.right_nodes?.map((rightNode) => {
                        const isMatched = result.matches?.some(
                          ([l, r]) => l === leftNode && r === rightNode
                        )
                        const hasOriginalEdge = hasEdge(leftNode, rightNode)
                        return (
                          <td key={rightNode} className="px-2 py-1 text-center">
                            {isMatched ? (
                              <span className="text-green-600 font-bold text-lg">✓</span>
                            ) : hasOriginalEdge ? (
                              <span className="text-gray-400">○</span>
                            ) : (
                              <span className="text-gray-200">·</span>
                            )}
                          </td>
                        )
                      }) || null}
                    </tr>
                  )) || null}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ✓ - ребро в паросочетании, ○ - доступное ребро, · - нет ребра
            </p>
          </div>
        </div>
      )}
    </div>
  )
}