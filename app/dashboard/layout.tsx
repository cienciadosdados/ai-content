"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Home, FolderOpen, Upload } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard/projects") {
      return pathname === path || pathname.startsWith("/dashboard/projects/");
    }
    return pathname === path;
  };

  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AI Podcast Assistant</span>
            </Link>
            
            {/* Dashboard Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/dashboard/projects">
                <Button 
                  variant={isActive("/dashboard/projects") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
              </Link>
              <Link href="/dashboard/upload">
                <Button 
                  variant={isActive("/dashboard/upload") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t px-4 py-2 flex items-center gap-2">
          <Link href="/dashboard/projects" className="flex-1">
            <Button 
              variant={isActive("/dashboard/projects") ? "default" : "ghost"}
              size="sm"
              className="w-full gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Projects
            </Button>
          </Link>
          <Link href="/dashboard/upload" className="flex-1">
            <Button 
              variant={isActive("/dashboard/upload") ? "default" : "ghost"}
              size="sm"
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </Link>
        </nav>
      </header>

      {/* Dashboard Content */}
      <main>{children}</main>
    </div>
  );
}

