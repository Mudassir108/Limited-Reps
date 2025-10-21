# PayPal Integration Setup Guide

## Issue: "Things don't appear to be working at the moment" Error

This error typically occurs due to PayPal account configuration issues. Follow these steps to fix it:

## Required Steps

### 1. Verify Your PayPal Business Account

Your PayPal account **MUST** be:
- ✅ A **Business Account** (not Personal)
- ✅ **Verified** with confirmed email
- ✅ Have **Website Payments Standard** enabled
- ✅ Located in a supported country (US, UK, etc.)

### 2. PayPal Account Setup

1. **Log in to PayPal** at https://www.paypal.com
2. Go to **Account Settings** → **Account Type**
3. Upgrade to **Business Account** if needed
4. Verify your **email address** (check for verification email)
5. Enable **Website Payments Standard**:
   - Go to **Account Settings** → **Payment Preferences**
   - Enable **Website Payments**
   - Save changes

### 3. Update Environment Variables

Create or update `.env.local` file:

```env
# PayPal Business Account Email (MUST be verified)
NEXT_PUBLIC_BUSINESS_EMAIL=your-verified-paypal-email@example.com
```

**IMPORTANT**: Replace `your-verified-paypal-email@example.com` with your actual PayPal business email.

### 4. PayPal Sandbox for Testing (Recommended)

For testing, use PayPal Sandbox:

1. Create Sandbox account at https://developer.paypal.com
2. Create a **Business Sandbox Account**
3. Create a **Personal Sandbox Account** (for testing purchases)
4. Update code to use sandbox URL:

```javascript
// For testing, change this line in pages/product/[slug].js
const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`
// Production: https://www.paypal.com/cgi-bin/webscr
```

### 5. Common Issues & Solutions

#### Issue: "Invalid Business Email"
**Solution**: 
- Verify email is confirmed in PayPal
- Check for typos in `.env.local`
- Ensure it's a Business Account email

#### Issue: "Transaction Declined"
**Solution**:
- Enable "Website Payments Standard" in PayPal settings
- Check if PayPal account is in good standing
- Verify account is not limited

#### Issue: "Generic Error"
**Solution**:
- Ensure all required fields are filled (name, address, etc.)
- Check if `no_shipping` parameter is correct for your products
- Verify return URLs are accessible

### 6. Testing the Integration

1. Fill in all customer information fields
2. Select size and color (if applicable)
3. Click "Buy Now"
4. You should be redirected to PayPal payment page
5. Complete payment with sandbox credentials (if testing)

### 7. Production Checklist

Before going live:
- [ ] PayPal Business Account verified
- [ ] Email confirmed in PayPal
- [ ] Website Payments enabled
- [ ] Correct business email in `.env.local`
- [ ] Using production URL (not sandbox)
- [ ] SSL certificate installed on your domain
- [ ] Return URLs are HTTPS (PayPal requires HTTPS for production)

## Alternative: Upgrade to PayPal REST API

For better reliability, consider upgrading to PayPal REST API with Express Checkout:

1. Create app at https://developer.paypal.com
2. Get Client ID and Secret
3. Implement server-side payment creation
4. Use PayPal JavaScript SDK for checkout

## Support

If issues persist:
1. Check PayPal activity log for declined transactions
2. Contact PayPal Business Support
3. Verify all account settings are correct

## Current Configuration

- **Integration Method**: Website Payments Standard (Form-based)
- **Payment Type**: Single item purchase
- **Shipping**: Required (physical products)
- **Currency**: USD
- **Return URLs**: /success and /cancel pages

