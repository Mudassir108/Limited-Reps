import { useState } from 'react'

export default function PayPalButton({ product, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false)


  const redirectToPayPal = async () => {
    if (!product) return

    setIsProcessing(true)

    try {
      // Generate unique order ID
      const orderId = 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
      
      // Store order details
      const orderDetails = {
        orderId: orderId,
        productName: product.name,
        price: Math.round(product.price),
        timestamp: new Date().toLocaleString(),
        status: 'Pending Payment'
      }

      // Store in localStorage for success page
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))

      // Send order notification email
      try {
        const response = await fetch('/api/send-order-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderDetails })
        })
        
        if (response.ok) {
          console.log('Order notification sent successfully')
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
      
      // Create PayPal payment URL
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=limitedrepsbusiness@gmail.com&item_name=${encodeURIComponent(product.name)}&amount=${Math.round(product.price)}&currency_code=USD&custom=${orderId}&return=${window.location.origin}/success&cancel_return=${window.location.origin}/cancel`
      
      // Redirect to PayPal
      window.location.href = paypalUrl
      
    } catch (error) {
      console.error('PayPal redirect failed:', error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="paypal-button-container">
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-spinner"></div>
          <p>Redirecting to PayPal...</p>
        </div>
      )}
      <button
        onClick={redirectToPayPal}
        className="btn btn-primary"
        disabled={isProcessing}
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          color: '#000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          width: '160px',
          height: '48px',
          lineHeight: '24px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
      >
        {isProcessing ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  )
}
