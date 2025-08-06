import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestProductsAPI:
    
    def test_get_products_success(self):
        """Test obtener lista de productos exitoso"""
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verificar estructura del primer producto
        product = data[0]
        required_fields = ["id", "title", "price", "currency", "condition", 
                          "thumbnail", "rating", "reviews_count", "seller_name"]
        for field in required_fields:
            assert field in product

    def test_get_products_with_pagination(self):
        """Test paginación de productos"""
        response = client.get("/api/v1/products?limit=2&offset=1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 2

    def test_get_products_with_search(self):
        """Test búsqueda de productos"""
        response = client.get("/api/v1/products?search=Samsung")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Verificar que todos los resultados contienen "Samsung"
        for product in data:
            assert "samsung" in product["title"].lower()

    def test_get_product_by_id_success(self):
        """Test obtener producto específico exitoso"""
        product_id = "1001"  # Samsung Galaxy A55 5G
        response = client.get(f"/api/v1/products/{product_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == int(product_id)
        
        # Verificar campos requeridos
        required_fields = ["id", "title", "price", "currency", "condition",
                          "available_quantity", "sold_quantity", "rating",
                          "reviews_count", "images", "description", "features",
                          "payment_methods", "seller", "shipping"]
        for field in required_fields:
            assert field in data

    def test_get_product_by_id_not_found(self):
        """Test producto no encontrado"""
        response = client.get("/api/v1/products/nonexistent-product")
        assert response.status_code == 404
        data = response.json()
        assert "no encontrado" in data["detail"].lower()

    def test_get_related_products_success(self):
        """Test obtener productos relacionados exitoso"""
        product_id = "1001"  # Samsung Galaxy A55 5G
        response = client.get(f"/api/v1/products/{product_id}/related")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # Verificar que el producto actual no está en la lista
        product_ids = [p["id"] for p in data]
        assert int(product_id) not in product_ids

    def test_get_related_products_with_limit(self):
        """Test productos relacionados con límite"""
        product_id = "1001"  # Samsung Galaxy A55 5G
        response = client.get(f"/api/v1/products/{product_id}/related?limit=2")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) <= 2

    def test_get_related_products_not_found(self):
        """Test productos relacionados para producto inexistente"""
        response = client.get("/api/v1/products/nonexistent/related")
        assert response.status_code == 404

    def test_health_check(self):
        """Test endpoint de salud"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_endpoint(self):
        """Test endpoint raíz"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "docs" in data

    def test_invalid_pagination_parameters(self):
        """Test parámetros de paginación inválidos"""
        # Offset negativo
        response = client.get("/api/v1/products?offset=-1")
        assert response.status_code == 422
        
        # Limit excesivo
        response = client.get("/api/v1/products?limit=101")
        assert response.status_code == 422

    def test_product_structure_validation(self):
        """Test validación de estructura de producto"""
        product_id = "1001"  # Samsung Galaxy A55 5G
        response = client.get(f"/api/v1/products/{product_id}")
        assert response.status_code == 200
        
        product = response.json()
        
        # Verificar tipos de datos
        assert isinstance(product["price"], (int, float))
        assert isinstance(product["rating"], (int, float))
        assert isinstance(product["images"], list)
        assert isinstance(product["features"], list)
        assert isinstance(product["payment_methods"], list)
        assert isinstance(product["seller"], dict)
        
        # Verificar estructura de seller
        seller = product["seller"]
        assert "id" in seller
        assert "name" in seller
        assert "reputation" in seller
        assert "rating" in seller
        assert isinstance(seller["rating"], (int, float))
        assert 0 <= seller["rating"] <= 5

    def test_error_response_structure(self):
        """Test estructura de respuestas de error"""
        response = client.get("/api/v1/products/999999")
        assert response.status_code == 404
        
        error_data = response.json()
        # Verificar campos de error estandarizados
        required_error_fields = ["error", "detail", "status_code", "timestamp", "path"]
        for field in required_error_fields:
            assert field in error_data
        
        assert error_data["status_code"] == 404
        assert "no encontrado" in error_data["detail"].lower()

    def test_validation_error_response(self):
        """Test respuesta de errores de validación"""
        # Test con offset negativo (violación de validación ge=0)
        response = client.get("/api/v1/products?offset=-1")
        assert response.status_code == 422
        
        error_data = response.json()
        assert "error" in error_data
        assert "validation_errors" in error_data

if __name__ == "__main__":
    pytest.main([__file__, "-v"])