@echo off
echo Compilando o projeto...
cd /d %~dp0
call npm run build
echo Código de saída: %ERRORLEVEL%
pause 