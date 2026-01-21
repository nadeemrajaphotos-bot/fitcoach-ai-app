'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateCurrentLevelXP, XP_PER_LEVEL } from '@/types/gamification';

interface LevelProgressProps {
  level: number;
  totalXP: number;
  className?: string;
}

export function LevelProgress({ level, totalXP, className }: LevelProgressProps) {
  const currentLevelXP = calculateCurrentLevelXP(totalXP);
  const progressPercent = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <div className={cn('rounded-xl bg-muted p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
            <Star className="h-4 w-4" />
          </div>
          <span className="font-semibold">Level {level}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentLevelXP}/{XP_PER_LEVEL} XP
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted-foreground/20">
        <div
          className="h-full rounded-full bg-yellow-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
