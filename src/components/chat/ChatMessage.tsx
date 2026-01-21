'use client';

import ReactMarkdown from 'react-markdown';
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
            'inline-block rounded-2xl px-4 py-3 text-sm max-w-[85%]',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-left">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-left">
              <ReactMarkdown
                components={{
                  // Headings
                  h1: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-2 first:mt-0">{children}</h3>,
                  h2: ({ children }) => <h4 className="text-sm font-semibold mt-3 mb-2 first:mt-0">{children}</h4>,
                  h3: ({ children }) => <h5 className="text-sm font-semibold mt-2 mb-1 first:mt-0">{children}</h5>,
                  // Paragraphs
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  // Lists
                  ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  // Strong/Bold
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  // Emphasis/Italic
                  em: ({ children }) => <em className="italic">{children}</em>,
                  // Code
                  code: ({ children }) => (
                    <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                  ),
                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-emerald-500 pl-3 italic my-2">{children}</blockquote>
                  ),
                  // Horizontal rule
                  hr: () => <hr className="my-3 border-border" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
