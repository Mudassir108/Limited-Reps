import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export const sendPurchaseNotification = async (orderDetails) => {
  try {
    const templateParams = {
      to_email: 'limitedrepsbusiness@gmail.com', // Website owner email
      from_name: 'Limited Reps Website',
      order_id: orderDetails.orderId,
      product_name: orderDetails.productName,
      product_price: orderDetails.price,
      customer_email: orderDetails.customerEmail || 'Not provided',
      customer_name: orderDetails.customerName || 'Not provided',
      payment_status: orderDetails.status,
      timestamp: orderDetails.timestamp,
      paypal_transaction_id: orderDetails.paypalTransactionId || 'N/A',
      message: `
New Purchase Notification

Order ID: ${orderDetails.orderId}
Product: ${orderDetails.productName}
Price: $${orderDetails.price}
Customer Email: ${orderDetails.customerEmail || 'Not provided'}
Customer Name: ${orderDetails.customerName || 'Not provided'}
Payment Status: ${orderDetails.status}
PayPal Transaction ID: ${orderDetails.paypalTransactionId || 'N/A'}
Timestamp: ${orderDetails.timestamp}

Please check your PayPal account for payment confirmation.
      `
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

export const sendCustomerConfirmation = async (orderDetails) => {
  try {
    const templateParams = {
      to_email: orderDetails.customerEmail,
      from_name: 'Limited Reps',
      order_id: orderDetails.orderId,
      product_name: orderDetails.productName,
      product_price: orderDetails.price,
      message: `
Thank you for your purchase!

Order ID: ${orderDetails.orderId}
Product: ${orderDetails.productName}
Price: $${orderDetails.price}
Status: ${orderDetails.status}

We will process your order and send you tracking information soon.

Best regards,
Limited Reps Team
      `
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'customer_confirmation', // Different template for customers
      templateParams
    )

    console.log('Customer confirmation sent:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Customer confirmation failed:', error)
    return { success: false, error }
  }
}
