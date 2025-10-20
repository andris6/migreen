
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { handleEmailAction, verifyPasswordResetCode } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import ResetPasswordForm from './ResetPasswordForm';

function AuthActionComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState('loading'); // loading, success, error, resetPassword
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus('error');
      setError('Invalid request. Missing required parameters.');
      return;
    }

    const processAction = async () => {
      try {
        switch (mode) {
          case 'resetPassword':
            const userEmail = await verifyPasswordResetCode(oobCode);
            setEmail(userEmail);
            setStatus('resetPassword');
            break;
          case 'verifyEmail':
            await handleEmailAction(oobCode);
            setStatus('success');
            break;
          default:
            throw new Error('Unsupported action mode.');
        }
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'An unknown error occurred.');
      }
    };

    processAction();
  }, [mode, oobCode]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Processing your request...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <Logo className="mb-4 justify-center" />
            <CardTitle className="text-2xl font-headline text-destructive">Action Failed</CardTitle>
            <CardDescription>{error || 'An unexpected error occurred.'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <Logo className="mb-4 justify-center" />
            <CardTitle className="text-2xl font-headline text-green-600">Email Verified</CardTitle>
            <CardDescription>Your email address has been successfully verified. You can now log in.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full">Proceed to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (status === 'resetPassword' && oobCode) {
      return <ResetPasswordForm oobCode={oobCode} email={email} />;
  }

  return null; // Should not be reached
}

// A Suspense boundary is needed because useSearchParams() can suspend.
export default function AuthActionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthActionComponent />
        </Suspense>
    )
}
