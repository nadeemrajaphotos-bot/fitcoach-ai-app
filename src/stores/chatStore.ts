import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message } from '@/types/chat';
import { generateSessionId } from '@/lib/n8n-client';

interface ChatState {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  error: string | null;
}

interface ChatActions {
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  initSession: () => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: '',
      isLoading: false,
      error: null,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearMessages: () =>
        set({
          messages: [],
          sessionId: generateSessionId(),
        }),

      initSession: () => {
        const state = get();
        if (!state.sessionId) {
          set({ sessionId: generateSessionId() });
        }
      },
    }),
    {
      name: 'fitness-coach-chat',
      partialize: (state) => ({
        messages: state.messages.slice(-50),
        sessionId: state.sessionId,
      }),
    }
  )
);
