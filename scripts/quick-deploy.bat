@echo off
REM Deploy rapido sem perguntas
cd /d "c:\Users\jaian\Documents\symponhy"
git add .
git commit -m "Quick update"
git push origin master
echo Deploy iniciado! Vercel vai atualizar em 2 minutos.
echo URL: https://symponhy.vercel.app
timeout /t 3
