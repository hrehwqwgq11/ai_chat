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

- **Llama 3.3 70B** (Meta) - Latest large model with enhanced capabilities
- **Llama 3.3 8B** (Meta) - Balanced performance and efficiency
- **Llama 3.2 3B/1B** (Meta) - Fast and lightweight options
- **Llama 3.2 11B Vision** (Meta) - Multimodal with vision capabilities
- **Gemma 3 12B/1B** (Google) - Latest Gemma models
- **Gemma 2 9B** (Google) - Efficient instruction-tuned model
- **Qwen 2.5 72B/7B** (Alibaba) - Large multilingual models
- **QwQ 32B** (Alibaba) - Reasoning-focused model
- **Mistral 7B/Small 24B** (Mistral AI) - High-quality open-source models
- **DeepSeek V3** (DeepSeek) - Advanced reasoning and coding
- **Phi-3 Mini** (Microsoft) - Compact with large context

All models are available for **free** through OpenRouter!

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
