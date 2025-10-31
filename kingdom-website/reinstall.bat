@echo off
echo Reinstalling kingdom-website dependencies...
cd /d "%~dp0"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /f "package-lock.json"
if exist ".next" rmdir /s /q ".next"
npm install
echo.
echo Installation complete!
pause


