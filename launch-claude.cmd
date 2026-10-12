@echo off
setlocal EnableExtensions
set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
title Claude Code - continue
echo.
echo  Model: kiro/deepseek-3.2
echo  Mode: continue
echo  Starting Claude Code...
echo.
if not exist "%APPDATA%\FreeClaude\freeclaude.bat" (
  echo [ERROR] freeclaude.bat not found in %%APPDATA%%\FreeClaude
  echo Open FreeClaude, connect a model, then try again.
  pause
  exit /b 1
)
call "%APPDATA%\FreeClaude\freeclaude.bat" --continue
if errorlevel 1 pause
