/**
 * YouTube Transcript Extraction API
 * 
 * Proxy para o microserviço Python que usa youtube-transcript-api.
 * Extrai transcrições diretamente - sem precisar de FFmpeg!
 */

import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

// URL do serviço Python (local ou produção)
const PYTHON_SERVICE_URL = process.env.YOUTUBE_SERVICE_URL || "http://127.0.0.1:5000";

// Validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get YouTube URL from request
    const { url } = await request.json();
    
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL do YouTube é obrigatória" },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: "URL do YouTube inválida" },
        { status: 400 }
      );
    }

    // Call Python service
    const response = await fetch(`${PYTHON_SERVICE_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, language: "pt" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Erro ao extrair transcrição" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("YouTube extraction error:", error);
    
    // Check if Python service is running
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: "Serviço de extração não está rodando. Inicie o serviço Python." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao processar vídeo do YouTube" },
      { status: 500 }
    );
  }
}
