import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-[#161C2C] border border-[#232D42] rounded-2xl shadow-2xl p-6 overflow-hidden z-10 transform scale-100 transition-all duration-300 animate-scale-up`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232D42]">
          <h3 className="font-display font-bold text-lg text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-[#1F2937] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
