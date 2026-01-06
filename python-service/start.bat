@echo off
echo Iniciando servico Python para YouTube...
echo.

REM Verificar se venv existe
if not exist "venv" (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativar venv
call venv\Scripts\activate

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt -q

REM Copiar token do .env.local do projeto pai
for /f "tokens=2 delims==" %%a in ('findstr "BLOB_READ_WRITE_TOKEN" ..\\.env.local') do set BLOB_READ_WRITE_TOKEN=%%a

echo.
echo Iniciando servidor na porta 5000...
echo.
python app.py
