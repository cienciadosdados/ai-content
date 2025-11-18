# AssemblyAI Integration Guide

## 🎯 What We've Implemented

Real AI transcription using AssemblyAI with advanced features:
- ✅ **Automatic transcription** with word-level timestamps
- ✅ **Speaker diarization** (identifies who's speaking)
- ✅ **Auto chapters** (automatically detects topic changes)
- ✅ **Direct URL support** (no need to download files first)

## 🔧 How It Works

### 1. Upload Flow

```typescript
// User uploads file → Vercel Blob
const blob = await upload(file.name, file, {
  access: "public",
  handleUploadUrl: "/api/upload",
});

// Create project and trigger Inngest
await fetch("/api/projects/create", {
  body: JSON.stringify({ fileUrl: blob.url, ... }),
});
```

### 2. Inngest Workflow

The `podcast-processor` function processes the file:

#### Step 1: Extract Audio (if video)
```typescript
// For video files, extract audio using FFmpeg
// For audio files, skip this step
const audioUrl = isVideo ? extractedAudioUrl : fileUrl;
```

#### Step 2: Transcribe with AssemblyAI
```typescript
const transcriptResponse = await assemblyai.transcripts.transcribe({
  audio: audioUrl, // Vercel Blob URL
  speaker_labels: true, // Who's speaking
  auto_chapters: true, // Chapter detection
  format_text: true, // Better formatting
});

// Returns:
// - Full transcript text
// - Word-level timestamps
// - Speaker labels (Speaker A, B, C...)
// - Auto-generated chapters
```

#### Step 3: Generate Key Moments
```typescript
// Uses AssemblyAI's auto chapters!
const keyMoments = transcript.chapters.map(chapter => ({
  time: formatTime(chapter.start),
  timestamp: chapter.start / 1000,
  text: chapter.headline,
  description: chapter.summary,
}));

// No GPT needed - AssemblyAI does this automatically! 🎉
```

#### Step 4: Parallel Content Generation
- Generate summary (mock for now)
- Generate captions (real SRT from transcript)
- Generate titles (mock for now)
- Generate hashtags (mock for now)
- Generate social posts (mock for now)

## 📊 What You Get from AssemblyAI

### Transcript Response Structure:

```typescript
{
  id: "transcript-id",
  status: "completed",
  text: "Full transcript text...",
  
  // Word-level timing
  words: [
    { text: "Hello", start: 0, end: 500, confidence: 0.99 },
    { text: "world", start: 500, end: 1000, confidence: 0.98 },
  ],
  
  // Speaker identification
  utterances: [
    {
      speaker: "A",
      text: "Hello, welcome to the show",
      start: 0,
      end: 2000,
      confidence: 0.95,
    },
    {
      speaker: "B",
      text: "Thanks for having me!",
      start: 2000,
      end: 3500,
      confidence: 0.97,
    },
  ],
  
  // Auto-generated chapters
  chapters: [
    {
      headline: "Introduction",
      summary: "Host introduces the topic and guest",
      start: 0,
      end: 60000,
    },
    {
      headline: "Main Discussion",
      summary: "Deep dive into AI technology trends",
      start: 60000,
      end: 300000,
    },
  ],
}
```

## 🎨 How We Transform It

### For Convex Schema:

```typescript
// Group words into readable segments
const segments = groupWordsIntoSegments(transcript.words, 10);

// Save to Convex
await convex.mutation(api.projects.saveTranscript, {
  projectId,
  transcript: {
    text: transcript.text,
    segments: segments.map((seg, idx) => ({
      id: idx,
      start: seg.start / 1000, // ms → seconds
      end: seg.end / 1000,
      text: seg.text,
      words: seg.words,
    })),
  },
});
```

### For Key Moments:

```typescript
// Use AssemblyAI chapters directly!
const keyMoments = transcript.chapters.map(chapter => ({
  time: "HH:MM:SS",
  timestamp: chapter.start / 1000,
  text: chapter.headline,
  description: chapter.summary,
}));
```

## 💰 Pricing

**AssemblyAI Pricing** (as of 2024):
- **Core** (transcription only): $0.00025/second = $0.015/minute
- **Best** (with speaker labels + chapters): $0.00031/second = $0.031/minute

**Example Costs:**
- 10-minute podcast: $0.31
- 30-minute podcast: $0.93
- 60-minute podcast: $1.86

**Note:** Much more valuable than basic transcription due to:
- Speaker identification
- Automatic chapters
- Better accuracy
- No file size limits

## 🔐 Security

Files are accessed via:
- Public Vercel Blob URLs (required for AssemblyAI)
- Application-level access control (Convex userId checks)
- Random URL suffixes (hard to guess)

AssemblyAI automatically deletes transcripts after 30 days for privacy.

## 🚀 Testing

1. **Upload a podcast file** (audio or video, max 100MB)
2. **Check the project dashboard** - you'll see real-time updates as:
   - Transcription runs (takes ~10-30% of audio duration)
   - Key moments are extracted from auto chapters
   - Captions are generated
3. **View results**:
   - Full transcript with timestamps
   - Auto-detected key moments (from chapters!)
   - Speaker-identified dialogue (in utterances)

## 🐛 Troubleshooting

### "AssemblyAI transcription failed"
- Check that `ASSEMBLYAI_API_KEY` is set in `.env.local`
- Verify the API key is valid at https://www.assemblyai.com/dashboard
- Check that the audio URL is publicly accessible

### "Cannot access uploaded file"
- Ensure Vercel Blob URLs are public
- Check that the file was uploaded successfully
- Verify network connectivity

### No chapters generated
- AssemblyAI may not generate chapters for very short audio (<5 minutes)
- Check the `auto_chapters` option is enabled
- View the full transcript response for debugging

## 📚 Resources

- [AssemblyAI Docs](https://www.assemblyai.com/docs)
- [Speaker Diarization](https://www.assemblyai.com/docs/speech-to-text/speaker-diarization)
- [Auto Chapters](https://www.assemblyai.com/docs/speech-to-text/auto-chapters)
- [Pricing](https://www.assemblyai.com/pricing)

## 🎉 Benefits Over Mock Implementation

**Before (Mock):**
- Fake transcript data
- No real timestamps
- No speaker identification
- Manual key moment creation needed

**After (AssemblyAI):**
- ✅ Real, accurate transcription
- ✅ Precise word & segment timestamps
- ✅ Automatic speaker identification
- ✅ **Auto-generated chapters = instant key moments!**
- ✅ Production-ready quality

