import React, { useRef, useState, useCallback, useId, useEffect } from 'react';
import gsap from 'gsap';

interface ThreeDTiltProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // max tilt angle in degrees
  perspective?: number; // perspective value in px
  scale?: number; // hover scale multiplier
  glowColor?: string; // Optional colored ambient glow
}

export default function ThreeDTilt({
  children,
  className = '',
  maxRotate = 12,
  perspective = 1000,
  scale = 1.02,
  glowColor = 'rgba(255,255,255,0.06)',
}: ThreeDTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });
  const containerId = useId();

  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const scaleTo = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set 3D perspective
    gsap.set(containerRef.current, { transformPerspective: perspective, transformStyle: "preserve-3d" });

    // GSAP quickTo for 60FPS physics transitions
    xTo.current = gsap.quickTo(containerRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });
    yTo.current = gsap.quickTo(containerRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    scaleTo.current = gsap.quickTo(containerRef.current, "scale", { duration: 0.6, ease: "power3.out" });

    return () => {
      if (xTo.current) xTo.current(0);
      if (yTo.current) yTo.current(0);
      if (scaleTo.current) scaleTo.current(1);
    };
  }, [perspective]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || !xTo.current || !yTo.current) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    xTo.current(x * maxRotate * 2);
    yTo.current(-y * maxRotate * 2);

    const sheenX = ((e.clientX - rect.left) / width) * 100;
    const sheenY = ((e.clientY - rect.top) / height) * 100;
    setSheenPosition({ x: sheenX, y: sheenY });
  }, [maxRotate]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (scaleTo.current) scaleTo.current(scale);
  }, [scale]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
    if (scaleTo.current) scaleTo.current(1);
  }, []);

  const sheenStyle: React.CSSProperties = {
    opacity: isHovered ? 0.25 : 0,
    background: `
      radial-gradient(500px circle at ${sheenPosition.x}% ${sheenPosition.y}%, ${glowColor}, transparent 40%),
      radial-gradient(150px circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.02), transparent 60%)
    `,
    transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  return (
    <div
      id={containerId}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
    >
      <div 
        id={`${containerId}-sheen`}
        className="absolute inset-0 pointer-events-none rounded-xl z-20 mix-blend-screen" 
        style={sheenStyle} 
      />
      {children}
    </div>
  );
}
