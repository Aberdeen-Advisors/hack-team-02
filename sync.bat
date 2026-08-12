@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
    echo Git is required but was not found on PATH.
    pause
    exit /b 1
)

echo Pulling latest changes from origin...
git pull --no-edit
if errorlevel 1 (
    echo.
    echo Pull failed — most likely a merge conflict with origin.
    echo Resolve it manually: run "git status" to see the conflicted files,
    echo fix them, then "git add" the resolved files and "git commit" to
    echo finish the merge. This script will not auto-resolve or force-push.
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
