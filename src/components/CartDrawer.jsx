import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountCode,
    discountAmount,
    finalTotal,
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-content">
        {/* Drawer Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
              Giỏ Hàng Của Bạn ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h3>
          </div>
          <button className="modal-close-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} color="#4b5563" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '6px' }}>Giỏ hàng đang trống</p>
              <p style={{ fontSize: '0.85rem' }}>Hãy thêm các sản phẩm công nghệ yêu thích của bạn vào giỏ!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', background: '#1e293b' }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{item.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.95rem' }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'rgba(0,0,0,0.3)' }}>
                      <button
                        style={{ padding: '2px 8px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, -1)}
                      ><Minus size={12} /></button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        style={{ padding: '2px 8px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, 1)}
                      ><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Total */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)', background: '#090d16' }}>
            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Mã giảm giá (VD: TECH10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                onClick={() => applyPromoCode(inputCode)}
              >
                Áp dụng
              </button>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tạm tính:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Giảm giá ({discountCode}):</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800, fontSize: '1.2rem', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <span>Tổng tiền:</span>
                <span style={{ color: '#818cf8' }}>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={() => {
                setIsCartOpen(false);
                onProceedCheckout();
              }}
            >
              <span>Thanh Toán Ngay</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
