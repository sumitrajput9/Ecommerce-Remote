'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/redux/slices/cartSlice';
// import { Product } from '@/lib/api/products';
import { useState } from 'react';

// interface ProductCardProps {
//   product: Product;
// }

export default function ProductCard({ product }: any) {
  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | ''>(''); // For styling toast


  const showTemporaryToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('');
    }, 3000); // Hide toast after 3 seconds
    return () => clearTimeout(timer);
  };


  const handleAddToCartClick = () => {
    if (product.stock <= 0) {
      showTemporaryToast('This product is out of stock!', 'error');
      return;
    }
    setShowConfirmationModal(true); 
  };

  const handleConfirmAddToCart = () => {
    setShowConfirmationModal(false); 
    try {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      }));
      showTemporaryToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showTemporaryToast(`Failed to add ${product.name} to cart.`, 'error');
    }
  };

  // Handler for canceling adding to cart
  const handleCancelAddToCart = () => {
    setShowConfirmationModal(false); // Close the modal
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full font-inter">
      <Link href={`/products/${product.id}`} className="block relative w-full h-48 bg-gray-200 overflow-hidden group">
        <img
          src={product.imageUrl}
          alt={product.name}
          
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback to a text placeholder if image fails to load
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/E0E0E0/333333?text=${product.name.substring(0, 1).toUpperCase()}`;
          }}
        />
      </Link>
      <div className="p-4 flex-grow pb-2">
        <h3 className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-gray-100 leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-1 leading-relaxed">
          {product.description}
        </p>
      </div>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mt-2">
          <span className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Stock: <span className="font-semibold">{product.stock}</span>
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Category: <span className="font-medium text-gray-700 dark:text-gray-300">{product.category}</span>
        </div>
        {/* <div className="text-yellow-500 text-sm mt-1 flex items-center">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span className="ml-1 text-gray-600 dark:text-gray-400">({product.rating})</span>
        </div> */}
      </div>

      <div className="p-4 pt-2">
        <button
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg
            ${product.stock > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'
            }`}
          onClick={handleAddToCartClick}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-95 animate-fade-in-up border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirm Add to Cart</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
              Do you want to add <span className="font-semibold text-indigo-600 dark:text-indigo-400">{product.name}</span> to your cart?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={handleCancelAddToCart}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                onClick={handleConfirmAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-lg transition-all duration-300 ease-out transform translate-y-0 opacity-100
          ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
