from rest_framework import serializers


# --- Сериализатор для алгоритма Форда-Фалкерсона ---
# Ожидает: graph — список списков целых чисел (матрица смежности)
class FordFulkersonSerializer(serializers.Serializer):
    graph = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(min_value=0), # Вершины должны быть >= 0
        ),
        help_text="Матрица смежности графа для поиска максимального паросочетания"
    )


# --- Сериализатор для интерполяции Лагранжа ---
# Ожидает: points — список точек [[x, y], ...], x — значение для вычисления
class LagrangeSerializer(serializers.Serializer):
    points = serializers.ListField(
        child=serializers.ListField(
            child=serializers.FloatField(), # Каждая точка — два float: x и y
            min_length=2,
            max_length=2
        ),
        help_text="Список точек в формате [[x1, y1], [x2, y2], ...]"
    )
    x = serializers.FloatField(help_text="Значение x для вычисления полинома")


# --- Сериализатор для поиска LCIS между двумя последовательностями ---
# Ожидает: sequence1 и sequence2 — списки целых чисел
class LCISSerializer(serializers.Serializer):
    sequence1 = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Первая последовательность чисел"
    )
    sequence2 = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Вторая последовательность чисел"
    )


# --- Сериализатор для поиска LCIS среди >=4 последовательностей ---
# Ожидает: sequences — список списков целых чисел
class ContinuousCommonIncreasingSubsequenceSerializer(serializers.Serializer):
    sequences = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(), # Одна из последовательностей
            help_text="Одна из последовательностей"
        ),
        min_length=4, # Требуется минимум 4 последовательности
        help_text="Список из >=4 последовательностей для поиска общей возрастающей подпоследовательности"
    )


# --- Сериализатор для поиска компонент сильной связности ---
# Ожидает: adj_matrix — матрица смежности (список списков целых чисел)
class MalgrangeSCCSerializer(serializers.Serializer):
    adj_matrix = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(), # Строка матрицы смежности
            help_text="Строка матрицы смежности"
        ),
        help_text="Матрица смежности графа для поиска компонент сильной связности"
    )