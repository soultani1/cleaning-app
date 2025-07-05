import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  timeLeft: number; // الوقت المتبقي بالثواني
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  progress: number; // النسبة المئوية للتقدم (0-100)
}

export interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTime: (seconds: number) => void;
}

export interface UseTimerOptions {
  initialTime: number; // الوقت الابتدائي بالثواني
  onComplete?: () => void; // callback عند انتهاء الوقت
  onTick?: (timeLeft: number) => void; // callback كل ثانية
  autoStart?: boolean; // هل يبدأ تلقائياً
}

export function useTimer(options: UseTimerOptions): [TimerState, TimerControls] {
  const {
    initialTime,
    onComplete,
    onTick,
    autoStart = false
  } = options;

  // State management
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [originalTime, setOriginalTime] = useState(initialTime);

  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // حساب النسبة المئوية للتقدم
  const progress = originalTime > 0 ? ((originalTime - timeLeft) / originalTime) * 100 : 0;

  // تنظيف المؤقت
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // بدء المؤقت
  const start = useCallback(() => {
    if (timeLeft > 0 && !isCompleted) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [timeLeft, isCompleted]);

  // إيقاف مؤقت
  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  // إعادة تعيين المؤقت
  const reset = useCallback(() => {
    clearTimer();
    setTimeLeft(originalTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
  }, [originalTime, clearTimer]);

  // تعيين وقت جديد
  const setTime = useCallback((seconds: number) => {
    clearTimer();
    setTimeLeft(seconds);
    setOriginalTime(seconds);
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
  }, [clearTimer]);

  // Main timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // استدعاء onTick callback
          if (onTick) {
            onTick(newTime);
          }

          // التحقق من انتهاء الوقت
          if (newTime <= 0) {
            setIsRunning(false);
            setIsCompleted(true);
            
            // استدعاء onComplete callback
            if (onComplete) {
              onComplete();
            }
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    // Cleanup function
    return () => clearTimer();
  }, [isRunning, timeLeft, onComplete, onTick, clearTimer]);

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // إعداد الوقت الابتدائي عند تغيير initialTime
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(initialTime);
      setOriginalTime(initialTime);
    }
  }, [initialTime, isRunning, isPaused]);

  const timerState: TimerState = {
    timeLeft,
    isRunning,
    isPaused,
    isCompleted,
    progress: Math.min(100, Math.max(0, progress))
  };

  const timerControls: TimerControls = {
    start,
    pause,
    reset,
    setTime
  };

  return [timerState, timerControls];
}

// Helper function لتحويل الثواني إلى تنسيق MM:SS
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// أوقات افتراضية للمهام المختلفة (بالدقائق)
export const DEFAULT_TASK_TIMES = {
  kitchen: 25, // 25 دقيقة للمطبخ
  bathroom: 15, // 15 دقيقة للحمام
  bedroom: 20, // 20 دقيقة للغرفة
  living: 30, // 30 دقيقة للصالة
  cleaning: 20, // 20 دقيقة للتنظيف العام
  organizing: 25, // 25 دقيقة للتنظيم
  default: 20 // الوقت الافتراضي
} as const;

// Helper function للحصول على الوقت الافتراضي بناءً على نوع المهمة
export function getDefaultTaskTime(taskName: string): number {
  const lowerTaskName = taskName.toLowerCase();
  
  if (lowerTaskName.includes('kitchen') || lowerTaskName.includes('مطبخ')) {
    return DEFAULT_TASK_TIMES.kitchen * 60; // تحويل إلى ثواني
  } else if (lowerTaskName.includes('bathroom') || lowerTaskName.includes('حمام')) {
    return DEFAULT_TASK_TIMES.bathroom * 60;
  } else if (lowerTaskName.includes('bedroom') || lowerTaskName.includes('غرفة')) {
    return DEFAULT_TASK_TIMES.bedroom * 60;
  } else if (lowerTaskName.includes('living') || lowerTaskName.includes('صالة')) {
    return DEFAULT_TASK_TIMES.living * 60;
  } else if (lowerTaskName.includes('organiz') || lowerTaskName.includes('تنظيم')) {
    return DEFAULT_TASK_TIMES.organizing * 60;
  } else {
    return DEFAULT_TASK_TIMES.default * 60;
  }
}