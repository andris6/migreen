
'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg text-center shadow-2xl bg-destructive/10 border-destructive">
            <CardHeader>
                <div className="mx-auto bg-destructive/20 p-3 rounded-full w-fit">
                   <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-headline mt-4 text-destructive">
                    Application Error
                </CardTitle>
                <CardDescription className="text-destructive/80">
                    We're sorry, something went wrong on our end. Please try again.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md text-sm text-left">
                    <p className="font-semibold">Error Details:</p>
                    <pre className="mt-2 whitespace-pre-wrap break-words text-muted-foreground font-mono text-xs">
                        {error.message}
                    </pre>
                </div>
                <Button
                    onClick={() => reset()}
                    size="lg"
                    variant="destructive"
                    className="text-lg py-6"
                >
                    Try Again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
