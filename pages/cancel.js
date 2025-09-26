import Layout from '../components/Layout'

export default function Cancel() {
  return (
    <Layout>
      <section className="products-header">
        <div className="container">
          <h1>Payment Cancelled</h1>
          <p>Your payment was cancelled. No charges have been made.</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div style={{
            background: 'rgba(17,17,17,0.7)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ color: '#ff4757', marginBottom: '1rem' }}>Payment Cancelled</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                Your payment was cancelled and no charges have been made to your account.
              </p>
              <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                If you have any questions or need assistance, please don't hesitate to contact us.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/products" className="btn btn-primary">
                Try Again
              </a>
              <a href="/contact" className="btn btn-secondary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
