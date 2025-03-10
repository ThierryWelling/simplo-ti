'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-50">
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 