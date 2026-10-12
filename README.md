# FreelanceHub - Платформа для фриланса

Полнофункциональная платформа для поиска фрилансеров и клиентов.

## Структура проекта

```
freelancer-frontend/      # React + Vite frontend
freelancer-backend/       # Node.js + Express backend
```

## Требования

- Node.js 16+
- MongoDB
- npm или yarn

## Установка и запуск

### 1. Установка MongoDB

1. Скачайте MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Установите MongoDB
3. Запустите MongoDB сервис:
   ```bash
   # Windows - через службы
   # Или через командную строку:
   mongod --dbpath "C:\data\db"
   ```

### 2. Запуск Backend

```bash
# Перейти в папку backend
cd freelancer-backend

# Установить зависимости
npm install

# Создать .env файл (уже создан, можно проверить)
# Запустить сервер разработки
npm run dev

# Сервер запустится на http://localhost:5000
```

### 3. Запуск Frontend

```bash
# Перейти в папку frontend
cd ../freelancer-frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Приложение откроется на http://localhost:5173
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль

### Проекты
- `GET /api/projects` - Получить список проектов
- `GET /api/projects/:id` - Получить проект по ID
- `POST /api/projects` - Создать проект (только клиенты)
- `PUT /api/projects/:id` - Обновить проект (только владелец)
- `DELETE /api/projects/:id` - Удалить проект (только владелец)

### Пользователи
- `GET /api/users` - Получить всех пользователей (админ)
- `GET /api/users/:id` - Получить пользователя по ID
- `GET /api/users/freelancers/list` - Получить список фрилансеров
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

## Функциональность

### Для клиентов:
- Создание проектов
- Просмотр предложений фрилансеров
- Управление заказами
- Оплата через систему
- Отзывы о фрилансерах

### Для фрилансеров:
- Поиск проектов по фильтрам
- Отправка предложений
- Управление своими предложениями
- Чат с клиентами
- Получение оплаты

### Общая:
- Регистрация/вход
- Профиль пользователя
- Система рейтингов
- Уведомления
- Безопасная система чата

## Структура базы данных

### Модели:
1. **User** - пользователи (клиенты, фрилансеры, админы)
2. **Project** - проекты
3. **Proposal** - предложения фрилансеров
4. **Order** - заказы
5. **Message** - сообщения
6. **Payment** - платежи
7. **Review** - отзывы

## Тестирование

Для тестирования API можно использовать Postman или cURL:

```bash
# Регистрация пользователя
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Тестовый Пользователь",
    "role": "client"
  }'

# Получение списка проектов
curl -X GET http://localhost:5000/api/projects

# Создание проекта (требуется токен)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Нужен сайт",
    "description": "Создание сайта-визитки",
    "category": "web",
    "skillsRequired": ["HTML", "CSS", "JavaScript"],
    "budget": {
      "min": 500,
      "max": 1000
    },
    "deadline": "2024-12-31"
  }'
```

## Дополнительная настройка

### Настройка email (опционально)
Для отправки уведомлений на email обновите .env файл в backend:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Настройка CORS
По умолчанию CORS настроен на http://localhost:5173

## Устранение проблем

1. **MongoDB не запущен**:
   - Проверьте, что MongoDB установлен и запущен
   - Убедитесь, что путь к БД существует

2. **Ошибки при установке зависимостей**:
   - Проверьте версию Node.js (должна быть 16+)
   - Попробуйте очистить кэш npm: `npm cache clean --force`

3. **Ошибки CORS**:
   - Проверьте, что фронтенд запущен на правильном порту (5173)
   - Проверьте настройки CORS в server.js

## Дальнейшее развитие

Планируется добавление:
- Система онлайн-оплаты (Stripe/PayPal)
- Push-уведомления
- Видеозвонки
- Система файлообмена
- API для мобильных приложений

## Лицензия

MIT