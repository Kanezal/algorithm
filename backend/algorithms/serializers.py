from rest_framework import serializers


class FordFulkersonSerializer(serializers.Serializer):
    graph = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(min_value=0)
        ),
        help_text="Матрица смежности графа для поиска максимального паросочетания"
    )


class LagrangeSerializer(serializers.Serializer):
    points = serializers.ListField(
        child=serializers.ListField(
            child=serializers.FloatField(),
            min_length=2,
            max_length=2
        ),
        help_text="Список точек в формате [[x1, y1], [x2, y2], ...]"
    )
    x = serializers.FloatField(help_text="Значение x для вычисления полинома")


class LCISSerializer(serializers.Serializer):
    sequence1 = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Первая последовательность чисел"
    )
    sequence2 = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Вторая последовательность чисел"
    )


class ContinuousCommonIncreasingSubsequenceSerializer(serializers.Serializer):
    sequences = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(),
            help_text="Одна из последовательностей"
        ),
        min_length=4,
        help_text="Список из >=4 последовательностей для поиска общей возрастающей подпоследовательности"
    )


class MalgrangeSCCSerializer(serializers.Serializer):
    adj_matrix = serializers.ListField(
        child=serializers.ListField(
            child=serializers.IntegerField(),
            help_text="Строка матрицы смежности"
        ),
        help_text="Матрица смежности графа для поиска компонент сильной связности"
    )