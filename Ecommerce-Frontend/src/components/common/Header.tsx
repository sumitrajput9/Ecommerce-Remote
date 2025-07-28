'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/lib/redux/store';
import { resetStore } from '@/lib/redux/resetStore'; 

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('searchTerm') as string;
   
  };

  const handleLogout = () => {
    dispatch(resetStore());
    localStorage.clear(); 
    router.push('/login'); 
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md py-4 px-6 md:px-8 flex items-center justify-between z-10 relative">
      <button
        onClick={() => router.push('/')}
        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors focus:outline-none"
      >
        E-Shop
      </button>

      <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-4">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search products..."
          className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none">
          <Search className="h-5 w-5" />
        </button>
      </form>

      <nav className="flex items-center space-x-6">
        <button
          onClick={() => router.push('/cart')}
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
          >
            <User className="h-6 w-6" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push('/profile');
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
