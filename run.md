# MercadoLibre Clone - Guía de Ejecución

## Descripción del Proyecto

Este proyecto es un clon de MercadoLibre que implementa una página de detalle de productos con su API de soporte correspondiente.

## Estructura del Proyecto

```
mercadolibre-clone/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── main.py         # Aplicación FastAPI principal
│   │   ├── models.py       # Modelos Pydantic
│   │   ├── routers/        # Endpoints organizados
│   │   └── data/           # Datos JSON (simula BD)
│   ├── tests/              # Tests con pytest
│   ├── requirements.txt    # Dependencias Python
│   └── run_backend.py      # Script de inicio del servidor
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de rutas
│   │   ├── services/       # Integración API
│   │   └── hooks/          # Custom hooks
│   ├── tests/              # Tests con Vitest
│   └── package.json        # Dependencias Node.js
```

## Requisitos Previos

### Software Necesario
- **Python 3.8+** (recomendado 3.12)
- **Node.js 16+** (recomendado 18+)
- **npm** o **yarn**
- **Git** (para clonar el repositorio)

### Verificar Instalaciones
```bash
python3 --version    # debe mostrar 3.8+
node --version       # debe mostrar 16+
npm --version        # debe mostrar 8+
```

## Configuración e Instalación

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd mercadolibre-clone
```

### 2. Configurar Backend (FastAPI)

#### Crear Entorno Virtual
```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
# venv\Scripts\activate
```

#### Instalar Dependencias
```bash
# Con entorno virtual activado
pip install -r requirements.txt
```

#### Verificar Instalación del Backend
```bash
# Listar paquetes instalados
pip list

# Debería incluir:
# fastapi==0.104.1
# uvicorn==0.24.0
# pydantic==2.5.0
# pytest==7.4.3
# pytest-cov==4.1.0
```

### 3. Configurar Frontend (React + Vite)

#### Instalar Dependencias
```bash
cd ../frontend
npm install
```

#### Verificar Instalación del Frontend
```bash
# Listar dependencias principales
npm list --depth=0

# Debería incluir:
# react@18.2.0
# vite@5.0.8
# axios@1.6.2
# react-router-dom@7.7.1
# tailwindcss@3.3.6
```

## Ejecución del Proyecto

### Opción 1: Ejecución Manual (Recomendada para Desarrollo)

#### Terminal 1 - Backend
```bash
cd backend

# Activar entorno virtual si no está activo
source venv/bin/activate

# Iniciar servidor FastAPI
python run_backend.py

# Alternativamente:
# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Resultado esperado:**
```
INFO:     Will watch for changes in these directories: ['/path/to/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Terminal 2 - Frontend
```bash
cd frontend

# Iniciar servidor de desarrollo
npm run dev
```

**Resultado esperado:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Opción 2: Ejecución con Scripts Individuales

#### Backend (Puerto 8000)
```bash
cd backend && source venv/bin/activate && python run_backend.py
```

#### Frontend (Puerto 5173)
```bash
cd frontend && npm run dev
```

## Verificación de la Instalación

### 1. Backend API (http://localhost:8000)

#### Endpoints Principales:
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Lista Productos**: http://localhost:8000/api/v1/products
- **Detalle Producto**: http://localhost:8000/api/v1/products/1001

#### Verificación Manual:
```bash
# Test básico con curl
curl http://localhost:8000/health

# Respuesta esperada:
# {"status":"healthy","service":"mercadolibre-clone-api"}
```

### 2. Frontend (http://localhost:5173)

#### Páginas Disponibles:
- **Home**: http://localhost:5173/
- **Detalle Producto**: http://localhost:5173/producto/1001
- **Celulares**: http://localhost:5173/celulares

#### Funcionalidades a Verificar:
- ✅ Listado de productos con búsqueda
- ✅ Página de detalle responsiva
- ✅ Galería de imágenes interactiva
- ✅ Información de vendedor y envío
- ✅ Medios de pago
- ✅ Productos relacionados

## Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate

# Ejecutar todos los tests
pytest

# Con reporte de coverage
pytest --cov=app --cov-report=term-missing

# Generar reporte HTML
pytest --cov=app --cov-report=html
# Ver en: htmlcov/index.html
```

**Coverage esperado: >80%**

### Frontend Tests
```bash
cd frontend

# Ejecutar tests
npm run test

# Con coverage
npm run test:coverage
```

## Build de Producción

### Frontend
```bash
cd frontend

# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

Los archivos optimizados se generarán en `frontend/dist/`

### Backend
```bash
cd backend
source venv/bin/activate

# Para producción con Gunicorn (opcional)
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Linting y Calidad de Código

### Frontend
```bash
cd frontend

# Linting con ESLint
npm run lint

# Build (incluye verificaciones)
npm run build
```

## Troubleshooting

### Problemas Comunes

#### 1. Puerto en Uso
```bash
# Encontrar proceso usando puerto 8000
lsof -i :8000
# o
netstat -tulpn | grep :8000

# Terminar proceso
kill -9 <PID>
```

#### 2. Dependencias Faltantes
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 3. CORS Issues
El backend está configurado para aceptar requests desde:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:5174
- http://127.0.0.1:5174

#### 4. Datos No Cargan
Verificar que existe el archivo:
```bash
ls -la backend/app/data/products.json
```

### Logs de Debug

#### Backend Logs
```bash
# Los logs aparecen en la terminal donde ejecutaste el backend
# Nivel INFO por defecto, configurado en app/main.py
```

#### Frontend Logs
```bash
# Abrir DevTools del navegador (F12)
# Console tab para logs de JavaScript
```

## Configuración del Entorno

### Variables de Entorno (Opcional)
```bash
# Backend - crear .env en /backend/
PORT=8000
HOST=0.0.0.0
DEBUG=True

# Frontend - crear .env en /frontend/
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Contacto y Soporte

Si encuentras problemas durante la instalación o ejecución:

1. **Verifica los requisitos previos** están correctamente instalados
2. **Revisa los logs** en ambos terminales
3. **Confirma los puertos** no están siendo utilizados por otros servicios
4. **Asegúrate** de que ambos servidores (backend y frontend) estén ejecutándose

---

**¡El proyecto debería estar funcionando correctamente siguiendo estos pasos!** 

Accede a http://localhost:5173 para ver la aplicación funcionando.