import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import PayPalButton from '../../components/PayPalButton'
import { PayPalButtons } from '@paypal/react-paypal-js'
import flatProducts from '../../flat_products.json'
import { getProductSizing } from '../../lib/productSizing'

export default function ProductPage() {
  const router = useRouter()
  const { slug } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [showSizeError, setShowSizeError] = useState(false)
  const [showColorError, setShowColorError] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [productSizing, setProductSizing] = useState(null)
  const [cardPaymentWindow, setCardPaymentWindow] = useState(null)

  // Customer information fields
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [showCustomerInfoError, setShowCustomerInfoError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (slug) {
      // Find product by slug from flat products
      const foundProduct = flatProducts.find(p => {
        const productSlug = p.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        return productSlug === slug
      })

      if (foundProduct) {
        setProduct({
          ...foundProduct,
          price: foundProduct.sellingPrice,
          id: foundProduct.publicId || `product-${Date.now()}`
        })
        // Set dynamic sizing based on product category and name
        const sizing = getProductSizing(foundProduct.category, foundProduct.name)
        setProductSizing(sizing)
      } else {
        setProduct({
          ...flatProducts[0],
          price: flatProducts[0].sellingPrice,
          id: flatProducts[0].publicId || `product-${Date.now()}`
        })
        // Set dynamic sizing for fallback product
        const sizing = getProductSizing(flatProducts[0].category, flatProducts[0].name)
        setProductSizing(sizing)
      }
      setLoading(false)
    }
  }, [slug])

  // Listen for messages from card payment popup
  useEffect(() => {
    const handleMessage = (event) => {
      // Security check - in production, verify event.origin
      if (event.data.type === 'PAYMENT_SUCCESS') {
        console.log('Card payment successful:', event.data.orderDetails)
        setShowConfirmationModal(false)
        // Redirect to success page
        setTimeout(() => {
          router.push('/success')
        }, 500)
      } else if (event.data.type === 'PAYMENT_FAILED') {
        console.log('Card payment failed')
        // Just close the modal, user can try again
        setShowConfirmationModal(false)
      }
    }

    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [router])

  const handlePaymentSuccess = (orderDetails) => {
    console.log('Payment successful:', orderDetails)
  }

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setShowSizeError(false)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setShowColorError(false)
  }

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
    setShowCustomerInfoError(false)
  }

  const isSelectionComplete = (!productSizing?.showSizes || selectedSize) && (!productSizing?.showColors || selectedColor)
  const isCustomerInfoComplete = customerInfo.firstName && customerInfo.lastName && 
    customerInfo.email && customerInfo.phone && customerInfo.address && 
    customerInfo.city && customerInfo.state && customerInfo.zipCode

  const handleBuyNowClick = () => {
    if (productSizing?.showSizes && !selectedSize) {
      setShowSizeError(true)
    }
    if (productSizing?.showColors && !selectedColor) {
      setShowColorError(true)
    }
    if (!isCustomerInfoComplete) {
      setShowCustomerInfoError(true)
    }
    
    if (isSelectionComplete && isCustomerInfoComplete) {
      setShowConfirmationModal(true)
    }
  }

  const closeModal = () => {
    setShowConfirmationModal(false)
  }

  const handleCardPayment = () => {
    // Build URL with order data
    const params = new URLSearchParams({
      productName: product.name,
      price: Math.round(product.price),
      selectedSize: selectedSize || 'Not specified',
      selectedColor: selectedColor || 'Not specified',
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      state: customerInfo.state,
      zipCode: customerInfo.zipCode
    })

    // Open popup window
    const width = 600
    const height = 700
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    const popup = window.open(
      `/card-payment?${params.toString()}`,
      'Card Payment',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )
    
    setCardPaymentWindow(popup)
    
    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert('Popup blocked! Please allow popups for this site and try again.')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading product...</h2>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Product not found</h2>
          <a href="/products" className="btn btn-primary">Back to Products</a>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="products-header">
        <div className="container">
          <h1>{product.name}</h1>
          <p>Premium quality, multiple sizes and colors available</p>
        </div>
      </section>

      <section className="products-section" style={{ minHeight: '100vh', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="product-detail" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '2rem' : '3rem',
            alignItems: 'start',
            background: 'rgba(17,17,17,0.8)',
            padding: isMobile ? '1.5rem' : '3rem',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            minHeight: '800px'
          }}>
            <div className="product-image" style={{
              height: isMobile ? '300px' : '500px',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
            }}>
                  <img
                src={product.cloudImage || (product.localImage ? `/Limited-Reps--main/${product.localImage}` : '')}
                    alt={product.name}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
            </div>
            <div>
              <h2 style={{ 
                marginBottom: '1rem',
                fontSize: isMobile ? '1.5rem' : '2rem',
                lineHeight: isMobile ? '1.3' : '1.2'
              }}>{product.name}</h2>
              <p style={{ 
                color: '#ccc', 
                marginBottom: '1rem',
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: '1.5'
              }}>{product.summary || 'Premium quality product with excellent craftsmanship and attention to detail.'}</p>
              {productSizing?.showPrice !== false && (
              <div style={{ 
                margin: '1rem 0',
                fontSize: isMobile ? '1.1rem' : '1.2rem'
              }}>
                <strong>Price:</strong> <span className="price" style={{
                  color: '#ffd700',
                  fontWeight: '700',
                  fontSize: isMobile ? '1.3rem' : '1.5rem'
                }}>${Math.round(product.price)}</span>
              </div>
              )}
              
              {productSizing?.showSizes && (
                <div style={{ margin: '1rem 0' }}>
                  <strong style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>{productSizing.sizeLabel}</strong>
                  <div style={{
                    display: 'flex',
                    gap: '.5rem',
                    flexWrap: 'wrap',
                    marginTop: '.5rem',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    {productSizing.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      style={{
                        padding: isMobile ? '.6rem .8rem' : '.5rem .8rem',
                        border: selectedSize === size ? '2px solid #ffd700' : '1px solid rgba(255,255,255,.2)',
                        borderRadius: '8px',
                        color: selectedSize === size ? '#ffd700' : '#fff',
                        background: selectedSize === size ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: selectedSize === size ? '700' : '400',
                        boxShadow: selectedSize === size ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {showSizeError && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0.03) 100%)',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 4px rgba(255, 107, 107, 0.05)',
                    animation: 'pulse 2s infinite'
                  }}>
                    <span style={{
                      color: '#ff6b6b',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚠️ Please select a size
                    </span>
                  </div>
                )}
                </div>
              )}
              
              {productSizing?.showColors && (
                <div style={{ margin: '1rem 0' }}>
                  <strong style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>{productSizing.colorLabel}</strong>
                  <div style={{
                    display: 'flex',
                    gap: '.5rem',
                    flexWrap: 'wrap',
                    marginTop: '.5rem',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    {productSizing.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      style={{
                        padding: isMobile ? '.6rem .8rem' : '.5rem .8rem',
                        border: selectedColor === color ? '2px solid #ffd700' : '1px solid rgba(255,255,255,.2)',
                        borderRadius: '8px',
                        color: selectedColor === color ? '#ffd700' : '#fff',
                        background: selectedColor === color ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: selectedColor === color ? '700' : '400',
                        boxShadow: selectedColor === color ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {showColorError && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0.03) 100%)',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 4px rgba(255, 107, 107, 0.05)',
                    animation: 'pulse 2s infinite'
                  }}>
                    <span style={{
                      color: '#ff6b6b',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚠️ Please select a color
                    </span>
                  </div>
                )}
                </div>
              )}
              
              <div style={{ margin: '2rem 0' }}>
                <h3 style={{ 
                  color: '#fff', 
                  marginBottom: '1.5rem', 
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #ffd700',
                  paddingBottom: '0.5rem'
                }}>
                  Customer Information
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#fff', 
                    marginBottom: '0.5rem',
                    fontWeight: '700',
                    fontSize: '0.9rem'
                  }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(60,60,60,0.8)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="Enter street address"
                  />
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : window.innerWidth <= 1024 ? '1fr 1fr' : '1fr 1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      State *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.state}
                      onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      color: '#fff', 
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: isMobile ? '1rem' : '0.9rem'
                    }}>
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.zipCode}
                      onChange={(e) => handleCustomerInfoChange('zipCode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(60,60,60,0.8)',
                        color: '#fff',
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
                
                {showCustomerInfoError && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0.03) 100%)',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 1px 4px rgba(255, 107, 107, 0.05)',
                    animation: 'pulse 2s infinite'
                  }}>
                    <span style={{
                      color: '#ff6b6b',
                      fontSize: isMobile ? '1rem' : '0.9rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ⚠️ Please fill in all customer information fields
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{
                marginTop: '2rem',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <PayPalButton
                  product={product}
                  isSelectionComplete={isSelectionComplete && isCustomerInfoComplete}
                  onBuyNowClick={handleBuyNowClick}
                />
                <a 
                  href="/products" 
                  className="btn btn-secondary"
                  style={{
                    background: 'transparent',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    padding: '12px 16px',
                    borderRadius: '25px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '160px',
                    height: '48px',
                    lineHeight: '1.2',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Back to Shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showConfirmationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: '8px',
            padding: '0.8rem',
            maxWidth: 'min(95vw, 450px)',
            width: '100%',
            maxHeight: '95vh',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
              <h2 style={{
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Confirm Your Order
              </h2>
              <p style={{ color: '#ccc', fontSize: '0.7rem', margin: 0 }}>
                Review your selection before payment
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              marginBottom: '0.6rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 215, 0, 0.3)'
              }}>
                    <img
                  src={product.cloudImage || (product.localImage ? `/Limited-Reps--main/${product.localImage}` : '')}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              padding: '0.5rem',
              marginBottom: '0.4rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '0.75rem',
                marginBottom: '0.3rem',
                textAlign: 'center',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Order Summary
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.05rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Product:</span>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.6rem' }}>{product.name}</span>
                  {productSizing?.showSizes && (
                    <>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Size:</span>
                  <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '700',
                    background: 'rgba(255, 215, 0, 0.15)',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    fontSize: '0.6rem',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}>
                    {selectedSize}
                  </span>
                    </>
                  )}
                </div>
                
                {productSizing?.showColors && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Color:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700',
                    fontSize: '0.6rem'
                  }}>
                    {selectedColor}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}></span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700',
                    fontSize: '0.6rem'
                  }}>
                  </span>
                </div>
                )}
              </div>
              
              <div style={{
                marginTop: '0.3rem',
                marginBottom: '0.2rem'
              }}>
                <h4 style={{
                  color: '#ffd700',
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  margin: '0 0 0.2rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.4)',
                  paddingBottom: '0.1rem'
                }}>
                  Shipping Information
                </h4>
              </div>
                
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.05rem',
                marginBottom: '0.2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Name:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem'
                  }}>
                    {customerInfo.firstName} {customerInfo.lastName}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Email:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem'
                  }}>
                    {customerInfo.email}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Phone No:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.phone}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>City:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.city}
                  </span>
                </div>
                </div>
                
                
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.05rem',
                marginBottom: '0.2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Address:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem'
                  }}>
                    {customerInfo.address}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.05rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>State:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.state}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.6rem' }}>Postal Code:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.6rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.zipCode}
                  </span>
                </div>
              </div>
                
                {productSizing?.showPrice !== false && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0',
                  marginTop: '0.3rem',
                  borderTop: '1px solid rgba(255, 215, 0, 0.3)',
                  paddingTop: '0.3rem'
                }}>
                  <span style={{ color: '#ffd700', fontWeight: '700', fontSize: '0.7rem' }}>Total Price:</span>
                  <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '800', 
                    fontSize: '0.8rem'
                  }}>
                      ${Math.round(product.price)}
                  </span>
                </div>
                )}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              justifyContent: 'center',
              marginTop: '0.4rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '0' }}>
                <p style={{ 
                  color: '#ffd700', 
                  fontSize: '0.65rem',
                  margin: '0 0 0.3rem 0',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Choose Payment Method
                </p>
              </div>
              
              {/* PayPal Buttons in Modal */}
              <div id="paypal-button-container-modal" style={{ minHeight: '120px' }}>
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay',
                    height: 38
                  }}
                  createOrder={(data, actions) => {
                    const itemName = `${product.name}${selectedSize ? ` - Size: ${selectedSize}` : ''}${selectedColor ? ` - Color: ${selectedColor}` : ''}`
                    
                    return actions.order.create({
                      purchase_units: [{
                        description: itemName,
                        amount: {
                          currency_code: 'USD',
                          value: Math.round(product.price).toString()
                        },
                        shipping: {
                          name: {
                            full_name: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`
                          },
                          address: {
                            address_line_1: customerInfo?.address || '',
                            admin_area_2: customerInfo?.city || '',
                            admin_area_1: customerInfo?.state || '',
                            postal_code: customerInfo?.zipCode || '',
                            country_code: 'US'
                          }
                        }
                      }]
                    })
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture()
                      console.log('Payment successful:', details)
                      
                      const orderId = 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
                      const orderDetails = {
                        orderId: orderId,
                        paypalTransactionId: details.id,
                        productName: product.name,
                        price: Math.round(product.price),
                        selectedSize: selectedSize || 'Not specified',
                        selectedColor: selectedColor || 'Not specified',
                        customerInfo: customerInfo,
                        payerEmail: details.payer.email_address,
                        payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                        timestamp: new Date().toLocaleString(),
                        status: 'Payment Completed'
                      }
                      
                      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
                      window.location.href = '/success'
                    } catch (error) {
                      console.error('Payment capture error:', error)
                      alert('Payment processing failed. Please try again.')
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err)
                    alert('Payment failed. Please try again.')
                  }}
                />
              </div>

              {/* Debit or Credit Card Button */}
              <button
                onClick={handleCardPayment}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                Debit or Credit Card
              </button>
              
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginTop: '0.2rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
