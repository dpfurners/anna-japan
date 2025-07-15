"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
  emoji: string;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const heartEmojis = [
      "💖",
      "💕",
      "💗",
      "💓",
      "💝",
      "🌸",
      "✨",
      "🦋",
      "🌺",
      "💐",
    ];

    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;

    const generateHearts = () => {
      const newHearts: Heart[] = [];
      // Reduce the number of hearts on mobile
      const heartCount = isMobile ? 7 : 15;

      for (let i = 0; i < heartCount; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 3 + Math.random() * 4, // 3-7 seconds
          size: isMobile ? 15 + Math.random() * 15 : 20 + Math.random() * 20, // Smaller on mobile
          delay: Math.random() * 5, // 0-5 seconds delay
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        });
      }
      setHearts(newHearts);
    };

    generateHearts();

    // Regenerate hearts every 10 seconds for variety
    const interval = setInterval(generateHearts, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float opacity-70"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`,
            filter: "drop-shadow(0 0 8px rgba(255, 182, 193, 0.3))",
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {/* Additional floating elements for atmosphere */}
      <div className="absolute top-1/4 left-1/4 animate-pulse">
        <div className="text-6xl text-pink-300/20">💕</div>
      </div>
      <div
        className="absolute top-3/4 right-1/4 animate-pulse"
        style={{ animationDelay: "2s" }}
      >
        <div className="text-4xl text-purple-300/20">✨</div>
      </div>
      <div
        className="absolute top-1/2 left-3/4 animate-pulse"
        style={{ animationDelay: "4s" }}
      >
        <div className="text-5xl text-pink-200/20">🌸</div>
      </div>
    </div>
  );
}
