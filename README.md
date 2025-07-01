# Cursor AI Chat

A modern AI chat application built with Next.js 15, featuring real-time streaming responses, multiple AI models, and a beautiful user interface.

## Features

- 🤖 **Multiple AI Models**: Support for various free models via OpenRouter
- 💬 **Real-time Streaming**: Live streaming responses for natural conversations
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📱 **Mobile Friendly**: Optimized for all device sizes
- 💾 **Conversation History**: Save and manage your chat history
- ⚙️ **Customizable Settings**: Personalize your chat experience
- 🔄 **Export/Import**: Backup and restore your conversations

## Available Models

- **Llama 3.2 3B** (Meta) - Fast and efficient
- **Llama 3.2 1B** (Meta) - Lightweight for simple tasks
- **Gemma 2 9B** (Google) - Instruction-tuned model
- **Phi-3 Mini** (Microsoft) - Compact and capable
- **Qwen 2 7B** (Alibaba) - Multilingual support

## Getting Started

### 1. Install Dependencies

This project uses **pnpm** as the package manager for better performance and disk efficiency:

```bash
pnpm install
```

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

### 2. Set Up OpenRouter API (Optional)

For real AI responses, you'll need an OpenRouter API key:

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your free API key
3. Copy `.env.example` to `.env.local`
4. Add your API key:

```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key_here
```

**Note**: The app works without an API key using mock responses for demonstration.

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

## Recent Updates

### ✅ Fixed Dark Mode Toggle
- **Issue**: Dark mode toggle wasn't working properly
- **Solution**: 
  - Fixed CSS to include explicit `.dark` class styles alongside media queries
  - Improved ThemeProvider to properly sync with the store
  - Simplified theme logic to avoid duplication between components
  - All three theme modes now work correctly: Light, Dark, and System

### 📦 Migrated from npm to pnpm
- **Benefits**: 
  - Faster installation and better disk efficiency
  - Improved dependency resolution
  - Better monorepo support
- **Changes**:
  - Removed `package-lock.json` and replaced with `pnpm-lock.yaml`
  - Updated package.json with pnpm-specific configurations
  - Added `.npmrc` for pnpm settings

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm install:clean` - Clean install (removes node_modules and lock file)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
