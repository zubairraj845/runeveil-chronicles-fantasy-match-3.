import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ArcaneRuneIdleProps {
  row: number;
  col: number;
  isIdle: boolean;
  color?: string;
  children: React.ReactNode;
}

// Ancient Elder Futhark rune symbols for ethereal ambient background
const RUNIC_GLYPHS = ['ᚱ', 'ᚦ', 'ᚨ', 'ᚹ', 'ᛗ', 'ᛋ', 'ᛏ', 'ᛟ', '✦', '✧'];

export const ArcaneRuneIdle = React.memo<ArcaneRuneIdleProps>(({
  row,
  col,
  isIdle,
  children
}) => {
  // Deterministic subtle phase delay based on tile coordinates to create undulating mystical wave
  const phaseDelay = useMemo(() => {
    return ((row * 13 + col * 7) % 8) * 0.35;
  }, [row, col]);

  const cycleDuration = useMemo(() => {
    return 3.0 + ((row + col) % 3) * 0.4;
  }, [row, col]);

  const runeGlyph = useMemo(() => {
    return RUNIC_GLYPHS[(row * 5 + col * 3) % RUNIC_GLYPHS.length];
  }, [row, col]);

  if (!isIdle) {
    return (
      <div className="w-full h-full relative flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className="w-full h-full relative flex items-center justify-center"
      style={{ willChange: 'transform' }}
      animate={{
        scale: [1, 1.028, 1],
        y: [0, -1, 0]
      }}
      transition={{
        duration: cycleDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: phaseDelay
      }}
    >
      {/* Subtle Arcane Background Rune Glyph (static lightweight layer, zero CPU cost) */}
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-purple-300/15 text-lg font-serif font-black">
        {runeGlyph}
      </span>

      {children}
    </motion.div>
  );
});

ArcaneRuneIdle.displayName = 'ArcaneRuneIdle';
