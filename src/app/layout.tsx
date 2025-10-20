
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/layout/ThemeProvider';
import PageShell from '@/components/layout/PageShell';
import { PT_Sans } from 'next/font/google';
import ErrorBoundary from '@/components/ErrorBoundary';

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-pt-sans' 
});

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
      <body className={`${ptSans.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <PageShell>
              {children}
            </PageShell>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
