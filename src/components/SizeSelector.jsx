import React from 'react';

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function SizeSelector({ product, selectedSize, onSelectSize }) {
  if (!product || !product.sizes) return null;

  return (
    <div className="size-selector-wrapper">
      <div className="size-picker">
        {STANDARD_SIZES.map((size) => {
          const variant = product.sizes.find((v) => v.size === size);
          const isOutOfStock = !variant || variant.stock <= 0;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              title={isOutOfStock ? `${size} (Out of stock)` : `${size} (${variant?.stock} in stock)`}
              className={`size-btn ${isSelected ? 'selected' : ''}`}
            >
              <span>{size}</span>
              {variant && variant.stock > 0 && variant.stock <= 5 && (
                <span className="size-stock-tag" style={{ color: 'var(--accent-crimson)', fontSize: '0.65rem' }}>
                  ({variant.stock})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
