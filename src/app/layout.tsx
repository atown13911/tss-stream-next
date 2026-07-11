import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taylor Shipping Solutions — TSS Stream',
  description: 'Transportation video streaming platform by Taylor Shipping Solutions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
