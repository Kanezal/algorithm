def ford_Falkerson(graph, nR):
    """
    Алгоритм Форда-Фалкерсона для поиска максимального паросочетания в двудольном графе (реализация через DFS).
    graph: список списков, где graph[x] содержит индексы правых вершин, с которыми соединена левая вершина x.
    nR: количество правых вершин.
    Возвращает словарь с результатом для API.
    """
    nL = len(graph)  # Количество левых вершин
    px = [-1] * nL   # px[x] = y, если x сопоставлен с y, иначе -1
    py = [-1] * nR   # py[y] = x, если y сопоставлен с x, иначе -1

    def dfs(x, visited):
        visited[x] = True  # ВАЖНО: помечаем вершину как посещенную
        # Проходим по всем смежным правым вершинам для x
        for y in graph[x]:
            if py[y] == -1:
                px[x] = y
                py[y] = x
                return True
            else:
                # Если вершина y уже занята, пробуем продвинуться дальше по цепочке
                x2 = py[y]
                if not visited[x2] and dfs(x2, visited):
                    px[x] = y
                    py[y] = x
                    return True
        return False

    found_path = True
    while found_path:
        found_path = False
        visited = [False] * nL
        for x in range(nL):
            if px[x] == -1:
                if dfs(x, visited):
                    found_path = True
    # Формируем результат: список пар (x, y), где x сопоставлен с y
    matches = [[i, px[i]] for i in range(nL) if px[i] != -1]
    return {
        "max_matching": len(matches),
        "matches": matches,
        "left_nodes": list(range(nL)),
        "right_nodes": list(range(nR))
    }


def lagrange_interpolation(points, x):
    """
    Интерполяция Лагранжа для вычисления значения полинома в точке x
    """
    n = len(points)
    if n == 0:
        return {"error": "Необходима хотя бы одна точка"}
    
    # Проверяем уникальность x-координат
    x_coords = [p[0] for p in points]
    if len(set(x_coords)) != len(x_coords):
        return {"error": "X-координаты точек должны быть уникальными"}
    
    result = 0.0
    
    for i in range(n):
        xi, yi = points[i]
        term = yi
        
        for j in range(n):
            if i != j:
                xj = points[j][0]
                term *= (x - xj) / (xi - xj)
        
        result += term
    
    # Построим полином в явном виде
    polynomial_terms = []
    for i in range(n):
        xi, yi = points[i]
        if yi == 0:
            continue
            
        term_parts = [f"{yi:.2f}"]
        for j in range(n):
            if i != j:
                xj = points[j][0]
                denominator = xi - xj
                if xj == 0:
                    term_parts.append(f"x/{denominator:.2f}")
                else:
                    term_parts.append(f"(x - {xj:.2f})/{denominator:.2f}")
        
        polynomial_terms.append(" * ".join(term_parts))
    
    polynomial = " + ".join(polynomial_terms) if polynomial_terms else "0"
    
    return {
        "value": result,
        "x": x,
        "polynomial": polynomial,
        "degree": n - 1,
        "points": points
    }


def find_continuous_common_increasing_subsequence(sequences):
    """
    Находит наибольшую непрерывную общую возрастающую подпоследовательность для четырех и более последовательностей.
    sequences: список последовательностей (списков чисел)
    Возвращает словарь с результатом для API.
    """
    if len(sequences) < 4:
        return {"error": "Должно быть 4 или более последовательностей"}

    def is_continuous_subsequence(sub, seq):
        n = len(sub)
        for i in range(len(seq) - n + 1):
            if seq[i:i+n] == sub:
                return True
        return False

    def is_common_continuous_subsequence(sub, list_of_seqs):
        for seq in list_of_seqs:
            if not is_continuous_subsequence(sub, seq):
                return False
        return True

    def is_increasing(seq):
        for i in range(1, len(seq)):
            if seq[i] <= seq[i-1]:
                return False
        return True

    min_seq = min(sequences, key=len)
    others = [seq for seq in sequences if seq is not min_seq]
    all_subsequences = []
    n = len(min_seq)
    for length in range(1, n + 1):
        for start in range(n - length + 1):
            sub = min_seq[start:start+length]
            if is_increasing(sub):
                all_subsequences.append(sub)
    all_subsequences.sort(key=len, reverse=True)
    for sub in all_subsequences:
        if is_common_continuous_subsequence(sub, others):
            return {
                "length": len(sub),
                "subsequence": sub,
                "sequences": sequences
            }
    return {"length": 0, "subsequence": [], "sequences": sequences}


def malgrange_scc(adj_matrix):
    """
    Поиск компонент сильной связности (SCC) в графе по матрице смежности.
    adj_matrix: квадратная матрица смежности.
    Возвращает список компонент, каждая компонента — список вершин.
    """
    n = len(adj_matrix)
    # Строим обратный граф
    reverse = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if adj_matrix[i][j]:
                reverse[j][i] = 1
    visited, scc = [False]*n, []
    def bfs(start, matrix, allowed):
        q, reached = [start], [False]*n
        reached[start] = True
        while q:
            cur = q.pop(0)
            for nb in range(n):
                if matrix[cur][nb] and allowed[nb] and not reached[nb]:
                    reached[nb] = True
                    q.append(nb)
        return reached
    for v in range(n):
        if not visited[v]:
            allowed = [not visited[k] for k in range(n)]
            fwd  = bfs(v, adj_matrix,  allowed)
            back = bfs(v, reverse,     allowed)
            comp = [k for k in range(n)
                    if not visited[k] and fwd[k] and back[k]]
            for k in comp:
                visited[k] = True
            scc.append(comp)
    return {"scc": scc, "count": len(scc)}