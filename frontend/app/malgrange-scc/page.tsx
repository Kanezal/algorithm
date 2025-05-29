'use client'

import { useState } from 'react'
import { algorithmAPI, MalgrangeSCCResponse } from '@/lib/api'

export default function MalgrangeSCCPage() {
  const [nodes, setNodes] = useState(7)
  const [graph, setGraph] = useState<number[][]>([
    [0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0]
  ])
  const [result, setResult] = useState<MalgrangeSCCResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGraphChange = (i: number, j: number) => {
    const newGraph = [...graph]
    newGraph[i][j] = newGraph[i][j] === 0 ? 1 : 0
    setGraph(newGraph)
  }

  const handleNodesChange = (newNodes: number) => {
    const newGraph = Array(newNodes).fill(null).map(() => Array(newNodes).fill(0))
    for (let i = 0; i < Math.min(nodes, newNodes); i++) {
      for (let j = 0; j < Math.min(nodes, newNodes); j++) {
        newGraph[i][j] = graph[i]?.[j] || 0
      }
    }
    setNodes(newNodes)
    setGraph(newGraph)
  }

  const runAlgorithm = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await algorithmAPI.malgrangeSCC({ adj_matrix: graph })
      setResult(response)
    } catch (err) {
      setError('Ошибка при выполнении алгоритма')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addExampleGraph = (type: 'cycle' | 'dag' | 'complex' | 'selfloops') => {
    if (type === 'cycle') {
      setNodes(5)
      setGraph([
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0]
      ])
    } else if (type === 'dag') {
      setNodes(5)
      setGraph([
        [0, 1, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0]
      ])
    } else if (type === 'selfloops') {
      setNodes(4)
      setGraph([
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [1, 0, 0, 1]
      ])
    } else {
      setNodes(7)
      setGraph([
        [0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 0]
      ])
    }
  }

  const getComponentColor = (componentIndex: number) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800'
    ]
    return colors[componentIndex % colors.length]
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Алгоритм Мальгранжа для поиска сильно связных компонент
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Настройки графа</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Количество вершин: {nodes}
          </label>
          <input
            type="range"
            min="2"
            max="15"
            value={nodes}
            onChange={(e) => handleNodesChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Примеры графов:</p>
          <div className="flex gap-2">
            <button
              onClick={() => addExampleGraph('cycle')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Простой цикл
            </button>
            <button
              onClick={() => addExampleGraph('dag')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              DAG
            </button>
            <button
              onClick={() => addExampleGraph('complex')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Сложный граф
            </button>
            <button
              onClick={() => addExampleGraph('selfloops')}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              С петлями
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Матрица смежности (кликните для изменения)</h3>
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 py-1"></th>
                  {Array.from({ length: nodes }, (_, i) => (
                    <th key={i} className="px-2 py-1 text-sm">{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graph.map((row, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 font-medium text-sm">{i}</td>
                    {row.map((cell, j) => (
                      <td key={j} className="px-1 py-1">
                        <button
                          onClick={() => handleGraphChange(i, j)}
                          className={`w-10 h-10 rounded ${
                            cell === 1 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          } hover:opacity-80 transition-colors`}
                        >
                          {cell}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={runAlgorithm}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Выполнение...' : 'Найти сильно связные компоненты'}
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
              <span className="font-medium">Количество компонент:</span>{' '}
              <span className="text-2xl font-bold text-blue-600">{result.count}</span>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Сильно связные компоненты:</h3>
            <div className="space-y-3">
              {result.scc.map((component, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="font-medium whitespace-nowrap">
                    Компонента {index + 1}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {component.map((node) => (
                      <span
                        key={node}
                        className={`px-3 py-1 rounded-full font-medium ${getComponentColor(index)}`}
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Визуализация графа с компонентами</h3>
            <div className="overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1"></th>
                    {Array.from({ length: nodes }, (_, i) => {
                      const componentIndex = result.scc.findIndex(comp => comp.includes(i))
                      return (
                        <th key={i} className="px-2 py-1">
                          <span className={`px-2 py-1 rounded ${getComponentColor(componentIndex)}`}>
                            {i}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {graph.map((row, i) => {
                    const rowComponentIndex = result.scc.findIndex(comp => comp.includes(i))
                    return (
                      <tr key={i}>
                        <td className="px-2 py-1">
                          <span className={`px-2 py-1 rounded ${getComponentColor(rowComponentIndex)}`}>
                            {i}
                          </span>
                        </td>
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1 text-center">
                            <span className={cell === 1 ? 'text-blue-600 font-bold' : 'text-gray-300'}>
                              {cell === 1 ? '→' : '·'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}