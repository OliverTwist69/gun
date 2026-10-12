@echo off
setlocal EnableExtensions
set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"

set "ANTHROPIC_BASE_URL=http://127.0.0.1:20128"
set "ANTHROPIC_AUTH_TOKEN=sk-feed7a3756f9456f-7f2e28-7725584b"
set "ANTHROPIC_MODEL=kiro/deepseek-3.2"
set "OMNIROUTE_API_KEY=sk-feed7a3756f9456f-7f2e28-7725584b"
set "CLAUDE_CONFIG_DIR=%USERPROFILE%\.claude\profiles\active-freeclaude"

echo Checking OmniRoute...
curl.exe -s -o NUL "http://127.0.0.1:20128/api/monitoring/health"
if errorlevel 1 (
  echo.
  echo [ERROR] OmniRoute offline.
  echo Start FreeClaude.exe first - it brings OmniRoute up.
  echo.
  pause
  exit /b 1
)

where claude.cmd >nul 2>&1
if errorlevel 1 (
  if not exist "%APPDATA%\npm\claude.cmd" (
    echo [ERROR] Claude Code not found.
    echo Install it from FreeClaude Settings, or set the path with the gear icon.
    echo.
    pause
    exit /b 1
  )
)

echo Starting Claude Code with kiro/deepseek-3.2...
if exist "%APPDATA%\npm\claude.cmd" (
  call "%APPDATA%\npm\claude.cmd" %*
) else (
  call claude.cmd %*
)
set "EC=%ERRORLEVEL%"
if not "%EC%"=="0" (
  echo.
  echo [ERROR] Claude exit code: %EC%
  pause
)
exit /b %EC%
