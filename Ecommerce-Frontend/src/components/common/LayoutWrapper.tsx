'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);

    if (!token && pathname !== '/login' && pathname !== '/customer-register') {
      router.push('/login'); // Redirect to login if not authenticated
    }

    if (token && pathname === '/login') {
      router.push('/'); // Already logged in, redirect to products
    }
  }, [pathname, router]);

  if (isAuthenticated === null) return null;

  const hideLayout = pathname === '/login' || pathname === '/customer-register';

  if (hideLayout) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
