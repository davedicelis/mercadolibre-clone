import React, { useState } from 'react'
import ProductList from '../components/ProductList'
import SearchBox from '../components/SearchBox'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSearch, setCurrentSearch] = useState('')

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

export default Home