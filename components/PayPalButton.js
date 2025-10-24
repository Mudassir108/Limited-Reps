import { useState, useImperativeHandle, forwardRef } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

const PayPalButton = forwardRef(({ product, selectedSize, selectedColor, customerInfo, isSelectionComplete, onBuyNowClick, onSuccess, onError }, ref) => {
  const [showPayPalButtons, setShowPayPalButtons] = useState(false)

  // Expose showCheckout method to parent component
  useImperativeHandle(ref, () => ({
    showCheckout: () => {
      setShowPayPalButtons(true)
    }
  }))

  const handleBuyNowClick = () => {
    if (!product) return

    // Trigger validation through parent component
    if (onBuyNowClick) {
      onBuyNowClick()
    }
  }

  // Create order on PayPal
  const createOrder = (data, actions) => {
    const itemName = `${product.name}${selectedSize ? ` - Size: ${selectedSize}` : ''}${selectedColor ? ` - Color: ${selectedColor}` : ''}`
    
    return actions.order.create({
      purchase_units: [
        {
          description: itemName,
          amount: {
            currency_code: 'USD',
            value: Math.round(product.price).toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: Math.round(product.price).toString()
              }
            }
          },
          items: [
            {
              name: itemName,
              unit_amount: {
                currency_code: 'USD',
                value: Math.round(product.price).toString()
              },
              quantity: '1'
            }
          ],
          // Add shipping address from customer info
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
        }
      ],
      application_context: {
        shipping_preference: 'SET_PROVIDED_ADDRESS' // Use the address we provide
      }
    })
  }

  // Handle successful payment
  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture()
      console.log('Payment successful:', details)
      
      // Call parent success handler
      if (onSuccess) {
        onSuccess({
          orderId: details.id,
          payerEmail: details.payer.email_address,
          payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
          amount: details.purchase_units[0].amount.value,
          status: details.status
        })
      }

      // Redirect to success page
      window.location.href = '/success'
    } catch (error) {
      console.error('Payment capture error:', error)
      if (onError) {
        onError(error)
      }
      alert('Payment processing failed. Please try again.')
    }
  }

  // Handle payment error
  const onErrorHandler = (err) => {
    console.error('PayPal error:', err)
    if (onError) {
      onError(err)
    }
    alert('Payment failed. Please try again.')
  }

  return (
    <div className="paypal-button-container">
      {!showPayPalButtons ? (
        <button
          onClick={handleBuyNowClick}
          className="btn btn-primary"
          disabled={!isSelectionComplete}
          style={{
            background: isSelectionComplete 
              ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' 
              : 'transparent',
            color: isSelectionComplete ? '#000' : '#ffffff',
            border: isSelectionComplete ? 'none' : '2px solid #ffffff',
            padding: '12px 16px',
            borderRadius: '25px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: !isSelectionComplete ? 'not-allowed' : 'pointer',
            opacity: !isSelectionComplete ? 0.7 : 1,
            transition: 'all 0.3s ease',
            boxShadow: isSelectionComplete 
              ? '0 8px 20px rgba(255, 215, 0, 0.3)' 
              : '0 8px 20px rgba(255, 255, 255, 0.1)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
            textAlign: 'center',
            width: '180px',
            height: '48px',
            lineHeight: '1.2',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {!isSelectionComplete ? 'Select Options' : 'Buy Now'}
        </button>
      ) : (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'pay'
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onErrorHandler}
          />
        </div>
      )}
    </div>
  )
})

PayPalButton.displayName = 'PayPalButton'

export default PayPalButton
