'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dumbbell } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 py-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-emerald-600 text-white">
          <Dumbbell className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Fitness Coach</p>
        <div className="inline-block rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
