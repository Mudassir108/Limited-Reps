import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import flatProducts from '../flat_products.json'

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showSubcategoryFilter, setShowSubcategoryFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'All Products', icon: 'fas fa-th' },
    { id: 'shoes', name: 'Shoes', icon: 'fas fa-shoe-prints' },
    { id: 'other_shoes', name: 'Other Shoe Brands', icon: 'fas fa-shoe-prints' },
    { id: 'clothes', name: 'Clothes', icon: 'fas fa-tshirt' },
    { id: 'watches', name: 'Watches', icon: 'fas fa-clock' },
    { id: 'bags', name: 'Bags', icon: 'fas fa-shopping-bag' },
    { id: 'accessories', name: 'Accessories', icon: 'fas fa-gem' },
    { id: 'jewelry', name: 'Jewelry', icon: 'fas fa-gem' }
  ]

  // Use flat products directly from flat_products.json
  const allProducts = useMemo(() => {
    return flatProducts.map((product, index) => ({
      ...product,
      id: product.publicId || `product-${index}`,
      price: product.sellingPrice // Use selling price for display
    }))
  }, [])

  // Get unique subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return []
    const categoryProducts = allProducts.filter(
      product => product.category === selectedCategory
    )
    const subcats = [...new Set(categoryProducts.map(p => p.subcategory))].sort()
    return subcats
  }, [selectedCategory, allProducts])

  // Initialize products on component mount
  useEffect(() => {
    if (allProducts.length > 0) {
      setFilteredProducts(allProducts)
      setIsLoading(false)
    }
  }, [allProducts])

  useEffect(() => {
    if (allProducts.length === 0) return

    let filtered = allProducts

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'other_shoes') {
        // Show shoes that are not from major brands
        const majorShoeBrands = ['nike', 'adidas', 'yeezy', 'jordan', 'gucci', 'dior', 'balenciaga', 'alexander mcqueen', 'burberry', 'asics', 'new balance', 'off white', 'supreme', 'travis scott']
        filtered = filtered.filter(product => 
          product.category === 'shoes' && 
          !majorShoeBrands.includes(product.subcategory.toLowerCase())
        )
      } else {
        filtered = filtered.filter(product => product.category === selectedCategory)
      }
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory)
    }

    console.log('Filtering debug:', {
      selectedCategory,
      selectedSubcategory,
      totalProducts: allProducts.length,
      filteredCount: filtered.length,
      firstFew: filtered.slice(0, 3).map(p => ({ name: p.name, category: p.category, subcategory: p.subcategory }))
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedSubcategory, allProducts])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('all') // Reset subcategory when category changes
    setShowSubcategoryFilter(categoryId !== 'all')
  }

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId)
  }

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  return (
    <Layout>
      {/* Products Header */}
      <section className="products-header">
        <div className="container">
          <h1>Explore Our Premium Collection</h1>
          <p>Discover the finest quality reps from top luxury and fashion brands</p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="category-nav">
        <div className="container">
          <div className="filters-row">
            <div className="category-dropdown">
              <button className="dropdown-btn">
                <i className="fas fa-filter"></i>
                Filter by Category
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="dropdown-content">
                {categories.map(category => (
                  <a
                    key={category.id}
                    className={`dropdown-item ${selectedCategory === category.id ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleCategoryChange(category.id)
                    }}
                  >
                    <i className={category.icon}></i>
                    {category.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            {showSubcategoryFilter && availableSubcategories.length > 0 && (
              <div className="subcategory-dropdown">
                <button className="dropdown-btn">
                  <i className="fas fa-tags"></i>
                  Filter by Brand
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="dropdown-content">
                  <a
                    className={`dropdown-item ${selectedSubcategory === 'all' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSubcategoryChange('all')
                    }}
                  >
                    <i className="fas fa-th"></i>
                    All Brands
                  </a>
                  {availableSubcategories.map(subcategory => (
                    <a
                      key={subcategory}
                      className={`dropdown-item ${selectedSubcategory === subcategory ? 'active' : ''}`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleSubcategoryChange(subcategory)
                      }}
                    >
                      <i className="fas fa-tag"></i>
                      {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="results-info">
            <p>Showing {filteredProducts.length} products</p>
            {selectedCategory !== 'all' && (
              <p>in {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</p>
            )}
            {selectedSubcategory !== 'all' && (
              <p>from {selectedSubcategory.charAt(0).toUpperCase() + selectedSubcategory.slice(1)}</p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <i className="fas fa-search"></i>
              <h3>No products found</h3>
              <p>Try adjusting your filters or browse all products</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedSubcategory('all')
                  setShowSubcategoryFilter(false)
                }}
              >
                Show All Products
              </button>
            </div>
          ) : (() => {
            // Group products by subcategory (brand)
            const groupedProducts = {}
            filteredProducts.forEach(product => {
              const brand = product.subcategory || 'Other'
              if (!groupedProducts[brand]) {
                groupedProducts[brand] = []
              }
              groupedProducts[brand].push(product)
            })

            return Object.entries(groupedProducts).map(([brand, products]) => (
              <div key={brand} className="brand-section">
                <div className="brand-header">
                  <div className="brand-logo">
                         {brand.toLowerCase() === 'nike' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-shoe-prints"></i>
                             </div>
                             <span className="brand-text">NIKE</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'adidas' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-running"></i>
                             </div>
                             <span className="brand-text">ADIDAS</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'gucci' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-crown"></i>
                             </div>
                             <span className="brand-text">GUCCI</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'louis vuitton' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-gem"></i>
                             </div>
                             <span className="brand-text">LOUIS VUITTON</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'prada' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-handbag"></i>
                             </div>
                             <span className="brand-text">PRADA</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'versace' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-medal"></i>
                             </div>
                             <span className="brand-text">VERSACE</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'balenciaga' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-star"></i>
                             </div>
                             <span className="brand-text">BALENCIAGA</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'off-white' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-bolt"></i>
                             </div>
                             <span className="brand-text">OFF-WHITE</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'jordan' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-basketball-ball"></i>
                             </div>
                             <span className="brand-text">JORDAN</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'yeezy' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-music"></i>
                             </div>
                             <span className="brand-text">YEEZY</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'travis scott' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-fire"></i>
                             </div>
                             <span className="brand-text">TRAVIS SCOTT</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'supreme' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-box"></i>
                             </div>
                             <span className="brand-text">SUPREME</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'bape' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-paw"></i>
                             </div>
                             <span className="brand-text">BAPE</span>
                           </div>
                         )}
                         {brand.toLowerCase() === 'other' && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-tags"></i>
                             </div>
                             <span className="brand-text">OTHER</span>
                           </div>
                         )}
                         {!['nike', 'adidas', 'gucci', 'louis vuitton', 'prada', 'versace', 'balenciaga', 'off-white', 'jordan', 'yeezy', 'travis scott', 'supreme', 'bape', 'other'].includes(brand.toLowerCase()) && (
                           <div className="brand-logo-with-icon">
                             <div className="brand-icon">
                               <i className="fas fa-tag"></i>
                             </div>
                             <span className="brand-text">{brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                           </div>
                         )}
                  </div>
                  <span className="product-count">{products.length} products</span>
                </div>
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img
                          src={product.cloudImage || '/videoplayback.mp4'}
                          alt={product.name}
                          width={300}
                          height={250}
                          style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                          onError={(e) => { e.currentTarget.src = '/videoplayback.mp4' }}
                        />
                        <div className="product-overlay">
                          <Link href={`/product/${createSlug(product.name)}`}>
                            <button className="btn-details">View Details</button>
                          </Link>
                        </div>
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <div className="product-price">
                          <span className="price">${Math.round(product.price)}</span>
                        </div>
                        <div className="product-category">
                          <span className="category-tag">{product.subcategory}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          })()}
        </div>
      </section>
    </Layout>
  )
}
