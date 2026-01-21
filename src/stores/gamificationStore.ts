import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GamificationState,
  Badge,
  BADGES,
  XP_PER_MESSAGE,
  calculateLevel,
} from '@/types/gamification';

interface GamificationActions {
  recordActivity: () => void;
  checkAndAwardBadges: () => void;
  resetWeeklyGoals: () => void;
}

type GamificationStore = GamificationState & GamificationActions;

const getToday = () => new Date().toISOString().split('T')[0];

const initialWeeklyGoals = [
  { id: 'sessions', name: 'Chat Sessions', target: 5, current: 0 },
  { id: 'messages', name: 'Messages Sent', target: 20, current: 0 },
  { id: 'streak', name: 'Maintain Streak', target: 7, current: 0 },
];

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalXP: 0,
      level: 1,
      badges: [],
      weeklyGoals: initialWeeklyGoals,
      totalSessions: 0,
      totalMessages: 0,

      recordActivity: () => {
        const state = get();
        const today = getToday();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.currentStreak;
        let newSessions = state.totalSessions;

        // Update streak
        if (state.lastActivityDate !== today) {
          if (state.lastActivityDate === yesterdayStr) {
            newStreak = state.currentStreak + 1;
          } else if (state.lastActivityDate !== today) {
            newStreak = 1;
          }
          newSessions = state.totalSessions + 1;
        }

        const newXP = state.totalXP + XP_PER_MESSAGE;
        const newLevel = calculateLevel(newXP);
        const newMessages = state.totalMessages + 1;

        // Update weekly goals
        const updatedGoals = state.weeklyGoals.map((goal) => {
          if (goal.id === 'messages') {
            return { ...goal, current: Math.min(goal.current + 1, goal.target) };
          }
          if (goal.id === 'sessions' && state.lastActivityDate !== today) {
            return { ...goal, current: Math.min(goal.current + 1, goal.target) };
          }
          if (goal.id === 'streak') {
            return { ...goal, current: Math.min(newStreak, goal.target) };
          }
          return goal;
        });

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastActivityDate: today,
          totalXP: newXP,
          level: newLevel,
          totalSessions: newSessions,
          totalMessages: newMessages,
          weeklyGoals: updatedGoals,
        });

        // Check for new badges
        get().checkAndAwardBadges();
      },

      checkAndAwardBadges: () => {
        const state = get();
        const earnedBadgeIds = state.badges.map((b) => b.id);
        const newBadges: Badge[] = [];

        // Check each badge condition
        if (!earnedBadgeIds.includes('first-chat') && state.totalMessages >= 1) {
          const badge = BADGES.find((b) => b.id === 'first-chat')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('streak-3') && state.currentStreak >= 3) {
          const badge = BADGES.find((b) => b.id === 'streak-3')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('streak-7') && state.currentStreak >= 7) {
          const badge = BADGES.find((b) => b.id === 'streak-7')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('streak-30') && state.currentStreak >= 30) {
          const badge = BADGES.find((b) => b.id === 'streak-30')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('messages-10') && state.totalMessages >= 10) {
          const badge = BADGES.find((b) => b.id === 'messages-10')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('messages-50') && state.totalMessages >= 50) {
          const badge = BADGES.find((b) => b.id === 'messages-50')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('level-5') && state.level >= 5) {
          const badge = BADGES.find((b) => b.id === 'level-5')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (!earnedBadgeIds.includes('level-10') && state.level >= 10) {
          const badge = BADGES.find((b) => b.id === 'level-10')!;
          newBadges.push({ ...badge, unlockedAt: new Date() });
        }

        if (newBadges.length > 0) {
          set({ badges: [...state.badges, ...newBadges] });
        }
      },

      resetWeeklyGoals: () => {
        set({ weeklyGoals: initialWeeklyGoals });
      },
    }),
    {
      name: 'fitness-coach-gamification',
    }
  )
);
