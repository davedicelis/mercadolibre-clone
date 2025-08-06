import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import ProductDetail from './components/ProductDetail'
import ProductList from './components/ProductList'
import SearchBox from './components/SearchBox'
import Footer from './components/Footer'

const Home = () => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentSearch, setCurrentSearch] = React.useState('')
  
  const handleSearch = (newQuery) => {
    setCurrentSearch(newQuery)
  }

  return (
    <div className="space-y-6">
      <SearchBox 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <ProductList searchQuery={currentSearch} />
    </div>
  )
}

const CellPhonesPage = () => (
  <div className="space-y-6">
    <div className="card">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Celulares y Smartphones</h1>
      <p className="text-gray-600">Encuentra los mejores celulares y smartphones del mercado</p>
    </div>
    
    <ProductList searchQuery="Samsung" />
  </div>
)

// Componente wrapper para el detalle de producto usando el componente modular
const ProductDetailPage = () => {
  const { id } = useParams()
  
  return <ProductDetail productId={id} />
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-yellow-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-mercado-blue">
                  MercadoLibre
                </h1>
                <span className="ml-2 text-sm text-gray-600">Clone</span>
              </Link>
              
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-700 font-medium hover:text-mercado-blue transition-colors duration-200"
                >
                  Inicio
                </Link>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/celulares" element={<CellPhonesPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App