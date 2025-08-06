import React from 'react'

const SearchBox = ({ searchQuery, setSearchQuery, onSearch, placeholder = "Buscar productos, marcas y más..." }) => {
  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        <button
          type="submit"
          className="btn-primary"
        >
          Buscar
        </button>
      </form>
    </div>
  )
}

export default SearchBox