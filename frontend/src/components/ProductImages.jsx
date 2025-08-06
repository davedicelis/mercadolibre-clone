import React, { useState } from 'react'

const ProductImages = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  
  // Si no hay imágenes, usar placeholder
  const defaultPlaceholder = {
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBkZWwgUHJvZHVjdG88L3RleHQ+PC9zdmc+',
    alt: 'Imagen del producto'
  }
  
  const imageList = images.length > 0 ? images : [defaultPlaceholder]
  
  const currentImage = imageList[selectedImage] || imageList[0]

  return (
    <div className="flex gap-4">
      {/* Miniaturas - a la izquierda */}
      <div className="flex flex-col gap-2 w-16">
        {imageList.slice(0, 6).map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 border-2 rounded cursor-pointer overflow-hidden ${
              selectedImage === index 
                ? 'border-gray-200 hover:border-gray-300' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={selectedImage === index ? {borderColor: '#2D3176'} : {}}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.url || image}
              alt={image.alt || `Vista ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Imagen principal - a la derecha */}
      <div className="flex-1">
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border">
          <img
            src={currentImage.url || currentImage}
            alt={currentImage.alt || "Producto"}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4='
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductImages