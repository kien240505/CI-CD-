import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShoppingBag, UserCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, register } = useUser();
  const { showToast } = useCart();

  const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'register') {
      if (!form.fullname.trim()) return setError('Vui lòng nhập Họ và tên đầy đủ!');
      if (!form.email.trim()) return setError('Vui lòng nhập địa chỉ Email!');
      if (form.password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự!');
      if (form.password !== form.confirmPassword) return setError('Mật khẩu nhập lại không khớp!');
    }

    try {
      setIsLoading(true);
      let res;
      if (authMode === 'login') {
        res = await login(form.email, form.password);
      } else {
        res = await register({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          password: form.password
        });
      }
      showToast(res.message || 'Thành công!');
      setIsAuthOpen(false);
      setForm({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setForm({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsAuthOpen(false)}>
          <X size={18} />
        </button>

        <div style={{ padding: '32px 28px' }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'var(--gradient-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <ShoppingBag size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
              {authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {authMode === 'login'
                ? 'Đăng nhập để theo dõi đơn hàng và bình luận sản phẩm.'
                : 'Đăng ký để trải nghiệm mua sắm TechNova đầy đủ nhất!'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '22px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => switchMode('login')}
              style={{
                padding: '9px', border: 'none', borderRadius: '6px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease',
                background: authMode === 'login' ? 'var(--gradient-primary)' : 'transparent',
                color: authMode === 'login' ? 'white' : 'var(--text-muted)'
              }}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => switchMode('register')}
              style={{
                padding: '9px', border: 'none', borderRadius: '6px', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease',
                background: authMode === 'register' ? 'var(--gradient-primary)' : 'transparent',
                color: authMode === 'register' ? 'white' : 'var(--text-muted)'
              }}
            >
              Đăng Ký
            </button>
          </div>

          {/* Error Box */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {authMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Họ và tên *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Nguyễn Văn A"
                    value={form.fullname}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Địa chỉ Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Số điện thoại
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0987 654 321"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Mật khẩu *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder={authMode === 'register' ? 'Tối thiểu 6 ký tự' : '••••••••'}
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: '42px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Nhập lại mật khẩu *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: form.confirmPassword && form.confirmPassword !== form.password ? '#fb7185' : 'var(--text-muted)' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      borderColor: form.confirmPassword && form.confirmPassword !== form.password
                        ? 'rgba(244, 63, 94, 0.5)'
                        : form.confirmPassword && form.confirmPassword === form.password
                          ? 'rgba(52, 211, 153, 0.5)'
                          : 'var(--border-light)'
                    }}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '4px' }}
            >
              <UserCheck size={18} />
              <span>{isLoading
                ? (authMode === 'login' ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...')
                : (authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản')
              }</span>
            </button>
          </form>

          {/* Quick demo hint */}
          {authMode === 'login' && (
            <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Tài khoản demo nhanh:
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => setForm(f => ({ ...f, email: 'demo@technova.com', password: 'demo123' }))}
              >
                Điền demo@technova.com / demo123
              </button>
            </div>
          )}

          {authMode === 'register' && (
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '14px' }}>
              Đã có tài khoản?{' '}
              <button
                onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
              >
                Đăng nhập ngay
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px 10px 38px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  color: 'white',
  fontSize: '0.88rem',
  transition: 'border-color 0.2s ease',
  outline: 'none'
};
