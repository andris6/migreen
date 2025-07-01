
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/layout/ThemeProvider';
import PageShell from '@/components/layout/PageShell';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Migreen',
  description: 'Personalized Green Light Therapy for Migraine Relief',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PageShell>
              {children}
            </PageShell>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
