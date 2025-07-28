'use client';

import { useState } from 'react';
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from '@/lib/redux/api/authApi';

const getInitials = (name: string) => {
  if (!name) return '?';

  const words = name.trim().split(' ').filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
};

const CustomerProfile = ({ customerId }: { customerId: string }) => {
  const { data, isLoading } = useGetCustomerByIdQuery(customerId);
  const [updateCustomer] = useUpdateCustomerMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    imageUrl: '',
  });

  const handleEdit = () => {
    if (data) {
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        password: '',
        phoneNumber: data.phoneNumber || '',
        imageUrl: data.imageUrl || '',
      });
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateCustomer({ id: customerId, data: formData });
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No customer found</p>;

  return (
    <div className="p-4 shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Customer Profile</h2>

      {/* Profile Image or Initials */}
      <div className="flex justify-center mb-4">
        {!data.imageUrl ? (
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white bg-gray-600 text-2xl font-semibold">
            {getInitials(data.fullName)}
          </div>
        ) : (
          <img
            src={data.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        )}
      </div>

      {/* Form Fields */}
      {['fullName', 'email', 'phoneNumber', 'imageUrl'].map((field) => (
        <div key={field} className="mb-3">
          <label className="block font-medium capitalize">{field}:</label>
          {isEditing ? (
            <input
              type="text"
              name={field}
              value={formData[field as keyof typeof formData] || ''}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded"
            />
          ) : (
            <p className="border p-2 rounded bg-gray-50">{data[field]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
