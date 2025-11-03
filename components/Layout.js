import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)'
        navbar.style.boxShadow = '0 2px 20px rgba(255, 255, 255, 0.15)'
      } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)'
        navbar.style.boxShadow = 'none'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Global Background Video */}
      <div className="global-video" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto" id="bgVideo">
          <source src="/videoplayback.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">
              <span className="brand-badge">LIMITED REPS</span>
            </Link>
          </div>

          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className={`nav-link ${router.pathname === '/products' ? 'active' : ''}`}>
                Explore Products
              </Link>
            </li>
            <li className="nav-item">
              <a
                href="https://tinyurl.com/viewmyproducts"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find More Products
              </a>
            </li>
            <li className="nav-item">
              <Link href="/contact" className={`nav-link ${router.pathname === '/contact' ? 'active' : ''}`}>
                Send Message
              </Link>
            </li>
          </ul>

          <div className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Limited Reps</h3>
              <p>Premium quality reps for the discerning customer</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <p>Email: limitedrepsbusiness@gmail.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Limited Reps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
