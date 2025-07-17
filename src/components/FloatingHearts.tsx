"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
  emoji: string;
  createdAt: number; // Add timestamp to track when heart was created
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

    const createHeart = (): Heart => {
      const now = Date.now();
      return {
        id: now + Math.random(), // Use timestamp + random for unique IDs
        left: Math.random() * 100,
        animationDuration: 6 + Math.random() * 4, // 6-10 seconds (longer duration)
        size: isMobile ? 16 + Math.random() * 12 : 24 + Math.random() * 16, // Slightly larger but fewer
        delay: 0, // No delay for continuous spawning
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        createdAt: now,
      };
    };

    const generateInitialHearts = () => {
      const newHearts: Heart[] = [];
      // Increased heart count for more romantic effect
      const heartCount = isMobile ? 6 : 8;

      for (let i = 0; i < heartCount; i++) {
        const heart = createHeart();
        // Stagger initial hearts so they don't all start at once
        heart.delay = Math.random() * 4;
        newHearts.push(heart);
      }
      setHearts(newHearts);
    };

    generateInitialHearts();

    // Add new hearts and clean up completed ones
    const interval = setInterval(() => {
      const now = Date.now();

      setHearts((prevHearts) => {
        // Remove hearts that have completed their animation
        // Animation completes after: delay + animationDuration (in seconds)
        const activeHearts = prevHearts.filter((heart) => {
          const totalDuration = (heart.delay + heart.animationDuration) * 1000; // Convert to ms
          return now - heart.createdAt < totalDuration;
        });

        // Only add new heart if we don't have too many active ones
        const maxHearts = isMobile ? 8 : 12;
        if (activeHearts.length < maxHearts) {
          const newHeart = createHeart();
          return [...activeHearts, newHeart];
        }

        return activeHearts;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float opacity-60"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`,
            filter: "drop-shadow(0 0 6px rgba(255, 182, 193, 0.2))",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)", // Force GPU acceleration
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {/* Reduced static elements for better performance */}
      <div className="absolute top-1/4 left-1/4 animate-pulse">
        <div className="text-5xl text-pink-300/30">💕</div>
      </div>
      <div
        className="absolute top-2/3 right-1/3 animate-pulse"
        style={{ animationDelay: "3s" }}
      >
        <div className="text-4xl text-purple-300/25">✨</div>
      </div>
    </div>
  );
}
