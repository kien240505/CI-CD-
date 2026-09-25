import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Clock, Send, Headset } from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { useCart } from '../context/CartContext';

export const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn mua hàng',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useCart();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Vui lòng nhập họ tên, email và nội dung cần tư vấn!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await sendContactMessage(formData);
      showToast(res.message || 'Gửi liên hệ thành công!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Tư vấn mua hàng',
        message: ''
      });
      onClose();
    } catch (err) {
      showToast('Lỗi khi gửi liên hệ: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Headset size={28} color="#818cf8" />
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                Liên Hệ & Hỗ Trợ Khách Hàng
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Chúng tôi sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn 24/7.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {/* Contact Info Panel */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white' }}>
                Thông Tin Trụ Sở TechNova
              </h3>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={20} color="#22d3ee" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Địa chỉ cửa hàng</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Số 123 Đường Công Nghệ, Quận Cầu Giấy, Hà Nội
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={20} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Hotline tư vấn (Miễn phí)</h4>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}>
                    1900 8888 - 0987 654 321
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail size={20} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Email hỗ trợ</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    support@technova.com.vn
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={20} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Giờ làm việc</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    8:00 - 21:30 (Từ Thứ 2 đến Chủ Nhật)
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '14px' }}>
                Gửi Tin Nhắn Cho Chúng Tôi
              </h3>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0987..."
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Chủ đề cần tư vấn
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                >
                  <option value="Tư vấn mua hàng">Tư vấn mua sản phẩm mới</option>
                  <option value="Hỗ trợ bảo hành">Hỗ trợ kỹ thuật & Bảo hành</option>
                  <option value="Góp ý dịch vụ">Góp ý chất lượng dịch vụ</option>
                  <option value="Hợp tác kinh doanh">Hợp tác kinh doanh</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Nội dung chi tiết *
                </label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Nhập nội dung cần tư vấn hoặc thắc mắc của bạn..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem', resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '11px' }}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Liên Hệ'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
