import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    productCategory: '',
    productSubcategory: '',
    specificProduct: '',
    customProduct: '',
    size: '',
    quantity: 1,
    additionalInfo: '',
    budget: '',
    contactMethod: 'whatsapp'
  })

  const subcategories = {
    shoes: [
      'Air Jordan', 'Luxury Brand', 'Fashion Brands', 'Basketball Shoes',
      'NIKE', 'Adidas', 'Balenciaga', 'New Balance', 'Other brands'
    ],
    clothes: [
      'Luxury Brand', 'Fashion Brand', 'Down Jacket', 'Baseball Jacket',
      'Windbreaker', 'T-Shirt', 'Polo Shirts', 'Long Sleeve', 'Track Suit',
      'Shorts', 'Pants', 'Hoodies/Sweatshirts', 'Sweater'
    ],
    watches: [
      'Rolex', 'Cartier', 'Omega', 'Patek Philippe', 'Audemars Piguet',
      'Hublot', 'Tag Heuer', 'Breitling'
    ],
    bags: [
      'Louis Vuitton', 'Gucci', 'Chanel', 'Hermès', 'Prada',
      'Fendi', 'Balenciaga', 'Saint Laurent'
    ],
    accessories: [
      'Belts', 'Wallets', 'Hats', 'Scarves', 'Gloves', 'Umbrellas', 'Phone Cases'
    ],
    jewelry: [
      'Necklaces', 'Bracelets', 'Rings', 'Earrings', 'Pendants', 'Chains'
    ],
    sunglasses: [
      'Ray-Ban', 'Gucci', 'Prada', 'Tom Ford', 'Dior', 'Chanel', 'Versace'
    ],
    belts: [
      'Louis Vuitton', 'Gucci', 'Hermès', 'Prada', 'Bottega Veneta', 'Saint Laurent'
    ],
    wallets: [
      'Louis Vuitton', 'Gucci', 'Chanel', 'Prada', 'Bottega Veneta', 'Saint Laurent'
    ],
    hats: [
      'New Era', 'Nike', 'Adidas', 'Supreme', 'Bape', 'Off-White'
    ],
    scarves: [
      'Hermès', 'Gucci', 'Burberry', 'Louis Vuitton', 'Chanel', 'Prada'
    ],
    perfumes: [
      'Chanel', 'Dior', 'Gucci', 'Tom Ford', 'Yves Saint Laurent', 'Versace'
    ]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Reset subcategory when category changes
    if (name === 'productCategory') {
      setFormData(prev => ({
        ...prev,
        productSubcategory: '',
        customProduct: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      showNotification('Please fill in all required fields marked with *', 'error')
      return
    }

    // Format message for WhatsApp
    const whatsappMessage = formatWhatsAppMessage(formData)
    
    // Format message for email
    const emailMessage = formatEmailMessage(formData)
    
    // Send to WhatsApp
    if (formData.contactMethod === 'whatsapp') {
      sendToWhatsApp(whatsappMessage)
    }
    
    // Send to email (using mailto)
    sendToEmail(emailMessage, formData)
    
    // Show success message
    showNotification('Message sent successfully! Check your WhatsApp and email.', 'success')
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      productCategory: '',
      productSubcategory: '',
      specificProduct: '',
      customProduct: '',
      size: '',
      quantity: 1,
      additionalInfo: '',
      budget: '',
      contactMethod: 'whatsapp'
    })
  }

  const formatWhatsAppMessage = (data) => {
    let productInfo = ''
    
    if (data.productCategory === 'other') {
      productInfo = `• Category: Custom Request
• Custom Product: ${data.customProduct || 'Not specified'}`
    } else {
      productInfo = `• Category: ${data.productCategory || 'Not specified'}
• Subcategory: ${data.productSubcategory || 'Not specified'}
• Specific Product: ${data.specificProduct || 'Not specified'}`
    }
    
    return `*New Customer Inquiry - Limited Reps* 🚀

*Personal Information:*
• Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}
• Address: ${data.address}

*Product Information:*
${productInfo}
• Size: ${data.size || 'Not specified'}
• Quantity: ${data.quantity || '1'}

*Additional Details:*
• Budget: ${data.budget || 'Not specified'}
• Additional Info: ${data.additionalInfo || 'None'}
• Preferred Contact: ${data.contactMethod}

---
*This message was sent from the Limited Reps website* 🌐`
  }

  const formatEmailMessage = (data) => {
    let productInfo = ''
    
    if (data.productCategory === 'other') {
      productInfo = `- Category: Custom Request
- Custom Product: ${data.customProduct || 'Not specified'}`
    } else {
      productInfo = `- Category: ${data.productCategory || 'Not specified'}
- Subcategory: ${data.productSubcategory || 'Not specified'}
- Specific Product: ${data.specificProduct || 'Not specified'}`
    }
    
    return `New Customer Inquiry - Limited Reps 🚀

Personal Information:
- Name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone}
- Address: ${data.address}

Product Information:
${productInfo}
- Size: ${data.size || 'Not specified'}
- Quantity: ${data.quantity || '1'}

Additional Details:
- Budget: ${data.budget || 'Not specified'}
- Additional Info: ${data.additionalInfo || 'None'}
- Preferred Contact: ${data.contactMethod}

---
This message was sent from the Limited Reps website 🌐`
  }

  const sendToWhatsApp = (message) => {
    const phoneNumber = '15106609281'
    const encodedMessage = encodeURIComponent(message)
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappURL, '_blank')
  }

  const sendToEmail = (message, data) => {
    const subject = 'New Customer Inquiry - Limited Reps 🚀'
    const body = message
    const email = 'limitedrepsinformation@gmail.com'
    
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    window.location.href = mailtoURL
  }

  const showNotification = (message, type = 'info') => {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification')
    existingNotifications.forEach(notification => notification.remove())
    
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : type === 'error' ? 'linear-gradient(135deg, #ff4757, #ff3742)' : 'linear-gradient(135deg, #00a8ff, #0097e6)'};
      color: ${type === 'success' ? '#000000' : '#ffffff'};
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      max-width: 400px;
      animation: slideInRight 0.3s ease;
    `
    
    // Add to page
    document.body.appendChild(notification)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease'
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close')
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    })
  }

  return (
    <Layout>
      {/* Contact Header */}
      <section className="contact-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>Fill out the form below and we'll get back to you as soon as possible</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <div>
                  <h3>WhatsApp</h3>
                  <p>Available 24/7 for quick responses</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>limitedrepsbusiness@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Response Time</h3>
                  <p>We typically respond within 2-4 hours</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>Send Us a Message</h2>
                
                {/* Personal Information */}
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Full Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Street Address, City, State, ZIP Code, Country"
                  />
                </div>

                {/* Product Information */}
                <div className="form-group">
                  <label htmlFor="productCategory">Product Category</label>
                  <select
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="shoes">Shoes</option>
                    <option value="clothes">Clothes</option>
                    <option value="watches">Watches</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="belts">Belts</option>
                    <option value="wallets">Wallets</option>
                    <option value="hats">Hats</option>
                    <option value="scarves">Scarves</option>
                    <option value="perfumes">Perfumes</option>
                    <option value="other">Other (Custom Request)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="productSubcategory">Product Subcategory</label>
                  <select
                    id="productSubcategory"
                    name="productSubcategory"
                    value={formData.productSubcategory}
                    onChange={handleInputChange}
                    disabled={formData.productCategory === 'other' || !formData.productCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.productCategory && subcategories[formData.productCategory] && 
                      subcategories[formData.productCategory].map((subcat, index) => (
                        <option key={index} value={subcat}>{subcat}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="specificProduct">Specific Product</label>
                  <input
                    type="text"
                    id="specificProduct"
                    name="specificProduct"
                    value={formData.specificProduct}
                    onChange={handleInputChange}
                    placeholder="e.g., Air Jordan 1 High, Gucci T-Shirt"
                  />
                </div>
                
                {formData.productCategory === 'other' && (
                  <div className="form-group">
                    <label htmlFor="customProduct">Custom Product Request</label>
                    <textarea
                      id="customProduct"
                      name="customProduct"
                      rows="3"
                      value={formData.customProduct}
                      onChange={handleInputChange}
                      placeholder="Please describe the specific product you're looking for in detail..."
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="6">6 (Shoes)</option>
                    <option value="7">7 (Shoes)</option>
                    <option value="8">8 (Shoes)</option>
                    <option value="9">9 (Shoes)</option>
                    <option value="10">10 (Shoes)</option>
                    <option value="11">11 (Shoes)</option>
                    <option value="12">12 (Shoes)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="additionalInfo">Additional Information</label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows="4"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements, color preferences, or additional details..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Budget</option>
                    <option value="100-150">$100 - $150</option>
                    <option value="150-200">$150 - $200</option>
                    <option value="200-300">$200 - $300</option>
                    <option value="300+">$300+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Contact Method</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={formData.contactMethod === 'whatsapp'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      WhatsApp
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === 'email'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Email
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                  <i className="fab fa-whatsapp"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
