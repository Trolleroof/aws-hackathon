import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IdeaForge | AI-Powered Idea Validation',
  description:
    'Brain dump your startup idea and get back a validated concept with problem statements, target users, tech stack, competitive gaps, and a founder-ready brief.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
