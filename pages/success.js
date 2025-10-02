import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function Success() {
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    // Get order details from localStorage
    if (typeof window !== 'undefined') {
      const storedOrder = localStorage.getItem('lastOrder')
      if (storedOrder) {
        const orderData = JSON.parse(storedOrder)
        // Update status to completed since user returned from PayPal
        orderData.status = 'Payment Completed'
        setOrderDetails(orderData)
        
        // Send email notification to owner now that payment is confirmed
        sendOwnerNotification(orderData)
        
        // Clear the order from localStorage to prevent duplicate emails
        localStorage.removeItem('lastOrder')
      }
    }
  }, [])

  const sendOwnerNotification = async (orderData) => {
    try {
      const response = await fetch('/api/send-order-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderDetails: orderData })
      })
      
      if (response.ok) {
        console.log('Owner notification sent successfully after payment confirmation')
      } else {
        console.error('Failed to send owner notification')
      }
    } catch (error) {
      console.error('Error sending owner notification:', error)
    }
  }

  return (
    <Layout>
      <section className="products-header">
        <div className="container">
          <h1>Payment Successful! 🎉</h1>
          <p>Thank you for your order. We'll process it shortly.</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div style={{
            background: 'rgba(17,17,17,0.7)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>Order Confirmed</h2>
            
            {orderDetails && (
              <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Order Details:</h3>
                <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                <p><strong>Product:</strong> {orderDetails.productName}</p>
                <p><strong>Amount:</strong> ${Math.round(orderDetails.price)}</p>
                <p><strong>Status:</strong> Payment Completed</p>
                <p><strong>Date:</strong> {orderDetails.timestamp}</p>
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>What's Next?</h3>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                • We'll send you a confirmation email shortly
              </p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                • Your order will be processed within 24 hours
              </p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                • You'll receive tracking information once shipped
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/products" className="btn btn-primary">
                Continue Shopping
              </a>
              <a href="/contact" className="btn btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
