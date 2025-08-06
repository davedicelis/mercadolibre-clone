# Importaciones necesarias para FastAPI
from fastapi import APIRouter, HTTPException, Query  # APIRouter para organizar rutas, HTTPException para errores HTTP, Query para parámetros de consulta
from typing import List, Optional  # Para type hints - List para listas tipadas, Optional para valores opcionales
import json  # Para leer y parsear archivos JSON
import os  # Para operaciones del sistema de archivos
from datetime import datetime  # Para manejo de fechas (aunque no se usa actualmente)
from ..models import Product, ProductSummary, ErrorResponse  # Importar modelos Pydantic desde módulo padre

# Crear instancia del router para agrupar endpoints relacionados
router = APIRouter()

def load_products_data():
    """
    Función utilitaria para cargar datos de productos desde archivo JSON
    Retorna: dict con los datos de productos
    Lanza: HTTPException si hay errores de archivo o JSON
    """
    try:
        # Obtener directorio actual del archivo
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Construir ruta relativa al archivo de datos
        data_path = os.path.join(current_dir, "..", "data", "products.json")
        
        # Abrir y leer archivo JSON con codificación UTF-8
        with open(data_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        # Lanzar excepción HTTP 500 si el archivo no existe
        raise HTTPException(
            status_code=500, 
            detail="Archivo de datos de productos no encontrado"
        )
    except json.JSONDecodeError:
        # Lanzar excepción HTTP 500 si el JSON está malformado
        raise HTTPException(
            status_code=500, 
            detail="Error al decodificar datos de productos"
        )

# Decorador @router.get define un endpoint GET
# response_model especifica el tipo de respuesta que FastAPI usará para validación y documentación
@router.get("/products", response_model=List[ProductSummary])
async def get_products(
    # Query() define parámetros de consulta URL con validaciones
    limit: int = Query(default=20, le=100),  # ?limit=20 - máximo 100 elementos por página
    offset: int = Query(default=0, ge=0),    # ?offset=0 - desplazamiento para paginación, mínimo 0
    search: Optional[str] = Query(default=None)  # ?search=samsung - búsqueda opcional
):
    """
    Endpoint para obtener lista de productos con paginación y búsqueda opcional
    
    Args:
        limit: Número máximo de productos a retornar (default: 20, max: 100)
        offset: Número de productos a saltar para paginación (default: 0)
        search: Término de búsqueda opcional para filtrar productos
        
    Returns:
        List[ProductSummary]: Lista de productos resumidos
        
    Raises:
        HTTPException 500: Error interno del servidor
    """
    try:
        # Cargar datos desde el archivo JSON
        data = load_products_data()
        products = data["products"]
        
        # Aplicar filtro de búsqueda si se proporciona
        if search:
            # List comprehension para filtrar productos
            # Busca el término en título y descripción (case-insensitive)
            products = [
                p for p in products 
                if search.lower() in p["title"].lower() or 
                   search.lower() in p["description"].lower()
            ]
        
        # Aplicar paginación usando slicing de Python
        # offset:offset+limit obtiene la "página" correspondiente
        paginated_products = products[offset:offset + limit]
        
        # Convertir productos completos a ProductSummary (datos resumidos)
        summaries = []
        for product in paginated_products:
            # Crear instancia de ProductSummary con validación automática de Pydantic
            summary = ProductSummary(
                id=product["id"],
                title=product["title"],
                price=product["price"],
                currency=product["currency"],
                condition=product["condition"],
                # Usar primera imagen como thumbnail, cadena vacía si no hay imágenes
                thumbnail=product["images"][0]["url"] if product["images"] else "",
                rating=product["rating"],
                reviews_count=product["reviews_count"],
                seller_name=product["seller"]["name"]  # Extraer nombre del vendedor del objeto anidado
            )
            summaries.append(summary)
        
        # FastAPI automáticamente serializa la lista a JSON
        return summaries
        
    except Exception as e:
        # Capturar cualquier excepción no manejada y convertir a HTTPException
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

# Endpoint con path parameter usando llaves {}
@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):  # Path parameter viene como string automáticamente
    """
    Endpoint para obtener detalles completos de un producto específico por ID
    
    Args:
        product_id (str): ID del producto en la URL (ej: /products/1005)
        
    Returns:
        Product: Objeto completo del producto con todos sus detalles
        
    Raises:
        HTTPException 400: Si el ID no es un número válido
        HTTPException 404: Si el producto no existe
        HTTPException 500: Error interno del servidor
    """
    try:
        # Cargar datos de productos
        data = load_products_data()
        products = data["products"]
        
        # Buscar producto por ID (soporta tanto string como int)
        product_data = None
        
        # Intentar convertir a int si es posible, sino usar como string
        try:
            product_id_int = int(product_id)
            # Buscar por ID numérico
            for product in products:
                if product["id"] == product_id_int:
                    product_data = product
                    break
        except ValueError:
            # Si no es número, buscar por ID string
            for product in products:
                if str(product.get("id")) == product_id:
                    product_data = product
                    break
        
        # Verificar si se encontró el producto
        if not product_data:
            # Lanzar error 404 Not Found si no existe
            raise HTTPException(
                status_code=404,
                detail=f"Producto con ID {product_id} no encontrado"
            )
        
        # Crear instancia de Product usando desempaquetado de diccionario (**)
        # Pydantic validará automáticamente todos los campos
        return Product(**product_data)
        
    except HTTPException:
        # Re-lanzar HTTPExceptions sin modificar (para mantener código de estado)
        raise
    except Exception as e:
        # Capturar cualquier otra excepción y convertir a error 500
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

