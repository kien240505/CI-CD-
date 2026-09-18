import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck, Wallet, ShieldCheck, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, finalTotal, clearCart, showToast } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    payment_method: 'COD'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.email || !formData.phone || !formData.address) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createOrder({
        ...formData,
        items: cartItems,
        total_amount: finalTotal
      });

      setCompletedOrder({
        orderId: res.orderId,
        items: cartItems,
        total_amount: finalTotal,
        customer: formData
      });

      clearCart();
      showToast('Đặt hàng thành công!');
    } catch (err) {
      showToast('Lỗi khi đặt hàng: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '28px' }}>
          {completedOrder ? (
            /* Order Success Receipt View */
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 size={54} color="#34d399" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                Xác Nhận Đơn Hàng Thành Công!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Mã đơn hàng của bạn: <strong style={{ color: '#818cf8' }}>#{completedOrder.orderId}</strong>. Chúng tôi sẽ liên hệ giao hàng sớm nhất.
              </p>

              {/* Order Receipt Summary */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  Thông tin khách hàng
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Người nhận: <strong style={{ color: 'white' }}>{completedOrder.customer.customer_name}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Số điện thoại: <strong style={{ color: 'white' }}>{completedOrder.customer.phone}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Địa chỉ: <strong style={{ color: 'white' }}>{completedOrder.customer.address}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Hình thức: <strong style={{ color: 'white' }}>{completedOrder.customer.payment_method}</strong></p>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  Danh sách sản phẩm
                </h4>
                {completedOrder.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#818cf8', borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '10px' }}>
                  <span>Tổng thanh toán:</span>
                  <span>${completedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <Printer size={16} />
                  <span>In Hóa Đơn</span>
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  <span>Hoàn Tất</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={24} color="#818cf8" /> Thông Tin Giao Hàng & Thanh Toán
              </h2>

              <form onSubmit={handleSubmitOrder}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Họ và tên *</label>
                    <input
                      type="text"
                      name="customer_name"
                      placeholder="Nguyễn Văn A"
                      value={formData.customer_name}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0987 654 321"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email nhận thông báo *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Địa chỉ giao hàng chi tiết *</label>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP..."
                    value={formData.address}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem', resize: 'none' }}
                    required
                  />
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                  Phương thức thanh toán
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'COD', label: 'Thanh toán COD', icon: Truck },
                    { id: 'Banking', label: 'Chuyển khoản QR', icon: Wallet },
                    { id: 'Card', label: 'Thẻ Visa/Master', icon: CreditCard }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.payment_method === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setFormData({ ...formData, payment_method: method.id })}
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                          background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={20} color={isSelected ? '#818cf8' : '#9ca3af'} style={{ margin: '0 auto 6px' }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? 'white' : 'var(--text-muted)', display: 'block' }}>
                          {method.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Tổng cần thanh toán</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>${finalTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <span>{isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
