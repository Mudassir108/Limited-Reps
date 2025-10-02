import { useEffect, useRef, useState } from 'react'

export default function PayPalTestButton({ product, onSuccess, onError }) {
  const paypalRef = useRef()
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  // PayPal Sandbox Client ID - replace with your actual sandbox client ID
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_SANDBOX_CLIENT_ID_HERE'

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
          label: 'paypal'
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

    loadPayPalScript()
  }, [product, PAYPAL_CLIENT_ID])

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
        padding: '20px', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>Loading PayPal...</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '15px', padding: '10px', background: '#e8f4fd', borderRadius: '6px', fontSize: '14px' }}>
        <strong>🧪 Test Mode:</strong> This is using PayPal Sandbox for testing. Use test credit cards or PayPal sandbox accounts.
      </div>
      <div ref={paypalRef}></div>
    </div>
  )
}
