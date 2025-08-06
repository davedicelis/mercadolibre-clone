# MercadoLibre Clone - Documento de Diseño

Este documento detalla las decisiones a nivel de arquitectura, la elección de la tecnológía que se implemento y los desafíos que enfrenté al desarrollar la página de detalles de un producto y su API de soporte. El objetivo era construir un prototipo full-stack que imitara la experiencia de MercadoLibre. La solución final usa React con Vite para el frontend y FastAPI (Python) para el backend.

## 1. Arquitectura General

Para este proyecto, decidí usar una arquitectura simple de cliente-servidor. El frontend, creado con React y Vite, se comunica con la API del backend, desarrollada con FastAPI. El backend, en lugar de usar una base de datos real, lee los datos del archivo JSON local.

```

┌─────────────────┐    HTTP/REST     ┌─────────────────┐
│                 │    API calls     │                 │
│   React + Vite  │◄────────────────►│   FastAPI       │
│   Frontend      │                  │   Backend       │
│   Puerto: 5173  │                  │   Puerto: 8000  │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
        │                                      │
        │                                      │
        ▼                                      ▼
┌─────────────────┐                  ┌─────────────────┐
│   Navegador     │                  │   Archivos JSON │
│   - Manejo Estado│                 │   - products.json
│   - Renderizado │                  │   - Datos Static │
│   - Interacción │                  │   - Sin BD       │
└─────────────────┘                  └─────────────────┘
```


1. **Separación de Responsabilidades**: Separación entre la presentación (lo que ve el usuario), la lógica (lo que hace el servidor) y datos (JSON)
2. **Desarrollo Basado en Componentes**: Piezas pequeñas y reutilizables con React
3. **Enfoque API-First**: Backend diseñado como servicio RESTful 
4. **Mejora Progresiva**: Diseño responsive mobile-first con mejoras para desktop


## 2. Arquitectura Frontend

### 2.1 Selección de Stack Tecnológico

**React 18 con Vite**: Elegí Vite por su velocidad en el desarrollo, es más rápido comparado con Create React App

**Tailwind CSS**
Este framework de CSS me permitió construir la interfaz de usuario de forma  rápida y consistente, ademas para no usar CSS desde cero.


**React Router v7**
Use la versión más reciente ya que tiene un rendimiento mejorado y permite que la aplicación solo cargue lo que se necesita ver en cada momento (Code splitting) , organiza las páginas de manera lógica por ejemplo, /productos/celulares/celular-a (routing anidado)  y, si algo falla en una parte de la página, el resto sigue funcionando sin problemas (error boundaries).

### 2.2 Arquitectura de Componentes

Organicé los componentes de manera jerárquica para mantener el código ordenado y fácil de entender. Cada componente tiene una única responsabilidad.

```
App.jsx
├── ProductDetail.jsx (Componente principal de página)
│   ├── ProductImages.jsx (Galería de imágenes)
│   ├── PaymentMethods.jsx (Opciones de pago)
│   ├── SellerInfo.jsx (Información del vendedor)
│   └── ProductInfo.jsx (Detalles del producto)
├── ProductList.jsx (Vista de catálogo)
├── SearchBox.jsx (Funcionalidad de búsqueda)
└── Footer.jsx (Pie de página)
```



### 2.3 Implementación de Diseño Responsive

**Enfoque Mobile-First:**
```
-  Adopté un enfoque mobile-first para asegurar que la experiencia en móviles fuera buena desde el principio,luego fui añadiendo estilos para tablets y escritorios, asegurando que la página funcione bien en cualquier tamaño de pantalla.

```

## 3. Arquitectura Backend

### 3.1 Selección de Stack Tecnológico

**FastAPI**
- Elegí este framework de Python por su alto rendimiento y su excelente experiencia de desarrollo. FastAPI genera automáticamente documentación OpenAPI/Swagger, lo que hace que el frontend y el backend sean fáciles de integrar. Además, la validación de tipos con Pydantic evita errores comunes y hace que el código sea más robusto.


### 3.2 Principios de Diseño de la  API

**Arquitectura RESTful:**
```
GET /api/v1/products              # Listar productos con paginación
GET /api/v1/products/{id}         # Obtener detalles específicos del producto
GET /api/v1/products/{id}/related # Obtener productos relacionados
GET /api/v1/payment-methods       # Obtener opciones de pago
```


**Paginación y Filtrado:**
Para que la página no tarde  en cargar, no le pedimos todos los productos de golpe.

```python
@router.get("/products", response_model=List[ProductSummary])
async def get_products(
    limit: int = Query(default=20, le=100),    # Máx 100 elementos por página
    offset: int = Query(default=0, ge=0),      # Offset de paginación
    search: Optional[str] = Query(default=None) # Término de búsqueda opcional
):
```

### 3.3 Modelado de Datos

**Diseño del Esquema de Datos con Pydantic:**

-Estos modelos me sirvieron para validar automáticamente los datos de las peticiones y respuestas, lo que me ayudó a establecer contratos de datos claros para la API.

```python

class Product(BaseModel):
    """Modelo completo de producto para vista de detalle"""
    id: int
    title: str
    description: str
    price: float
    images: List[ProductImage]
    seller: Seller
    features: List[ProductFeature]
    # ... campos adicionales
```

### 3.4 Estrategia de Manejo de Errores

**Manejo Integral de Excepciones:**
El proyecto implementa un manejador global de excepciones que estandariza todas las respuestas de error de la API.

