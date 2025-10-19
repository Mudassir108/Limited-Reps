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
    case 'clothes':
      return {
        sizes: getClothingSizes(),
        colors: getStandardColors(),
        showSizes: true,
        showColors: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: 'Available Colors:'
      }
    
    case 'shoes':
      return {
        sizes: getShoeSizes(),
        colors: getStandardColors(),
        showSizes: true,
        showColors: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: 'Available Colors:'
      }
    
    case 'rings':
      return {
        sizes: getRingSizes(),
        colors: [],
        showSizes: true,
        showColors: false,
        sizeLabel: 'Available Sizes:',
        colorLabel: ''
      }
    
    case 'pillows':
      return {
        sizes: [],
        colors: getStandardColors(),
        showSizes: false,
        showColors: true,
        sizeLabel: '',
        colorLabel: 'Available Colors:'
      }
    
    case 'accessories':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        sizeLabel: '',
        colorLabel: ''
      }
    
    default:
      // Check if name suggests it's a shoe or clothing item
      if (name.includes('shoe') || name.includes('sneaker') || name.includes('jordan') || 
          name.includes('dunk') || name.includes('air force') || name.includes('slide') ||
          name.includes('boot') || name.includes('sandal') || name.includes('loafer') ||
          name.includes('heel') || name.includes('trainer') || name.includes('runner') ||
          name.includes('jogger') || name.includes('slipper') || name.includes('slippers') ||
          name.includes('af1') || name.includes('af1s') || name.includes('air max') ||
          name.includes('air force 1') || name.includes('air force one') ||
          name.includes('retro') || name.includes('low') || name.includes('high') ||
          name.includes('mid') || name.includes('og') || name.includes('se') ||
          name.includes('premium') || name.includes('luxury') || name.includes('limited') ||
          name.includes('nike') || name.includes('adidas') || name.includes('puma') ||
          name.includes('converse') || name.includes('vans') || name.includes('yeezy')) {
        // Default to shoe sizes for shoe-related names
        return {
          sizes: getShoeSizes(),
          colors: getStandardColors(),
          showSizes: true,
          showColors: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: 'Available Colors:'
        }
      } else if (name.includes('hoodie') || name.includes('shirt') || name.includes('pants') || 
                 name.includes('shorts') || name.includes('jacket') || name.includes('jeans') ||
                 name.includes('trousers') || name.includes('sock') || name.includes('socks') ||
                 name.includes('jersey') || name.includes('top') || name.includes('sweater') ||
                 name.includes('coat') || name.includes('dress') || name.includes('skirt') ||
                 name.includes('blouse') || name.includes('tank') || name.includes('tee') ||
                 name.includes('t-shirt') || name.includes('polo') || name.includes('rugby')) {
        // Default to clothing sizes for clothing-related names
        return {
          sizes: getClothingSizes(),
          colors: getStandardColors(),
          showSizes: true,
          showColors: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: 'Available Colors:'
        }
      } else {
        // Default to shoe sizes if category is unclear (most products are shoes)
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
}

/**
 * Detect product type based on category and name
 * @param {string} category - Product category
 * @param {string} name - Product name (lowercase)
 * @returns {string} - Detected product type
 */
