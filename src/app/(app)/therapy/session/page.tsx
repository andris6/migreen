'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PreSessionData } from '@/types';
import { LongPressButton } from '@/components/therapy/LongPressButton';
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
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error(`${(err as Error).name}, ${(err as Error).message}`);
        }
      }
    };
    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
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
      className="fixed inset-0 flex flex-col items-center justify-center p-4 transition-colors duration-500"
      style={{ backgroundColor: GREEN_LIGHT_COLOR }}
      role="application"
      aria-label="Green light therapy session active"
    >
      <div className="text-center">
        <h1 
            className="text-8xl md:text-9xl font-mono font-bold mb-12"
            style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(0,0,0,0.3)' }}
            aria-live="polite"
            aria-atomic="true"
        >
          {formatTime(timeLeft)}
        </h1>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48">
        <LongPressButton
          onLongPress={handleExit}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white py-4 text-lg shadow-xl"
          aria-label="Long press to exit session"
        >
          Exit Session
        </LongPressButton>
      </div>

      <Card className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white max-w-xs p-0">
        <CardContent className="p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-300" />
            <div>
              <h3 className="text-sm font-semibold">Important</h3>
              <p className="text-xs">
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
