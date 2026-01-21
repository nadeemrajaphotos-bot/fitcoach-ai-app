'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { GamificationPanel } from '@/components/gamification/GamificationPanel';
import { Dumbbell, RotateCcw, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useChatStore } from '@/stores/chatStore';
import { useGamificationStore } from '@/stores/gamificationStore';

function Header() {
  const clearMessages = useChatStore((state) => state.clearMessages);
  const { level, currentStreak } = useGamificationStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b px-4 py-3 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold">AI Fitness Coach</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Mobile gamification toggle */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-2"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs">Lv.{level}</span>
              {currentStreak > 0 && (
                <span className="text-xs text-orange-500">{currentStreak}d</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Your Progress</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <GamificationPanel />
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex">
        {/* Main chat area */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer />
        </div>
        {/* Right sidebar - gamification panel (hidden on mobile) */}
        <aside className="hidden lg:flex w-80 border-l bg-muted/30 flex-col">
          <GamificationPanel />
        </aside>
      </div>
    </main>
  );
}
