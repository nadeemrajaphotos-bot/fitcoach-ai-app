'use client';

import { Target, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WeeklyGoal } from '@/types/gamification';

interface WeeklyGoalsProps {
  goals: WeeklyGoal[];
  className?: string;
}

export function WeeklyGoals({ goals, className }: WeeklyGoalsProps) {
  return (
    <div className={cn('rounded-xl bg-muted p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-emerald-600" />
        <span className="font-semibold text-sm">Weekly Goals</span>
      </div>
      <div className="space-y-3">
        {goals.map((goal) => {
          const isComplete = goal.current >= goal.target;
          const progressPercent = Math.min((goal.current / goal.target) * 100, 100);

          return (
            <div key={goal.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{goal.name}</span>
                <div className="flex items-center gap-1">
                  {isComplete && (
                    <Check className="h-3 w-3 text-emerald-600" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {goal.current}/{goal.target}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted-foreground/20">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isComplete ? 'bg-emerald-500' : 'bg-emerald-400'
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