# Endpoint con path parameter y query parameter combinados
@router.get("/products/{product_id}/related", response_model=List[ProductSummary])
async def get_related_products(
    product_id: str,  # Path parameter: ID del producto base
    limit: int = Query(default=15, le=25)  # Query parameter: límite de productos relacionados
):
    """
    Endpoint para obtener productos relacionados basados en el producto actual
    Útil para mostrar recomendaciones en páginas de detalle de producto
    
    Args:
        product_id (str): ID del producto base en la URL
        limit (int): Número máximo de productos relacionados (default: 4, max: 10)
        
    Returns:
        List[ProductSummary]: Lista de productos relacionados (excluyendo el actual)
        
    Raises:
        HTTPException 400: Si el ID no es un número válido
        HTTPException 404: Si el producto base no existe
        HTTPException 500: Error interno del servidor
    """
    try:
        # Cargar datos de productos
        data = load_products_data()
        products = data["products"]
        
        # Buscar el producto base (soporta tanto string como int)
        current_product = None
        
        # Intentar convertir a int si es posible, sino usar como string
        try:
            product_id_int = int(product_id)
            # Buscar por ID numérico
            for product in products:
                if product["id"] == product_id_int:
                    current_product = product
                    break
        except ValueError:
            # Si no es número, buscar por ID string
            for product in products:
                if str(product.get("id")) == product_id:
                    current_product = product
                    break
        
        # Verificar que el producto base existe
        if not current_product:
            raise HTTPException(
                status_code=404,
                detail=f"Producto con ID {product_id} no encontrado"
            )
        
        # Filtrar productos relacionados excluyendo el actual
        # Priorizar productos del mismo vendedor, luego otros productos
        current_product_id = current_product["id"]
        current_seller_name = current_product["seller"]["name"]
        
        # Separar productos por vendedor
        same_seller_products = []
        other_products = []
        
        for p in products:
            if p["id"] != current_product_id:
                if p["seller"]["name"] == current_seller_name:
                    same_seller_products.append(p)
                else:
                    other_products.append(p)
        
        # Combinar: primero productos del mismo vendedor, luego otros
        related_products = same_seller_products + other_products
        
        # Aplicar límite usando slicing
        related_products = related_products[:limit]
        
        # Convertir a ProductSummary (misma lógica que en get_products)
        summaries = []
        for product in related_products:
            summary = ProductSummary(
                id=product["id"],
                title=product["title"],
                price=product["price"],
                currency=product["currency"],
                condition=product["condition"],
                thumbnail=product["images"][0]["url"] if product["images"] else "",
                rating=product["rating"],
                reviews_count=product["reviews_count"],
                seller_name=product["seller"]["name"]
            )
            summaries.append(summary)
        
        return summaries
        
    except HTTPException:
        # Preservar HTTPExceptions existentes
        raise
    except Exception as e:
        # Convertir errores inesperados a HTTP 500
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/payment-methods")
async def get_payment_methods():
    """
    Endpoint para obtener los medios de pago disponibles
    
    Returns:
        dict: Diccionario con los medios de pago organizados por categorías
        
    Raises:
        HTTPException 500: Error interno del servidor
    """
    try:
        # Cargar datos de productos que incluye payment_methods
        data = load_products_data()
        
        # Retornar solo la sección de payment_methods
        if "payment_methods" in data:
            return data["payment_methods"]
        else:
            # Fallback si no existe la sección
            return {
                "credit_cards": [],
                "debit_cards": [],
                "cash": []
            }
            
    except Exception as e:
        # Convertir errores inesperados a HTTP 500
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )