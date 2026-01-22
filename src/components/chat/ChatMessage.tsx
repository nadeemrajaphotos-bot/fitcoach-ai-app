'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Dumbbell } from 'lucide-react';
import type { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

/**
 * Sanitizes LLM output to prevent XSS and remove potential instruction leakage
 */
function sanitizeOutput(content: string): string {
  // Remove potential system prompt leakage patterns
  const leakagePatterns = [
    /\[SYSTEM\][\s\S]*?\[\/SYSTEM\]/gi,
    /\[INST\][\s\S]*?\[\/INST\]/gi,
    /<\|im_start\|>[\s\S]*?<\|im_end\|>/gi,
    /###\s*System[\s\S]*?###/gi,
    /You are an AI assistant[\s\S]*?(?=\n\n|\z)/i,
    /As an AI fitness coach,?\s*I\s*(am|was)\s*(programmed|instructed|told)/gi,
  ];

  let sanitized = content;
  for (const pattern of leakagePatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove any HTML tags that might have slipped through
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized.trim();
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Sanitize assistant messages
  const displayContent = isUser ? message.content : sanitizeOutput(message.content);

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
            <p className="whitespace-pre-wrap text-left">{displayContent}</p>
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
                  // Code - sanitize to prevent XSS
                  code: ({ children }) => (
                    <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                  ),
                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-emerald-500 pl-3 italic my-2">{children}</blockquote>
                  ),
                  // Horizontal rule
                  hr: () => <hr className="my-3 border-border" />,
                  // Block dangerous elements
                  script: () => null,
                  iframe: () => null,
                  object: () => null,
                  embed: () => null,
                  // Sanitize links
                  a: ({ href, children }) => {
                    // Only allow safe protocols
                    const safeHref = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/'))
                      ? href
                      : '#';
                    return (
                      <a
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
