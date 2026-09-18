import React, { useState, useEffect } from 'react';
import { Star, Send, User, MessageCircle, LogIn } from 'lucide-react';
import { addProductComment } from '../services/api';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export const ReviewList = ({ productId, initialComments = [], onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useCart();
  const { currentUser, openAuth } = useUser();
  const author = currentUser ? currentUser.fullname : '';

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      showToast('Vui lòng nhập tên và nội dung đánh giá!');
      return;
    }

    try {
      setIsSubmitting(true);
      const newComment = await addProductComment(productId, {
        author: author.trim(),
        rating,
        content: content.trim()
      });

      setComments([newComment, ...comments]);
      setContent('');
      showToast('Gửi đánh giá thành công!');
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      showToast('Lỗi khi gửi đánh giá: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <MessageCircle size={22} color="#818cf8" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
          Đánh Giá & Bình Luận Khách Hàng ({comments.length})
        </h3>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmitComment} style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        marginBottom: '28px'
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '14px' }}>
          Viết đánh giá của bạn
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Họ và tên</label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                color: 'white',
                fontSize: '0.85rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Đánh giá sao</label>
            <div style={{ display: 'flex', gap: '4px', paddingTop: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  style={{ cursor: 'pointer', transition: 'transform 0.1s ease' }}
                  fill={star <= rating ? '#f59e0b' : 'none'}
                  color={star <= rating ? '#f59e0b' : '#4b5563'}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nội dung nhận xét</label>
          <textarea
            rows="3"
            placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              fontSize: '0.85rem',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
        >
          <Send size={15} />
          <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}</span>
        </button>
      </form>

      {/* Comment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên nhận xét!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={c.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(c.author)}`}
                    alt={c.author}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{c.author}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= c.rating ? '#f59e0b' : 'none'}
                      color={s <= c.rating ? '#f59e0b' : '#374151'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
