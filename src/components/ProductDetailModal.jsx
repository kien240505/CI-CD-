import React, { useEffect, useState } from 'react';
import { X, Star, ShoppingCart, Check, ShieldAlert, Cpu } from 'lucide-react';
import { fetchProductDetail } from '../services/api';
import { useCart } from '../context/CartContext';
import { ReviewList } from './ReviewList';

export const ProductDetailModal = ({ product, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!product?.id) return;
    setLoading(true);
    fetchProductDetail(product.id)
      .then(data => setDetail(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [product?.id]);

  if (!product) return null;

  const currentProduct = detail || product;
  const isOutOfStock = currentProduct.stock === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Đang tải thông tin chi tiết sản phẩm...
          </div>
        ) : (
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
              {/* Product Image */}
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#1e293b' }}>
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                />
              </div>

              {/* Product Quick Info */}
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
                  {currentProduct.category}
                </span>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '12px', lineHeight: 1.3 }}>
                  {currentProduct.name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        fill={s <= currentProduct.rating ? '#f59e0b' : 'none'}
                        color={s <= currentProduct.rating ? '#f59e0b' : '#4b5563'}
                      />
                    ))}
                  </div>
                  <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>{currentProduct.rating}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                    ${currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.oldPrice && (
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      ${currentProduct.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {currentProduct.description}
                </p>

                {/* Specs List */}
                {currentProduct.specs && currentProduct.specs.length > 0 && (
                  <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Cpu size={14} /> Thông Số Kỹ Thuật
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {currentProduct.specs.map((spec, idx) => (
                        <li key={idx} style={{ fontSize: '0.83rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Check size={14} color="#34d399" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)' }}>
                    <button
                      style={{ padding: '8px 14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                    <button
                      style={{ padding: '8px 14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '12px' }}
                    disabled={isOutOfStock}
                    onClick={() => {
                      addToCart(currentProduct, quantity);
                      onClose();
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>{isOutOfStock ? 'Hết hàng' : `Thêm ${quantity} vào Giỏ hàng`}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* E-Comment / Reviews Section */}
            <ReviewList
              productId={currentProduct.id}
              initialComments={currentProduct.comments || []}
            />
          </div>
        )}
      </div>
    </div>
  );
};
