'use client';

import { ReactNode } from 'react';
import GlassmorphismContainer from './GlassmorphismContainer';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="p-6">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-zinc-800 mb-2">{title}</h1>
          )}
          {subtitle && (
            <p className="text-zinc-600">{subtitle}</p>
          )}
        </div>
      )}
      <GlassmorphismContainer variant="default" className="p-6">
        {children}
      </GlassmorphismContainer>
    </div>
  );
} 