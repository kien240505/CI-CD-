import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <CheckCircle2 className="w-5 h-5 text-indigo-400" size={20} color="#818cf8" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
