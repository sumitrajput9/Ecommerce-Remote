'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/lib/redux/api/authApi';
import { setCredentials } from '@/lib/redux/slices/authSlice';

type LoginFormInputs = {
  email: string;
  password: string;
};

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response:any = await login(data).unwrap();
      dispatch(setCredentials(response));
      localStorage.setItem('userToken', response.accessToken); // store token in localStorage
        localStorage.setItem('user', JSON.stringify(response.user)); // store user data
      router.push('/products'); 
    } catch (error: any) {
      alert(error?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-300"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don’t have an account?{' '}
          <a href="/customer-register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
