"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Hash,
  type LucideIcon,
  MessageSquare,
  Sparkles,
  Zap,
  Users,
  Youtube,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Youtube,
    title: "YouTube & Audio",
    description:
      "Cole um link do YouTube ou faça upload de áudio. Extraímos o conteúdo automaticamente.",
  },
  {
    icon: Sparkles,
    title: "Análise com IA",
    description:
      "AssemblyAI transcreve e analisa seu conteúdo para alimentar todas as features de IA.",
  },
  {
    icon: FileText,
    title: "Resumos Inteligentes",
    description:
      "Gere resumos completos com pontos-chave e insights do seu conteúdo.",
  },
  {
    icon: MessageSquare,
    title: "Posts para Redes",
    description:
      "Posts otimizados para Twitter, LinkedIn, Instagram, TikTok, YouTube e Facebook.",
  },
  {
    icon: Hash,
    title: "Títulos & Hashtags",
    description:
      "Títulos SEO-friendly e hashtags específicas por plataforma automaticamente.",
  },
  {
    icon: Zap,
    title: "Momentos-Chave",
    description:
      "Identifique momentos virais e gere timestamps para YouTube automaticamente.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-white mb-4"
        >
          Tudo que você precisa em{" "}
          <span className="text-emerald-400">uma plataforma</span>
        </motion.h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Ferramentas de IA poderosas para amplificar o alcance do seu conteúdo
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(16, 185, 129, 0.5)" }}
                className="rounded-2xl border border-emerald-500/20 bg-black/40 backdrop-blur-sm p-6 cursor-pointer transition-colors"
              >
                <div className="mb-4 inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
