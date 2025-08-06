import axios from 'axios'

// Configuración base de axios
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error)

        // Crear objeto de error estructurado
        const apiError = {
            message: 'Error desconocido',
            status: null,
            detail: null,
            timestamp: new Date().toISOString(),
            path: error.config?.url || 'unknown'
        }

        if (error.response) {
            // El servidor respondió con un código de error
            const { status, data } = error.response
            apiError.status = status
            apiError.detail = data?.detail || 'Error del servidor'
            
            // Mensajes específicos por código de estado
            switch (status) {
                case 400:
                    apiError.message = 'Solicitud inválida'
                    break
                case 401:
                    apiError.message = 'No autorizado'
                    break
                case 403:
                    apiError.message = 'Acceso denegado'
                    break
                case 404:
                    apiError.message = 'Recurso no encontrado'
                    break
                case 422:
                    apiError.message = 'Datos de entrada inválidos'
                    apiError.validationErrors = data?.validation_errors
                    break
                case 500:
                    apiError.message = 'Error interno del servidor'
                    break
                case 503:
                    apiError.message = 'Servicio no disponible'
                    break
                default:
                    apiError.message = `Error ${status}`
            }
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            apiError.message = 'Error de conexión'
            apiError.detail = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
            apiError.status = 0
        } else {
            // Error en la configuración de la petición
            apiError.message = 'Error de configuración'
            apiError.detail = error.message
        }

        // Crear error personalizado con propiedades estructuradas
        const customError = new Error(apiError.message)
        Object.assign(customError, apiError)
        
        throw customError
    }
)

// Funciones de la API
export const productApi = {
    /**
     * Obtener lista de productos
     * @param {Object} params - Parámetros de consulta
     * @param {number} params.limit - Límite de productos por página
     * @param {number} params.offset - Desplazamiento para paginación
     * @param {string} params.search - Término de búsqueda
     * @returns {Promise} Lista de productos
     */
    async getProducts(params = {}) {
        try {
            const response = await api.get('/products', { params })
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Obtener detalles de un producto específico
     * @param {string} productId - ID del producto
     * @returns {Promise} Detalles del producto
     */
    async getProduct(productId) {
        try {
            const response = await api.get(`/products/${productId}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Obtener productos relacionados
     * @param {string} productId - ID del producto
     * @param {number} limit - Límite de productos relacionados
     * @returns {Promise} Lista de productos relacionados
     */
    async getRelatedProducts(productId, limit = 4) {
        try {
            const response = await api.get(`/products/${productId}/related`, {
                params: { limit }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    /**
     * Obtener medios de pago disponibles
     * @returns {Promise} Medios de pago organizados por categorías
     */
    async getPaymentMethods() {
        try {
            const response = await api.get('/payment-methods')
            return response.data
        } catch (error) {
            throw error
        }
    }
}

// Función de utilidad para verificar la salud de la API
export const checkApiHealth = async () => {
    try {
        const response = await axios.get('http://localhost:8000/health', { timeout: 5000 })
        return response.data
    } catch (error) {
        throw new Error('API no disponible')
    }
}

export default api