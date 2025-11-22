/**
 * Main Layout
 * Layout chính với Navbar và Footer
 */

import { ReactNode } from 'react';
import { Navbar, Footer } from '@/components';
interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">{children}</main>

      <Footer />
    </div>
  );
};
