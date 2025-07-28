'use client';

import { useGetProductsQuery } from '@/lib/redux/api/productApi';
import ProductCard from '@/components/products/ProductCard';

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const handleAddToCart = (productId: string) => {
    console.log(`Product ${productId} added to cart`);
    // Implement add-to-cart logic here
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
        All Products
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">Loading products...</p>
      ) : isError ? (
        <p className="text-center text-red-500 text-lg">Failed to load products. Please try again later.</p>
      ) : !products || products.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          No products found at the moment. Please check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
