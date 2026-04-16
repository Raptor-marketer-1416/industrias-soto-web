@echo off
setlocal
cd /d "%~dp0"

set CLOUDFLARE_API_TOKEN=NLn0L2ooM-Q-ENTapCz-ABycp8S5h-be4MSfMvr5
set CLOUDFLARE_ACCOUNT_ID=598d12c266f77cf364564d086167f79f

echo.
echo ============================================
echo   Publicando Lacteo Industria Soto
echo ============================================
echo.

git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo Sin cambios nuevos para commitear, solo desplegando a Cloudflare...
) else (
  set /p msg="Mensaje del commit: "
  git commit -m "!msg!"
  git push origin main
)

echo.
echo Desplegando a Cloudflare Pages (industrias-soto)...
npx wrangler pages deploy . --project-name=industrias-soto --commit-dirty=true --branch=main

echo.
echo ============================================
echo   Deploy completado
echo ============================================
pause
