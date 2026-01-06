'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function FloatingGrid() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const particleCount = isMobile ? 5 : 15;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Hero Gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/20 via-transparent to-transparent rounded-full blur-3xl" />
      </motion.div>
      
      {/* Floating Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
