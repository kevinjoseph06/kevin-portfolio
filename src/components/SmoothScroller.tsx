import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable smooth scrolling on mobile for better native performance
    if (window.innerWidth < 768) {
      return;
    }

    // Initialize Lenis with premium physics-based scrolling settings
    const lenis = new Lenis({
      lerp: 0.04, // Lower lerp for incredibly buttery smooth interpolation
      wheelMultiplier: 0.9, // Slightly soften the scroll wheel impact
      smoothWheel: true,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis needs ms
    });

    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally so React components can use it
    (window as any).lenis = lenis;

    return () => {
      delete (window as any).lenis;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
