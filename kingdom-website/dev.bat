@echo off
REM Kingdom Website - Development Server Startup Script
REM This script starts the Next.js development server

echo.
echo ========================================
echo   Kingdom Collective - Dev Server
echo ========================================
echo.
echo Starting development server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
npm run dev

