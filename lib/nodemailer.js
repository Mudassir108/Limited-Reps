import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your app password
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
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(17, 17, 17, 0.95);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .header {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            .brand-logo {
                position: relative;
                z-index: 1;
                font-size: 2.5rem;
                font-weight: 900;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .notification-badge {
                background: #ff4444;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-top: 10px;
                display: inline-block;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .content {
                padding: 40px 30px;
            }
            .order-id {
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                color: #000;
                padding: 15px 25px;
                border-radius: 15px;
                font-size: 1.2rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
            }
            .order-details {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #ffd700;
                font-size: 1rem;
            }
            .detail-value {
                color: #ffffff;
                font-size: 1rem;
                text-align: right;
            }
            .product-info {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
                border: 2px solid rgba(255, 215, 0, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .product-name {
                font-size: 1.4rem;
                font-weight: 700;
                color: #ffd700;
                margin-bottom: 10px;
            }
            .product-price {
                font-size: 2rem;
                font-weight: 900;
                color: #00ff88;
                margin-bottom: 15px;
            }
            .footer {
                background: rgba(0, 0, 0, 0.3);
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .footer-text {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
                margin: 0;
            }
            .action-button {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                color: #000;
                padding: 15px 30px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 700;
                font-size: 1.1rem;
                display: inline-block;
                margin-top: 20px;
                box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
                transition: transform 0.3s ease;
            }
            .action-button:hover {
                transform: translateY(-2px);
            }
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px; }
                .detail-row { flex-direction: column; align-items: flex-start; }
                .detail-value { text-align: left; margin-top: 5px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="brand-logo">LIMITED REPS</h1>
                <div class="notification-badge">NEW PURCHASE NOTIFICATION</div>
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
                    <div class="detail-row">
                        <span class="detail-label">Customer Email:</span>
                        <span class="detail-value">${orderDetails.customerEmail || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer Name:</span>
                        <span class="detail-value">${orderDetails.customerName || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value" style="color: #00ff88; font-weight: 700;">${orderDetails.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">PayPal Transaction ID:</span>
                        <span class="detail-value">${orderDetails.paypalTransactionId || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${orderDetails.timestamp}</span>
                    </div>
                </div>
                
                <a href="https://www.paypal.com/activity" class="action-button" target="_blank">
                    View in PayPal Dashboard
                </a>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    This is an automated notification from your Limited Reps website.<br>
                    Please check your PayPal account for payment confirmation.
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
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(17, 17, 17, 0.95);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .header {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            .brand-logo {
                position: relative;
                z-index: 1;
                font-size: 2.5rem;
                font-weight: 900;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .success-icon {
                font-size: 4rem;
                margin: 20px 0;
                animation: bounce 2s infinite;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 1.5rem;
                color: #ffd700;
                margin-bottom: 20px;
                text-align: center;
            }
            .order-id {
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                color: #000;
                padding: 15px 25px;
                border-radius: 15px;
                font-size: 1.2rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
            }
            .order-details {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #ffd700;
                font-size: 1rem;
            }
            .detail-value {
                color: #ffffff;
                font-size: 1rem;
                text-align: right;
            }
            .next-steps {
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%);
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .next-steps h3 {
                color: #00ff88;
                margin-top: 0;
                font-size: 1.3rem;
            }
            .next-steps ul {
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
            }
            .footer {
                background: rgba(0, 0, 0, 0.3);
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .footer-text {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
                margin: 0;
            }
            .action-button {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                color: #000;
                padding: 15px 30px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 700;
                font-size: 1.1rem;
                display: inline-block;
                margin: 10px;
                box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
                transition: transform 0.3s ease;
            }
            .action-button:hover {
                transform: translateY(-2px);
            }
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px; }
                .detail-row { flex-direction: column; align-items: flex-start; }
                .detail-value { text-align: left; margin-top: 5px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="brand-logo">LIMITED REPS</h1>
                <div class="success-icon">🎉</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Thank you for your purchase, ${orderDetails.customerName || 'Valued Customer'}!
                </div>
                
                <div class="order-id">
                    Order ID: ${orderDetails.orderId}
                </div>
                
                <div class="order-details">
                    <div class="detail-row">
                        <span class="detail-label">Product:</span>
                        <span class="detail-value">${orderDetails.productName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount Paid:</span>
                        <span class="detail-value" style="color: #00ff88; font-weight: 700;">$${orderDetails.price}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value" style="color: #00ff88; font-weight: 700;">${orderDetails.status}</span>
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
      from: `"Limited Reps" <${process.env.EMAIL_USER}>`,
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
    'limitedrepsbusiness@gmail.com',
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
