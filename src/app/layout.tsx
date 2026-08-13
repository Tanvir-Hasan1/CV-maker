import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Modern CV Maker — Professional Resume Builder',
  description: 'Turn your existing CV into a polished, editable resume or build one from scratch. Free, local, private, and template-driven.',
  keywords: ['CV maker', 'Resume builder', 'Modern resume', 'PDF CV export', 'Developer resume'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="h-full font-sans antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