function detectProductType(category, name) {
  // Check for rings FIRST (highest priority for jewelry sizing)
  // Only detect actual ring products, exclude pillows and other items
  if ((name.includes('ring') || name.includes('rings') || name.includes('wedding') ||
       name.includes('engagement') || name.includes('band') || name.includes('bands')) &&
      !name.includes('pillow') && !name.includes('pillows') && !name.includes('cushion') &&
      !name.includes('blanket') && !name.includes('towel') && !name.includes('bedding') &&
      !name.includes('home') && !name.includes('decor') && !name.includes('decoration')) {
    return 'rings'
  }
  
  // Check for pillows (colors only, no sizes) - higher priority than shoes
  if (name.includes('pillow') || name.includes('pillows') || name.includes('cushion')) {
    return 'pillows'
  }
  
  // Check for shoes (after rings and pillows)
  // Exclude audio/tech products from shoe detection
  if ((name.includes('shoe') || name.includes('sneaker') || name.includes('jordan') || 
      name.includes('dunk') || name.includes('air force') || name.includes('slide') ||
      name.includes('boot') || name.includes('sandal') || name.includes('loafer') ||
      name.includes('heel') || name.includes('trainer') || name.includes('runner') ||
      name.includes('jogger') || name.includes('slipper') || name.includes('slippers') ||
      name.includes('birkenstock') || name.includes('arizona') || name.includes('crocs') ||
      name.includes('flip') || name.includes('flops') || name.includes('flip-flops') ||
      name.includes('clog') || name.includes('clogs') || name.includes('moccasin') ||
      name.includes('oxford') || name.includes('derby') || name.includes('chuck') ||
      name.includes('converse') || name.includes('vans') || name.includes('adidas') ||
      name.includes('nike') || name.includes('puma') || name.includes('reebok') ||
      name.includes('new balance') || name.includes('asics') || name.includes('under armour') ||
      name.includes('yeezy') || name.includes('boost') || name.includes('ultra') ||
      name.includes('max') || name.includes('air') || name.includes('force') ||
      name.includes('af1') || name.includes('af1s') || name.includes('air max') ||
      name.includes('air force 1') || name.includes('air force one') ||
      name.includes('retro') || name.includes('low') || name.includes('high') ||
      name.includes('mid') || name.includes('og') || name.includes('se') ||
      name.includes('premium') || name.includes('luxury') || name.includes('limited') ||
      name.includes('gats') || name.includes('gat') || name.includes('tabi') ||
      name.includes('mm') || name.includes('margiela')) &&
      !name.includes('airpod') && !name.includes('airpods') && !name.includes('airpords') &&
      !name.includes('headphone') && !name.includes('headphones') && !name.includes('speaker') &&
      !name.includes('charger') && !name.includes('cable') && !name.includes('phone') &&
      !name.includes('apple') && !name.includes('sony') && !name.includes('bose') &&
      !name.includes('sennheiser') && !name.includes('dyson') && !name.includes('hair') &&
      !name.includes('dryer') && !name.includes('sonic') && !name.includes('supersonic') &&
      !name.includes('bugatti') && !name.includes('veyron') && !name.includes('ferrari') &&
      !name.includes('lamborghini') && !name.includes('porsche') && !name.includes('mclaren') &&
      !name.includes('sculpture') && !name.includes('art') && !name.includes('statue') &&
      !name.includes('figurine') && !name.includes('mini') && !name.includes('balloon') &&
      !name.includes('dog') && !name.includes('cat') && !name.includes('animal')) {
    return 'shoes'
  }
  
  // Check for accessories in name (fourth priority)
  if (name.includes('bag') || name.includes('cap') || name.includes('hat') ||
      name.includes('backpack') || name.includes('purse') || name.includes('wallet') ||
      name.includes('belt') || name.includes('scarf') || name.includes('glove') ||
      name.includes('watch') || name.includes('timepiece') || name.includes('bracelet') ||
      name.includes('necklace') || name.includes('chain') || name.includes('earring') ||
      name.includes('pendant') || name.includes('perfume') ||
      name.includes('cologne') || name.includes('fragrance') || name.includes('airpod') ||
      name.includes('maison') || name.includes('replica') || name.includes('bottle') ||
      name.includes('dior') || name.includes('chanel') || name.includes('tom ford') || name.includes('creed') ||
      name.includes('versace') || name.includes('prada') || name.includes('hermes') ||
      name.includes('ysl') || name.includes('yves saint') || name.includes('lancome') || name.includes('estee') ||
      name.includes('lauder') || name.includes('clinique') || name.includes('mac') || name.includes('urban decay') ||
      name.includes('nars') || name.includes('fenty') || name.includes('rare beauty') || name.includes('glossier') ||
      name.includes('kiehl') || name.includes('origins') || name.includes('fresh') || name.includes('lush') ||
      name.includes('bath') || name.includes('body works') || name.includes('victoria') || name.includes('secret') ||
      name.includes('makeup') || name.includes('cosmetics') || name.includes('beauty') || name.includes('skincare') ||
      name.includes('serum') || name.includes('moisturizer') || name.includes('cleanser') || name.includes('toner') ||
      name.includes('airpods') || name.includes('toy') || name.includes('doll') ||
      name.includes('action figure') || name.includes('game') || name.includes('headphone') ||
      name.includes('headphones') || name.includes('speaker') || name.includes('charger') ||
      name.includes('cable') || name.includes('phone') || name.includes('glass') ||
      name.includes('glasses') || name.includes('sunglass') || name.includes('sunglasses') ||
      name.includes('eyewear') || name.includes('spectacle') || name.includes('spectacles') ||
      name.includes('goggle') || name.includes('goggles') || name.includes('lens') ||
      name.includes('lenses') || name.includes('reading') || name.includes('prescription') ||
      name.includes('mousepad') || name.includes('mouse pad') || name.includes('mouse') ||
      name.includes('keyboard') || name.includes('laptop') || name.includes('computer') ||
      name.includes('desk') || name.includes('desktop') || name.includes('monitor') ||
      name.includes('webcam') || name.includes('microphone') || name.includes('mic') ||
      name.includes('tablet') || name.includes('ipad') || name.includes('case') ||
      name.includes('cover') || name.includes('skin') || name.includes('sticker') ||
      name.includes('decals') || name.includes('decoration') || name.includes('art') ||
      name.includes('poster') || name.includes('print') || name.includes('canvas') ||
      name.includes('frame') || name.includes('picture') || name.includes('photo') ||
      name.includes('wall') || name.includes('hanging') || name.includes('display') ||
      name.includes('blanket') || name.includes('towel') || name.includes('bedding') ||
      name.includes('home') || name.includes('decor') || name.includes('dyson') ||
      name.includes('hair') || name.includes('dryer') || name.includes('sonic') ||
      name.includes('supersonic') || name.includes('straightener') || name.includes('curler') ||
      name.includes('flat iron') || name.includes('blow dryer') || name.includes('hair dryer') ||
      name.includes('bugatti') || name.includes('veyron') || name.includes('ferrari') ||
      name.includes('lamborghini') || name.includes('porsche') || name.includes('mclaren') ||
      name.includes('toy') || name.includes('toy car') || name.includes('model car') ||
      name.includes('diecast') || name.includes('die cast') || name.includes('scale model') ||
      name.includes('sculpture') || name.includes('art') || name.includes('statue') ||
      name.includes('figurine') || name.includes('mini') || name.includes('balloon') ||
      name.includes('dog') || name.includes('cat') || name.includes('animal')) {
    return 'accessories'
  }
  
  // Check for clothing in name (second priority)
  if (name.includes('hoodie') || name.includes('shirt') || name.includes('pants') || 
      name.includes('shorts') || name.includes('jacket') || name.includes('jeans') ||
      name.includes('trousers') || name.includes('sock') || name.includes('socks') ||
      name.includes('jersey') || name.includes('top') || name.includes('sweater') || 
      name.includes('coat') || name.includes('dress') || name.includes('skirt') || 
      name.includes('blouse') || name.includes('tank') || name.includes('tee') || 
      name.includes('t-shirt') || name.includes('polo') || name.includes('rugby') || 
      name.includes('uniform') || name.includes('sweatshirt') || name.includes('pullover') || 
      name.includes('cardigan') || name.includes('puffer') || name.includes('windbreaker') ||
      name.includes('vest') || name.includes('blazer') || name.includes('bomber') ||
      name.includes('denim') || name.includes('cargo') || name.includes('track') ||
      name.includes('sweatpants') || name.includes('leggings') || name.includes('overalls') ||
      name.includes('romper') || name.includes('jumpsuit') || name.includes('bodysuit') ||
      name.includes('crop') || name.includes('tunic') || name.includes('blouse') ||
      name.includes('cardigan') || name.includes('poncho') || name.includes('cape') ||
      name.includes('kimono') || name.includes('robe') || name.includes('nightgown') ||
      name.includes('pajamas') || name.includes('lingerie') || name.includes('underwear') ||
      name.includes('bra') || name.includes('briefs') || name.includes('boxers') ||
      name.includes('undershirt') || name.includes('camisole') || name.includes('tankini') ||
      name.includes('bikini') || name.includes('swimsuit') || name.includes('trunks') ||
      name.includes('board') || name.includes('shorts') || name.includes('tank') ||
      name.includes('tee') || name.includes('t-shirt') || name.includes('polo') ||
      name.includes('rugby') || name.includes('uniform') || name.includes('sweatshirt') ||
      name.includes('pullover') || name.includes('cardigan')) {
    return 'clothes'
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
 * Get ring sizes (numeric)
 * @returns {Array} - Array of ring sizes
 */
function getRingSizes() {
  return ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
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
    'clothes': '👕 Clothes (S, M, L, XL)',
    'shoes': '👟 Shoes (3.5-11)',
    'accessories': '🎒 Accessories (No sizes)'
  }
  
  return typeMap[productType] || '📦 Product'
}
