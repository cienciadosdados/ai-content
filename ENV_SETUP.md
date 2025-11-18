# Environment Variables Setup

This document describes all the environment variables needed to run the AI Podcast Assistant.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Vercel Blob Storage

Get your token from: https://vercel.com/dashboard/stores

```bash
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

### Convex Database

Get your deployment URL from: https://dashboard.convex.dev

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your_convex_deploy_key_here
```

### Clerk Authentication

Get your keys from: https://dashboard.clerk.com

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### Inngest Background Jobs

Get your keys from: https://app.inngest.com

```bash
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### AssemblyAI (for transcription)

Get your API key from: https://www.assemblyai.com/dashboard

```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

### OpenAI (for content generation)

Get your API key from: https://platform.openai.com/api-keys

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

## Setup Instructions

1. Copy this template to `.env.local`:
   ```bash
   cp ENV_SETUP.md .env.local
   ```

2. Replace all placeholder values with your actual API keys

3. Ensure `.env.local` is in your `.gitignore` (it should be by default)

4. Restart your development server after adding environment variables

## Verification

You can verify your setup by checking:
- Convex: Should connect automatically when running `npm run dev`
- Clerk: Sign in should work on the homepage
- Vercel Blob: Upload functionality should work
- Inngest: Check the Inngest dashboard for function registrations

