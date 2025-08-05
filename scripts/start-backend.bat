@echo off
echo Starting Kingdom Studios Backend Server...
cd /d "c:\Users\dezme\Kingdom Studios App\kingdom-studios-backend"
echo Current directory: %CD%
echo.
echo Checking if Node.js is available...
node --version
echo.
echo Starting server with: node src/server.js
echo =====================================
node src/server.js
