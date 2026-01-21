export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface WeeklyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface GamificationState {
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;

  // XP & Level
  totalXP: number;
  level: number;

  // Badges
  badges: Badge[];

  // Weekly Goals
  weeklyGoals: WeeklyGoal[];

  // Stats
  totalSessions: number;
  totalMessages: number;
}

export const BADGES: Badge[] = [
  { id: 'first-chat', name: 'First Steps', description: 'Started your fitness journey', icon: '🎯' },
  { id: 'streak-3', name: 'On Fire', description: '3 day streak', icon: '🔥' },
  { id: 'streak-7', name: 'Week Warrior', description: '7 day streak', icon: '💪' },
  { id: 'streak-30', name: 'Dedicated', description: '30 day streak', icon: '🏆' },
  { id: 'messages-10', name: 'Conversationalist', description: 'Sent 10 messages', icon: '💬' },
  { id: 'messages-50', name: 'Engaged', description: 'Sent 50 messages', icon: '🗣️' },
  { id: 'level-5', name: 'Rising Star', description: 'Reached level 5', icon: '⭐' },
  { id: 'level-10', name: 'Fitness Pro', description: 'Reached level 10', icon: '🌟' },
];

export const XP_PER_MESSAGE = 10;
export const XP_PER_LEVEL = 100;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calculateXPForNextLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function calculateCurrentLevelXP(xp: number): number {
  return xp % XP_PER_LEVEL;
}
