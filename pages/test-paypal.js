import { useState } from 'react'
import Layout from '../components/Layout'
import PayPalTestButton from '../components/PayPalTestButton'

export default function TestPayPal() {
  const [selectedProduct, setSelectedProduct] = useState({
    name: 'Test Product - Nike Air Jordan 1',
    price: 120,
    image: '/images/test-product.jpg'
  })

  const testProducts = [
    { name: 'Test Product - Nike Air Jordan 1', price: 120 },
    { name: 'Test Product - Gucci Bag', price: 150 },
    { name: 'Test Product - Rolex Watch', price: 200 },
    { name: 'Test Product - Adidas Shoes', price: 100 }
  ]

  const handlePaymentSuccess = (details) => {
    console.log('Payment successful:', details)
    alert('Payment successful! Check your email for confirmation.')
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    alert('Payment failed. Please try again.')
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            🧪 PAYPAL TEST CENTER
          </h1>
          <p style={{ margin: '0', fontSize: '1.1rem', opacity: '0.9' }}>
            Test your PayPal integration with sandbox environment
          </p>
        </div>

        <div style={{ 
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Important Test Instructions:</h3>
          <ul style={{ color: '#856404', margin: '0', paddingLeft: '20px' }}>
            <li>This uses PayPal Sandbox environment for testing</li>
            <li>Use PayPal sandbox test accounts or test credit cards</li>
            <li>No real money will be charged</li>
            <li>Check your email (mudassirshahid605@gmail.com) for test notifications</li>
          </ul>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Product Selection */}
          <div style={{ 
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '25px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Select Test Product</h3>
            {testProducts.map((product, index) => (
              <div 
                key={index}
                onClick={() => setSelectedProduct(product)}
                style={{
                  padding: '15px',
                  border: selectedProduct.name === product.name ? '2px solid #3498db' : '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  background: selectedProduct.name === product.name ? '#e8f4fd' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>{product.name}</div>
                <div style={{ color: '#27ae60', fontSize: '1.2rem', fontWeight: '700' }}>${product.price}</div>
              </div>
            ))}
          </div>

          {/* Selected Product */}
          <div style={{ 
            background: '#f8f9fa',
            border: '2px solid #2c3e50',
            borderRadius: '12px',
            padding: '25px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Selected Product</h3>
            <div style={{ 
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px' }}>
                {selectedProduct.name}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#27ae60' }}>
                ${selectedProduct.price}
              </div>
            </div>
          </div>
        </div>

        {/* PayPal Test Button */}
        <div style={{ 
          background: 'white',
          border: '2px solid #2c3e50',
          borderRadius: '12px',
          padding: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', textAlign: 'center' }}>
            PayPal Test Payment
          </h3>
          
          <PayPalTestButton 
            product={selectedProduct}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>

        {/* Test Information */}
        <div style={{ 
          background: '#e8f4fd',
          border: '1px solid #3498db',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h4 style={{ color: '#2c3e50', margin: '0 0 15px 0' }}>📋 Test Credit Card Numbers:</h4>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>
            <p><strong>Visa:</strong> 4111111111111111</p>
            <p><strong>Mastercard:</strong> 5555555555554444</p>
            <p><strong>American Express:</strong> 378282246310005</p>
            <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
            <p><strong>CVV:</strong> Any 3-4 digits (e.g., 123)</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
