import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zoho CRM PDF Viewer',
  description: 'View PDFs from Zoho CRM file fields',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}