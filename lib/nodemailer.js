import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email
      pass: process.env.EMAIL_PASSWORD  // Your app password
    }
  })
}

// Email templates
export const emailTemplates = {
  ownerNotification: (orderDetails) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Purchase - Limited Reps</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8f9fa;
                color: #333333;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }
            .header {
                background: #000000;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .brand-logo {
                font-size: 2.2rem;
                font-weight: 800;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0 0 10px 0;
            }
            .notification-badge {
                background: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 600;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 40px 30px;
            }
            .order-id {
                background: #f8f9fa;
                border: 2px solid #000000;
                color: #000000;
                padding: 15px 25px;
                border-radius: 4px;
                font-size: 1.1rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 30px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .product-info {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 25px;
                margin-bottom: 25px;
                text-align: center;
            }
            .product-name {
                font-size: 1.3rem;
                font-weight: 600;
                color: #000000;
                margin-bottom: 10px;
            }
            .product-price {
                font-size: 2.2rem;
                font-weight: 800;
                color: #000000;
                margin-bottom: 0;
            }
            .order-details {
                background: #ffffff;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #f1f3f4;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #495057;
                font-size: 0.95rem;
            }
            .detail-value {
                color: #000000;
                font-size: 0.95rem;
                text-align: right;
                font-weight: 500;
            }
            .highlight-value {
                color: #28a745;
                font-weight: 700;
                font-size: 1.1rem;
            }
            .footer {
                background: #f8f9fa;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer-text {
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 0;
            }
            .action-button {
                display: inline-block;
                background: #000000;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                margin: 20px 0;
                border: 2px solid #000000;
            }
            .action-button:hover {
                background: #ffffff;
                color: #000000;
            }
            .status-badge {
                background: #28a745;
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .section-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #000000;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="brand-logo">LIMITED REPS</h1>
                <div class="notification-badge">New Purchase Notification</div>
            </div>
            
            <div class="content">
                <div class="order-id">
                    Order ID: ${orderDetails.orderId}
                </div>
                
                <div class="product-info">
                    <div class="product-name">${orderDetails.productName}</div>
                    <div class="product-price">$${orderDetails.price}</div>
                </div>
                
                <div class="order-details">
                    <div class="section-title">Order Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Amount:</span>
                        <span class="detail-value highlight-value">$${orderDetails.price}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value"><span class="status-badge">${orderDetails.status}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">PayPal Transaction ID:</span>
                        <span class="detail-value">${orderDetails.paypalTransactionId || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer Email:</span>
                        <span class="detail-value">${orderDetails.customerEmail || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer Name:</span>
                        <span class="detail-value">${orderDetails.customerName || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${orderDetails.timestamp}</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://www.paypal.com/activity" class="action-button" target="_blank">
                        View in PayPal Dashboard
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>Payment Received!</strong> This is an automated notification from your Limited Reps website.<br>
                    The customer has successfully paid $${orderDetails.price} for ${orderDetails.productName}.<br>
                    Please check your PayPal account for payment confirmation and process the order.
                </p>
            </div>
        </div>
    </body>
    </html>
    `
  },

  customerConfirmation: (orderDetails) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Limited Reps</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8f9fa;
                color: #333333;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }
            .header {
                background: #000000;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .brand-logo {
                font-size: 2.2rem;
                font-weight: 800;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0 0 20px 0;
            }
            .success-icon {
                font-size: 3rem;
                margin: 0;
                color: #28a745;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 1.4rem;
                color: #000000;
                margin-bottom: 30px;
                text-align: center;
                font-weight: 600;
            }
            .order-id {
                background: #f8f9fa;
                border: 2px solid #000000;
                color: #000000;
                padding: 15px 25px;
                border-radius: 4px;
                font-size: 1.1rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 30px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .order-details {
                background: #ffffff;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #f1f3f4;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #495057;
                font-size: 0.95rem;
            }
            .detail-value {
                color: #000000;
                font-size: 0.95rem;
                text-align: right;
                font-weight: 500;
            }
            .highlight-value {
                color: #28a745;
                font-weight: 700;
                font-size: 1.1rem;
            }
            .next-steps {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .next-steps h3 {
                color: #000000;
                margin-top: 0;
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 15px;
            }
            .next-steps ul {
                color: #495057;
                line-height: 1.6;
                margin: 0;
                padding-left: 20px;
            }
            .next-steps li {
                margin-bottom: 8px;
            }
            .footer {
                background: #f8f9fa;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer-text {
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 0;
            }
            .action-button {
                display: inline-block;
                background: #000000;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                margin: 10px;
                border: 2px solid #000000;
            }
            .action-button:hover {
                background: #ffffff;
                color: #000000;
            }
            .status-badge {
                background: #28a745;
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .section-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #000000;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="brand-logo">LIMITED REPS</h1>
                <div class="success-icon">✓</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Thank you for your purchase, ${orderDetails.customerName || 'Valued Customer'}!
                </div>
                
                <div class="order-id">
                    Order ID: ${orderDetails.orderId}
                </div>
                
                <div class="order-details">
                    <div class="section-title">Order Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Product:</span>
                        <span class="detail-value">${orderDetails.productName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount Paid:</span>
                        <span class="detail-value highlight-value">$${orderDetails.price}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value"><span class="status-badge">${orderDetails.status}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${orderDetails.timestamp}</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>What happens next?</h3>
                    <ul>
                        <li>We'll process your order within 24 hours</li>
                        <li>You'll receive tracking information via email</li>
                        <li>Your order will be shipped within 2-3 business days</li>
                        <li>If you have any questions, contact us at limitedrepsbusiness@gmail.com</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="/products" class="action-button">Continue Shopping</a>
                    <a href="/contact" class="action-button">Contact Support</a>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    Thank you for choosing Limited Reps!<br>
                    We appreciate your business and look forward to serving you again.
                </p>
            </div>
        </div>
    </body>
    </html>
    `
  }
}

// Send email function
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Limited Reps" <${process.env.EMAIL_USERNAME}>`,
      to: to,
      subject: subject,
      html: htmlContent
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error.message }
  }
}

// Send order notification to owner
export const sendOrderNotification = async (orderDetails) => {
  const htmlContent = emailTemplates.ownerNotification(orderDetails)
  return await sendEmail(
    'mudassirshahid605@gmail.com',
    `New Purchase - ${orderDetails.orderId}`,
    htmlContent
  )
}

// Send confirmation to customer
export const sendCustomerConfirmation = async (orderDetails) => {
  if (!orderDetails.customerEmail) {
    console.log('No customer email provided, skipping confirmation')
    return { success: false, error: 'No customer email' }
  }
  
  const htmlContent = emailTemplates.customerConfirmation(orderDetails)
  return await sendEmail(
    orderDetails.customerEmail,
    `Order Confirmation - ${orderDetails.orderId}`,
    htmlContent
  )
}
