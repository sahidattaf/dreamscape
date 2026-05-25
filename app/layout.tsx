import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'DreamScape - AI Virtual Staging',
  description: 'Transform empty rooms into beautiful spaces with AI-powered virtual staging',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-primary text-white min-h-screen">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
