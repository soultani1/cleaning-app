"use client";

import React, { useEffect, useState } from 'react';
import { useTimer, formatTime, getDefaultTaskTime } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle2,
  Settings
} from 'lucide-react';

interface TaskTimerProps {
  taskName: string;
  onComplete?: () => void;
  className?: string;
}

// Circular Progress Component
const CircularProgress: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ progress, size = 120, strokeWidth = 8, className = "" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        {/* Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const TaskTimer: React.FC<TaskTimerProps> = ({ 
  taskName, 
  onComplete,
  className = ""
}) => {
  const [customTime, setCustomTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  // Get default time for task
  const defaultTime = getDefaultTaskTime(taskName);
  const initialTime = customTime || defaultTime;

  // Enhanced audio functions
  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1 + index * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4 + index * 0.15);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + 0.4 + index * 0.15);
      });
    } catch (error) {
      console.log('Could not play completion sound');
    }
  };

  const playWarningSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play warning sound');
    }
  };

  // Use timer hook
  const [timerState, timerControls] = useTimer({
    initialTime,
    onComplete: () => {
      playCompletionSound();
      if (onComplete) {
        onComplete();
      }
    },
    onTick: (timeLeft) => {
      if (timeLeft === 10) {
        playWarningSound();
      }
    }
  });

  // Set custom time
  const handleCustomTime = (minutes: number) => {
    const seconds = minutes * 60;
    setCustomTime(seconds);
    timerControls.setTime(seconds);
    setShowSettings(false);
  };

  // Handle custom input
  const handleCustomInput = () => {
    const value = parseInt(customInput);
    if (value && value > 0 && value <= 480) {
      handleCustomTime(value);
      setCustomInput('');
    }
  };

  // Handle input key press
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomInput();
    }
  };

  // Get timer color based on state
  const getTimerColor = () => {
    if (timerState.isCompleted) return 'text-green-600';
    if (timerState.timeLeft <= 60) return 'text-red-500';
    if (timerState.timeLeft <= 300) return 'text-orange-500';
    return 'text-blue-600';
  };

  // Format time display for buttons
  const formatTimeDisplay = (minutes: number) => {
    if (minutes >= 60) {
      const hours = minutes / 60;
      return hours === Math.floor(hours) ? `${hours}h` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className={`bg-white shadow-lg border-0 ${className}`}>
      <CardContent className="p-6 text-center">
        {/* Task Title */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {taskName}
          </h3>
          <p className="text-sm text-gray-500">
            {timerState.isCompleted ? 'Completed!' : 
             timerState.isRunning ? 'In Progress...' : 
             timerState.isPaused ? 'Paused' : 'Ready to Start'}
          </p>
        </div>

        {/* Circular Progress and Time */}
        <div className="relative mb-6 flex justify-center">
          <CircularProgress 
            progress={timerState.progress} 
            size={140}
            strokeWidth={10}
          />
          
          {/* Time in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-2xl font-bold ${getTimerColor()} transition-colors`}>
              {formatTime(timerState.timeLeft)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(timerState.progress)}%
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3 mb-4">
          {!timerState.isRunning ? (
            <Button
              onClick={timerControls.start}
              disabled={timerState.isCompleted || timerState.timeLeft === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Play size={16} className="mr-2" />
              {timerState.isPaused ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button
              onClick={timerControls.pause}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            >
              <Pause size={16} className="mr-2" />
              Pause
            </Button>
          )}

          <Button
            onClick={timerControls.reset}
            variant="outline"
            className="px-4"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>

          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="px-4"
          >
            <Settings size={16} />
          </Button>
        </div>

        {/* Custom Time Settings */}
        {showSettings && (
          <div className="border-t pt-4 space-y-4">
            <p className="text-sm text-gray-600 mb-3">Set custom time:</p>
            
            {/* Quick Time Buttons */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Quick options:</p>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20, 25, 30, 45, 60].map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() => handleCustomTime(minutes)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Extended Time Options */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Longer sessions:</p>
              <div className="grid grid-cols-3 gap-2">
                {[90, 120, 180].map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() => handleCustomTime(minutes)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    {formatTimeDisplay(minutes)}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Custom Input */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Custom time:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="480"
                  placeholder="Minutes (1-480)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomInput}
                  disabled={!customInput || parseInt(customInput) <= 0 || parseInt(customInput) > 480}
                  className="text-xs px-4"
                >
                  Set
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Enter any time from 1 to 480 minutes (8 hours)
              </p>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {timerState.isCompleted && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center text-green-700">
              <CheckCircle2 size={20} className="mr-2" />
              <span className="font-medium">Great job! Task completed 🎉</span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-center">
          <Clock size={12} className="mr-1" />
          Default time: {Math.round(defaultTime / 60)} minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTimer;