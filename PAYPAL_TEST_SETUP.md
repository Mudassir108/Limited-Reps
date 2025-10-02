# PayPal Test Setup Guide

## 🧪 Testing PayPal Integration with Your Client ID

### Step 1: Environment Setup

Create or update your `.env.local` file with your PayPal Sandbox Client ID:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id_here

# Your existing email configuration...
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Limited Reps <your_email@gmail.com>"
```

### Step 2: Get Your PayPal Sandbox Client ID

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Go to "My Apps & Credentials"
4. Under "Sandbox", create a new app or use existing
5. Copy the "Client ID" from your sandbox app
6. Replace `your_sandbox_client_id_here` in `.env.local`

### Step 3: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/test-paypal`

3. Select a test product and click the PayPal button

### Step 4: Test Payment Methods

#### Option A: PayPal Sandbox Account
- Create a sandbox buyer account at [PayPal Sandbox](https://www.sandbox.paypal.com/)
- Use these credentials during checkout

#### Option B: Test Credit Cards
Use these test credit card numbers:

- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444  
- **American Express**: 378282246310005
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3-4 digits (e.g., 123)

### Step 5: Email Testing

After successful payment:
1. Check your email (mudassirshahid605@gmail.com) for order notifications
2. Verify the email template looks correct
3. Check that all order details are included

### Step 6: Integration Features

The test setup includes:
- ✅ PayPal SDK integration
- ✅ Sandbox environment
- ✅ Email notifications
- ✅ Order tracking
- ✅ Success/cancel page redirects
- ✅ Error handling

### Troubleshooting

**If PayPal button doesn't load:**
- Check your client ID is correct
- Verify `.env.local` file is in project root
- Restart development server after adding environment variables

**If emails don't send:**
- Check your email configuration in `.env.local`
- Verify Gmail app password is correct
- Check server console for error messages

### Next Steps

Once testing is complete:
1. Replace the test component with the real one in your product pages
2. Switch to PayPal Live environment for production
3. Update client ID to production client ID

## 🚀 Ready to Test!

Visit `http://localhost:3000/test-paypal` to start testing your PayPal integration!
