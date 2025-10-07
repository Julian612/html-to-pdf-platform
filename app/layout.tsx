import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'PDFTools - Professional PDF Tools & Utilities',
  description: 'Free online PDF tools, image processing, and file utilities. All processing happens in your browser for complete privacy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="dark">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
