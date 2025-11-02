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
    case 'toys':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        showPrice: true,
        sizeLabel: '',
        colorLabel: '',
        isToy: true
      }
    
    case 'tape':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        showPrice: true,
        sizeLabel: '',
        colorLabel: '',
        isToy: false
      }
    
    case 'bags':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        showPrice: true,
        sizeLabel: '',
        colorLabel: '',
        isToy: false
      }
    
    case 'clothes':
      return {
        sizes: getClothingSizes(),
        colors: [],
        showSizes: true,
        showColors: false,
        showPrice: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: '',
        isToy: false
      }
    
    case 'shoes':
      return {
        sizes: getShoeSizes(),
        colors: [],
        showSizes: true,
        showColors: false,
        showPrice: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: '',
        isToy: false
      }
    
    case 'rings':
      return {
        sizes: getRingSizes(),
        colors: [],
        showSizes: true,
        showColors: false,
        showPrice: true,
        sizeLabel: 'Available Sizes:',
        colorLabel: '',
        isToy: false
      }
    
    case 'pillows':
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        showPrice: true,
        sizeLabel: '',
        colorLabel: '',
        isToy: false
      }
    
    case 'accessories':
      // Special case: Check if product name suggests it might be clothing despite being in accessories category
      // This handles cases like t-shirts incorrectly categorized as accessories
      if (name.includes('shirt') || name.includes('t-shirt') || name.includes('tee') ||
          name.includes('hoodie') || name.includes('jersey') || name.includes('sweater') ||
          name.includes('pants') || name.includes('shorts') || name.includes('jacket') ||
          name.includes('tank') || name.includes('polo') || name.includes('sweatshirt') ||
          name.includes('pullover') || name.includes('cardigan') || name.includes('fleece') ||
          name.includes('beanie') || name.includes('beanies') || name.includes('cap') ||
          name.includes('hat') || name.includes('kit') || name.includes('uniform') ||
          name.includes('crewneck') || name.includes('monaco') ||
          // Check if name contains clothing-related brand names that might indicate clothing
          (name.includes('cny') && (name.includes('99') || name.includes('15'))) ||
          // If it's clearly a price string but product appears to be clothing, show sizes
          (name.includes('$') && name.includes('15'))) {
        return {
          sizes: getClothingSizes(),
          colors: [],
          showSizes: true,
          showColors: false,
          showPrice: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: '',
          isToy: false
        }
      }
      return {
        sizes: [],
        colors: [],
        showSizes: false,
        showColors: false,
        showPrice: true,
        sizeLabel: '',
        colorLabel: '',
        isToy: false
      }
    
    default:
      // FIRST: Check for glasses/eyewear - must show only price
      if (name.includes('glasses') || name.includes('sunglass') || name.includes('sunglasses') ||
          name.includes('eyewear') || name.includes('spectacle') || name.includes('spectacles')) {
        return {
          sizes: [],
          colors: [],
          showSizes: false,
          showColors: false,
          showPrice: true,
          sizeLabel: '',
          colorLabel: '',
          isToy: false
        }
      }
      
      // SECOND: Check for Murakami accessories (jewelry, pendants, etc.) - must show only price
      if (name.includes('murakami') || 
          (name.includes('ice') && (name.includes('murakami') || name.includes('pendant') || 
           name.includes('jewelry') || name.includes('diamond') || name.includes('chain') || 
           name.includes('necklace')))) {
        return {
          sizes: [],
          colors: [],
          showSizes: false,
          showColors: false,
          showPrice: true,
          sizeLabel: '',
          colorLabel: '',
          isToy: false
        }
      }
      
      // Check if name suggests it's clothing or shoe item
      // Check CLOTHING FIRST (more specific keywords should take priority)
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
          name.includes('fleece') || name.includes('baggy') || name.includes('beanie') ||
          name.includes('beanies') || name.includes('cap') || name.includes('caps') ||
          name.includes('hat') || name.includes('hats') || name.includes('crewneck') ||
          name.includes('crewnecks') || name.includes('kit') || name.includes('kits') ||
          name.includes('football kit') || name.includes('longsleeve') || name.includes('long sleeve') ||
          name.includes('zip') || (name.includes('golf') && !name.includes('golf bag') &&
           !name.includes('golf bags') && !name.includes('golf ball') && !name.includes('golf shoe')) ||
          (name.includes('top') && !name.includes('drop top') && !name.includes('high top') &&
           !name.includes('high tops') && !name.includes('low top') && !name.includes('low tops'))) {
        // Default to clothing sizes for clothing-related names
        return {
          sizes: getClothingSizes(),
          colors: [],
          showSizes: true,
          showColors: false,
          showPrice: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: '',
          isToy: false
        }
      } else if ((name.includes('shoe') || name.includes('sneaker') || name.includes('jordan') || 
          name.includes('dunk') || name.includes('air force') || name.includes('slide') ||
          name.includes('boot') || name.includes('sandal') || name.includes('loafer') ||
          name.includes('heel') || name.includes('trainer') || name.includes('runner') ||
          name.includes('jogger') || name.includes('slipper') || name.includes('slippers') ||
          name.includes('af1') || name.includes('af1s') || name.includes('air max') ||
          name.includes('air force 1') || name.includes('air force one') ||
          name.includes('retro') || name.includes('low') || name.includes('high') ||
          name.includes('mid') || name.includes('og') || name.includes('se') ||
          name.includes('premium') || name.includes('luxury') || name.includes('limited') ||
          (name.includes('nike') || name.includes('adidas') || name.includes('puma') ||
          name.includes('converse') || name.includes('vans') || name.includes('yeezy'))) &&
          !name.includes('hoodie') && !name.includes('shirt') && !name.includes('pants') &&
          !name.includes('jacket') && !name.includes('trousers') && !name.includes('jersey')) {
        // Default to shoe sizes for shoe-related names (but exclude if it's clearly clothing)
        return {
          sizes: getShoeSizes(),
          colors: [],
          showSizes: true,
          showColors: false,
          showPrice: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: '',
          isToy: false
        }
      } else {
        // Default to shoe sizes if category is unclear (most products are shoes)
        return {
          sizes: getShoeSizes(),
          colors: [],
          showSizes: true,
          showColors: false,
          showPrice: true,
          sizeLabel: 'Available Sizes:',
          colorLabel: '',
          isToy: false
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
  // ABSOLUTE FIRST: Check for glasses/eyewear as accessories (must be before everything else)
  // This ensures "STAR DRIVER GLASSES" is detected as accessory, showing only price
  if (name.includes('glasses') || name.includes('sunglass') || name.includes('sunglasses') ||
      name.includes('eyewear') || name.includes('spectacle') || name.includes('spectacles') ||
      name.includes('reading glass') || name.includes('prescription glass')) {
    return 'accessories'
  }
  
  // ABSOLUTE SECOND: Check for Murakami accessories (jewelry, pendants with "ice", etc.) - must show only price
  // This ensures "ROTATING MURAKAMI ICE" is detected as accessory, showing only price
  if (name.includes('murakami') || 
      (name.includes('ice') && (name.includes('murakami') || name.includes('pendant') || 
       name.includes('jewelry') || name.includes('diamond') || name.includes('chain') || 
       name.includes('necklace')))) {
    return 'tape'
  }
  
  // ABSOLUTE THIRD: Check for perfume/fragrance products - must show only price
  // This ensures "MAISON MARGIELA" (perfume) is detected as accessory, showing only price
  // Must happen before shoe detection so perfume products aren't misclassified as shoes
  if (name.includes('perfume') || name.includes('fragrance') || name.includes('cologne') ||
      name.includes('eau de') || name.includes('parfum') || name.includes('bottle') ||
      // Check for "maison" or "margiela" alone (perfume products) but exclude clothing/shoes
      ((name.includes('maison') || name.includes('margiela')) && 
       !name.includes('hoodie') && !name.includes('hoodies') && !name.includes('jacket') &&
       !name.includes('pants') && !name.includes('shirt') && !name.includes('sweater') &&
       !name.includes('gats') && !name.includes('gat') && !name.includes('tabi') &&
       !name.includes('shoe') && !name.includes('sneaker') && !name.includes('boot')) ||
      (name.includes('replica') && !name.includes('mini') && !name.includes('model') &&
       !name.includes('diecast') && !name.includes('toy'))) {
    // Exclude if it's clearly clothing or shoes
    if (!name.includes('hoodie') && !name.includes('hoodies') && !name.includes('jacket') &&
        !name.includes('pants') && !name.includes('shirt') && !name.includes('sweater') &&
        !name.includes('jersey') && !name.includes('coat') && !name.includes('vest') &&
        !name.includes('gats') && !name.includes('gat') && !name.includes('tabi') &&
        !name.includes('shoe') && !name.includes('sneaker') && !name.includes('boot')) {
      return 'tape'
    }
  }
  
  // ABSOLUTE FOURTH: Check for beanie/scarf sets - these are accessories, not clothing
  // This ensures "POLO RALPH CABLE KNIT BEANIE/SCARF SET" shows only price
  // Must happen before clothing detection so sets aren't misclassified as clothing
  if ((name.includes('beanie') && (name.includes('scarf') || name.includes('set'))) ||
      (name.includes('scarf') && name.includes('set'))) {
    return 'tape'
  }
  
  // ABSOLUTE FIFTH: Check for jewelry and accessory items (necklaces, bracelets, pendants, keychains, phone cases) - must show only price
  // This ensures "CHROME HEARTS NECKLACES", "CHROME HEARTS KEYCHAINS", and "CHROME HEARTS PHONE CASE" show only price, not sizes
  // Must happen BEFORE clothing detection so jewelry/accessories aren't misclassified
  if (name.includes('necklace') || name.includes('necklaces') || 
      name.includes('bracelet') || name.includes('bracelets') ||
      name.includes('keychain') || name.includes('keychains') ||
      (name.includes('phone') && name.includes('case')) ||
      (name.includes('pendant') && !name.includes('pillow') && !name.includes('pillows'))) {
    return 'tape'
  }
  
  // ABSOLUTE SIXTH: Check for pillows - must happen BEFORE clothing detection
  // This ensures "CHROME HEARTS PILLOWS" shows only price, not sizes
  // Must happen before clothing detection so pillows aren't misclassified
  if (name.includes('pillow') || name.includes('pillows') || name.includes('cushion')) {
    return 'pillows'
  }
  
  // ABSOLUTE SEVENTH: Check for rings - must happen BEFORE clothing detection
  // This ensures "CHROME HEARTS RINGS" shows ring sizes, not clothing sizes
  // Rings need specific numeric sizing (5-14), not clothing sizes (S, M, L, XL, XXL)
  if ((name.includes('ring') || name.includes('rings') || name.includes('wedding') ||
       name.includes('engagement') || name.includes('band') || name.includes('bands')) &&
      !name.includes('blanket') && !name.includes('towel') && !name.includes('bedding') &&
      !name.includes('home') && !name.includes('decor') && !name.includes('decoration')) {
    return 'rings'
  }
  
  // ABSOLUTE EIGHTH: Check for clothing keywords BEFORE shoe detection
  // This ensures "MAISON MARGIELA HOODIES" is detected as clothing, not shoes
  // Clothing keywords must take priority over brand names that might be in shoe detection
  if (name.includes('hoodie') || name.includes('hoodies') || name.includes('pants') || 
      name.includes('shorts') || name.includes('jacket') || name.includes('shirt') ||
      name.includes('jeans') || name.includes('trousers') || name.includes('sweater') ||
      name.includes('jersey') || name.includes('sweatshirt') || name.includes('pullover') ||
      name.includes('cardigan') || name.includes('coat') || name.includes('vest') ||
      name.includes('t-shirt') || name.includes('tank') || name.includes('tee') ||
      name.includes('polo') || name.includes('sweatpants') || name.includes('leggings') ||
      name.includes('fleece') || name.includes('baggy')) {
    // If it's clearly clothing, return 'clothes' immediately (before shoe detection can override)
    return 'clothes'
  }
  
  // ABSOLUTE FOURTH: Check for shoe-specific terms BEFORE category checks
  // This ensures "LV LOUIS VUITTON SLIDES" is detected as shoes even if category is "clothes"
  // Check for "slide"/"slides" FIRST - these are ALWAYS shoes (unless it's clearly something else)
  if ((name.includes('slide') || name.includes('slides')) &&
      !name.includes('powerpoint') && !name.includes('presentation') && 
      !name.includes('water slide') && !name.includes('playground')) {
    return 'shoes'
  }
  
  // Check for other shoe keywords (sneaker, shoe, etc.) - must be before category checks
  if (name.includes('sneaker') || name.includes('sneakers') || name.includes('shoe') || name.includes('shoes') ||
      name.includes('boot') || name.includes('trainer') || name.includes('sandal') ||
      name.includes('high top') || name.includes('high tops') || name.includes('hightop') ||
      name.includes('hightops') || name.includes('low top') || name.includes('low tops') ||
      name.includes('lowtop') || name.includes('lowtops') || name.includes('shox') ||
      name.includes('tn') || name.includes('tns') || name.includes('bapesta') || name.includes('bapestas') ||
      name.includes('onitsuka') || name.includes('mexicos') || name.includes('dunk') ||
      name.includes('jordan') || name.includes('gats') || name.includes('gat') || name.includes('tabi') ||
      name.includes('margiela') || name.includes('mm') ||
      (name.includes('balenciaga') && (name.includes('sneaker') || name.includes('shoe') || 
       name.includes('boot') || name.includes('trainer'))) ||
      (name.includes('tops') && (name.includes('rick owens') || name.includes('shoe') || 
       name.includes('sneaker') || name.includes('dunk') || name.includes('jordan')))) {
    // Exclude if it contains clothing keywords (hoodie, pants, jacket, shirt, etc.)
    if (!name.includes('hoodie') && !name.includes('pants') && !name.includes('jacket') &&
        !name.includes('shirt') && !name.includes('sweater') && !name.includes('jersey') &&
        !name.includes('sweatshirt') && !name.includes('pullover') && !name.includes('cardigan') &&
        !name.includes('coat') && !name.includes('vest') && !name.includes('t-shirt') &&
        !name.includes('tank') && !name.includes('tee') && !name.includes('polo')) {
      // But exclude if it's clearly clothing (like "drop top" for cars or other contexts)
      if (!name.includes('drop top') && !name.includes('tank top') && !name.includes('crop top') &&
          !name.includes('tube top') && !name.includes('halter top')) {
        return 'shoes'
      }
    }
  }
  
  // PRIORITY CHECK: If category is explicitly "clothes", return 'clothes' immediately
  // BUT ONLY if it's not clearly a shoe product, bag, ring, jewelry, or pillow (already checked above)
  // This ensures products in clothes category show clothing sizes even if name doesn't match keywords
  if (category === 'clothes') {
    // Double-check: if name has pillow keywords, it's still a pillow
    if (name.includes('pillow') || name.includes('pillows') || name.includes('cushion')) {
      return 'pillows'
    }
    // Double-check: if name has jewelry/accessory keywords (necklace, bracelet, pendant, keychain, phone case), it's still an accessory
    if (name.includes('necklace') || name.includes('necklaces') || 
        name.includes('bracelet') || name.includes('bracelets') ||
        name.includes('keychain') || name.includes('keychains') ||
        (name.includes('phone') && name.includes('case')) ||
        (name.includes('pendant') && !name.includes('pillow') && !name.includes('pillows'))) {
      return 'tape'
    }
    // Double-check: if name has ring keywords, it's still a ring
    if ((name.includes('ring') || name.includes('rings') || name.includes('wedding') ||
         name.includes('engagement') || name.includes('band') || name.includes('bands')) &&
        !name.includes('pillow') && !name.includes('pillows') && !name.includes('cushion') &&
        !name.includes('blanket') && !name.includes('towel') && !name.includes('bedding')) {
      return 'rings'
    }
    // Double-check: if name has bag keywords, it's still a bag
    if (name.includes('bag') || name.includes('bags') || name.includes('duffel') || name.includes('duffle') ||
        name.includes('backpack') || name.includes('tote') || name.includes('messenger') ||
        name.includes('shoulder bag') || name.includes('crossbody') || name.includes('satchel') ||
        name.includes('weekender') || name.includes('gym bag') || name.includes('travel bag') ||
        name.includes('bucket bag') || name.includes('handbag') || name.includes('purse')) {
      return 'bags'
    }
    // Double-check: if name has shoe keywords, it's still a shoe
    if (name.includes('slide') || name.includes('slides') || name.includes('sneaker') ||
        name.includes('sneakers') || name.includes('shoe') || name.includes('shoes') ||
        name.includes('boot') || name.includes('trainer') || name.includes('sandal') ||
        name.includes('loafer') || name.includes('high top') || name.includes('high tops') ||
        name.includes('low top') || name.includes('low tops') || name.includes('dunk') ||
        name.includes('jordan') || name.includes('shox') || name.includes('tn') ||
        name.includes('tns') || name.includes('bapesta') || name.includes('bapestas') ||
        name.includes('gats') || name.includes('gat') || name.includes('tabi') ||
        name.includes('margiela') || name.includes('mm')) {
      return 'shoes'
    }
    return 'clothes'
  }
  
  // BUT exclude if it contains clothing keywords (like "hoodie", "pants", "jacket", etc.)
  if ((name.includes('sneaker') || name.includes('sneakers') || name.includes('shoe') || name.includes('shoes') ||
      name.includes('high top') || name.includes('high tops') || name.includes('hightop') ||
      name.includes('hightops') || name.includes('low top') || name.includes('low tops') ||
      name.includes('lowtop') || name.includes('lowtops') || name.includes('shox') ||
      name.includes('tn') || name.includes('tns') || name.includes('bapesta') || name.includes('bapestas') ||
      name.includes('onitsuka') || name.includes('mexicos') ||
      (name.includes('balenciaga') && (name.includes('sneaker') || name.includes('shoe') || 
       name.includes('boot') || name.includes('trainer'))) ||
      name.includes('boot') || name.includes('trainer') || name.includes('dunk') || name.includes('jordan') ||
      (name.includes('tops') && (name.includes('rick owens') || name.includes('shoe') || 
       name.includes('sneaker') || name.includes('dunk') || name.includes('jordan')))) &&
      // Exclude if it contains clothing keywords (hoodie, pants, jacket, shirt, etc.)
      !name.includes('hoodie') && !name.includes('pants') && !name.includes('jacket') &&
      !name.includes('shirt') && !name.includes('sweater') && !name.includes('jersey') &&
      !name.includes('sweatshirt') && !name.includes('pullover') && !name.includes('cardigan') &&
      !name.includes('coat') && !name.includes('vest') && !name.includes('t-shirt') &&
      !name.includes('tank') && !name.includes('tee') && !name.includes('polo')) {
    // But exclude if it's clearly clothing (like "drop top" for cars or other contexts)
    if (!name.includes('drop top') && !name.includes('tank top') && !name.includes('crop top') &&
        !name.includes('tube top') && !name.includes('halter top')) {
      return 'shoes'
    }
  }
  
  // ABSOLUTE SECOND: Check for luxury car brands as toys (must be before clothing check)
  // This ensures "DROP TOP LAMBORGHINI HURACAN" is detected as toy, not clothing
  if (name.includes('lamborghini') || name.includes('ferrari') || name.includes('bugatti') ||
      name.includes('porsche') || name.includes('mclaren') || name.includes('huracan') ||
      name.includes('aventador') || name.includes('urus') || name.includes('gallardo')) {
    return 'toys'
  }
  
  // Check for putter/accessories that should only show price (must be before clothing check with "golf")
  if (name.includes('putter') || name.includes('putters')) {
    return 'tape'
  }
  
  // Check for golf bags that should only show price (must be before clothing check with "golf")
  if (name.includes('golf bag') || name.includes('golf bags')) {
    return 'tape'
  }
  
  // Check for golf balls that should only show price (must be before clothing check with "golf")
  if (name.includes('golf ball') || name.includes('golf balls')) {
    return 'tape'
  }
  
  // Check for golf shoes that should show shoe sizes (must be before clothing check with "golf")
  if (name.includes('golf shoe') || name.includes('golf shoes')) {
    return 'shoes'
  }
  
  // Check for toys FIRST (highest priority)
  // Toys should not show colors or prices
  // Detect luxury car brands directly as toys (even without "car" keyword)
  if (name.includes('toy') || name.includes('blimp') || name.includes('balloon') ||
      name.includes('action figure') || name.includes('figurine') || name.includes('doll') ||
      name.includes('miniature') || name.includes('model car') || name.includes('die cast') ||
      name.includes('diecast') || name.includes('plush') || name.includes('stuffed') ||
      name.includes('collectible') || name.includes('sculpture') && (name.includes('toy') || 
      name.includes('mini') || name.includes('replica')) ||
      // Detect other cars as toys if 'car' keyword is present
      (name.includes('car') && (name.includes('sports car') || name.includes('toy') || 
      name.includes('model') || name.includes('diecast') || name.includes('miniature') || 
      name.includes('replica')))) {
    return 'toys'
  }
  
  // ABSOLUTE SECOND: Check for clothing keywords (but exclude if it contains luxury car brands)
  // This ensures items like "BAGGY ADIDAS PANTS" are ALWAYS detected as clothing
  // BUT exclude "top" if it's part of car-related terms like "drop top"
  // IMPORTANT: Exclude shoe-related terms and bags from clothing detection
  if ((name.includes('pants') || name.includes('shorts') || name.includes('trousers') ||
      name.includes('jacket') || name.includes('hoodie') || name.includes('shirt') ||
      name.includes('jeans') || name.includes('sweatpants') || name.includes('leggings') ||
      name.includes('baggy') || name.includes('fleece') || name.includes('sweater') ||
      name.includes('jersey') || name.includes('vest') ||
      name.includes('sweatshirt') || name.includes('pullover') || name.includes('cardigan') ||
      name.includes('coat') || name.includes('dress') || name.includes('skirt') ||
      name.includes('blouse') || name.includes('tank') || name.includes('tee') ||
      name.includes('t-shirt') || name.includes('polo') || name.includes('rugby') ||
      name.includes('uniform') || name.includes('sock') || name.includes('socks') ||
      name.includes('beanie') || name.includes('beanies') || name.includes('cap') || name.includes('caps') ||
      name.includes('hat') || name.includes('hats') || name.includes('beanie hat') ||
      name.includes('crewneck') || name.includes('crewnecks') ||
      name.includes('kit') || name.includes('kits') || name.includes('football kit') ||
      name.includes('longsleeve') || name.includes('long sleeve') || name.includes('zip') ||
      // Check for "cargo" but exclude if it's "cargo sneaker(s)" or other shoe-related terms
      (name.includes('cargo') && !name.includes('sneaker') && !name.includes('shoe') && 
       !name.includes('boot') && !name.includes('trainer')) ||
      // Check for "golf" but exclude if it's "golf bag", "golf bags", "golf ball(s)", or "golf shoe(s)" (already handled above)
      (name.includes('golf') && !name.includes('golf bag') && !name.includes('golf bags') &&
       !name.includes('golf ball') && !name.includes('golf shoe')) ||
      // Check for "top" but exclude if it's "drop top" (car-related)
      (name.includes('top') && !name.includes('drop top') && !name.includes('high top') && 
       !name.includes('high tops') && !name.includes('low top') && !name.includes('low tops'))) &&
      // Exclude if it contains shoe-related terms (sneaker, shoe, boot, etc.)
      !name.includes('sneaker') && !name.includes('shoe') && !name.includes('boot') &&
      !name.includes('trainer') && !name.includes('runner') && !name.includes('sandal') &&
      // Exclude bags from clothing detection (check for actual bag products, not "baggy")
      // Note: We can't use !name.includes('bag') because it would exclude "baggy" clothing items
      // Instead, check for specific bag-related terms that indicate actual bag products
      !name.includes('bucket bag') && !name.includes('handbag') && !name.includes('purse') &&
      !name.includes('duffel') && !name.includes('duffle') && !name.includes('backpack') &&
      !name.includes('tote bag') && !name.includes('messenger bag') &&
      !name.includes('shoulder bag') && !name.includes('crossbody') && !name.includes('satchel') &&
      !name.includes('weekender') && !name.includes('gym bag') && !name.includes('travel bag') &&
      // Check for standalone "bag" or "bags" but only if it's not part of "baggy"
      (!name.includes(' bag') && !name.includes(' bags') && !name.includes('bag ') && !name.includes('bags ') ||
       name.includes('baggy')) &&
      // Exclude if it contains luxury car brands (already checked above)
      !name.includes('lamborghini') && !name.includes('ferrari') && !name.includes('bugatti') &&
      !name.includes('porsche') && !name.includes('mclaren')) {
    return 'clothes'
  }
  
  // Check for tape and similar items SECOND (should only show price, no sizes/colors)
  // Also check for Murakami accessories (jewelry, pendants with "ice", etc.)
  // Check for beanie/scarf sets - these are accessories, not clothing (should show only price)
  if (name.includes('tape') || name.includes('adhesive') || name.includes('duct tape') ||
      name.includes('masking tape') || name.includes('packing tape') || name.includes('scotch tape') ||
      name.includes('mat') || name.includes('mats') || name.includes('mousepad') || name.includes('mouse pad') ||
      name.includes('vase') || name.includes('skateboard') || name.includes('skate board') ||
      name.includes('ski goggle') || name.includes('goggles') && !name.includes('eyewear') ||
      name.includes('decal') || name.includes('decals') || name.includes('sticker') || name.includes('stickers') ||
      name.includes('command center') || name.includes('command centre') || name.includes('control center') ||
      name.includes('control centre') || name.includes('aircraft carrier') || name.includes('airport') ||
      name.includes('rug') || name.includes('rugs') || name.includes('necklace') || name.includes('necklaces') ||
      name.includes('pendant') || name.includes('pendants') || name.includes('bracelet') || name.includes('bracelets') ||
      name.includes('keychain') || name.includes('keychains') ||
      (name.includes('phone') && name.includes('case')) ||
      name.includes('putter') || name.includes('putters') || name.includes('belt') || name.includes('belts') ||
      name.includes('wallet') || name.includes('wallets') || name.includes('visor') || name.includes('visors') ||
      name.includes('clock') || name.includes('clocks') || name.includes('scarf') || name.includes('scarves') ||
      // Check for beanie/scarf sets or beanies as accessories (not standalone clothing)
      (name.includes('beanie') && (name.includes('scarf') || name.includes('set') || name.includes('accessory'))) ||
      name.includes('murakami') || 
      (name.includes('ice') && (name.includes('murakami') || name.includes('pendant') || 
       name.includes('jewelry') || name.includes('diamond') || name.includes('chain') || 
       name.includes('necklace')))) {
    return 'tape'
  }
  
  // Check for bags THIRD (should only show price, no sizes)
  // This must happen before clothing detection to prevent bags from being misclassified
  // Check for bags BEFORE clothing check to ensure "LOUIS VUITTON BUCKET BAG" is detected correctly
  if (name.includes('bag') || name.includes('bags') || name.includes('duffel') || name.includes('duffle') ||
      name.includes('backpack') || name.includes('tote') || name.includes('messenger') ||
      name.includes('shoulder bag') || name.includes('crossbody') || name.includes('satchel') ||
      name.includes('weekender') || name.includes('gym bag') || name.includes('travel bag') ||
      name.includes('bucket bag') || name.includes('handbag') || name.includes('purse')) {
    // Exclude golf bags (already handled earlier to show only price)
    if (!name.includes('golf bag') && !name.includes('golf bags')) {
      return 'bags'
    }
  }
  
  // Check for rings THIRD (high priority for jewelry sizing)
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
  
  // PRIORITY CHECK: Check for shoe keywords BEFORE clothing (shoe-specific terms take precedence)
  // This ensures items like "RICK OWENS HIGH TOPS" are detected as shoes, not clothing
  if (name.includes('high top') || name.includes('high tops') || name.includes('hightop') ||
      name.includes('hightops') || name.includes('low top') || name.includes('low tops') ||
      name.includes('lowtop') || name.includes('lowtops')) {
    // But exclude if it's clearly clothing (like "drop top" for cars or other contexts)
    if (!name.includes('drop top') && !name.includes('tank top') && !name.includes('crop top') &&
        !name.includes('tube top') && !name.includes('halter top')) {
      return 'shoes'
    }
  }
  
  // Check for clothing in name (clothing keywords are more specific)
  // This ensures items like "NIKE X CAVEMPT VINTAGE JACKET" are detected as clothing, not shoes
  // Clothing detection has HIGH priority - but shoe-specific terms come first
  if (name.includes('hoodie') || name.includes('shirt') || name.includes('pants') || 
      name.includes('shorts') || name.includes('jacket') || name.includes('jeans') ||
      name.includes('trousers') || name.includes('sock') || name.includes('socks') ||
      name.includes('jersey') || (name.includes('top') && !name.includes('high top') && 
      !name.includes('high tops') && !name.includes('hightop') && !name.includes('hightops')) ||
      name.includes('sweater') || 
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
      name.includes('poncho') || name.includes('cape') ||
      name.includes('kimono') || name.includes('robe') || name.includes('nightgown') ||
      name.includes('pajamas') || name.includes('lingerie') || name.includes('underwear') ||
      name.includes('bra') || name.includes('briefs') || name.includes('boxers') ||
      name.includes('undershirt') || name.includes('camisole') || name.includes('tankini') ||
      name.includes('bikini') || name.includes('swimsuit') || name.includes('trunks') ||
      name.includes('fleece') || name.includes('baggy')) {
    return 'clothes'
  }
  
  // Check for shoes (after clothing check to avoid conflicts)
  // Exclude audio/tech products and CLOTHING items from shoe detection
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
      name.includes('balenciaga') || name.includes('yeezy') || name.includes('boost') || name.includes('ultra') ||
      name.includes('max') || name.includes('air') || name.includes('force') ||
      name.includes('af1') || name.includes('af1s') || name.includes('air max') ||
      name.includes('air force 1') || name.includes('air force one') ||
      name.includes('retro') || (name.includes('low') && !name.includes('low top') && 
      !name.includes('low tops') && !name.includes('lowtop') && !name.includes('lowtops')) ||
      (name.includes('high') && !name.includes('high top') && !name.includes('high tops') &&
       !name.includes('hightop') && !name.includes('hightops')) ||
      name.includes('mid') || name.includes('og') || name.includes('se') ||
      name.includes('premium') || name.includes('luxury') || name.includes('limited') ||
      name.includes('gats') || name.includes('gat') || name.includes('tabi') ||
      name.includes('mm') || name.includes('margiela') || name.includes('rick owens') ||
      name.includes('shox') || name.includes('tn') || name.includes('tns') ||
      name.includes('bapesta') || name.includes('bapestas') || name.includes('onitsuka') ||
      name.includes('tiger') || name.includes('mexicos') ||
      (name.includes('tops') && !name.includes('top') || name.includes('high tops') || 
       name.includes('low tops'))) &&
      !name.includes('airpod') && !name.includes('airpods') && !name.includes('airpords') &&
      !name.includes('headphone') && !name.includes('headphones') && !name.includes('speaker') &&
      !name.includes('charger') && !name.includes('cable') && !name.includes('phone') &&
      !name.includes('apple') && !name.includes('sony') && !name.includes('bose') &&
      !name.includes('sennheiser') && !name.includes('dyson') && !name.includes('hair') &&
      !name.includes('dryer') && !name.includes('sonic') && !name.includes('supersonic') &&
      !name.includes('bugatti') && !name.includes('veyron') && !name.includes('ferrari') &&
      !name.includes('lamborghini') && !name.includes('porsche') && !name.includes('mclaren') &&
      !name.includes('art') && !name.includes('statue') &&
      (!name.includes('dog') || name.includes('dunk') || name.includes('shoe') || name.includes('sneaker')) &&
      !name.includes('cat') && !name.includes('animal') &&
      !name.includes('goggle') && !name.includes('goggles') && !name.includes('eyewear') &&
      !name.includes('toy') && !name.includes('blimp') && !name.includes('balloon') &&
      !name.includes('figurine') && !name.includes('doll') && !name.includes('plush') &&
      !name.includes('tape') && !name.includes('mat') && !name.includes('mats') &&
      !name.includes('vase') && !name.includes('skateboard') &&
      // Exclude clothing items from shoe detection
      !name.includes('hoodie') && !name.includes('shirt') && !name.includes('pants') &&
      !name.includes('shorts') && !name.includes('jacket') && !name.includes('jeans') &&
      !name.includes('trousers') && !name.includes('jersey') && !name.includes('top') &&
      !name.includes('sweater') && !name.includes('coat') && !name.includes('dress') &&
      !name.includes('skirt') && !name.includes('blouse') && !name.includes('tank') &&
      !name.includes('tee') && !name.includes('t-shirt') && !name.includes('polo') &&
      !name.includes('rugby') && !name.includes('uniform') && !name.includes('sweatshirt') &&
      !name.includes('pullover') && !name.includes('cardigan') && !name.includes('puffer') &&
      !name.includes('windbreaker') && !name.includes('vest') && !name.includes('blazer') &&
      !name.includes('bomber') && !name.includes('denim') && !name.includes('cargo') &&
      !name.includes('track') && !name.includes('sweatpants') && !name.includes('leggings') &&
      !name.includes('fleece')) {
    return 'shoes'
  }
  
  // Check for accessories in name (fourth priority) - MUST happen before category fallback
  // Glasses, eyewear, and other accessories should always be detected here
  // BUT exclude if it contains shoe keywords (like "dunk", "nike", etc.) - accessories check should not override shoes
  if ((name.includes('cap') || name.includes('hat') ||
      name.includes('purse') || name.includes('wallet') ||
      name.includes('belt') || name.includes('scarf') || name.includes('glove') ||
      name.includes('watch') || name.includes('timepiece') || name.includes('bracelet') ||
      name.includes('necklace') || name.includes('chain') || name.includes('earring') ||
      name.includes('pendant') || name.includes('perfume') ||
      name.includes('cologne') || name.includes('fragrance') || name.includes('airpod') ||
      name.includes('maison') || name.includes('bottle') ||
      name.includes('dior') || name.includes('chanel') || name.includes('tom ford') || name.includes('creed') ||
      name.includes('versace') || name.includes('prada') || name.includes('hermes') ||
      name.includes('ysl') || name.includes('yves saint') || name.includes('lancome') || name.includes('estee') ||
      name.includes('lauder') || name.includes('clinique') || name.includes('mac') || name.includes('urban decay') ||
      name.includes('nars') || name.includes('fenty') || name.includes('rare beauty') || name.includes('glossier') ||
      name.includes('kiehl') || name.includes('origins') || name.includes('fresh') || name.includes('lush') ||
      name.includes('bath') || name.includes('body works') || name.includes('victoria') || name.includes('secret') ||
      name.includes('makeup') || name.includes('cosmetics') || name.includes('beauty') || name.includes('skincare') ||
      name.includes('serum') || name.includes('moisturizer') || name.includes('cleanser') || name.includes('toner') ||
      name.includes('airpods') || name.includes('game') || name.includes('headphone') ||
      name.includes('headphones') || name.includes('speaker') || name.includes('charger') ||
      name.includes('cable') || name.includes('phone') || name.includes('glass') ||
      name.includes('glasses') || name.includes('sunglass') || name.includes('sunglasses') ||
      name.includes('eyewear') || name.includes('spectacle') || name.includes('spectacles') ||
      name.includes('lens') || name.includes('lenses') || name.includes('reading') || 
      name.includes('prescription') || name.includes('mouse') ||
      name.includes('keyboard') || name.includes('laptop') || name.includes('computer') ||
      name.includes('desk') || name.includes('desktop') || name.includes('monitor') ||
      name.includes('webcam') || name.includes('microphone') || name.includes('mic') ||
      name.includes('tablet') || name.includes('ipad') || name.includes('case') ||
      name.includes('cover') || name.includes('skin') || name.includes('sticker') ||
      name.includes('decoration') || name.includes('art') ||
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
      name.includes('statue') || name.includes('dog') || name.includes('cat') || name.includes('animal')) &&
      // Exclude if it's clearly a shoe
      !name.includes('shoe') && !name.includes('sneaker') && !name.includes('dunk') &&
      !name.includes('jordan') && !name.includes('boot') && !name.includes('sandal') &&
      !name.includes('nike') && !name.includes('adidas') && !name.includes('yeezy') &&
      !name.includes('air force') && !name.includes('air max') && category !== 'shoes') {
    return 'accessories'
  }
  
  // IMPORTANT: Clothing check should have already happened above and returned 'clothes'
  // But if somehow we get here, double-check for clothing keywords
  // This is a safety check to ensure clothing items are never misclassified
  if (name.includes('pants') || name.includes('shorts') || name.includes('trousers') ||
      name.includes('jacket') || name.includes('hoodie') || name.includes('shirt') ||
      name.includes('jeans') || name.includes('sweatpants') || name.includes('leggings') ||
      name.includes('baggy') || name.includes('fleece') || name.includes('sweater') ||
      name.includes('jersey') || name.includes('top') || name.includes('vest') ||
      name.includes('sweatshirt') || name.includes('pullover') || name.includes('cardigan')) {
    return 'clothes'
  }
  
  // If category is "shoes", prioritize it over other checks (unless it's clearly clothing)
  // BUT exclude if name contains clothing keywords (like pants, jacket, etc.)
  if (category === 'shoes' && (
      name.includes('shoe') || name.includes('sneaker') || name.includes('dunk') ||
      name.includes('jordan') || name.includes('boot') || name.includes('sandal') ||
      name.includes('nike') || name.includes('adidas') || name.includes('yeezy') ||
      name.includes('air force') || name.includes('air max')) &&
      // Exclude if it's clearly clothing
      !name.includes('pants') && !name.includes('shorts') && !name.includes('trousers') &&
      !name.includes('jacket') && !name.includes('hoodie') && !name.includes('shirt') &&
      !name.includes('sweater') && !name.includes('jersey') && !name.includes('top') &&
      !name.includes('jeans') && !name.includes('sweatpants') && !name.includes('leggings') &&
      !name.includes('baggy')) {
    return 'shoes'
  }
  
  // If category is "accessories", prioritize it (glasses, watches, etc.)
  // BUT exclude if it's clearly a shoe product (like "RICK OWENS HIGH TOPS")
  if (category === 'accessories') {
    // Don't override if we've already detected it as shoes based on product name
    if (name.includes('high top') || name.includes('high tops') || name.includes('hightop') ||
        name.includes('hightops') || name.includes('low top') || name.includes('low tops') ||
        name.includes('lowtop') || name.includes('lowtops') || name.includes('sneaker') ||
        name.includes('shoe') || name.includes('boot') || name.includes('sandal') ||
        name.includes('loafer') || name.includes('rick owens') || name.includes('shox') ||
        name.includes('tn') || name.includes('tns') || name.includes('bapesta') || name.includes('bapestas') ||
        name.includes('onitsuka') || name.includes('mexicos') || name.includes('slide') ||
        name.includes('slides') ||
        (name.includes('tops') && (name.includes('rick owens') || name.includes('shoe') || 
         name.includes('sneaker') || name.includes('dunk') || name.includes('jordan')))) {
      return 'shoes'
    }
    return 'accessories'
  }
  
  // If category is "clothes", prioritize it BUT exclude if it's clearly a shoe product
  if (category === 'clothes') {
    // Don't override if we've already detected it as shoes based on product name
    // This handles cases like "LV LOUIS VUITTON SLIDES" which is miscategorized as clothes
    if (name.includes('slide') || name.includes('slides') || name.includes('sneaker') ||
        name.includes('sneakers') || name.includes('shoe') || name.includes('shoes') ||
        name.includes('boot') || name.includes('trainer') || name.includes('sandal') ||
        name.includes('loafer') || name.includes('high top') || name.includes('high tops') ||
        name.includes('low top') || name.includes('low tops') || name.includes('dunk') ||
        name.includes('jordan') || name.includes('shox') || name.includes('tn') ||
        name.includes('tns') || name.includes('bapesta') || name.includes('bapestas')) {
      return 'shoes'
    }
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
  return ['S', 'M', 'L', 'XL', 'XXL']
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
    'clothes': '👕 Clothes (S, M, L, XL, XXL)',
    'shoes': '👟 Shoes (3.5-11)',
    'accessories': '🎒 Accessories (No sizes)'
  }
  
  return typeMap[productType] || '📦 Product'
}
