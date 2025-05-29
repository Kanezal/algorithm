from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import (
    FordFulkersonSerializer,
    MalgrangeSCCSerializer
)
from .algorithms import (
    ford_Falkerson,
    find_continuous_common_increasing_subsequence,
    malgrange_scc
)


@api_view(['POST'])
def ford_fulkerson_view(request):
    """
    Эндпоинт для алгоритма Форда-Фалкерсона.
    Принимает данные через POST-запрос.
    Ожидаемые данные в теле запроса (JSON):
    { "graph": [[...], ...], "nR": ... } (старый формат, nR не используется)
    или (предпочтительно):
    { "graph": [[индексы_правых_вершин_для_левой_0], [для_левой_1], ...] }
    где graph[i] - список правых вершин, смежных с левой вершиной i.
    Количество правых вершин (nR) будет вычислено автоматически.
    """
    serializer = FordFulkersonSerializer(data=request.data)
    if serializer.is_valid():
        graph = serializer.validated_data['graph']
        nR = 0
        if graph: # Проверяем, что граф не пустой
            max_right_node_index = -1
            for g_list in graph:
                if g_list: # Проверяем, что список смежности для левой вершины не пуст
                    current_max = max(g_list)
                    if current_max > max_right_node_index:
                        max_right_node_index = current_max
            if max_right_node_index != -1:
                 nR = max_right_node_index + 1

        try:
            result = ford_Falkerson(graph, nR)
            return Response({
                'status': 'success',
                'algorithm': 'Ford-Fulkerson',
                'result': result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def lcis_view(request):
    """
    Эндпоинт для поиска наибольшей непрерывной общей возрастающей подпоследовательности (LCIS).
    Принимает данные через POST-запрос.
    Ожидаемые данные в теле запроса (JSON):
    { "sequences": [[числа_посл_1], [числа_посл_2], ..., [числа_посл_N]] } (N >= 4)
    Для обратной совместимости также поддерживается старый формат (N=2):
    { "sequence1": [...], "sequence2": [...] }
    """
    data = request.data
    sequences = data.get('sequences')

    if not sequences:
        seq1 = data.get('sequence1')
        seq2 = data.get('sequence2')
        if seq1 is not None and seq2 is not None:
            sequences = [seq1, seq2]
        else:
            return Response({
                'status': 'error',
                'message': 'Необходимо передать sequences (список списков из >=2 элементов) или sequence1 и sequence2'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        result = find_continuous_common_increasing_subsequence(sequences)
        if 'error' in result:
            return Response({
                'status': 'error',
                'message': result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'status': 'success',
            'algorithm': 'Continuous Common Increasing Subsequence',
            'result': result
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def malgrange_scc_view(request):
    """
    Эндпоинт для поиска компонент сильной связности (SCC) по матрице смежности (алгоритм Мальгранжа).
    Принимает данные через POST-запрос.
    Ожидаемые данные в теле запроса (JSON):
    { "adj_matrix": [[0,1,0], [0,0,1], [1,0,0]] } # Матрица смежности
    """
    serializer = MalgrangeSCCSerializer(data=request.data)
    if serializer.is_valid():
        adj_matrix = serializer.validated_data['adj_matrix']
        
        try:
            result = malgrange_scc(adj_matrix)
            return Response({
                'status': 'success',
                'algorithm': 'Malgrange SCC',
                'result': result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_info(request):
    """
    Предоставляет общую информацию об API и доступных эндпоинтах.
    """
    return Response({
        'title': 'Algorithms API',
        'version': '1.0',
        'description': 'REST API для выполнения различных алгоритмов',
        'endpoints': {
            'ford_fulkerson': {
                'url': '/api/ford-fulkerson/',
                'method': 'POST',
                'description': 'Алгоритм Форда-Фалкерсона для поиска максимального паросочетания',
                'example_request': {
                    'graph': [
                        [0, 1],
                        [2],
                        [3],
                        [1]
                    ]
                }
            },
            'lcis': {
                'url': '/api/lcis/',
                'method': 'POST',
                'description': 'Наибольшая общая непрерывная возрастающая подпоследовательность (для >=2, рекомендуется >=4 последовательностей)',
                'example_request': {
                    'sequences': [
                        [1, 3, 5, 7, 9, 2, 4],
                        [5, 1, 3, 5, 7, 9, 3],
                        [8, 1, 3, 5, 7, 9, 4],
                        [9, 1, 3, 5, 7, 9, 6]
                    ]
                }
            },
            'malgrange_scc': {
                'url': '/api/malgrange_scc/',
                'method': 'POST',
                'description': 'Поиск компонент сильной связности (SCC) по матрице смежности',
                'example_request': {
                    'adj_matrix': [
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1],
                        [1, 0, 0, 0] # Пример для графа-цикла 0->1->2->3->0
                    ]
                }
            }
        }
    }, status=status.HTTP_200_OK)