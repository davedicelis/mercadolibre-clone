import React from 'react'
import ProductList from '../components/ProductList'

const CellPhonesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header de categoría */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Celulares y Smartphones</h1>
        <p className="text-gray-600">Encuentra los mejores celulares y smartphones del mercado</p>
      </div>

      {/* Lista de productos filtrada por celulares */}
      <ProductList searchQuery="celular" category="celulares" />
    </div>
  )
}

export default CellPhonesPage