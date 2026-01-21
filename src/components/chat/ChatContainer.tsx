'use client';

import { useEffect, useRef } from 'react';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '@/stores/chatStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { sendChatMessage } from '@/lib/n8n-client';
import type { Message } from '@/types/chat';

const SUGGESTED_PROMPTS = [
  'Create a workout plan for me',
  'How do I build muscle?',
  'What should I eat after a workout?',
  'Help me lose weight',
];

export function ChatContainer() {
  const {
    messages,
    sessionId,
    isLoading,
    error,
    addMessage,
    setLoading,
    setError,
    initSession,
  } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const recordActivity = useGamificationStore((state) => state.recordActivity);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!sessionId || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(content, sessionId);

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.output,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

      // Record activity for gamification
      recordActivity();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="px-4 py-6 max-w-3xl mx-auto min-h-full">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                AI Fitness Coach
              </h2>
              <p className="text-muted-foreground max-w-sm mb-6">
                Your personal fitness companion. Ask me anything about workouts, nutrition, or building healthy habits.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed input area at bottom */}
      <div className="shrink-0 border-t bg-background">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
