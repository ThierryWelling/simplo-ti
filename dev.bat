@echo off
echo Iniciando o servidor de desenvolvimento...
cd /d "%~dp0"
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev"
pause 