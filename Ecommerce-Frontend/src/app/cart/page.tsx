'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '@/lib/redux/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useCreateOrderMutation } from '@/lib/redux/api/orderApi';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const showTemporaryToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000); // Hide toast after 3 seconds
    return () => clearTimeout(timer);
  };

  const handleProceedToCheckoutClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmCheckout = async () => {
    setShowConfirmationModal(false); // Close the confirmation modal

    let customerId = '';
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.id) {
          customerId = user.id;
        } else {
          showTemporaryToast('Error: User ID not found in local storage.');
          return;
        }
      } else {
        showTemporaryToast('Error: User data not found in local storage. Please log in.');
        return;
      }
    } catch (error) {
      console.error('Failed to parse user from local storage:', error);
      showTemporaryToast('Error: Could not retrieve user data.');
      return;
    }

    if (!customerId) {
      showTemporaryToast('Error: Customer ID is missing.');
      return;
    }

    const orderPayload = {
      customerId,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(orderPayload).unwrap();
      showTemporaryToast('Order placed successfully!');
      dispatch(clearCart());
    } catch (error) {
      console.error('Failed to create order:', error);
      showTemporaryToast('Failed to place order. Please try again.');
    }
  };

  const handleCancelCheckout = () => {
    setShowConfirmationModal(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        🛒 <p className="text-xl mt-2">Your cart is empty.</p>
        <Link href="/products">
          <span className="inline-block mt-4 text-indigo-600 hover:underline font-semibold">
            Browse Products
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <ul className="space-y-6">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded-md bg-white dark:bg-gray-800"
          >
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Image
                src={item?.imageUrl || '/placeholder.png'}
                alt={item.name}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                <div className="text-sm text-gray-500">Price: ${item.price}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                className="bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded-md transition-colors hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => dispatch(decrementQuantity(item.id))}
                disabled={item.quantity === 1}
              >
                -
              </button>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{item.quantity}</span>
              <button
                className="bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded-md transition-colors hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => dispatch(incrementQuantity(item.id))}
              >
                +
              </button>
            </div>

            <div className="text-right mt-4 sm:mt-0">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">
                ${(item.price * item.quantity)}
              </div>
              <button
                className="text-red-500 text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Total: ${totalPrice}
          </div>
          <button
            className="mt-2 text-sm text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </div>
        <button
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md transition-all
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleProceedToCheckoutClick}
          disabled={isLoading || cartItems.length === 0}
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirm Checkout</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to proceed with the checkout?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                onClick={handleCancelCheckout}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                onClick={handleConfirmCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
