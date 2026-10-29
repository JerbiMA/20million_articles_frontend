// Utilitaires de formatage de prix et monnaie tunisienne (DT)
export const formatPrice = (product) => {
  if (!product) return { hasDiscount: false, current: '0 DT' };
  
  const price = Number(product.price) || 0;
  const salePrice = product.salePrice != null ? Number(product.salePrice) : null;

  if (salePrice !== null && salePrice < price) {
    const discountPercent = Math.round(((price - salePrice) / price) * 100);
    return {
      hasDiscount: true,
      current: `${salePrice} DT`,
      original: `${price} DT`,
      currentNum: salePrice,
      originalNum: price,
      save: `-${discountPercent}%`,
    };
  }

  return {
    hasDiscount: false,
    current: `${price} DT`,
    currentNum: price,
    originalNum: price,
  };
};

export const formatMoney = (amount) => {
  return `${(Number(amount) || 0).toFixed(2)} DT`;
};

export const getProductImage = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
  if (product.mainImage) return product.mainImage;
  if (product.images && product.images.length > 0) {
    const main = product.images.find(img => img.isMain);
    return main?.url || product.images[0].url;
  }
  return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
};
