@echo off
echo ========================================
echo   DEPLOY FRONTEND - SYMPHONY
echo ========================================
echo.

cd /d "c:\Users\jaian\Documents\symponhy"

echo [1/4] Verificando mudancas...
git status

echo.
echo [2/4] Adicionando arquivos...
git add .

echo.
echo [3/4] Criando commit...
set /p msg="Digite a mensagem do commit (ou Enter para 'Update frontend'): "
if "%msg%"=="" set msg=Update frontend
git commit -m "%msg%"

echo.
echo [4/4] Enviando para GitHub...
git push origin master

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo   Vercel vai atualizar em ~2 minutos
echo   URL: https://symponhy.vercel.app
echo ========================================
pause
