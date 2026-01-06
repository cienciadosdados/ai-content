"use client";

import { useState } from "react";
import { Youtube, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface YouTubeInputProps {
  onExtracted: (data: {
    transcript: string;
    title: string;
    videoId: string;
    duration: number;
  }) => void;
  disabled?: boolean;
}

type ExtractStatus = "idle" | "extracting" | "success" | "error";

export function YouTubeInput({ onExtracted, disabled }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ExtractStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const handleExtract = async () => {
    if (!url.trim()) return;

    setStatus("extracting");
    setError(null);
    setProgress("Conectando ao YouTube...");

    try {
      setProgress("Extraindo transcrição...");
      
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao extrair transcrição");
      }

      setProgress("Transcrição obtida!");
      setStatus("success");

      // Notify parent component
      onExtracted({
        transcript: data.transcript,
        title: data.title,
        videoId: data.videoId,
        duration: data.duration,
      });

    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleReset = () => {
    setUrl("");
    setStatus("idle");
    setError(null);
    setProgress("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          <Input
            type="url"
            placeholder="Cole o link do YouTube aqui..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled || status === "extracting"}
            className="pl-10 bg-black/40 border-emerald-500/30 text-white placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>
        <Button
          onClick={status === "error" ? handleReset : handleExtract}
          disabled={disabled || status === "extracting" || (!url.trim() && status !== "error")}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-emerald-500/25"
        >
          {status === "extracting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Extraindo...
            </>
          ) : status === "error" ? (
            "Tentar Novamente"
          ) : (
            "Extrair"
          )}
        </Button>
      </div>

      {/* Status Messages */}
      {status === "extracting" && (
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress}
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          Transcrição extraída com sucesso!
        </div>
      )}

      {status === "error" && error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Supported formats hint */}
      {status === "idle" && (
        <p className="text-xs text-slate-500">
          Suporta: youtube.com/watch, youtu.be, youtube.com/shorts (vídeos com legendas)
        </p>
      )}
    </div>
  );
}
