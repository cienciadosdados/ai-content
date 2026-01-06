import { PricingTable } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface PricingSectionProps {
  compact?: boolean;
}

export function PricingSection({ compact = false }: PricingSectionProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Preços <span className="text-emerald-400">Simples</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Escolha o plano ideal para você. Upgrade ou cancele quando quiser.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="flex justify-center w-full">
            <div className={compact ? "max-w-4xl w-full" : "max-w-5xl w-full"}>
              <PricingTable
                appearance={{
                  elements: {
                    pricingTableCardHeader: {
                      background: "linear-gradient(135deg, rgb(16 185 129), rgb(45 212 191))",
                      color: "white",
                      borderRadius: "1rem 1rem 0 0",
                      padding: "1.5rem",
                    },
                    pricingTableCardTitle: {
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      color: "white",
                      marginBottom: "0.25rem",
                    },
                    pricingTableCardDescription: {
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "500",
                    },
                    pricingTableCardFee: {
                      color: "white",
                      fontWeight: "800",
                      fontSize: "2rem",
                    },
                    pricingTableCardFeePeriod: {
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "0.875rem",
                    },
                    pricingTableCard: {
                      borderRadius: "1rem",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      boxShadow: "0 10px 40px rgba(16, 185, 129, 0.1)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      background: "rgb(15, 15, 15)",
                    },
                    pricingTableCardBody: {
                      padding: "1.5rem",
                      background: "rgb(15, 15, 15)",
                      color: "rgb(148, 163, 184)",
                    },
                    pricingTableCardFeatures: {
                      marginTop: "0.5rem",
                      gap: "0.5rem",
                    },
                    pricingTableCardFeature: {
                      fontSize: "0.875rem",
                      padding: "0.5rem 0",
                      fontWeight: "500",
                      color: "rgb(148, 163, 184)",
                      borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                      background: "transparent",
                    },
                    pricingTableCardFeatureIcon: {
                      color: "rgb(52, 211, 153)",
                    },
                    pricingTableCardFeatureText: {
                      color: "rgb(148, 163, 184)",
                    },
                    pricingTableCardButton: {
                      marginTop: "1rem",
                      borderRadius: "0.5rem",
                      fontWeight: "700",
                      padding: "0.75rem 1.5rem",
                      transition: "all 0.2s ease",
                      fontSize: "0.875rem",
                      background: "linear-gradient(135deg, rgb(16 185 129), rgb(45 212 191))",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                      color: "white",
                    },
                  },
                }}
                fallback={
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4 bg-black/60 border border-emerald-500/20 p-12 rounded-2xl">
                      <Loader2 className="h-16 w-16 animate-spin text-emerald-400 mx-auto" />
                      <p className="text-slate-400 text-lg font-medium">Carregando opções...</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

