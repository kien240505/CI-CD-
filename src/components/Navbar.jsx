import React, { useState } from 'react';
import { ShoppingBag, Search, Store, Headset, LogIn, LogOut, UserCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export const Navbar = ({ search, setSearch, currentPath, navigateTo, onOpenContact }) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentUser, logout, openAuth } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const isAdminPath = currentPath === '/admin';

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand Logo */}
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
          <div className="logo-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span>Tech<span style={{ color: '#818cf8' }}>Nova</span></span>
            {isAdminPath ? (
              <span className="badge badge-rose" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>Admin Portal</span>
            ) : (
              <span className="badge badge-cyan" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>Store</span>
            )}
          </div>
        </a>

        {/* Search Bar - only in shop */}
        {!isAdminPath && (
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm Laptop, iPhone, Tai nghe, Chuột..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Nav Actions */}
        <div className="nav-actions">
          {!isAdminPath ? (
            <>
              {/* Contact button */}
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                onClick={onOpenContact}
              >
                <Headset size={16} color="#22d3ee" />
                <span>Liên Hệ</span>
              </button>

              {/* User Auth Area */}
              {currentUser ? (
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', gap: '8px' }}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullname}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.fullname}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {showDropdown && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: '#111827', border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)', padding: '8px', minWidth: '200px',
                      zIndex: 200, boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: '6px' }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{currentUser.fullname}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setShowDropdown(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        <LogOut size={15} />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  onClick={() => openAuth('login')}
                >
                  <LogIn size={16} />
                  <span>Đăng Nhập</span>
                </button>
              )}

              {/* Cart Trigger */}
              <button className="cart-trigger" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={20} color="#818cf8" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Giỏ hàng</span>
                {totalItemsCount > 0 && (
                  <span className="cart-badge-count">{totalItemsCount}</span>
                )}
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              onClick={() => navigateTo('/')}
            >
              <Store size={16} />
              <span>Về Trang Cửa Hàng</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
