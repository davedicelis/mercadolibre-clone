import React from 'react'

const SellerInfo = ({ seller }) => {
  if (!seller) return null

  const getReputationBadge = (reputation) => {
    const badges = {
      'Platino': 'seller-badge-platinum',
      'Oro': 'seller-badge-gold', 
      'Diamante': 'seller-badge-diamond',
      'Plata': 'bg-gray-100 text-gray-800'
    }
    return badges[reputation] || 'bg-gray-100 text-gray-800'
  }

  const getReputationIcon = (reputation) => {
    const icons = {
      'Platino': '🥈',
      'Oro': '🥇',
      'Diamante': '💎',
      'Plata': '🥉'
    }
    return icons[reputation] || '⭐'
  }

  const formatSalesCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>)
    }

    return stars
  }

  return (
    <div className="card">
      <h3 className="font-medium text-gray-900 mb-4">Información del vendedor</h3>
      
      <div className="space-y-4">
        {/* Nombre y badges del vendedor */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-lg text-gray-900">
                {seller.name}
              </h4>
              {seller.is_mercado_lider && (
                <div className="flex items-center space-x-1 bg-mercado-yellow px-2 py-1 rounded text-xs font-bold">
                  <span>👑</span>
                  <span>MercadoLíder</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`seller-badge ${getReputationBadge(seller.reputation)}`}>
                <span className="mr-1">{getReputationIcon(seller.reputation)}</span>
                {seller.reputation}
              </span>
              <span className="text-sm text-gray-600">
                📍 {seller.location}
              </span>
            </div>
          </div>
        </div>

        {/* Rating y ventas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-1">
              {renderStars(seller.rating)}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {seller.rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">
              Calificación
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {formatSalesCount(seller.sales_count)}
            </div>
            <div className="text-xs text-gray-600">
              Ventas
            </div>
          </div>
        </div>

        {/* Características del vendedor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Experiencia vendiendo:</span>
            <span className="text-gray-900 font-medium">+ 2 años</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Responde mensajes:</span>
            <span className="text-mercado-green font-medium">En el día</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Velocidad de envío:</span>
            <span className="text-mercado-green font-medium">Excelente</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2 pt-2">
          <button 
            className="w-full py-2 px-4 border rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
            style={{borderColor: '#2D3176', color: '#2D3176'}}
          >
            Ver más productos de este vendedor
          </button>
          
          <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            Hacer una pregunta
          </button>
        </div>

        {/* Garantías del vendedor */}
        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="text-mercado-green">✓</span>
              <span>Producto en stock</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="text-mercado-green">✓</span>
              <span>Envío a todo el país</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="text-mercado-green">✓</span>
              <span>Garantía del vendedor</span>
            </div>
            
            {seller.is_mercado_lider && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span className="text-mercado-green">✓</span>
                <span>Protección MercadoLibre</span>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional para MercadoLíder */}
        {seller.is_mercado_lider && (
          <div className="bg-mercado-yellow bg-opacity-20 border border-mercado-yellow p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">👑</span>
              <div className="text-xs text-gray-700">
                <div className="font-medium mb-1">MercadoLíder</div>
                <div>
                  Los MercadoLíderes son los vendedores con mejor reputación 
                  y calidad de servicio en MercadoLibre.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerInfo