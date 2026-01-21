'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Dumbbell } from 'lucide-react';
import type { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 py-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-emerald-600 text-white'
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex-1 space-y-1',
          isUser ? 'text-right' : 'text-left'
        )}
      >
        <p className="text-xs font-medium text-muted-foreground">
          {isUser ? 'You' : 'Fitness Coach'}
        </p>
        <div
          className={cn(
            'inline-block rounded-2xl px-4 py-2.5 text-sm max-w-[85%]',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm'
          )}
        >
          <p className="whitespace-pre-wrap text-left">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
