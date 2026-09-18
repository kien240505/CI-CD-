import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { fetchProducts, fetchCategories } from './services/api';
import { CartProvider } from './context/CartContext';
import { SlidersHorizontal, Headset, ShieldCheck } from 'lucide-react';

const MainShop = ({ search, setSearch, isContactOpen, setIsContactOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(data => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: selectedCategory,
      search: search,
      sort: sortBy
    })
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      {!search && selectedCategory === 'All' && (
        <HeroBanner onShopNow={() => {
          const gridEl = document.getElementById('catalog-grid');
          if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
        }} />
      )}

      {/* Category Bar & Controls */}
      <div id="catalog-grid" className="category-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'Tất cả sản phẩm' : cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải danh sách sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default function App() {
  const [search, setSearch] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath === '/admin';

  return (
    <CartProvider>
      <div className="app-container">
        <Navbar
          search={search}
          setSearch={setSearch}
          currentPath={currentPath}
          navigateTo={navigateTo}
          onOpenContact={() => setIsContactOpen(true)}
        />

        <main className="main-content">
          {isAdminRoute ? (
            <AdminDashboard />
          ) : (
            <MainShop
              search={search}
              setSearch={setSearch}
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          )}
        </main>

        <footer className="footer">
          <p style={{ marginBottom: 0 }}>© 2026 TechNova E-Commerce Store. All rights reserved.</p>
        </footer>

        <AuthModal />
        <Toast />
      </div>
    </CartProvider>
  );
}