**Estructura de Respuesta de Error:**
- Formato consistente: Todas las respuestas de error siguen la misma estructura JSON
- Mensajes de error significativos para debugging
- Códigos de estado HTTP apropiados
- Contexto de request para debugging

 Estructura de respuesta de error:
```Json
 {
    "error": "HTTP 404",
    "detail": "Product not found",
    "timestamp": "2025-08-06T15:30:00.000Z",
    "path": "/api/v1/products/999"
  }
```
 

## 4. Desafíos Clave de Diseño y Soluciones

### 4.1 Desafío: Integración Frontend-Backend

**Desafío**: Comunicación entre Frontend y Backend
Al conectar nuestro frontend de React con el backend de FastAPI, nos enfrentamos a dos retos principales: CORS y el manejo de errores.

**La Solución a CORS**
El problema de CORS, que es una restricción de seguridad del navegador, se resolvió configurando un middleware en FastAPI. Esto le indica al navegador que es seguro que el frontend y el backend se comuniquen entre sí, incluso estando en dominios o puertos diferentes.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
### 4.2 Desafío: Performance de Imágenes

**Problema**: Carga lenta de múltiples imágenes de producto
**Solución**:
- Lazy loading de imágenes secundarias
- Componente `ProductImages` optimizado con thumbnails
- Placeholder states durante carga

```javascript
const [selectedImage, setSelectedImage] = useState(0)
const [imageLoading, setImageLoading] = useState(true)
```

### 4.3 Desafío: Galería de Imágenes del Producto

**Problema**: Crear una galería de imágenes responsive e interactiva que funcione en todos los dispositivos

La galería de imágenes está implementada como un componente independiente en ProductImages.jsx

**Solución Implementada:**
```javascript
// Galería de imágenes responsive con thumbnails
<div className="flex gap-3">
  {/* Columna de thumbnails */}
  <div className="flex flex-col gap-2">
    {product.images.map((image, index) => (
      <button onClick={() => setSelectedImage(index)}>
        <img src={image.url} className="w-16 h-16" />
      </button>
    ))}
  </div>
  
  {/* Imagen principal */}
  <div className="flex-1 aspect-square">
    <img src={product.images[selectedImage]?.url} />
  </div>
</div>
```

  - Thumbnails a la izquierda con un límite de 6 imágenes máximo
  - Imagen principal con aspect-ratio cuadrado
  - Manejo de errores con placeholders SVG automáticos
  - Estado visual para el thumbnail seleccionado (border azul)
  - Diseño responsive con flexbox
  - Fallback para productos sin imágenes usando un placeholder por defecto


### 4.4 Desafío: Relaciones de Datos del Backend

**Problema**: Manejar eficientemente relaciones de productos sin base de datos

**Solución Implementada:**
```python
@router.get("/products/{product_id}/related")
async def get_related_products(product_id: str, limit: int = 15):
    # Algoritmo de prioridad para productos relacionados
    current_seller_name = current_product["seller"]["name"]
    
    same_seller_products = []
    other_products = []
    
    for p in products:
        if p["id"] != current_product_id:
            if p["seller"]["name"] == current_seller_name:
                same_seller_products.append(p)
            else:
                other_products.append(p)
    
    # Priorizar mismo vendedor, luego otros
    related_products = same_seller_products + other_products
    return related_products[:limit]
```

**Lógica del Algoritmo:**
1. Productos del mismo vendedor primero (mayor relevancia)
2. Luego otros productos (oportunidad de descubrimiento)
3. Límite configurable para controlar el tamaño de respuesta


## 5. Estrategia de Testing

  Para el backend  implementé un enfoque de testing integral usando pytest, enfocándome en cubrir tanto los casos exitosos como las
  situaciones de error que son críticas en una API REST.

  Tests implementados:
  - Endpoints principales: Verificación de respuestas exitosas para listado y detalle de productos
  - Manejo de errores: Validación de códigos 404 para productos inexistentes y otros errores HTTP
  - Validación de datos: Tests para asegurar que los modelos Pydantic validen correctamente la entrada
  - Transformación de datos: Verificación de que los datos se estructuren correctamente antes de ser enviados al frontend

### 5.1 Testing Backend

**Estructura de Tests:**
```python
class TestProductsAPI:
    def test_get_products_success(self):
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        
    def test_get_product_by_id(self):
        response = client.get("/api/v1/products/1001")
        assert response.status_code == 200
        
    def test_product_not_found(self):
        response = client.get("/api/v1/products/99999")
        assert response.status_code == 404
```

  **Configuración técnica:**
  - Framework: pytest con soporte async
  - Cliente de test: TestClient de FastAPI para simular requests HTTP
  - Coverage reporting: pytest-cov para generar reportes detallados
  - Fixtures: Datos de prueba reutilizables para mantener consistencia

### 5.2 Testing Frontend
 
 Implementé una suite de tests para los componentes principales utilizando Vitest y React Testing Library, priorizando los flujos críticos
  de usuario.

**Estrategia de Testing de Componentes:**
```javascript
describe('ProductDetail Component', () => {
  it('renders loading state initially', () => {
    render(<ProductDetail productId="1001" />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
  
  it('displays product information when loaded', async () => {
    // Mock API response
    // Render component
    // Assert content is displayed
  });
});
```

El enfoque se centró en probar la funcionalidad desde la perspectiva del usuario final, asegurando que los componentes respondan
  correctamente a las interacciones y muestren la información apropiada en cada estado.

**Elabaorado por:** 
David Espinosa Dicelis