
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PreSessionData } from '@/types';
import { Button } from '@/components/ui/button'; // Changed from LongPressButton
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GREEN_LIGHT_COLOR = '#00BA00'; // Approx 530nm

export default function TherapySessionPage() {
  const router = useRouter();
  const [preSessionData, setPreSessionData] = useState<PreSessionData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [initialDuration, setInitialDuration] = useState(0); // in seconds

  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('preSessionData');
    if (storedData) {
      const parsedData: PreSessionData = JSON.parse(storedData);
      setPreSessionData(parsedData);
      setTimeLeft(parsedData.recommendedDuration * 60);
      setInitialDuration(parsedData.recommendedDuration * 60);
      startTimeRef.current = new Date();
    } else {
      // No data, redirect or show error
      router.replace('/therapy/start');
    }

    // Prevent screen sleep (best effort, browser support varies)
    let wakeLock: WakeLockSentinel | null = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && navigator.wakeLock) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
          // console.log('Screen Wake Lock activated.'); // Optional: for debugging success
        } catch (err) {
          console.warn(
            `Screen Wake Lock request failed: ${(err as Error).name} - ${(err as Error).message}. ` +
            `This can occur if permissions are denied or the feature is unsupported in the current context (e.g., an iframe missing the 'screen-wake-lock' policy). ` +
            `The screen may turn off during the session.`
          );
        }
      } else {
        console.warn('Screen Wake Lock API is not supported in this browser or context. The screen may turn off.');
      }
    };
    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().catch((err) => {
          // Silently catch release errors, or log if needed for debugging
          // console.warn('Failed to release wake lock:', (err as Error).message);
        });
      }
    };
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0 && initialDuration > 0) { // Ensure it only triggers if session was active
      // Session finished
      const actualDurationMinutes = Math.round((initialDuration - timeLeft) / 60);
      sessionStorage.setItem('actualDuration', actualDurationMinutes.toString());
      sessionStorage.setItem('sessionStartTime', startTimeRef.current?.toISOString() || new Date().toISOString());
      router.replace('/therapy/feedback');
      return;
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, router, initialDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    const endTime = new Date();
    let actualDurationMinutes = 0;
    if (startTimeRef.current) {
      actualDurationMinutes = Math.round((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60));
    } else { // Fallback if startTimeRef is somehow null
       actualDurationMinutes = Math.round((initialDuration - timeLeft) / 60);
    }
    
    sessionStorage.setItem('actualDuration', actualDurationMinutes.toString());
    sessionStorage.setItem('sessionStartTime', startTimeRef.current?.toISOString() || new Date().toISOString());
    router.replace('/therapy/feedback');
  };

  if (!preSessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading session data...</p>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 p-4 transition-colors duration-500"
      style={{ backgroundColor: GREEN_LIGHT_COLOR }}
      role="application"
      aria-label="Green light therapy session active"
    >
      <h1 
          className="absolute top-4 left-4 text-4xl font-mono font-bold"
          style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0,0,0,0.3)' }}
          aria-live="polite"
          aria-atomic="true"
      >
        {formatTime(timeLeft)}
      </h1>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48">
        <Button
          onClick={handleExit} // Changed from onLongPress
          className="bg-white/25 hover:bg-white/40 text-white border border-white/40 py-4 text-lg shadow-xl w-full" // Added w-full for consistency
          aria-label="Exit session"
        >
          Exit Session
        </Button>
      </div>

      <Card className="absolute top-4 right-4 bg-white/25 backdrop-blur-md border-white/40 text-white max-w-sm shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 mt-0.5 text-yellow-300 flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold">Important</h3>
              <p className="text-sm">
                Keep this screen active. Do not navigate away or lock your device.
                Relax and focus on the green light.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
