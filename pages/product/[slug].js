import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import PayPalButton from '../../components/PayPalButton'
import flatProducts from '../../flat_products.json'

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
          price: foundProduct.sellingPrice, // Use selling price for display
          id: foundProduct.publicId || `product-${Date.now()}`
        })
      } else {
        // Fallback to first product if not found
        setProduct({
          ...flatProducts[0],
          price: flatProducts[0].sellingPrice,
          id: flatProducts[0].publicId || `product-${Date.now()}`
        })
      }
      setLoading(false)
    }
  }, [slug])

  const handlePaymentSuccess = (orderDetails) => {
    console.log('Payment successful:', orderDetails)
    // Payment success is handled in PayPalButton component
  }

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setShowSizeError(false) // Hide error when size is selected
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setShowColorError(false) // Hide error when color is selected
  }

  const isSelectionComplete = selectedSize && selectedColor

  const handleBuyNowClick = () => {
    if (!selectedSize) {
      setShowSizeError(true)
    }
    if (!selectedColor) {
      setShowColorError(true)
    }
    
    // If both selections are complete, show confirmation modal
    if (selectedSize && selectedColor) {
      setShowConfirmationModal(true)
    }
  }

  const handleConfirmOrder = async () => {
    if (!product) return

    try {
      // Generate unique order ID
      const orderId = 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
      
      // Store order details
      const orderDetails = {
        orderId: orderId,
        productName: product.name,
        price: Math.round(product.price),
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        timestamp: new Date().toLocaleString(),
        status: 'Pending Payment'
      }

      // Store in localStorage for success page
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
      
      // Create PayPal LIVE payment URL with customer information fields
      const itemName = `${product.name} - Size: ${selectedSize}, Color: ${selectedColor}`
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent('limitedrepsbusiness@gmail.com')}&item_name=${encodeURIComponent(itemName)}&amount=${Math.round(product.price)}&currency_code=USD&custom=${orderId}&return=${encodeURIComponent(window.location.origin + '/success')}&cancel_return=${encodeURIComponent(window.location.origin + '/cancel')}&no_shipping=0&address_override=1&first_name=&last_name=&email=`
      
      // Redirect to PayPal
      window.location.href = paypalUrl
      
    } catch (error) {
      console.error('PayPal redirect failed:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const closeModal = () => {
    setShowConfirmationModal(false)
  }

  const sendOrderEmail = (orderDetails) => {
    // Initialize EmailJS
    if (typeof window !== 'undefined' && window.emailjs) {
      window.emailjs.init("YOUR_EMAILJS_PUBLIC_KEY") // Replace with your EmailJS public key
      
      const templateParams = {
        to_email: 'limitedrepsbusiness@gmail.com',
        order_id: orderDetails.orderId,
        product_name: orderDetails.productName,
        price: orderDetails.price,
        timestamp: orderDetails.timestamp,
        status: orderDetails.status
      }

      window.emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
          console.log('Order email sent successfully!', response.status, response.text)
        }, function(error) {
          console.log('Failed to send order email:', error)
        })
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
      {/* Product Header */}
      <section className="products-header">
        <div className="container">
          <h1>{product.name}</h1>
          <p>Premium quality, multiple sizes and colors available</p>
        </div>
      </section>

      {/* Product Details */}
      <section className="products-section">
        <div className="container">
          <div className="product-detail" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start',
            background: 'rgba(17,17,17,0.7)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div className="product-image" style={{
              height: '420px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {(() => {
                const src = product.cloudImage || (product.localImage ? `/Limited-Reps--main/${product.localImage}` : '')
                return (
                  <img
                    src={src}
                    alt={product.name}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                )
              })()}
            </div>
            <div>
              <h2 style={{ marginBottom: '1rem' }}>{product.name}</h2>
              <p style={{ color: '#ccc', marginBottom: '1rem' }}>{product.summary || 'Premium quality product with excellent craftsmanship and attention to detail.'}</p>
              <div style={{ margin: '1rem 0' }}>
                <strong>Price:</strong> <span className="price">${Math.round(product.price)}</span>
              </div>
              <div style={{ margin: '1rem 0' }}>
                <strong>Available Sizes:</strong>
                <div style={{
                  display: 'flex',
                  gap: '.5rem',
                  flexWrap: 'wrap',
                  marginTop: '.5rem'
                }}>
                  {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      style={{
                        padding: '.5rem .8rem',
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
              <div style={{ margin: '1rem 0' }}>
                <strong>Available Colors:</strong>
                <div style={{
                  display: 'flex',
                  gap: '.5rem',
                  flexWrap: 'wrap',
                  marginTop: '.5rem'
                }}>
                  {(product.colors || ['Black', 'White', 'Red', 'Blue', 'Green']).map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      style={{
                        padding: '.5rem .8rem',
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
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <PayPalButton
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  isSelectionComplete={isSelectionComplete}
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

      {/* Confirmation Modal */}
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
            borderRadius: '15px',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Close Button */}
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

            {/* Modal Header */}
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

            {/* Product Image */}
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
                {(() => {
                  const src = product.cloudImage || (product.localImage ? `/Limited-Reps--main/${product.localImage}` : '')
                  return (
                    <img
                      src={src}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )
                })()}
              </div>
            </div>

            {/* Order Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '1rem',
                marginBottom: '0.8rem',
                textAlign: 'center'
              }}>
                Order Summary
              </h3>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.3rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '500', fontSize: '0.9rem' }}>Product:</span>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>{product.name}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.3rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '500', fontSize: '0.9rem' }}>Size:</span>
                  <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '600',
                    background: 'rgba(255, 215, 0, 0.1)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {selectedSize}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.3rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: '#ccc', fontWeight: '500', fontSize: '0.9rem' }}>Color:</span>
                  <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '600',
                    background: 'rgba(255, 215, 0, 0.1)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {selectedColor}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.3rem 0'
                }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>Total Price:</span>
                  <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '800', 
                    fontSize: '1.2rem',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                  }}>
                    ${Math.round(product.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.8rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
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
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 6px 15px rgba(255, 215, 0, 0.3)'
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
