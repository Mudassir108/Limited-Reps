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
                    <span
                      key={index}
                      style={{
                        padding: '.5rem .8rem',
                        border: '1px solid rgba(255,255,255,.2)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
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
                    <span
                      key={index}
                      style={{
                        padding: '.5rem .8rem',
                        border: '1px solid rgba(255,255,255,.2)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <PayPalButton
                  product={product}
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
    </Layout>
  )
}
