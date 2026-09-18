import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const HeroBanner = ({ onShopNow }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(6, 182, 212, 0.08) 100%)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px 32px',
      marginBottom: '36px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
        <span className="badge badge-primary" style={{ marginBottom: '16px' }}>
          <Sparkles size={14} /> Hệ Thống Công Nghệ Số 1
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, color: '#ffffff', marginBottom: '16px' }}>
          Trải Nghiệm Công Nghệ Đỉnh Cao Với <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TechNova</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
          Cung cấp các thiết bị điện tử, laptop cao cấp, flagship smartphone và phụ kiện công nghệ chính hãng. Giảm tới 20% khi nhập mã <code style={{ color: '#818cf8', background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>TECH10</code>.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button className="btn btn-primary" onClick={onShopNow}>
            <span>Khám Phá Ngay</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Value props */}
        <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={18} color="#34d399" />
            <span>Hàng chính hãng 100%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Truck size={18} color="#22d3ee" />
            <span>Giao siêu tốc 2H</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={18} color="#818cf8" />
            <span>Đổi trả 30 ngày</span>
          </div>
        </div>
      </div>

      {/* Decorative background glow circle */}
      <div style={{
        position: 'absolute',
        right: '-50px',
        top: '-50px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};
