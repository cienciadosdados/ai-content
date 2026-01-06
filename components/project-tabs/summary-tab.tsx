"use client";

interface SummaryTabProps {
  summary?: {
    tldr: string;
    full: string;
    bullets: string[];
    insights: string[];
  };
}

export function SummaryTab({ summary }: SummaryTabProps) {
  // TabContent ensures this is never undefined at runtime
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-4 gradient-emerald-text">TL;DR</h3>
        <p className="text-lg text-slate-300 leading-relaxed wrap-break-word">
          {summary.tldr}
        </p>
      </div>

      <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-4 gradient-emerald-text">
          Resumo Completo
        </h3>
        <p className="text-slate-300 leading-relaxed wrap-break-word">
          {summary.full}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Points */}
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Pontos-Chave</h3>
          <ul className="space-y-3">
            {summary.bullets.map((bullet, idx) => (
              <li
                key={`${idx}-${bullet}`}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
              >
                <span className="text-slate-300 leading-relaxed wrap-break-word">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Insights */}
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Insights</h3>
          <ul className="space-y-3">
            {summary.insights.map((insight, idx) => (
              <li
                key={`${idx}-${insight}`}
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
              >
                <span className="text-slate-300 leading-relaxed wrap-break-word">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
