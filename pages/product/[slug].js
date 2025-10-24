import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import PayPalButton from '../../components/PayPalButton'
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

  const handleConfirmOrder = async () => {
    if (!product) return

    try {
      const orderId = 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
      
      const orderDetails = {
        orderId: orderId,
        productName: product.name,
        price: Math.round(product.price),
        selectedSize: selectedSize || 'Not specified',
        selectedColor: selectedColor || 'Not specified',
        customerInfo: customerInfo,
        timestamp: new Date().toLocaleString(),
        status: 'Pending Payment'
      }

      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
      
      const itemName = `${product.name}${selectedSize ? ` - Size: ${selectedSize}` : ''}${selectedColor ? ` - Color: ${selectedColor}` : ''}`
      // Use a working PayPal business email - you can change this to your actual PayPal email
      const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'mudassirshahid605@gmail.com'
      
      // PayPal URL construction with proper shipping information
      const paypalParams = new URLSearchParams({
        cmd: '_xclick',
        business: businessEmail,
        item_name: itemName,
        amount: Math.round(product.price),
        currency_code: 'USD',
        custom: orderId,
        return: window.location.origin + '/success',
        cancel_return: window.location.origin + '/cancel',
        // Include shipping information for physical products
        no_shipping: '2', // Prompt for shipping address (required)
        address_override: '0', // Allow customer to change address
        // Customer information
        first_name: customerInfo.firstName,
        last_name: customerInfo.lastName,
        email: customerInfo.email,
        // Shipping address
        address1: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip: customerInfo.zipCode,
        country: 'US',
        night_phone_b: customerInfo.phone,
        lc: 'US',
        bn: 'PP-BuyNowBF:btn_buynow_LG.gif:NonHosted',
        // Additional parameters
        charset: 'utf-8',
        rm: '2' // Return method: POST
      })
      
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`
      
      // Debug: Log the PayPal URL for troubleshooting
      console.log('PayPal URL:', paypalUrl)
      console.log('Business Email:', businessEmail)
      console.log('Order Details:', orderDetails)
      console.log('PayPal Parameters:', Object.fromEntries(paypalParams))
      
      // Validate business email before redirecting
      if (!businessEmail || !businessEmail.includes('@')) {
        console.error('Invalid business email:', businessEmail)
        alert('❌ Payment configuration error.\n\nThe PayPal business email is not configured correctly.\nPlease contact support.')
        return
      }
      
      // Validate that we're using the correct business email
      if (businessEmail !== 'mudassirshahid605@gmail.com') {
        console.warn('Using fallback business email instead of configured email')
      }
      
      // Show helpful error message if this is a known issue
      const debugMode = false // Set to true to see PayPal URL before redirect
      
      if (debugMode) {
        const proceed = confirm(
          '🔍 DEBUG MODE\n\n' +
          'PayPal URL generated successfully.\n\n' +
          'Check browser console for details.\n\n' +
          'Click OK to proceed to PayPal, or Cancel to stop.'
        )
        if (!proceed) {
          console.log('User cancelled PayPal redirect')
          return
        }
      }
      
      // Try PayPal redirect with error handling
      try {
        window.location.href = paypalUrl
      } catch (error) {
        console.error('PayPal redirect error:', error)
        alert(
          '❌ PayPal Redirect Error\n\n' +
          `Order ID: ${orderId}\n\n` +
          'Error: Unable to redirect to PayPal.\n\n' +
          'Please check:\n' +
          '1. Your internet connection\n' +
          '2. Browser popup blocker settings\n' +
          '3. Contact support if issue persists'
        )
      }
      
    } catch (error) {
      console.error('PayPal redirect failed:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const closeModal = () => {
    setShowConfirmationModal(false)
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
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  isSelectionComplete={isSelectionComplete && isCustomerInfoComplete}
                  onBuyNowClick={handleBuyNowClick}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
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
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: '8px',
            padding: '0.6rem',
            maxWidth: 'min(85vw, 400px)',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
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

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{
                color: '#fff',
                fontSize: '1.4rem',
                fontWeight: '700',
                marginBottom: '0.3rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Confirm Your Order
              </h2>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                Review your selection before payment
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto',
                borderRadius: '8px',
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
              marginBottom: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '0.8rem',
                marginBottom: '0.4rem',
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
                gap: '0.1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Product:</span>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.65rem' }}>{product.name}</span>
                  {productSizing?.showSizes && (
                    <>
                      <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Size:</span>
                      <span style={{ 
                        color: '#ffd700', 
                        fontWeight: '700',
                        background: 'rgba(255, 215, 0, 0.15)',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '0.65rem',
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
                    padding: '0.1rem 0'
                  }}>
                    <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Color:</span>
                    <span style={{ 
                      color: '#fff', 
                      fontWeight: '700',
                      fontSize: '0.65rem'
                    }}>
                      {selectedColor}
                    </span>
                    <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}></span>
                    <span style={{ 
                      color: '#fff', 
                      fontWeight: '700',
                      fontSize: '0.65rem'
                    }}>
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{
                marginTop: '0.4rem',
                marginBottom: '0.3rem'
              }}>
                <h4 style={{
                  color: '#ffd700',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  margin: '0 0 0.3rem 0',
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
                gap: '0.1rem',
                marginBottom: '0.4rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Name:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem'
                  }}>
                    {customerInfo.firstName} {customerInfo.lastName}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Email:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem'
                  }}>
                    {customerInfo.email}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Phone No:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.phone}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>City:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem',
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
                gap: '0.1rem',
                marginBottom: '0.4rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Address:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem'
                  }}>
                    {customerInfo.address}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.1rem 0'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>State:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px'
                  }}>
                    {customerInfo.state}
                  </span>
                  <span style={{ color: '#ccc', fontWeight: '600', fontSize: '0.65rem' }}>Postal Code:</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '0.65rem',
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
                    padding: '0.2rem 0',
                    marginTop: '0.4rem'
                  }}>
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.7rem' }}>Total Price:</span>
                    <span style={{ 
                      color: '#fff', 
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
              gap: '0.4rem',
              justifyContent: 'center',
              marginTop: '0.5rem'
            }}>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '80px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmOrder}
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 10px rgba(255, 215, 0, 0.4)',
                  minWidth: '100px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 6px 15px rgba(255, 215, 0, 0.4)'
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
