import React from 'react';
import { Star, ShoppingCart, Eye, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();

  const isLowStock = product.stock <= 3 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      {/* Featured / Sale Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {product.featured === 1 && (
          <span className="badge badge-primary">HOT</span>
        )}
        {product.oldPrice && (
          <span className="badge badge-rose">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Image Preview */}
      <div className="product-img-wrapper" onClick={() => onSelectProduct(product)}>
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title" onClick={() => onSelectProduct(product)}>
          {product.name}
        </h3>

        {/* Rating & Review info */}
        <div className="product-rating">
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 700, color: '#ffffff' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginLeft: '4px' }}>
            • <MessageSquare size={12} style={{ display: 'inline', margin: '0 2px' }} /> Chi tiết
          </span>
        </div>

        {/* Stock warning */}
        {isLowStock && (
          <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600, marginBottom: '8px' }}>
            🔥 Chỉ còn {product.stock} sản phẩm!
          </span>
        )}
        {isOutOfStock && (
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, marginBottom: '8px' }}>
            ❌ Tạm hết hàng
          </span>
        )}

        {/* Price Row */}
        <div className="product-price-row">
          <span className="price-current">${product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="price-old">${product.oldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.85rem' }}
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingCart size={16} />
            <span>{isOutOfStock ? 'Hết hàng' : 'Thêm giỏ hàng'}</span>
          </button>
          <button
            className="btn btn-secondary"
            title="Xem chi tiết & Đánh giá"
            onClick={() => onSelectProduct(product)}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
