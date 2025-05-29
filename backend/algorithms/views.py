from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import (
    FordFulkersonSerializer,
    ContinuousCommonIncreasingSubsequenceSerializer,
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
    Эндпоинт для алгоритма Форда-Фалкерсона (новая реализация).
    Ожидает: graph (список смежности), nR (кол-во правых вершин)
    """
    serializer = FordFulkersonSerializer(data=request.data)
    if serializer.is_valid():
        graph = serializer.validated_data['graph']
        # graph: список смежности, nR: максимальный индекс правой вершины + 1
        nR = max([max(g) if g else -1 for g in graph]) + 1 if graph else 0
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
    Эндпоинт для поиска наибольшей непрерывной общей возрастающей подпоследовательности для >=4 последовательностей.
    Ожидает: sequences (список списков)
    """
    # Для обратной совместимости поддержим старый вариант (2 последовательности)
    data = request.data
    sequences = data.get('sequences')
    if not sequences:
        # Если sequences нет, пробуем старый вариант
        seq1 = data.get('sequence1')
        seq2 = data.get('sequence2')
        if seq1 and seq2:
            sequences = [seq1, seq2]
        else:
            return Response({
                'status': 'error',
                'message': 'Необходимо передать sequences (список списков) или sequence1 и sequence2'
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
    Эндпоинт для поиска компонент сильной связности (SCC) по матрице смежности.
    Ожидает: adj_matrix (матрица смежности)
    """
    data = request.data
    adj_matrix = data.get('adj_matrix')
    if not adj_matrix:
        return Response({
            'status': 'error',
            'message': 'Необходимо передать adj_matrix (матрицу смежности)'
        }, status=status.HTTP_400_BAD_REQUEST)
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


@api_view(['GET'])
def api_info(request):
    """
    Информация об API и доступных эндпоинтах
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
                'description': 'Наибольшая общая возрастающая подпоследовательность (>=4 последовательностей)',
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
                        [1, 0, 0, 0]
                    ]
                }
            }
        }
    }, status=status.HTTP_200_OK)