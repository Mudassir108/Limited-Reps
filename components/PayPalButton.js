import { useEffect, useRef, useState } from 'react'

export default function PayPalButton({ product, onSuccess, onError }) {
  const paypalRef = useRef()
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  // PayPal Sandbox Client ID
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AXd5jYxj9xnLlvdf2d1BeDm-4g5LUeaL5FN8DoIp-vOzyHwVGnokhkRYc-RmUU-IJ7HZ0W_oWcqM_O5l'
  
  // Debug logging
  console.log('PayPal Component Debug:', {
    clientId: PAYPAL_CLIENT_ID,
    product: product,
    isLoaded: isLoaded,
    error: error
  })

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsLoaded(true)
        renderPayPalButton()
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&enable-funding=venmo,paylater`
      script.async = true
      
      script.onload = () => {
        setIsLoaded(true)
        renderPayPalButton()
      }
      
      script.onerror = () => {
        setError('Failed to load PayPal SDK')
      }
      
      document.body.appendChild(script)
    }

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalRef.current) return

      // Clear any existing buttons
      paypalRef.current.innerHTML = ''

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48
        },
        
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: Math.round(product.price).toString(),
                currency_code: 'USD'
              },
              description: product.name,
              custom_id: 'LR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
            }]
          })
        },
        
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture()
            
            // Generate order details for email
            const orderDetails = {
              orderId: details.purchase_units[0].custom_id || data.orderID,
              productName: product.name,
              price: Math.round(product.price),
              timestamp: new Date().toLocaleString(),
              status: 'Payment Completed',
              paypalTransactionId: details.id,
              customerEmail: details.payer?.email_address || 'Not provided',
              customerName: details.payer?.name ? `${details.payer.name.given_name} ${details.payer.name.surname}` : 'Not provided'
            }

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

            // Store order details
            localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
            
            if (onSuccess) {
              onSuccess(details)
            }
            
            // Redirect to success page
            window.location.href = '/success'
            
          } catch (error) {
            console.error('Payment capture failed:', error)
            if (onError) {
              onError(error)
            }
          }
        },
        
        onError: (err) => {
          console.error('PayPal error:', err)
          setError('Payment failed. Please try again.')
          if (onError) {
            onError(err)
          }
        },
        
        onCancel: (data) => {
          console.log('Payment cancelled:', data)
          window.location.href = '/cancel'
        }
        
      }).render(paypalRef.current)
    }

    if (product) {
      loadPayPalScript()
      
      // Fallback timeout in case PayPal doesn't load
      const timeout = setTimeout(() => {
        if (!isLoaded) {
          console.warn('PayPal SDK failed to load within 10 seconds')
          setError('PayPal is taking too long to load. Please refresh the page.')
        }
      }, 10000)
      
      return () => clearTimeout(timeout)
    }
  }, [product, PAYPAL_CLIENT_ID, isLoaded])

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fee', 
        border: '1px solid #fcc', 
        borderRadius: '8px',
        color: '#c33'
      }}>
        <p><strong>PayPal Error:</strong> {error}</p>
        <p>Please check your PayPal configuration.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            color: '#000',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            width: '160px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            opacity: '0.7'
          }}
          disabled
        >
          Loading...
        </button>
        <div style={{ fontSize: '12px', color: '#666' }}>
          🧪 Loading PayPal Sandbox...
        </div>
      </div>
    )
  }

  return (
    <div className="paypal-button-container">
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        🧪 <strong>Sandbox Mode:</strong> Safe testing environment
      </div>
      <div ref={paypalRef}></div>
    </div>
  )
}
