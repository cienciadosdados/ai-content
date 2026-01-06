import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function CtaSection() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <section className="py-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 rounded-2xl blur-2xl" />
          <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Pronto para transformar seu conteúdo?</h3>
            <p className="text-slate-400 mb-6">Comece agora e veja a mágica acontecer em segundos.</p>
            {isSignedIn ? (
              <Link href="/dashboard/projects">
                <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  <Video className="h-5 w-5" />
                  CRIAR NOVO PROJETO
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  <Video className="h-5 w-5" />
                  COMEÇAR AGORA
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
