@echo off
REM Database Setup Script for Windows
REM Run this once to setup database

echo Employee Management System - Database Setup
echo ============================================
echo.

set /p DB_HOST="Enter MySQL host (default: localhost): " || set DB_HOST=localhost
set /p DB_USER="Enter MySQL user (default: root): " || set DB_USER=root
set /p DB_PASSWORD="Enter MySQL password: "

echo.
echo Creating database and tables...

mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% < employee_management_db.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database created successfully!
    echo.
    echo Next steps:
    echo 1. Update Backend-dacn\.env with these credentials:
    echo    DB_HOST=%DB_HOST%
    echo    DB_USER=%DB_USER%
    echo    DB_PASSWORD=%DB_PASSWORD%
    echo.
    echo 2. Test the connection:
    echo    mysql -h %DB_HOST% -u %DB_USER% -p -e "USE employee_management_db; SHOW TABLES;"
) else (
    echo Database setup failed!
    exit /b 1
)
