"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailConfirmationAlert from '@/components/EmailConfirmationAlert';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar onToggle={handleSidebarToggle} />
        <main className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-16')}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <EmailConfirmationAlert />
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 