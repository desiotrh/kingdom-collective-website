@echo off
REM Kingdom Studios App - Workspace Startup Script (Batch)
REM This script ensures you're always in the correct workspace directory

echo.
echo ========================================
echo    Kingdom Studios App - Workspace
echo ========================================
echo.

cd /d "D:\Kingdom Studios App"

if exist "kingdom-website\" (
    echo [32mWorkspace directory set successfully[0m
    echo Current directory: %CD%
    echo.
    echo You can now run commands like:
    echo   npm run build
    echo   npm --prefix kingdom-website install
    echo   npm --prefix kingdom-website run dev
    echo.
) else (
    echo [31mError: kingdom-website directory not found![0m
    echo Please check the workspace path.
    echo.
)

REM Keep terminal open
cmd /k

