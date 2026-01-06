"use client";

import { SignInButton, UserButton, useAuth, Protect } from "@clerk/nextjs";
import { Home, Zap, Crown, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const showDashboardNav = isDashboard;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 lg:gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                <Video className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AI Content Engine
              </span>
            </Link>

            {/* Dashboard Navigation inline with logo */}
            {showDashboardNav && (
              <div className="flex items-center pl-2 sm:pl-4 border-l border-white/20">
                <DashboardNav />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {isSignedIn ? (
              <>
                {/* Show "Upgrade to Pro" for Free users */}
                <Protect
                  condition={(has) =>
                    !has({ plan: "pro" }) && !has({ plan: "ultra" })
                  }
                  fallback={null}
                >
                  <Link href="/dashboard/upgrade">
                    <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-emerald-500/25 hover:scale-105 gap-2 shadow-lg font-semibold transition-all duration-300">
                      <Zap className="h-4 w-4" />
                      <span className="hidden lg:inline">Upgrade to Pro</span>
                      <span className="lg:hidden">Pro</span>
                    </Button>
                  </Link>
                </Protect>

                {/* Show "Upgrade to Ultra" for Pro users */}
                <Protect
                  condition={(has) =>
                    has({ plan: "pro" }) && !has({ plan: "ultra" })
                  }
                  fallback={null}
                >
                  <Link href="/dashboard/upgrade">
                    <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-emerald-500/25 hover:scale-105 gap-2 shadow-lg font-semibold transition-all duration-300">
                      <Crown className="h-4 w-4" />
                      <span className="hidden lg:inline">Upgrade to Ultra</span>
                      <span className="lg:hidden">Ultra</span>
                    </Button>
                  </Link>
                </Protect>

                {/* Show Ultra badge for Ultra users */}
                <Protect
                  condition={(has) => has({ plan: "ultra" })}
                  fallback={null}
                >
                  <Badge className="gap-1.5 hidden md:flex bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5">
                    <Crown className="h-3.5 w-3.5" />
                    <span className="font-semibold">Ultra</span>
                  </Badge>
                </Protect>

                {!showDashboardNav && (
                  <Link href="/dashboard/projects">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                      <span className="hidden lg:inline">My Projects</span>
                      <span className="lg:hidden">Projects</span>
                    </Button>
                  </Link>
                )}
                {showDashboardNav && (
                  <Link href="/" className="hidden lg:block">
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                      <Home className="h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                )}
                <div className="scale-110 hover:scale-125 transition-transform duration-300">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                  Entrar
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
