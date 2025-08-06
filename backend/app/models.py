from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ErrorResponse(BaseModel):
    """Modelo para respuestas de error estandarizadas"""
    error: str
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.now)

class ValidationError(BaseModel):
    """Modelo para errores de validación"""
    field: str
    message: str
    invalid_value: Optional[str] = None

class ProductImage(BaseModel):
    id: str
    url: str
    alt: str

class PaymentMethod(BaseModel):
    type: str
    name: str
    logo: str
    installments: Optional[int] = None

class Seller(BaseModel):
    id: str
    name: str
    reputation: str
    rating: float = Field(..., ge=0, le=5)
    sales_count: int
    location: str
    is_mercado_lider: bool = False

class ProductFeature(BaseModel):
    name: str
    value: str

class ProductCategory(BaseModel):
    main: str
    sub: str
    brand: str
    series: str

class Product(BaseModel):
    id: int
    title: str
    category: Optional[ProductCategory] = None
    price: float = Field(..., gt=0)
    original_price: Optional[float] = None
    discount_percentage: Optional[int] = None
    currency: str = "COP"
    condition: str
    available_quantity: int
    sold_quantity: int
    rating: float = Field(..., ge=0, le=5)
    reviews_count: int
    images: List[ProductImage]
    description: str
    features: List[ProductFeature]
    payment_methods: List[PaymentMethod]
    seller: Seller
    shipping: dict
    warranty: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class ProductSummary(BaseModel):
    id: int
    title: str
    price: float
    currency: str
    condition: str
    thumbnail: str
    rating: float
    reviews_count: int
    seller_name: str

class ErrorResponse(BaseModel):
    detail: str
    status_code: int
    timestamp: datetime