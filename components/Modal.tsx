import React from 'react';
import { CallButton } from './CallButton.tsx';

export const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-3xl">
        <div 
          className="relative bg-white rounded-2xl shadow-xl w-full p-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
          onClick={e => e.stopPropagation()}
        >
          <div className="space-y-3 text-left">{children}</div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="w-full order-last sm:order-first py-2.5 px-4 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-150 ease-in-out"
            >
              キャンセル
            </button>
            <CallButton onClick={onConfirm} className="w-full py-2.5 px-4 text-sm font-medium">
              発信する
            </CallButton>
          </div>
        </div>
      </div>
    </div>
  );
};