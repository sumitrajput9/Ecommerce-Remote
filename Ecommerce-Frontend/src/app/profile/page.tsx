'use client';

import { useEffect, useState } from 'react';
import CustomerProfile from '@/components/CustomerProfile';

export default function ProfilePage() {
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomerId(parsed.id);
      } catch (error) {
        console.error('Invalid user data in localStorage', error);
      }
    }
  }, []);

  if (!customerId) {
    return <div className="p-4">No customer data found.</div>;
  }

  return <CustomerProfile customerId={customerId} />;
}
