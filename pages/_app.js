import '../styles/globals.css'
import Head from 'next/head'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

export default function App({ Component, pageProps }) {
  // PayPal SDK configuration
  // Note: Removing 'components' to allow default popup behavior for cards
  const paypalOptions = {
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
    'enable-funding': 'card'
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <PayPalScriptProvider options={paypalOptions}>
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </>
  )
}
