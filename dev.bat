@echo off
echo ========================================
echo   Courtify Development Server
echo ========================================
echo.

echo [1/2] Starting Backend API on port 3000...
start "Courtify Backend" cmd /k "cd /d %~dp0apps\backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend on port 5173...
start "Courtify Frontend" cmd /k "cd /d %~dp0apps\frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
echo Opening browser...
start http://localhost:5173
echo.
echo Press any key to close this window...
echo (Note: Server windows will remain open)
pause >nul
