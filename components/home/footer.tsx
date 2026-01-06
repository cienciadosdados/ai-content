import { Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 py-8 mt-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Video className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white">AI Content Engine</span>
          </div>
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} AI Content Engine. Projeto do AICODEPRO.
          </p>
        </div>
      </div>
    </footer>
  );
}
