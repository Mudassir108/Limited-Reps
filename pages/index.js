import { useEffect } from 'react'
import Layout from '../components/Layout'

export default function Home() {
  useEffect(() => {
    // Wave animation for hero title
    function waveText(element, text) {
      // Clear the element first
      element.innerHTML = '';
      
      // Split text into characters and create spans
      const characters = text.split('');
      
      characters.forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space for spaces
        charSpan.style.display = 'inline-block';
        charSpan.style.opacity = '0';
        charSpan.style.transform = 'translateY(50px) rotateX(90deg)';
        charSpan.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        charSpan.style.transformOrigin = 'bottom';
        
        element.appendChild(charSpan);
        
        // Animate each character with a wave effect
        setTimeout(() => {
          charSpan.style.opacity = '1';
          charSpan.style.transform = 'translateY(0) rotateX(0deg)';
        }, index * 100 + 500);
      });
    }

    // Initialize wave animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const text = 'Limited Reps';
      setTimeout(() => {
        waveText(heroTitle, text);
      }, 300);
    }
  }, [])

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Limited Reps</h1>
          <p className="hero-subtitle">We Have The Best Reps Premium Quality</p>
          
          <div className="hero-buttons">
            <a href="/products" className="btn btn-primary">
              <i className="fas fa-search"></i>
              Explore Products
            </a>
            <a href="/contact" className="btn btn-secondary">
              <i className="fas fa-envelope"></i>
              Send Message
            </a>
          </div>
        </div>
        
        <div className="hero-overlay"></div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <h2>About Limited Reps</h2>
            <p>We specialize in providing premium quality reps that meet the highest standards. Our collection includes the latest trends in shoes and clothing from top luxury and fashion brands.</p>
            <p>With years of experience in the industry, we ensure that every product meets our quality standards and customer expectations.</p>
            <p>Discover our extensive collection of premium reps and experience the difference in quality and style.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-star"></i>
              <h3>Premium Quality</h3>
              <p>Only the finest materials and craftsmanship</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shipping-fast"></i>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable delivery worldwide</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Quality Guarantee</h3>
              <p>We stand behind every product we sell</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Animation Section */}
      <section className="category-animation">
        <div className="container">
          <h2>What We're Selling</h2>
          <div className="category-slider">
            <div className="category-item">Shoes</div>
            <div className="category-item">Clothes</div>
            <div className="category-item">Watches</div>
            <div className="category-item">Bags</div>
            <div className="category-item">Accessories</div>
            <div className="category-item">Jewelry</div>
            <div className="category-item">Sunglasses</div>
            <div className="category-item">Belts</div>
            <div className="category-item">Wallets</div>
            <div className="category-item">Hats</div>
            <div className="category-item">Scarves</div>
            <div className="category-item">Perfumes</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
