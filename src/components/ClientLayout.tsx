"use client";

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import EmailConfirmationAlert from './EmailConfirmationAlert';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={setIsSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <main className="p-8">
          <EmailConfirmationAlert />
          {children}
        </main>
      </div>
    </div>
  );
} 