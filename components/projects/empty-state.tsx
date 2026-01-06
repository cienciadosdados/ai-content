"use client";

import { Video, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-black/40 backdrop-blur-sm p-12 md:p-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="relative rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-8 w-fit mx-auto">
            <Video className="h-16 w-16 text-emerald-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white">Nenhum projeto ainda</h3>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Cole um link do YouTube ou faça upload de áudio para gerar resumos, posts e muito mais com IA
        </p>
        <Link href="/dashboard/upload">
          <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-emerald-500/25 shadow-lg px-8 py-4 text-base">
            <Upload className="mr-2 h-5 w-5" />
            Criar Primeiro Projeto
          </Button>
        </Link>
      </div>
    </div>
  );
}
