'use client';

import { cn } from '@/lib/utils';
import { BADGES, type Badge } from '@/types/gamification';

interface BadgeGridProps {
  earnedBadges: Badge[];
  className?: string;
}

export function BadgeGrid({ earnedBadges, className }: BadgeGridProps) {
  const earnedIds = earnedBadges.map((b) => b.id);

  return (
    <div className={cn('rounded-xl bg-muted p-4', className)}>
      <span className="font-semibold text-sm">Badges</span>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {BADGES.map((badge) => {
          const isEarned = earnedIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all',
                isEarned
                  ? 'bg-background shadow-sm'
                  : 'bg-muted-foreground/10 grayscale opacity-40'
              )}
              title={isEarned ? `${badge.name}: ${badge.description}` : 'Locked'}
            >
              {badge.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
