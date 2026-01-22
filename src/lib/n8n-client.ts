import type { ChatRequest, ChatResponse } from '@/types/chat';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

// Security constants
const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 1;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Rate limiting state (client-side)
const requestTimestamps: number[] = [];

// Input validation patterns - block common prompt injection attempts
const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /forget\s+(all\s+)?(previous|prior|above)/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /###\s*(system|instruction)/i,
  /you\s+are\s+now\s+a/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(if\s+you\s+are|a)/i,
  /roleplay\s+as/i,
];

/**
 * Validates user input for security and format
 */
function validateInput(input: string): { valid: boolean; error?: string } {
  // Length checks
  if (input.length < MIN_MESSAGE_LENGTH) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  if (input.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds ${MAX_MESSAGE_LENGTH} characters` };
  }

  // Check for blocked patterns (prompt injection attempts)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return { valid: false, error: 'Message contains disallowed content' };
    }
  }

  return { valid: true };
}

/**
 * Sanitizes input by removing potentially dangerous characters
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace (but preserve newlines for formatting)
    .replace(/[\t\r]/g, ' ')
    .replace(/ +/g, ' ')
    // Remove control characters except newlines
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Client-side rate limiting check
 */
function checkRateLimit(): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  // Remove timestamps outside the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = requestTimestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export async function sendChatMessage(
  chatInput: string,
  sessionId: string
): Promise<ChatResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  // Rate limiting check
  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    throw new Error(`Too many requests. Please wait ${rateCheck.retryAfter} seconds.`);
  }

  // Sanitize input
  const sanitizedInput = sanitizeInput(chatInput);

  // Validate input
  const validation = validateInput(sanitizedInput);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid input');
  }

  // Record this request for rate limiting
  requestTimestamps.push(Date.now());

  const request: ChatRequest = {
    chatInput: sanitizedInput,
    sessionId,
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
