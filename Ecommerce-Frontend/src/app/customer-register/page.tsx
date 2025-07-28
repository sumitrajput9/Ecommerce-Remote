'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/lib/redux/api/authApi';
import { useState } from 'react';
import { Link } from 'lucide-react';
type RegisterFormInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerSchema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
}).required();

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('');

  // Function to show a temporary toast message
  const showTemporaryToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('');
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }).unwrap();
      showTemporaryToast('Registration successful! Please log in.', 'success');
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error: any) {
      console.error('Registration failed:', error);
      showTemporaryToast(error?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 font-inter p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Register Account</h2>

        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Link to Login Page */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>

      {showToast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-lg transition-all duration-300 ease-out transform translate-y-0 opacity-100
          ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
