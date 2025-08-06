import React from 'react'

const LoadingSpinner = ({ size = 'large', message = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-mercado-blue rounded-full spinner`}>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  )
}

export const LoadingCard = ({ className = '' }) => (
  <div className={`card animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
)

export const LoadingProductDetail = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Galería de imágenes skeleton */}
    <div className="space-y-4">
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex space-x-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
    
    {/* Información del producto skeleton */}
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
)

export default LoadingSpinner