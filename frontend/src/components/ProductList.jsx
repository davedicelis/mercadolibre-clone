import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

const ProductList = ({ searchQuery, category }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, category, pagination.offset])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = `http://localhost:8000/api/v1/products?limit=${pagination.limit}&offset=${pagination.offset}`
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setProducts(data.products || data)
      setPagination(prev => ({
        ...prev,
        total: data.total || data.length
      }))
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({
      ...prev,
      offset: newOffset
    }))
  }


  if (loading) {
    return (
      <div className="center-flex py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mercado-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar productos</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-mercado-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg mb-2">No se encontraron productos</p>
          <p className="text-sm">Intenta con otra búsqueda</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1

  return (
    <div className="space-y-6">
      {/* Resultados y filtros */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {pagination.total} productos encontrados
          {searchQuery && <span className="text-gray-600"> para "{searchQuery}"</span>}
        </h2>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-6">
          <button
            onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              const isActive = page === currentPage
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange((page - 1) * pagination.limit)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-mercado-blue text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(Math.min((totalPages - 1) * pagination.limit, pagination.offset + pagination.limit))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductList