@echo off
REM Kingdom Website - Install Dependencies and Start Dev Server
REM This script installs all dependencies first, then starts the dev server

echo.
echo ========================================
echo   Kingdom Collective - Setup & Dev
echo ========================================
echo.
echo Step 1: Installing dependencies...
echo.

cd /d "%~dp0"
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencies installed successfully!
echo ========================================
echo.
echo Step 2: Starting development server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

