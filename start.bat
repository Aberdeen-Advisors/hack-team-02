@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required but was not found on PATH.
    echo Install it from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo Starting Change Impact Assessment Tool on http://localhost:3000 ...
start "Change Impact Assessment Tool - server" cmd /k node server.js

timeout /t 2 /nobreak >nul
start http://localhost:3000

endlocal
