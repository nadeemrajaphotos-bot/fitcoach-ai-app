'use client';

import { useGamificationStore } from '@/stores/gamificationStore';
import { StreakCounter } from './StreakCounter';
import { LevelProgress } from './LevelProgress';
import { WeeklyGoals } from './WeeklyGoals';
import { BadgeGrid } from './BadgeGrid';
import { MessageSquare, Calendar } from 'lucide-react';

export function GamificationPanel() {
  const {
    currentStreak,
    level,
    totalXP,
    badges,
    weeklyGoals,
    totalSessions,
    totalMessages,
  } = useGamificationStore();

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <h2 className="font-semibold text-lg mb-1">Your Progress</h2>
        <p className="text-sm text-muted-foreground">Keep up the momentum!</p>
      </div>

      <StreakCounter streak={currentStreak} />

      <LevelProgress level={level} totalXP={totalXP} />

      <WeeklyGoals goals={weeklyGoals} />

      <BadgeGrid earnedBadges={badges} />

      {/* Stats */}
      <div className="rounded-xl bg-muted p-4">
        <span className="font-semibold text-sm">Stats</span>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{totalMessages}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
