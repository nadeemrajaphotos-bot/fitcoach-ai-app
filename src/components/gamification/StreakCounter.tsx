'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl p-4',
        isActive ? 'bg-orange-50 dark:bg-orange-950/30' : 'bg-muted',
        className
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          isActive
            ? 'bg-orange-500 text-white'
            : 'bg-muted-foreground/20 text-muted-foreground'
        )}
      >
        <Flame className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold">{streak}</p>
        <p className="text-sm text-muted-foreground">
          {streak === 1 ? 'Day Streak' : 'Days Streak'}
        </p>
      </div>
    </div>
  );
}
