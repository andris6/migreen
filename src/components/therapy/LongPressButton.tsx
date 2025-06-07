"use client";

import { useState, useRef, useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LongPressButtonProps extends ButtonProps {
  onLongPress: () => void;
  pressDuration?: number; // in milliseconds
  children: React.ReactNode;
}

export function LongPressButton({ 
  onLongPress, 
  pressDuration = 2000, 
  children, 
  className,
  ...props 
}: LongPressButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    setIsPressing(true);
    setProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / pressDuration) * 100);
      setProgress(currentProgress);
    }, 50);

    timerRef.current = setTimeout(() => {
      onLongPress();
      resetPress();
    }, pressDuration);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
  };
  
  const resetPress = () => {
    cancelPress();
  };

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Button
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress} // Cancel if mouse leaves button while pressing
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        className={`w-full ${className}`}
        {...props}
      >
        {children}
      </Button>
      {isPressing && (
        <Progress value={progress} className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md" />
      )}
    </div>
  );
}
