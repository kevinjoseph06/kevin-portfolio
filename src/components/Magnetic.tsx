import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  key?: string | number;
}

export default function Magnetic({ children, range = 65, strength = 0.32 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // GSAP quickTo for highly performant, physics-based spring logic without React re-renders
    xTo.current = gsap.quickTo(ref.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    yTo.current = gsap.quickTo(ref.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    return () => {
      // Reset position on unmount
      if (xTo.current) xTo.current(0);
      if (yTo.current) yTo.current(0);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !xTo.current || !yTo.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      // Magnetic pull
      xTo.current(distanceX * strength);
      yTo.current(distanceY * strength);
    } else {
      // Snap back if outside range but still hovering the bounding box
      xTo.current(0);
      yTo.current(0);
    }
  };

  const handleMouseLeave = () => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
}
