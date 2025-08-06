from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.routers import products
from app.models import ErrorResponse
import logging
from datetime import datetime

app = FastAPI(
    title="MercadoLibre Clone API",
    description="API para clon de MercadoLibre - Página de detalle de productos",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar respuestas JSON con UTF-8
app.default_response_class = JSONResponse

# Middleware para asegurar encoding UTF-8
@app.middleware("http")
async def add_utf8_header(request: Request, call_next):
    response = await call_next(request)
    if response.headers.get("content-type", "").startswith("application/json"):
        response.headers["content-type"] = "application/json; charset=utf-8"
    return response

# Configurar CORS para permitir requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(products.router, prefix="/api/v1", tags=["products"])

@app.get("/")
async def root():
    return {
        "message": "MercadoLibre Clone API",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "1.0.0"
    }

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Exception handlers globales
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handler para excepciones HTTP"""
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler para errores de validación de requests"""
    logger.error(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": "Los datos enviados no son válidos",
            "status_code": 422,
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url),
            "validation_errors": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handler para excepciones generales no manejadas"""
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "Ha ocurrido un error interno del servidor",
            "status_code": 500,
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url)
        }
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mercadolibre-clone-api"}