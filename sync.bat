@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
    echo Git is required but was not found on PATH.
    pause
    exit /b 1
)

echo Staging changes...
git add -A

git diff --cached --quiet
if errorlevel 1 (
    for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set TS=%%i
    echo Committing as "Auto-sync: %TS%"...
    git commit -m "Auto-sync: %TS%"
    if errorlevel 1 (
        echo Commit failed — see the error above.
        pause
        exit /b 1
    )
) else (
    echo No staged changes to commit.
)

echo Pushing to origin...
git push
if errorlevel 1 (
    echo Push failed — see the error above ^(e.g. the remote has commits you don't have yet; pull first^).
    pause
    exit /b 1
)

echo Sync complete.
pause
endlocal
