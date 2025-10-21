# Environment Variables Setup Guide

## Current Configuration Status

Your `.env.local` file currently only has:
```
NEXT_PUBLIC_BUSINESS_EMAIL=mudassirshahid605@gmail.com
```

## Required Configuration

You need to add the following to your `.env.local` file:

```env
# PayPal Configuration
NEXT_PUBLIC_BUSINESS_EMAIL=mudassirshahid605@gmail.com

# Email Notification Configuration (Required for order email notifications)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=mudassirshahid605@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here

# Optional Configuration
BUSINESS_EMAIL=limitedrepsbusiness@gmail.com
EMAIL_FROM="Limited Reps <noreply@limitedreps.com>"
```

## How to Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with `mudassirshahid605@gmail.com`
3. Select "Mail" and "Other (Custom name)"
4. Name it "Limited Reps Store"
5. Click "Generate"
6. Copy the 16-character password
7. Paste it in `EMAIL_PASSWORD` (no spaces)

Example:
```
EMAIL_PASSWORD=abcd efgh ijkl mnop
```
Should be entered as:
```
EMAIL_PASSWORD=abcdefghijklmnop
```

## After Configuration

1. Save the `.env.local` file
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. Test email notifications by:
   - Making a test order
   - Check if email arrives at `mudassirshahid605@gmail.com`

## Troubleshooting

### "App Passwords" option not available
- Enable 2-Step Verification first: https://myaccount.google.com/security
- Wait a few minutes after enabling 2FA
- Try again

### Emails not sending
- Verify `EMAIL_USERNAME` matches the account with App Password
- Check Gmail "Less secure app access" settings
- Verify no typos in environment variables
- Check server console for error messages

### Variables not loading
- Make sure file is named `.env.local` (not `.env.local.txt`)
- Restart Next.js server after changes
- Verify no extra spaces around `=` signs
- Check file is in project root directory

## Security Notes

- ⚠️ Never commit `.env.local` to git (already in .gitignore)
- ⚠️ Use App Password, not your actual Gmail password
- ⚠️ Keep EMAIL_PASSWORD secret
- ✅ App Passwords can be revoked anytime from Google Account settings

