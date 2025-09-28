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
        <title>New Purchase Notification - Limited Reps</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                color: #2c3e50;
                line-height: 1.6;
            }
            .container {
                max-width: 650px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid #e1e8ed;
            }
            .header {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .brand-logo {
                font-size: 2.4rem;
                font-weight: 700;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0 0 15px 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .notification-badge {
                background: #27ae60;
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 0.9rem;
                font-weight: 600;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
            }
            .content {
                padding: 45px 35px;
            }
            .order-id {
                background: #ecf0f1;
                border-left: 4px solid #3498db;
                color: #2c3e50;
                padding: 20px 25px;
                border-radius: 0 6px 6px 0;
                font-size: 1.2rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 35px;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .product-info {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 30px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .product-name {
                font-size: 1.4rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                line-height: 1.4;
            }
            .product-price {
                font-size: 2.5rem;
                font-weight: 800;
                color: #27ae60;
                margin-bottom: 0;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .order-details {
                background: #ffffff;
                border: 1px solid #e1e8ed;
                border-radius: 8px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #ecf0f1;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #7f8c8d;
                font-size: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .detail-value {
                color: #2c3e50;
                font-size: 1rem;
                text-align: right;
                font-weight: 500;
            }
            .highlight-value {
                color: #27ae60;
                font-weight: 700;
                font-size: 1.2rem;
            }
            .footer {
                background: #f8f9fa;
                padding: 30px 35px;
                text-align: center;
                border-top: 1px solid #e1e8ed;
            }
            .footer-text {
                color: #7f8c8d;
                font-size: 0.95rem;
                line-height: 1.7;
                margin: 0;
            }
            .action-button {
                display: inline-block;
                background: #3498db;
                color: #ffffff;
                padding: 15px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.3s ease;
                margin: 25px 0;
                border: none;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            }
            .action-button:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
            }
            .status-badge {
                background: #27ae60;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .section-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }
            .priority-notice {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: center;
            }
            .priority-notice h3 {
                color: #856404;
                margin: 0 0 10px 0;
                font-size: 1.1rem;
                font-weight: 700;
            }
            .priority-notice p {
                color: #856404;
                margin: 0;
                font-size: 0.95rem;
            }
            .timestamp {
                color: #95a5a6;
                font-size: 0.9rem;
                text-align: center;
                margin-top: 20px;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="brand-logo">LIMITED REPS</h1>
                <div class="notification-badge">New Purchase Alert</div>
            </div>
            
            <div class="content">
                <div class="priority-notice">
                    <h3>⚡ Immediate Action Required</h3>
                    <p>A new customer has completed a purchase and payment is pending verification in your PayPal account.</p>
                </div>
                
                <div class="order-id">
                    Order Reference: ${orderDetails.orderId}
                </div>
                
                <div class="product-info">
                    <div class="product-name">${orderDetails.productName}</div>
                    <div class="product-price">$${orderDetails.price}</div>
                </div>
                
                <div class="order-details">
                    <div class="section-title">Transaction Details</div>
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
                        <span class="detail-value">${orderDetails.paypalTransactionId || 'Pending confirmation'}</span>
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
                
                <div class="timestamp">
                    This notification was generated automatically at ${new Date().toLocaleString()}
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>Action Required:</strong> Please verify the payment in your PayPal account and process the order within 24 hours.<br>
                    <strong>Customer Service:</strong> If you have any questions about this order, contact us at limitedrepsbusiness@gmail.com<br>
                    <strong>System:</strong> This is an automated notification from your Limited Reps e-commerce platform.
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
