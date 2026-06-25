import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TextSpotlightProps {
  children: React.ReactNode;
}

export default function TextSpotlight({ children }: TextSpotlightProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Convert smooth coordinates to a string for the CSS mask
  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(60px circle at ${x}px ${y}px, black 0%, transparent 100%)`
  );

  return (
    <div
      ref={containerRef}
      className="relative w-fit cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 1. Base Text Layer - slightly muted and elegant */}
      <div className="relative z-10 transition-opacity duration-500 opacity-80">
        {children}
      </div>

      {/* 2. Supercharged Glowing Spotlight Overlay */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.4 } }}
      >
        <div className="brightness-200 saturate-[2] contrast-125">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
