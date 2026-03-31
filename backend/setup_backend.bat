@echo off
setlocal enabledelayedexpansion

REM -----------------------------------------------------------------------------
REM Backend setup script (Windows)
REM - Finds a compatible Python (3.8+; 3.11 recommended)
REM - Creates a virtual environment in backend\.venv
REM - Installs dependencies from requirements.txt
REM - Optionally starts the server with: setup_backend.bat --run
REM -----------------------------------------------------------------------------

cd /d "%~dp0"

set "VENV_DIR=.venv"
set "MIN_PY_MAJOR=3"
set "MIN_PY_MINOR=8"

set "PY_EXE="
set "PY_ARGS="

REM Allow override (useful when Python isn't on PATH)
REM Example:
REM   set PYTHON_EXE=C:\Python311\python.exe
REM   backend\setup_backend.bat
if not "%PYTHON_EXE%"=="" (
  set "PY_EXE=%PYTHON_EXE%"
  set "PY_ARGS="
  goto :check_python
)

REM Prefer the Windows Python launcher (py.exe) when available.
for %%V in (11 10 9 8) do (
  py -3.%%V -c "import sys; print(sys.version_info[:2])" >nul 2>&1
  if !errorlevel! == 0 (
    set "PY_EXE=py"
    set "PY_ARGS=-3.%%V"
    goto :check_python
  )
)

REM Fallback to python/python3 on PATH.
python -c "import sys" >nul 2>&1
if !errorlevel! == 0 (
  set "PY_EXE=python"
  set "PY_ARGS="
  goto :check_python
)

python3 -c "import sys" >nul 2>&1
if !errorlevel! == 0 (
  set "PY_EXE=python3"
  set "PY_ARGS="
  goto :check_python
)

echo [ERROR] Python not found.
echo Install Python 3.11+ from https://www.python.org/downloads/windows/ (recommended)
echo Then re-run this script. If Python is installed but not detected, set PYTHON_EXE and retry.
exit /b 1

:check_python
set "PY_VERSION="
for /f "usebackq delims=" %%I in (`"%PY_EXE%" %PY_ARGS% -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')" 2^>nul`) do (
  set "PY_VERSION=%%I"
)

if "%PY_VERSION%"=="" (
  echo [ERROR] Failed to run Python using: "%PY_EXE%" %PY_ARGS%
  exit /b 1
)

for /f "tokens=1-3 delims=." %%A in ("%PY_VERSION%") do (
  set "PY_MAJOR=%%A"
  set "PY_MINOR=%%B"
  set "PY_MICRO=%%C"
)

if %PY_MAJOR% LSS %MIN_PY_MAJOR% (
  echo [ERROR] Python %MIN_PY_MAJOR%.%MIN_PY_MINOR%+ required. Detected %PY_VERSION%.
  exit /b 1
)

if %PY_MAJOR% EQU %MIN_PY_MAJOR% if %PY_MINOR% LSS %MIN_PY_MINOR% (
  echo [ERROR] Python %MIN_PY_MAJOR%.%MIN_PY_MINOR%+ required. Detected %PY_VERSION%.
  exit /b 1
)

echo [OK] Using Python %PY_VERSION%  ^(""%PY_EXE%"" %PY_ARGS%^)

REM Create venv if it doesn't exist yet.
if exist "%VENV_DIR%\\Scripts\\python.exe" (
  echo [OK] Virtual env already exists: %VENV_DIR%
) else (
  echo [..] Creating virtual env: %VENV_DIR%
  "%PY_EXE%" %PY_ARGS% -m venv "%VENV_DIR%"
  if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment.
    exit /b 1
  )
)

call "%VENV_DIR%\\Scripts\\activate.bat"
if errorlevel 1 (
  echo [ERROR] Failed to activate virtual environment.
  exit /b 1
)

if not exist "requirements.txt" (
  echo [ERROR] requirements.txt not found in backend folder.
  exit /b 1
)

echo [..] Upgrading pip
python -m pip install --upgrade pip

echo [..] Installing dependencies
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ERROR] Dependency install failed.
  exit /b 1
)

REM Create backend\.env from backend\.env.example if missing.
if not exist ".env" (
  if exist ".env.example" (
    echo [..] Creating .env from .env.example
    copy ".env.example" ".env" >nul
    echo [INFO] Edit backend\.env (DB settings, API keys) before running.
  ) else (
    echo [WARN] backend\.env is missing and .env.example was not found.
  )
)

echo.
echo [DONE] Backend setup complete.
echo Run the backend:
echo   cd backend
echo   call %VENV_DIR%\\Scripts\\activate.bat
echo   python main.py
echo.

if /I "%1"=="--run" (
  echo [..] Starting backend on http://localhost:8080
  python main.py
)

endlocal
exit /b 0

