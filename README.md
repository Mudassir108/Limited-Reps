# Limited Reps - E-commerce Website

A modern e-commerce website built with Next.js featuring luxury fashion items, sneakers, and accessories.

## Features

- 🛍️ Product catalog with categories and filtering
- 💳 PayPal integration for payments
- 📧 Email notifications for orders
- 📱 Responsive design
- 🎨 Modern UI with dark theme
- 🔍 Product search and filtering

## Tech Stack

- **Frontend**: Next.js, React
- **Styling**: CSS3
- **Payments**: PayPal
- **Email**: Nodemailer
- **Images**: Cloudinary
- **Icons**: Font Awesome

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file
   - Add your Cloudinary credentials
   - Add your PayPal client ID
   - Add your email service credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Project Structure

```
├── components/          # React components
├── lib/                # Utility libraries
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/             # CSS styles
└── flat_products.json  # Product data
```

## License

This project is for educational purposes.
