import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CardPayment() {
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Get order data from URL parameters
    const { 
      productName, 
      price, 
      selectedSize, 
      selectedColor, 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      zipCode 
    } = router.query

    if (productName) {
      setOrderData({
        productName,
        price: parseFloat(price),
        selectedSize,
        selectedColor,
        customerInfo: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          zipCode
        }
      })
    }
  }, [router.query])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setCardDetails({ ...cardDetails, [name]: formattedValue })
    } 
    // Format expiry date with /
    else if (name === 'expiryDate') {
      let formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4)
      }
      setCardDetails({ ...cardDetails, [name]: formattedValue })
    }
    // Limit CVV to 3-4 digits
    else if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4)
      setCardDetails({ ...cardDetails, [name]: formattedValue })
    }
    else {
      setCardDetails({ ...cardDetails, [name]: value })
    }
  }

  const validateCard = () => {
    const { cardholderName, cardNumber, expiryDate, cvv } = cardDetails
    
    if (!cardholderName.trim()) {
      alert('Please enter cardholder name')
      return false
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      alert('Please enter a valid card number')
      return false
    }
    
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      alert('Please enter a valid expiry date (MM/YY)')
      return false
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
      alert('Please enter a valid CVV')
      return false
    }
    
    return true
  }

  const showMessage = (isSuccess) => {
    const messageDiv = document.getElementById('payment-message')
    messageDiv.style.display = 'flex'
    messageDiv.querySelector('.message-text').textContent = isSuccess 
      ? '✅ Payment Successful! Your order has been placed.' 
      : '❌ Payment Failed! Please try again.'
    messageDiv.style.background = isSuccess 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    
    if (isSuccess) {
      // Save order to localStorage for main window
      const orderId = 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
      const orderDetails = {
        orderId: orderId,
        transactionId: 'CARD-' + Date.now(),
        productName: orderData.productName,
        price: orderData.price,
        selectedSize: orderData.selectedSize || 'Not specified',
        selectedColor: orderData.selectedColor || 'Not specified',
        customerInfo: orderData.customerInfo,
        paymentMethod: 'Card',
        cardLastFour: cardDetails.cardNumber.slice(-4),
        timestamp: new Date().toLocaleString(),
        status: 'Payment Completed'
      }
      
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
      localStorage.setItem('paymentSuccess', 'true')
      
      // Close window and notify parent after 3 seconds
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'PAYMENT_SUCCESS', orderDetails }, '*')
        }
        window.close()
      }, 3000)
    } else {
      // Close window after 3 seconds on failure
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'PAYMENT_FAILED' }, '*')
        }
        window.close()
      }, 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateCard()) return
    
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      
      // Simulate success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1
      showMessage(isSuccess)
    }, 2000)
  }

  if (!orderData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a1a',
        color: '#fff'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{
          color: '#ffd700',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Card Payment
        </h2>

        {/* Order Summary */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <h3 style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Order Summary</h3>
          <div style={{ color: '#fff', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span>Product:</span>
              <span style={{ fontWeight: '700' }}>{orderData.productName}</span>
            </div>
            {orderData.selectedSize && orderData.selectedSize !== 'Not specified' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>Size:</span>
                <span style={{ fontWeight: '700' }}>{orderData.selectedSize}</span>
              </div>
            )}
            {orderData.selectedColor && orderData.selectedColor !== 'Not specified' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>Color:</span>
                <span style={{ fontWeight: '700' }}>{orderData.selectedColor}</span>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.8rem',
              paddingTop: '0.8rem',
              borderTop: '1px solid rgba(255, 215, 0, 0.3)',
              fontSize: '1rem'
            }}>
              <span style={{ fontWeight: '700' }}>Total:</span>
              <span style={{ fontWeight: '800', color: '#ffd700' }}>${orderData.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#ccc', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={cardDetails.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#ccc', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                color: '#ccc', 
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                color: '#ccc', 
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: isProcessing 
                ? 'linear-gradient(135deg, #666 0%, #888 100%)'
                : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              color: '#000',
              fontSize: '1rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '1px'
            }}
          >
            {isProcessing ? 'Processing...' : `Pay $${orderData.price}`}
          </button>

          <button
            type="button"
            onClick={() => window.close()}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </button>
        </form>
      </div>

      {/* Payment Success/Failure Message */}
      <div
        id="payment-message"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}
      >
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div className="message-text" style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
          </div>
          <p style={{ 
            color: '#fff', 
            marginTop: '1rem',
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            This window will close automatically...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        input:focus {
          border-color: rgba(255, 215, 0, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
        }
        
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

