@echo off
echo ========================================
echo   Courtify - First Time Setup
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
echo.

echo [2/5] Installing backend dependencies...
cd apps\backend
call npm install
echo.

echo [3/5] Generating Prisma client...
call npx prisma generate
echo.

echo [4/5] Creating database and running migrations...
call npx prisma db push
echo.

echo [5/5] Seeding database with sample data...
call npx tsx prisma/seed.ts
cd ..\..

echo.
echo [OPTIONAL] Installing frontend dependencies...
cd apps\frontend
call npm install
cd ..\..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Database: apps\backend\prisma\dev.db (SQLite)
echo.
echo Test accounts:
echo   Admin:   admin@courtify.vn / admin123
echo   Manager: manager@courtify.vn / manager123
echo   Staff:   staff@courtify.vn / staff123
echo.
echo Next: Run 'dev.bat' to start development servers
echo.
pause
