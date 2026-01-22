'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const MAX_MESSAGE_LENGTH = 2000;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = input.length;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;
  const showCharCount = charCount > MAX_MESSAGE_LENGTH * 0.8; // Show at 80% capacity

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Allow typing but enforce max length
    if (value.length <= MAX_MESSAGE_LENGTH + 100) {
      setInput(value);
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled && !isOverLimit) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workouts, nutrition, or fitness..."
            disabled={disabled}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH + 100}
            className={`w-full resize-none rounded-xl border bg-muted/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
              isOverLimit
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:ring-emerald-500 focus-visible:border-emerald-500'
            }`}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={disabled || !input.trim() || isOverLimit}
          size="icon"
          className="h-11 w-11 rounded-xl shrink-0 bg-emerald-600 hover:bg-emerald-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {showCharCount && (
        <div className={`text-xs mt-1 text-right ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
          {charCount}/{MAX_MESSAGE_LENGTH}
        </div>
      )}
    </div>
  );
}
