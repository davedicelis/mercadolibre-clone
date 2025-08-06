import React from 'react'

const ProductInfo = ({ product }) => {
  if (!product) return null

  const formatPrice = (price, currency = 'COP') => {
    return `$ ${price.toLocaleString()}`
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{color: '#2D3176'}}>★</span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      )
    }

    return stars
  }

  const getConditionBadge = (condition) => {
    const badges = {
      'Nuevo': 'bg-green-100 text-green-800',
      'Usado': 'bg-yellow-100 text-yellow-800',
      'Reacondicionado': 'bg-blue-100 text-blue-800'
    }
    return badges[condition] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Título y condición */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-normal text-gray-900 leading-tight">
            {product.title}
          </h1>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionBadge(product.condition)}`}>
            {product.condition}
          </span>
        </div>

        {/* Rating y reseñas */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="rating-stars">
            {renderStars(product.rating)}
          </div>
          <span className="text-gray-600">
            {product.rating} ({product.reviews_count} reseñas)
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">
            {product.sold_quantity} vendidos
          </span>
        </div>
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {product.original_price && product.original_price > product.price && (
            <span className="price-original">
              {formatPrice(product.original_price, product.currency)}
            </span>
          )}
          {product.discount_percentage && (
            <span className="discount-badge">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>
        <div className="price-current">
          {formatPrice(product.price, product.currency)}
        </div>
        <div className="text-sm text-mercado-green font-medium">
          {product.shipping?.free ? '🚚 Envío gratis' : `🚚 + Envío: ${formatPrice(product.shipping?.cost || 0)}`}
        </div>
      </div>

      {/* Stock disponible */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Stock disponible:</span>
        <span className={`text-sm font-medium ${
          product.available_quantity > 10 
            ? 'text-mercado-green' 
            : product.available_quantity > 0 
              ? 'text-yellow-600' 
              : 'text-red-600'
        }`}>
          {product.available_quantity} {product.available_quantity === 1 ? 'unidad' : 'unidades'}
        </span>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3 pt-4">
        <button 
          className="w-full text-white py-3 px-6 rounded font-medium hover:opacity-90 transition-opacity"
          style={{backgroundColor: '#2D3176'}}
          disabled={product.available_quantity === 0}
        >
          {product.available_quantity > 0 ? 'Comprar ahora' : 'Sin stock'}
        </button>
        <button 
          className="w-full py-3 px-6 rounded font-medium hover:opacity-90 transition-opacity"
          style={{backgroundColor: '#E8F2FF', color: '#2D3176'}}
          disabled={product.available_quantity === 0}
        >
          Agregar al carrito
        </button>
      </div>

      {/* Información de envío */}
      {product.shipping && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-2">Información de envío</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center space-x-2">
              <span>📦</span>
              <span>{product.shipping.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⏱️</span>
              <span>Llegada estimada: {product.shipping.estimated_days}</span>
            </div>
          </div>
        </div>
      )}

      {/* Garantía */}
      {product.warranty && (
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h3 className="font-medium text-gray-900 mb-2">Garantía</h3>
          <div className="text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>{product.warranty}</span>
            </div>
          </div>
        </div>
      )}

      {/* Características principales */}
      {product.features && product.features.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Características principales</h3>
          <div className="space-y-2">
            {product.features.slice(0, 6).map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="text-sm text-gray-600 font-medium">{feature.name}:</span>
                <span className="text-sm text-gray-900">{feature.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      {product.description && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Descripción</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductInfo