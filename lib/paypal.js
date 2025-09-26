// PayPal Configuration
export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID_HERE',
  currency: 'USD',
  intent: 'capture',
  components: 'buttons',
  style: {
    layout: 'vertical',
    color: 'gold',
    shape: 'rect',
    label: 'paypal'
  }
}

// PayPal Button Configuration
export const paypalButtonConfig = {
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: data.price
        },
        description: data.productName
      }]
    })
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then((details) => {
      // This will be handled by the parent component
      return details
    })
  },
  onError: (err) => {
    console.error('PayPal Error:', err)
  }
}
