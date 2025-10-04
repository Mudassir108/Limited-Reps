import { useState } from 'react'

export default function PayPalButton({ product, selectedSize, selectedColor, isSelectionComplete, onBuyNowClick, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const redirectToPayPalSandbox = async () => {
    if (!product) return

    // Always trigger the buy now click handler (which will show confirmation modal or validation errors)
    if (onBuyNowClick) {
      onBuyNowClick()
    }
  }

  return (
    <div className="paypal-button-container">
      <button
        onClick={redirectToPayPalSandbox}
        className="btn btn-primary"
        disabled={!isSelectionComplete}
        style={{
          background: isSelectionComplete 
            ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' 
            : 'transparent',
          color: isSelectionComplete ? '#000' : '#ffffff',
          border: isSelectionComplete ? 'none' : '2px solid #ffffff',
          padding: '12px 16px',
          borderRadius: '25px',
          fontSize: '0.8rem',
          fontWeight: '700',
          cursor: !isSelectionComplete ? 'not-allowed' : 'pointer',
          opacity: !isSelectionComplete ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: isSelectionComplete 
            ? '0 8px 20px rgba(255, 215, 0, 0.3)' 
            : '0 8px 20px rgba(255, 255, 255, 0.1)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'inline-block',
          textAlign: 'center',
          width: '180px',
          height: '48px',
          lineHeight: '1.2',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {!isSelectionComplete ? 'Select Options' : 'Buy Now'}
      </button>
    </div>
  )
}
