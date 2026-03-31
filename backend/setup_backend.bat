@echo off
setlocal

cd /d "%~dp0"

set "VENV_DIR=.venv"
set "PYTHON_EXE=py -3.10"

echo [..] Checking for Python 3.10...

%PYTHON_EXE% --version >nul 2>&1
if errorlevel 1 (
    echo [..] Python 3.10 not found. Attempting installation via winget...

    winget install --id Python.Python.3.10 -e --silent
    if errorlevel 1 (
        echo [ERROR] Failed to install Python 3.10 automatically.
        echo Please install it manually from https://www.python.org/downloads/release/python-310/
        exit /b 1
    )

    echo [..] Python 3.10 installed successfully.
)

echo [..] Creating virtual environment...

if not exist "%VENV_DIR%\Scripts\activate.bat" (
    %PYTHON_EXE% -m venv "%VENV_DIR%"
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        exit /b 1
    )
) else (
    echo [..] Virtual environment already exists. Skipping creation.
)

echo [..] Activating virtual environment...

call "%VENV_DIR%\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment.
    exit /b 1
)

echo [..] Upgrading pip...
python -m pip install --upgrade pip

echo [..] Installing dependencies from requirements.txt...

if not exist requirements.txt (
    echo [ERROR] requirements.txt not found.
    exit /b 1
)

pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
)

echo [SUCCESS] Backend setup complete.
echo You can now run: run_backend.bat

endlocal
exit /b 0