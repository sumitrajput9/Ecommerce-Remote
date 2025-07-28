'use client';

import { useState, useEffect } from 'react';
import { useGetOrdersByCustomerIdQuery } from '@/lib/redux/api/orderApi'; // Ensure this path is correct
import Link from 'next/link';
import Image from 'next/image';

export default function OrderHistoryPage() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [errorFetchingCustomer, setErrorFetchingCustomer] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.id) {
          setCustomerId(user.id);
        } else {
          setErrorFetchingCustomer('User ID not found in local storage. Please log in.');
        }
      } else {
        setErrorFetchingCustomer('User data not found in local storage. Please log in.');
      }
    } catch (error) {
      console.error('Failed to parse user from local storage:', error);
      setErrorFetchingCustomer('Could not retrieve user data from local storage.');
    }
  }, []);

  const { data: orders, error, isLoading, isSuccess } = useGetOrdersByCustomerIdQuery(customerId!, {
    skip: !customerId,
  });

  // --- UI for various states ---

  if (errorFetchingCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 font-inter">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <p className="text-5xl mb-6 animate-bounce">⚠️</p>
          <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Authentication Required</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">{errorFetchingCustomer}</p>
          <Link href="/">
            <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Go to Home
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 font-inter">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">Loading your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 font-inter">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <p className="text-5xl mb-6">❌</p>
          <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Orders</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            Failed to retrieve order history: {(error as any)?.message || 'An unknown error occurred.'}
          </p>
          <Link href="/">
            <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Go to Home
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess && (!orders || orders.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 font-inter">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <p className="text-5xl mb-6">📦</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Orders Found</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">It looks like you haven't placed any orders yet. Start exploring our products!</p>
          <Link href="/">
            <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Browse Products
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // --- Main Order History Display ---

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        <h2 className="text-5xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 text-center tracking-tight">Your Order History</h2>

        <div className="space-y-10">
          {orders?.map((order: any) => (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
                <div className="flex flex-col mb-4 sm:mb-0">
                  <div className="text-sm font-light opacity-80">Order ID</div>
                  <div className="font-bold text-xl sm:text-2xl break-all">{order.id}</div>
                </div>
                <div className="flex flex-col text-left sm:text-right">
                  <div className="text-sm font-light opacity-80">Order Date</div>
                  <div className="font-semibold text-lg sm:text-xl">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details & Items */}
              <div className="p-5 sm:p-7 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
                    <div className={`font-bold text-xl sm:text-2xl mt-1 ${
                        order.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' :
                        order.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-400' :
                        order.status === 'CANCELLED' ? 'text-red-600 dark:text-red-400' :
                        'text-gray-800 dark:text-gray-200' // Default color for unknown status
                    }`}>
                      {order.status || 'Processing'}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Total</div>
                    <div className="font-extrabold text-3xl sm:text-4xl text-indigo-700 dark:text-indigo-400 mt-1">
                      ${order.totalAmount || '0.00'}
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-5 border-b-2 pb-3 border-indigo-200 dark:border-indigo-700">Items in this Order</h4>
                <ul className="space-y-4">
                  {order.orderItems?.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <Image
                        src={item.imageUrl || '/placeholder.png'}
                        alt={item.name || 'Product Image'}
                        width={70}
                        height={70}
                        className="rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
                      />
                      <div className="flex-grow">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{item.name || `Product ID: ${item.productId}`}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Quantity: <span className="font-medium text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
                          ${item.price || 'N/A'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
