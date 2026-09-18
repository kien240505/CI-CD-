import React, { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, AlertTriangle, Plus, Trash2, RefreshCw, Mail, Lock, User, LogOut, ShieldCheck, KeyRound } from 'lucide-react';
import { fetchAdminStats, fetchOrders, updateOrderStatus, createProduct, deleteProduct, fetchProducts, fetchContactMessages, adminLogin } from '../services/api';
import { useCart } from '../context/CartContext';

export const AdminDashboard = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('technova_admin_token'));
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Data State
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'messages' | 'add_product'
  const [loading, setLoading] = useState(false);
  const { showToast } = useCart();

  // New product form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Laptop',
    price: '',
    oldPrice: '',
    stock: 10,
    image: '',
    description: '',
    specs: '',
    featured: false
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, productsData, messagesData] = await Promise.all([
        fetchAdminStats(),
        fetchOrders(),
        fetchProducts(),
        fetchContactMessages().catch(() => [])
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
      setMessages(messagesData);
    } catch (err) {
      showToast('Lỗi tải dữ liệu quản trị: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUser || !loginPass) {
      setLoginError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await adminLogin(loginUser, loginPass);
      localStorage.setItem('technova_admin_token', res.token);
      setIsAuthenticated(true);
      showToast('Đăng nhập quản trị viên thành công!');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('technova_admin_token');
    setIsAuthenticated(false);
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Cập nhật trạng thái đơn #${orderId} thành "${newStatus}"!`);
      loadDashboardData();
    } catch (err) {
      showToast('Lỗi cập nhật đơn: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      showToast('Đã xóa sản phẩm thành công!');
      loadDashboardData();
    } catch (err) {
      showToast('Lỗi xóa sản phẩm: ' + err.message);
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.image) {
      showToast('Vui lòng điền tên, giá và link ảnh sản phẩm!');
      return;
    }

    try {
      const specsArr = newProd.specs.split('\n').filter(s => s.trim() !== '');
      await createProduct({
        ...newProd,
        price: Number(newProd.price),
        oldPrice: newProd.oldPrice ? Number(newProd.oldPrice) : null,
        stock: Number(newProd.stock),
        specs: specsArr
      });

      showToast('Thêm sản phẩm mới thành công!');
      setNewProd({
        name: '',
        category: 'Laptop',
        price: '',
        oldPrice: '',
        stock: 10,
        image: '',
        description: '',
        specs: '',
        featured: false
      });
      setActiveTab('products');
      loadDashboardData();
    } catch (err) {
      showToast('Lỗi thêm sản phẩm: ' + err.message);
    }
  };

  // RENDER ADMIN LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '440px', margin: '40px auto 60px' }}>
        <div className="glass-panel" style={{ padding: '36px 28px', border: '1px solid var(--border-accent)', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-glow)', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <ShieldCheck size={28} color="#818cf8" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
              Đăng Nhập Quản Trị Viên
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nhập tài khoản quản lý để truy cập trang Admin hệ thống.
            </p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '18px', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tên đăng nhập</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Nhập username (admin)"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px 11px 38px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="Nhập password (admin123)"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px 11px 38px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoggingIn}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginBottom: '16px' }}
            >
              <KeyRound size={18} />
              <span>{isLoggingIn ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}</span>
            </button>
          </form>

          {/* Demo Quick Fill Button */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Thử đăng nhập nhanh với tài khoản Demo:</span>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => {
                setLoginUser('admin');
                setLoginPass('admin123');
              }}
            >
              Tự động điền admin / admin123
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Đang tải bảng quản trị Admin...
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Top Header & Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
            Bảng Quản Trị Cửa Hàng TechNova
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Theo dõi doanh thu, quản lý đơn hàng, tồn kho & liên hệ khách hàng.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={loadDashboardData}>
            <RefreshCw size={16} />
            <span>Làm mới</span>
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng Xuất Admin</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng Doanh Thu</span>
            <DollarSign size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng Đơn Hàng</span>
            <ShoppingBag size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            {stats?.totalOrders || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sản Phẩm Trong Kho</span>
            <Package size={20} color="#22d3ee" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
            {stats?.totalProducts || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cảnh Báo Tồn Kho Thấp</span>
            <AlertTriangle size={20} color="#fb7185" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb7185' }}>
            {stats?.lowStock || 0} sản phẩm
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Quản Lý Đơn Hàng ({orders.length})
        </button>
        <button
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          Danh Sách Sản Phẩm ({products.length})
        </button>
        <button
          className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('messages')}
        >
          <Mail size={16} /> Tin Nhắn Liên Hệ ({messages.length})
        </button>
        <button
          className={`btn ${activeTab === 'add_product' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('add_product')}
        >
          <Plus size={16} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Mã Đơn</th>
                <th style={{ padding: '12px' }}>Khách Hàng</th>
                <th style={{ padding: '12px' }}>SĐT / Email</th>
                <th style={{ padding: '12px' }}>Tổng Tiền</th>
                <th style={{ padding: '12px' }}>Thanh Toán</th>
                <th style={{ padding: '12px' }}>Trạng Thái</th>
                <th style={{ padding: '12px' }}>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                    Chưa có đơn hàng nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#818cf8' }}>#{o.id}</td>
                    <td style={{ padding: '12px', color: 'white', fontWeight: 600 }}>{o.customer_name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{o.phone}<br/>{o.email}</td>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#34d399' }}>${o.total_amount.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{o.payment_method}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="sort-select"
                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      >
                        <option value="Pending">Pending (Đang chờ)</option>
                        <option value="Processing">Processing (Đang xử lý)</option>
                        <option value="Shipped">Shipped (Đang giao)</option>
                        <option value="Delivered">Delivered (Đã hoàn thành)</option>
                        <option value="Cancelled">Cancelled (Đã hủy)</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {new Date(o.created_at).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Products */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Ảnh</th>
                <th style={{ padding: '12px' }}>Tên Sản Phẩm</th>
                <th style={{ padding: '12px' }}>Danh Mục</th>
                <th style={{ padding: '12px' }}>Giá Ban Đầu</th>
                <th style={{ padding: '12px' }}>Tồn Kho</th>
                <th style={{ padding: '12px' }}>Đánh Giá</th>
                <th style={{ padding: '12px' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '12px', color: 'white', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'white' }}>${p.price.toLocaleString()}</td>
                  <td style={{ padding: '12px', color: p.stock <= 3 ? '#fb7185' : '#34d399', fontWeight: 700 }}>
                    {p.stock} cái
                  </td>
                  <td style={{ padding: '12px', color: '#f59e0b' }}>★ {p.rating}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Contact Messages */}
      {activeTab === 'messages' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Họ Tên</th>
                <th style={{ padding: '12px' }}>Email / SĐT</th>
                <th style={{ padding: '12px' }}>Chủ Đề</th>
                <th style={{ padding: '12px' }}>Nội Dung Tin Nhắn</th>
                <th style={{ padding: '12px' }}>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                    Chưa có tin nhắn liên hệ nào từ khách hàng.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', color: 'white', fontWeight: 600 }}>{m.name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{m.email}<br/>{m.phone}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{m.subject}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1', maxWidth: '350px' }}>{m.message}</td>
                    <td style={{ padding: '12px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {new Date(m.created_at).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Add Product Form */}
      {activeTab === 'add_product' && (
        <div className="glass-panel" style={{ padding: '28px', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>
            Tạo Sản Phẩm Mới Vào Kho
          </h3>

          <form onSubmit={handleCreateProductSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tên sản phẩm *</label>
              <input
                type="text"
                placeholder="VD: Sony PlayStation 5 Pro"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Danh mục *</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#111827', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white' }}
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Audio">Audio</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="Accessory">Accessory</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Giá ($) *</label>
                <input
                  type="number"
                  placeholder="699"
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Số lượng tồn kho</label>
                <input
                  type="number"
                  placeholder="10"
                  value={newProd.stock}
                  onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Link ảnh sản phẩm (URL) *</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newProd.image}
                onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Mô tả sản phẩm</label>
              <textarea
                rows="3"
                placeholder="Mô tả các đặc tính nổi bật của sản phẩm..."
                value={newProd.description}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Thông số kỹ thuật (mỗi dòng 1 thông số)</label>
              <textarea
                rows="3"
                placeholder="Chip Apple M3 Max&#10;36GB RAM Unified&#10;Màn hình XDR 120Hz"
                value={newProd.specs}
                onChange={(e) => setNewProd({ ...newProd, specs: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              <span>Lưu & Thêm Sản Phẩm Mới</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
