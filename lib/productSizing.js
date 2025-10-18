// Product sizing utility functions

/**
 * Get appropriate sizes based on product category and name
 * @param {string} category - Product category (shoes, clothes, accessories)
 * @param {string} productName - Product name for additional detection
 * @returns {object} - Object containing sizes, colors, and visibility settings
 */
export function getProductSizing(category, productName = '') {
  const name = productName.toLowerCase()
  
  // Enhanced product type detection based on category and name
  const productType = detectProductType(category, name)
  
  switch (productType) {
    case 'shoes':
    case 'socks':
      return {
        sizes: getShoeSizes(),
        colors: getStandardColors(),
        showSizes: true,
        showColors: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: 'Available Colors:'
      }
    
    case 'clothes':
      return {
        sizes: getClothingSizes(),
        colors: getStandardColors(),
        showSizes: true,
        showColors: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: 'Available Colors:'
      }
    
    case 'accessories':
      return {
        sizes: [],
        colors: getStandardColors(),
        showSizes: false,
        showColors: true,
        sizeLabel: '',
        colorLabel: 'Available Colors:'
      }
    
    case 'electronics':
    case 'jewelry':
    case 'watches':
    case 'perfumes':
    case 'toys':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        sizeLabel: '',
        colorLabel: ''
      }
    
    default:
      // Default to shoe sizes if category is unclear
      return {
        sizes: getShoeSizes(),
        colors: getStandardColors(),
        showSizes: true,
        showColors: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: 'Available Colors:'
      }
  }
}

/**
 * Detect product type based on category and name
 * @param {string} category - Product category
 * @param {string} name - Product name (lowercase)
 * @returns {string} - Detected product type
 */
function detectProductType(category, name) {
  // Check for socks in name
  if (name.includes('sock') || name.includes('socks')) {
    return 'socks'
  }
  
  // Check for clothing in name (priority over shoes)
  if (name.includes('hoodie') || name.includes('shirt') || name.includes('pants') || 
      name.includes('shorts') || name.includes('jersey') || name.includes('top') ||
      name.includes('sweater') || name.includes('jacket') || name.includes('coat') ||
      name.includes('dress') || name.includes('skirt') || name.includes('blouse') ||
      name.includes('tank') || name.includes('tee') || name.includes('t-shirt') ||
      name.includes('polo') || name.includes('rugby') || name.includes('uniform') ||
      name.includes('sweatshirt') || name.includes('pullover') || name.includes('cardigan')) {
    return 'clothes'
  }
  
  // Check for shoes in name
  if (name.includes('shoe') || name.includes('sneaker') || name.includes('jordan') || 
      name.includes('dunk') || name.includes('air force') || name.includes('slide') ||
      name.includes('boot') || name.includes('sandal') || name.includes('loafer') ||
      name.includes('heel') || name.includes('trainer') || name.includes('runner')) {
    return 'shoes'
  }
  
  // Check for electronics/gadgets in name
  if (name.includes('airpod') || name.includes('airpods') || 
      name.includes('headphone') || name.includes('headphones') ||
      name.includes('watch') || name.includes('smartwatch') ||
      name.includes('phone') || name.includes('charger') ||
      name.includes('cable') || name.includes('speaker')) {
    return 'electronics'
  }
  
  // Check for jewelry in name
  if (name.includes('chain') || name.includes('necklace') ||
      name.includes('bracelet') || name.includes('ring') ||
      name.includes('earring') || name.includes('pendant')) {
    return 'jewelry'
  }
  
  // Check for perfumes in name
  if (name.includes('perfume') || name.includes('cologne') ||
      name.includes('fragrance') || name.includes('eau de toilette')) {
    return 'perfumes'
  }
  
  // Check for toys in name
  if (name.includes('toy') || name.includes('doll') ||
      name.includes('action figure') || name.includes('game')) {
    return 'toys'
  }
  
  // Check for watches in name
  if (name.includes('watch') || name.includes('timepiece')) {
    return 'watches'
  }
  
  // Check for accessories in name (bags, caps, etc.)
  if (name.includes('bag') || name.includes('cap') || name.includes('hat') ||
      name.includes('backpack') || name.includes('purse') || name.includes('wallet') ||
      name.includes('belt') || name.includes('scarf') || name.includes('glove')) {
    return 'accessories'
  }
  
  // Use category as fallback
  return category
}

/**
 * Get shoe/sock sizes (numeric)
 * @returns {Array} - Array of shoe sizes
 */
function getShoeSizes() {
  return ['3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11']
}

/**
 * Get clothing sizes (standard)
 * @returns {Array} - Array of clothing sizes
 */
function getClothingSizes() {
  return ['S', 'M', 'L', 'XL']
}

/**
 * Get standard colors
 * @returns {Array} - Array of colors
 */
function getStandardColors() {
  return ['Black', 'White', 'Red', 'Blue', 'Green', 'Grey', 'Navy', 'Brown', 'Pink', 'Yellow']
}

/**
 * Get product type display name
 * @param {string} productType - Product type
 * @returns {string} - Display name with emoji
 */
export function getProductTypeDisplay(productType) {
  const typeMap = {
    'shoes': '🧦 Shoes',
    'socks': '🧦 Socks',
    'clothes': '👕 Clothes',
    'accessories': '🎒 Accessories',
    'electronics': '⌚ Electronics',
    'jewelry': '⌚ Jewelry',
    'watches': '⌚ Watches',
    'perfumes': '⌚ Perfumes',
    'toys': '⌚ Toys'
  }
  
  return typeMap[productType] || '📦 Product'
}
