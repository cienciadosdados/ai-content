# AI Podcast Assistant

An AI-powered SaaS platform that transforms podcast audio files into actionable content including transcripts, summaries, social posts, key moments, titles, and hashtags.

## 🚀 Features

- **Drag & Drop Upload**: Easy file upload with progress tracking (up to 100MB)
- **AI Transcription**: Accurate transcripts with timestamps using OpenAI Whisper
- **Smart Summaries**: Comprehensive summaries with key points and insights
- **Key Moments**: Automatically identified important timestamps
- **Social Content**: Platform-optimized posts for Twitter, LinkedIn, Instagram, TikTok, etc.
- **SEO Optimization**: Auto-generated titles and hashtags
- **Real-time Updates**: Live processing status updates via Convex
- **Modern UI**: Built with Next.js 15, shadcn/ui, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Authentication**: Clerk
- **Database**: Convex (Real-time)
- **Storage**: Vercel Blob
- **Background Jobs**: Inngest
- **File Upload**: react-dropzone, Vercel Blob SDK
- **AI**: AssemblyAI (transcription, speaker labels, auto chapters)

## 📋 Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Accounts for:
  - [Vercel](https://vercel.com) (for Blob storage)
  - [Convex](https://convex.dev) (for database)
  - [Clerk](https://clerk.com) (for authentication)
  - [Inngest](https://inngest.com) (for background jobs)
  - [AssemblyAI](https://www.assemblyai.com) (for transcription)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-podcast-saas-inngest-coderabbit-clerk
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

Create a `.env.local` file with:
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `ASSEMBLYAI_API_KEY`

### 4. Set up Convex

```bash
pnpm convex dev
```

This will:
- Initialize your Convex project
- Push the schema to your deployment
- Start the Convex development server

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 6. Set up Inngest (for background jobs)

Visit [http://localhost:3000/api/inngest](http://localhost:3000/api/inngest) to sync your functions with Inngest.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── upload/          # Upload API route (Vercel Blob)
│   │   └── inngest/         # Inngest function handler
│   ├── projects/
│   │   ├── [id]/           # Project detail page
│   │   └── page.tsx        # Projects list
│   ├── upload/             # Upload page
│   ├── convex-provider.tsx # Convex + Clerk integration
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── upload-dropzone.tsx
│   ├── upload-progress.tsx
│   ├── project-status-card.tsx
│   └── processing-steps.tsx
├── convex/
│   ├── schema.ts           # Database schema
│   └── projects.ts         # Queries & mutations
├── inngest/
│   ├── client.ts           # Inngest client
│   └── functions/
│       └── podcast-processor.ts # Main processing workflow
└── lib/
    └── utils.ts            # Utility functions
```

## 🔄 How It Works

1. **Upload**: User uploads podcast audio file via drag & drop (max 100MB)
2. **Storage**: File is uploaded to Vercel Blob with progress tracking
3. **Database**: Project record is created in Convex
4. **Processing**: Inngest workflow is triggered with these steps:
   - **Linear Phase**:
     - Transcribe audio
   - **Parallel Phase**:
     - Generate key moments
     - Generate summary
     - Generate captions (SRT)
     - Generate titles
     - Generate hashtags
   - **Join Phase**:
     - Save all results to Convex
     - Update project status
5. **Real-time UI**: Dashboard updates automatically via Convex subscriptions

## 🎨 UI Components

Built with shadcn/ui:
- Button
- Card
- Progress
- Badge
- Input
- Label
- Tabs
- Sonner (Toast notifications)

## 📝 Current Implementation

This MVP includes:
- ✅ Complete upload flow with progress tracking (drag & drop)
- ✅ Real-time database integration with Convex
- ✅ Workflow orchestration with Inngest
- ✅ **Real AI transcription with AssemblyAI**
  - Speaker identification
  - Auto-generated chapters (used for key moments!)
  - Word-level timestamps
- ⏳ Content generation (summary, social posts, etc.) uses mock data for now

## 🔮 Next Steps

To complete the AI implementation:

1. ~~**Add transcription**~~ ✅ **DONE with AssemblyAI!**
   - Real transcription with speaker labels
   - Auto chapters for key moments

2. **Add GPT content generation** (currently mock data):
   - Implement summary generation
   - Implement key moments extraction
   - Implement social posts generation
   - Implement titles & hashtags generation

3. **Enhance features**:
   - Pagination for projects list
   - Search & filter projects
   - Export functionality
   - Usage analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database by [Convex](https://convex.dev/)
- Background jobs by [Inngest](https://inngest.com/)
- Authentication by [Clerk](https://clerk.com/)
- Storage by [Vercel Blob](https://vercel.com/storage/blob)
