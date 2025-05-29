from pathlib import Path

# --- Основные настройки Django --- 
# Используется для работы с путями к файлам и директориям.
# `BASE_DIR` определяет базовую директорию проекта.
# `Path(__file__).resolve()`: получает абсолютный путь к текущему файлу (settings.py).
# `.parent.parent`: дважды поднимается на уровень выше, чтобы указать на корневую папку бэкенда.
BASE_DIR = Path(__file__).resolve().parent.parent

# `SECRET_KEY`: Секретный ключ для Django. Важен для безопасности, особенно в продакшене.
# В данном случае используется ключ для разработки.
# ВНИМАНИЕ: Для продакшена этот ключ должен быть уникальным и храниться в секрете!
SECRET_KEY = 'django-insecure-development-key-for-algorithms-api'

# `DEBUG`: Флаг режима отладки.
# `True` в разработке (показывает подробные страницы ошибок).
# `False` в продакшене (скрывает детали ошибок от пользователя).
DEBUG = True

# `ALLOWED_HOSTS`: Список строк, представляющих хосты/домены, которые может обслуживать это Django-приложение.
# `['*']` означает, что разрешены все хосты. Это удобно для разработки, но небезопасно для продакшена.
# В продакшене здесь должны быть указаны конкретные домены (например, ['mydomain.com', 'www.mydomain.com']).
ALLOWED_HOSTS = ['*']

# --- Приложения Django (`INSTALLED_APPS`) ---
# Список всех приложений Django, которые используются в этом проекте.
# Django будет искать шаблоны, статические файлы, модели и т.д. в этих приложениях.
INSTALLED_APPS = [
    # Стандартные приложения Django:
    'django.contrib.admin',       # Административный интерфейс.
    'django.contrib.auth',        # Система аутентификации.
    'django.contrib.contenttypes',# Фреймворк для типов контента.
    'django.contrib.sessions',    # Фреймворк для сессий.
    'django.contrib.messages',    # Фреймворк для сообщений (например, флеш-сообщения).
    'django.contrib.staticfiles', # Управление статическими файлами (CSS, JavaScript, изображения).
    
    # Сторонние приложения:
    'rest_framework', # Django REST framework для создания Web API.
    'corsheaders',    # Для обработки CORS (Cross-Origin Resource Sharing) заголовков.
    
    # Пользовательские приложения проекта:
    'algorithms',     # Приложение, содержащее логику алгоритмов и их API эндпоинты.
]

# --- Промежуточное ПО (`MIDDLEWARE`) ---
# Список классов middleware, которые обрабатывают запросы и ответы.
# Порядок middleware важен, так как они применяются последовательно.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # Защита от некоторых веб-атак.
    'django.contrib.sessions.middleware.SessionMiddleware', # Включает поддержку сессий.
    'corsheaders.middleware.CorsMiddleware', # Добавляет CORS заголовки к ответам. Должен быть выше CommonMiddleware.
    'django.middleware.common.CommonMiddleware', # Обрабатывает общие случаи (например, добавляет слеш в конце URL).
    'django.middleware.csrf.CsrfViewMiddleware', # Защита от CSRF-атак.
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Добавляет пользователя (request.user) к запросу.
    'django.contrib.messages.middleware.MessageMiddleware', # Включает поддержку сообщений.
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Защита от кликджекинга.
]

# `ROOT_URLCONF`: Строка, указывающая на главный файл конфигурации URL-адресов проекта.
# В данном случае это 'core.urls', что означает файл `urls.py` в директории `core`.
ROOT_URLCONF = 'core.urls'

