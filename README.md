# AI Fitness Coach

A personalized AI fitness coaching web application powered by n8n workflows and LangChain.

## Features

- **AI-Powered Coaching**: Get personalized fitness advice, workout plans, and nutrition guidance
- **Conversation Memory**: The AI remembers your conversation context for better recommendations
- **Gamification System**: Track your progress with streaks, XP levels, badges, and weekly goals
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimalistic interface inspired by Linear/Notion

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Backend**: n8n workflow with LangChain Agent + Groq LLM

## Getting Started

### Prerequisites

- Node.js 18+
- n8n instance with the AI Fitness Coach workflow configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/ai-fitness-coach.git
cd ai-fitness-coach
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your n8n webhook URL:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/fitness-coach
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── chat/              # Chat interface components
│   │   ├── ChatContainer.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatMessage.tsx
│   ├── gamification/      # Progress tracking components
│   │   ├── GamificationPanel.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── LevelProgress.tsx
│   │   ├── WeeklyGoals.tsx
│   │   └── BadgeGrid.tsx
│   └── ui/                # shadcn/ui components
├── lib/
│   └── n8n-client.ts      # n8n API client
├── stores/
│   ├── chatStore.ts       # Chat state management
│   └── gamificationStore.ts # Gamification state
└── types/
    ├── chat.ts            # Chat type definitions
    └── gamification.ts    # Gamification types
```

## n8n Workflow Setup

The AI Fitness Coach requires an n8n workflow with:
- **Webhook Trigger**: POST endpoint for receiving messages
- **LangChain Agent**: AI processing with fitness coaching system prompt
- **Groq LLM**: llama-3.3-70b-versatile model
- **Window Buffer Memory**: Conversation context (10 messages)
- **Respond to Webhook**: JSON response with CORS headers

### Expected Request Format
```json
{
  "chatInput": "Your message here",
  "sessionId": "unique-session-id"
}
```

### Expected Response Format
```json
{
  "output": "AI response here",
  "sessionId": "unique-session-id"
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variable `NEXT_PUBLIC_N8N_WEBHOOK_URL` in Vercel settings
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | n8n webhook endpoint URL | Yes |

## Important Notes

### n8n Execution Limits
This project is designed to minimize n8n workflow executions. Each user message triggers one workflow execution. Monitor your n8n execution credits and consider implementing rate limiting for production use.

### Security
- Never commit `.env` files
- All API keys are stored in environment variables
- The webhook URL is public-facing (no authentication required by default)

## License

MIT
