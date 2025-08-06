import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, variant = 'default' }) => {
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return `$${price.toLocaleString()} COP`
  }

  const handleClick = () => {
    navigate(`/producto/${product.id}`)
  }

  const getImageSrc = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    if (product.thumbnail) {
      return product.thumbnail
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4='
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
        <img
          src={getImageSrc()}
          alt={product.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4='
          }}
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.title}
        </h4>
        
        <div className="space-y-1">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          
          {product.original_price && product.original_price > product.price && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                {Math.round((1 - product.price / product.original_price) * 100)}% OFF
              </span>
            </div>
          )}
          
          {product.free_shipping && (
            <p className="text-sm text-green-600 font-semibold">
              Envío gratis
            </p>
          )}
          
          {product.seller_name && (
            <p className="text-xs text-gray-500">
              por {product.seller_name}
            </p>
          )}
          
          {product.condition && (
            <p className="text-xs text-gray-500 capitalize">
              {product.condition}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard