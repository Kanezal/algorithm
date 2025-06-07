const API_BASE_URL = 'https://vg63wb48-8000.euw.devtunnels.ms/api'

// Ford-Fulkerson для двудольного графа
export interface FordFulkersonInput {
  graph: number[][]  // Список смежности
}

export interface FordFulkersonResponse {
  max_matching: number
  matches: [number, number][]
  left_nodes: number[]
  right_nodes: number[]
}

// LCIS для множества последовательностей
export interface LCISInput {
  sequences: number[][]  // Массив последовательностей (4+)
}

export interface LCISResponse {
  length: number
  subsequence: number[]
  sequences: number[][]
}

// Malgrange SCC
export interface MalgrangeSCCInput {
  adj_matrix: number[][]  // Матрица смежности
}

export interface MalgrangeSCCResponse {
  scc: number[][]
  count: number
}

export const algorithmAPI = {
  fordFulkerson: async (data: FordFulkersonInput): Promise<FordFulkersonResponse> => {
    const response = await fetch(`${API_BASE_URL}/ford-fulkerson/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Network response was not ok')
    }
    const json = await response.json()
    // Сервер возвращает {status: 'success', algorithm: '...', result: {...}}
    return json.result || json
  },

  lcis: async (data: LCISInput): Promise<LCISResponse> => {
    const response = await fetch(`${API_BASE_URL}/lcis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Network response was not ok')
    }
    const json = await response.json()
    return json.result || json
  },

  malgrangeSCC: async (data: MalgrangeSCCInput): Promise<MalgrangeSCCResponse> => {
    const response = await fetch(`${API_BASE_URL}/malgrange_scc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Network response was not ok')
    }
    const json = await response.json()
    return json.result || json
  },
}