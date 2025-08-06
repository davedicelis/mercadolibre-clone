import { useState, useEffect } from 'react'

/**
 * Custom hook para manejar el estado y carga de un producto individual
 * @param {string} productId - ID del producto a obtener
 * @returns {Object} Objeto con product, relatedProducts, loading, error y refreshProduct
 */
export const useProduct = (productId) => {
    // Estados locales para manejar los datos del producto
    const [product, setProduct] = useState(null)              // Datos del producto principal
    const [relatedProducts, setRelatedProducts] = useState([]) // Lista de productos relacionados
    const [loading, setLoading] = useState(true)               // Estado de carga
    const [error, setError] = useState(null)                   // Manejo de errores

    /**
     * Función asíncrona para obtener datos del producto y productos relacionados
     */
    const fetchProduct = async () => {
        try {
            // Inicializar estado de carga y limpiar errores previos
            setLoading(true)
            setError(null)

            // Obtener datos del producto principal desde la API
            const response = await fetch(`http://localhost:8000/api/v1/products/${productId}`)
            if (!response.ok) {
                throw new Error('Producto no encontrado')
            }
            const productData = await response.json()
            setProduct(productData)

            // Intentar cargar productos relacionados (no crítico si falla)
            try {
                const relatedResponse = await fetch(`http://localhost:8000/api/v1/products/${productId}/related?limit=4`)
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json()
                    setRelatedProducts(relatedData)
                }
            } catch (relatedErr) {
                // Error no crítico - productos relacionados son opcionales
                console.log('No se pudieron cargar productos relacionados')
                setRelatedProducts([])
            }

        } catch (err) {
            // Manejar errores críticos del producto principal
            setError(err.message)
            console.error('Error fetching product:', err)
        } finally {
            // Finalizar estado de carga independientemente del resultado
            setLoading(false)
        }
    }

    /**
     * Función para recargar manualmente los datos del producto
     */
    const refreshProduct = () => {
        fetchProduct()
    }

    // Efecto para cargar el producto cuando cambia el productId
    useEffect(() => {
        if (productId) {
            fetchProduct()
        }
    }, [productId])

    // Retornar estado y funciones para el componente consumidor
    return {
        product,
        relatedProducts,
        loading,
        error,
        refreshProduct
    }
}

/**
 * Custom hook para manejar el estado y carga de múltiples productos
 * @param {Object} searchParams - Parámetros de búsqueda y filtros
 * @returns {Object} Objeto con products, loading, error y refreshProducts
 */
export const useProducts = (searchParams = {}) => {
    // Estados locales para manejar la lista de productos
    const [products, setProducts] = useState([])     // Lista de productos
    const [loading, setLoading] = useState(true)     // Estado de carga
    const [error, setError] = useState(null)         // Manejo de errores

    /**
     * Función asíncrona para obtener lista de productos con filtros
     */
    const fetchProducts = async () => {
        try {
            // Inicializar estado de carga y limpiar errores previos
            setLoading(true)
            setError(null)

            // Obtener productos desde la API usando el servicio productApi
            const productsData = await productApi.getProducts(searchParams)
            setProducts(productsData)

        } catch (err) {
            // Manejar errores de carga de productos
            setError(err.message)
            console.error('Error fetching products:', err)
        } finally {
            // Finalizar estado de carga
            setLoading(false)
        }
    }

    // Efecto para cargar productos cuando cambian los parámetros de búsqueda
    useEffect(() => {
        fetchProducts()
    }, [JSON.stringify(searchParams)]) // Convertir a string para comparación profunda

    // Retornar estado y funciones para el componente consumidor
    return {
        products,
        loading,
        error,
        refreshProducts: fetchProducts
    }
}