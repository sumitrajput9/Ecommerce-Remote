import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './providers';
import LayoutWrapper from '@/components/common/LayoutWrapper'; // client component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'A modern e-commerce platform built with Next.js and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