# --- Шаблоны (`TEMPLATES`) ---
# Настройки для системы шаблонов Django.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates', # Используемый шаблоонизатор.
        'DIRS': [], # Список директорий, где Django будет искать шаблоны (помимо директорий 'templates' в приложениях).
        'APP_DIRS': True, # Указывает Django искать шаблоны в директориях 'templates' внутри каждого приложения из INSTALLED_APPS.
        'OPTIONS': {
            # `context_processors`: функции, которые добавляют переменные в контекст каждого шаблона.
            'context_processors': [
                'django.template.context_processors.debug', # Переменные, связанные с отладкой.
                'django.template.context_processors.request', # Объект `request` доступен в шаблонах.
                'django.contrib.auth.context_processors.auth', # Переменные, связанные с аутентификацией (например, `user`).
                'django.contrib.messages.context_processors.messages', # Сообщения доступны в шаблонах.
            ],
        },
    },
]

# `WSGI_APPLICATION`: Путь к WSGI-приложению, которое будет использоваться веб-серверами, совместимыми с WSGI.
WSGI_APPLICATION = 'core.wsgi.application'

# --- Базы данных (`DATABASES`) ---
# Настройки подключения к базам данных.
DATABASES = {
    # `default` - это стандартное имя для основной базы данных.
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Используемый движок базы данных (SQLite3).
        'NAME': BASE_DIR / 'db.sqlite3',       # Имя файла базы данных SQLite. Располагается в корневой директории бэкенда.
    }
}

# --- Валидаторы паролей (`AUTH_PASSWORD_VALIDATORS`) ---
# Список валидаторов, используемых для проверки сложности паролей пользователей.
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', # Пароль не должен быть слишком похож на атрибуты пользователя.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', # Минимальная длина пароля.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', # Пароль не должен быть из списка распространенных паролей.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', # Пароль не должен состоять только из цифр.
    },
]

# --- Интернационализация и локализация (`LANGUAGE_CODE`, `TIME_ZONE`, `USE_I18N`, `USE_TZ`) ---
LANGUAGE_CODE = 'ru-ru' # Язык по умолчанию для проекта (русский).
TIME_ZONE = 'UTC'       # Часовой пояс по умолчанию.
USE_I18N = True         # Включить систему интернационализации Django (перевод текстов).
USE_TZ = True           # Включить поддержку часовых поясов (даты и время будут храниться в UTC в БД).

# --- Статические файлы (`STATIC_URL`) ---
# URL-префикс для статических файлов (CSS, JavaScript, изображения).
# Например, файл `css/style.css` будет доступен по адресу `/static/css/style.css`.
STATIC_URL = 'static/'

# `DEFAULT_AUTO_FIELD`: Тип поля, используемый для первичных ключей по умолчанию в моделях.
# `BigAutoField` использует 64-битное целое число, что предотвращает переполнение для очень больших таблиц.
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Настройки CORS (Cross-Origin Resource Sharing) --- 
# `CORS_ALLOW_ALL_ORIGINS = True`: Разрешает запросы со всех источников (доменов).
# ВНИМАНИЕ: Для продакшена это небезопасно. Лучше использовать `CORS_ALLOWED_ORIGINS`.
CORS_ALLOW_ALL_ORIGINS = True 
# `CORS_ALLOW_CREDENTIALS = True`: Разрешает отправку cookie и других учетных данных в кросс-доменных запросах.
CORS_ALLOW_CREDENTIALS = True
# `CORS_ALLOWED_ORIGINS`: Список источников (доменов), которым разрешено делать кросс-доменные запросы.
# Используется, если `CORS_ALLOW_ALL_ORIGINS` установлено в `False`.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Разрешен доступ для фронтенда на React/Next.js, запущенного локально.
    "http://127.0.0.1:3000",
]

# --- Настройки Django REST framework (`REST_FRAMEWORK`) ---
REST_FRAMEWORK = {
    # `DEFAULT_PERMISSION_CLASSES`: Классы разрешений по умолчанию для всех API view.
    # `AllowAny` означает, что доступ разрешен всем пользователям (анонимным и аутентифицированным).
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    # `DEFAULT_RENDERER_CLASSES`: Классы рендереров по умолчанию.
    # `JSONRenderer` означает, что API будет возвращать ответы в формате JSON.
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    # Можно добавить другие настройки, например, для пагинации, аутентификации (JWT, TokenAuthentication) и т.д.
}