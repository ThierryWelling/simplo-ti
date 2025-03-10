"use client";

import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassmorphismContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export default function GlassmorphismContainer({ 
  children, 
  className = '',
  variant = 'default'
}: GlassmorphismContainerProps) {
  const baseStyles = "border transition-all duration-300 rounded-2xl backdrop-blur-sm bg-white/20 border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:bg-white/30 hover:-translate-y-1 p-6";
  
  const variantStyles = {
    default: '',
    primary: 'border-primary/40 hover:border-primary/60',
    secondary: 'border-secondary/40 hover:border-secondary/60',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
} 