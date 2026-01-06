'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SonarBadgeProps {
  text: string;
  className?: string;
}

export function SonarBadge({ text, className = "" }: SonarBadgeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`}>
        <div className="relative px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-500/20 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-sm text-slate-300">{text}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <div className="relative px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-500/20 flex items-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <motion.div
            className="absolute inset-0 bg-emerald-500 rounded-full"
            animate={{ scale: [1, 3], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
        <span className="text-sm text-slate-300">{text}</span>
      </div>
    </motion.div>
  );
}
