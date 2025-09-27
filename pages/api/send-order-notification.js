import { sendOrderNotification } from '../../lib/nodemailer'

// Load environment variables
require('dotenv').config({ path: '.env' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderDetails } = req.body

    if (!orderDetails) {
      return res.status(400).json({ error: 'Order details are required' })
    }


    const result = await sendOrderNotification(orderDetails)

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Order notification sent successfully',
        messageId: result.messageId
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send email',
        details: result.error
      })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    })
  }
}
