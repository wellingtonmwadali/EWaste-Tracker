'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  duration?: number;
}

export default function Confetti({ show, duration = 3000 }: ConfettiProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!visible) return null;

  const colors = ['#22c55e', '#4ade80', '#86efac', '#10b981', '#34d399'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 0.5}s`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti absolute w-2 h-2 rounded-full"
          style={{
            left: piece.left,
            animationDelay: piece.animationDelay,
            backgroundColor: piece.backgroundColor,
          }}
        />
      ))}
    </div>
  );
}
