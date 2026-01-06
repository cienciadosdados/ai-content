import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ChevronRight, Sparkles, Video, Youtube } from "lucide-react";
import Link from "next/link";
import { PodcastUploader } from "@/components/podcast-uploader";
import { Button } from "@/components/ui/button";
import { FloatingGrid } from "@/components/ui/floating-grid";
import { MouseGradient } from "@/components/ui/mouse-gradient";
import { SonarBadge } from "@/components/ui/sonar-badge";

export async function HeroSection() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-black">
      <MouseGradient />
      <FloatingGrid />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <SonarBadge text="Powered by AI PRO EXPERT" className="mb-6" />
          
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-white">Transforme vídeos em</span>
            <br />
            <span className="text-emerald-400">conteúdo multi-plataforma</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Cole um link do <span className="text-emerald-400">YouTube</span> ou faça upload de áudio.
            Receba resumos, posts para redes sociais, títulos e hashtags{" "}
            <span className="text-emerald-400">em segundos.</span>
          </p>
        </div>

          {isSignedIn ? (
          <div className="mt-10 space-y-6">
            <div className="max-w-2xl mx-auto rounded-2xl border border-emerald-500/20 bg-black/60 backdrop-blur-sm p-8">
              <PodcastUploader />
            </div>
            <div className="text-center">
              <Link href="/dashboard/projects">
                <Button variant="outline" className="text-slate-300 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-white">
                  Ver Meus Projetos
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-center justify-center gap-4">
              <SignInButton mode="modal">
                <Button className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
                  <Sparkles className="h-5 w-5" />
                  Começar Agora
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Youtube className="h-4 w-4 text-emerald-500" />
                Suporte a YouTube
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4 text-emerald-500" />
                Upload de áudio
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
