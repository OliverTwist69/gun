@echo off
echo ========================================
echo Запуск FreelanceHub Development Servers
echo ========================================
echo.

echo 1. Проверка MongoDB...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: MongoDB не найден!
    echo Установите MongoDB с: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo MongoDB найден ✓
echo.

echo 2. Запуск Backend сервера...
start cmd /k "cd /d freelancer-backend && npm run dev"
echo Backend запускается... (порт 5000)
echo.

echo 3. Запуск Frontend сервера...
timeout /t 3 >nul
start cmd /k "cd /d freelancer-frontend && npm run dev"
echo Frontend запускается... (порт 5173)
echo.

echo 4. Открытие браузера...
timeout /t 5 >nul
start http://localhost:5173

echo ========================================
echo Серверы запущены!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Нажмите любую клавишу для продолжения...
pause >nul