'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingCart, History, Home, User, CreditCard } from 'lucide-react';

const navLinks = [
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/order-history', icon: History, label: 'Order History' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col h-screen p-4 shadow-lg sticky top-0 overflow-y-auto flex-shrink-0">
      {/* Logo / Title */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700 dark:border-gray-800 mb-6">
        <Link href="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
          E-Commerce
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <ul>
          {navLinks.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href) &&
                (pathname.length === link.href.length || pathname[link.href.length] === '/');

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 w-full text-left
                    ${isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-80 hover:text-white'}
                  `}
                >
                  <link.icon className="mr-3 h-5 w-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-4 mt-6 text-sm text-gray-400">
        <p className="text-center">&copy; 2024 E-Shop. All rights reserved.</p>
      </div>
    </aside>
  );
}
