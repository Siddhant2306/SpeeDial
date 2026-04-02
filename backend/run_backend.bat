@echo off
setlocal

cd /d "%~dp0"

set "VENV_DIR=.venv"

if not exist "%VENV_DIR%\\Scripts\\activate.bat" (
  echo [ERROR] Virtual environment not found in "%VENV_DIR%".
  echo Run: backend\\setup_backend.bat
  exit /b 1
)

call "%VENV_DIR%\\Scripts\\activate.bat"
if errorlevel 1 (
  echo [ERROR] Failed to activate virtual environment.
  exit /b 1
)

echo [..] Starting backend on http://localhost:8080
python main.py

endlocal
exit /b 0

