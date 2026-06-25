import React, { useEffect, useRef, useState, useId, useMemo } from 'react';
import { SKILLS } from '../data';
import { Skill } from '../types';
import { Database, Layout, ShieldCheck, Terminal, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectedSkill extends Skill {
  baseX: number;
  baseY: number;
  baseZ: number;
}

export default function ThreeDSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate mathematical base positions exactly once
  const VISIBLE_SKILLS = useMemo(() => SKILLS.slice(0, 9), []);
  const projected = useMemo<ProjectedSkill[]>(() => {
    const N = VISIBLE_SKILLS.length;
    return VISIBLE_SKILLS.map((skill, i) => {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      const radius = 135; // Sphere radius
      return {
        ...skill,
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
      };
    });
  }, [VISIBLE_SKILLS]);

  const tagsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tagStatesRef = useRef(projected.map(() => ({ hoverScale: 1.0 })));
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const hoveredSkillRef = useRef<string | null>(null);

  const anglesRef = useRef({ yaw: 0.01, pitch: 0.01 }); // persistent velocity
  const totalAnglesRef = useRef({ yaw: 0, pitch: 0 }); // accumulated rotation
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isMouseInRef = useRef(false);
  const speedProxy = useRef({ multiplier: 1 });
  const sphereId = useId();

  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(containerRef.current, 
        { scale: 0.1, opacity: 0, filter: 'blur(10px)' },
        {
          scale: 1, opacity: 1, filter: 'blur(0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#skills',
            start: 'top bottom',
            end: 'top center',
            scrub: 1
          }
        }
      );

      gsap.to(speedProxy.current, {
        multiplier: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#bento',
          start: 'top bottom',
          end: 'top center',
          scrub: 1
        }
      });

      gsap.utils.toArray('.tech-stack-item').forEach((item: any) => {
        gsap.fromTo(item,
          { opacity: 0, x: -20, filter: 'blur(5px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 95%',
              end: 'bottom 15%',
              toggleActions: 'play reset play reset'
            }
          }
        );
      });
    });
  }, { scope: containerRef });

  // Pure DOM manipulation loop for hyper-smooth 3D orbit
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const isMobile = window.innerWidth < 640;
      let targetYawSpeed = (isMobile ? 0.015 : 0.05) * speedProxy.current.multiplier;
      let targetPitchSpeed = (isMobile ? 0.01 : 0.03) * speedProxy.current.multiplier;

      if (isMouseInRef.current) {
        targetYawSpeed = mousePosRef.current.x * 0.2 * speedProxy.current.multiplier;
        targetPitchSpeed = -mousePosRef.current.y * 0.2 * speedProxy.current.multiplier;
      }

      // Decelerate the sphere completely if looking at a specific tag
      if (hoveredSkillRef.current !== null) {
        targetYawSpeed = 0;
        targetPitchSpeed = 0;
      }

      anglesRef.current.yaw += (targetYawSpeed - anglesRef.current.yaw) * 0.1;
      anglesRef.current.pitch += (targetPitchSpeed - anglesRef.current.pitch) * 0.1;

      totalAnglesRef.current.yaw += anglesRef.current.yaw;
      totalAnglesRef.current.pitch += anglesRef.current.pitch;

      const cosY = Math.cos(totalAnglesRef.current.yaw);
      const sinY = Math.sin(totalAnglesRef.current.yaw);
      const cosP = Math.cos(totalAnglesRef.current.pitch);
      const sinP = Math.sin(totalAnglesRef.current.pitch);

      const baseScale = isMobile ? 0.78 : 1.0;
      const scaleRatio = isMobile ? 0.6 : window.innerWidth < 1024 ? 0.82 : 1.0;

      projected.forEach((item, idx) => {
        const el = tagsRef.current[idx];
        const state = tagStatesRef.current[idx];
        if (!el || !state) return;

        const isHovered = hoveredSkillRef.current === item.name;

        // Smoothly interpolate hover scale natively in the engine
        const targetHoverScale = isHovered ? 1.12 : 1.0;
        state.hoverScale += (targetHoverScale - state.hoverScale) * 0.2;

        const x1 = item.baseX * cosY - item.baseZ * sinY;
        const z1 = item.baseZ * cosY + item.baseX * sinY;
        const y2 = item.baseY * cosP - z1 * sinP;
        const z2 = z1 * cosP + item.baseY * sinP;

        const distance = 250;
        const projectionScale = distance / (distance - z2);
        const opacity = Math.max(0.15, Math.min(1, (z2 + 170) / (2 * 170) + 0.15));

        const tx = x1 * scaleRatio;
        const ty = y2 * scaleRatio;
        const finalScale = projectionScale * baseScale * state.hoverScale;

        // Apply raw CSS transforms bypassing React state
        el.style.transform = `translate3d(calc(${tx}px - 50%), calc(${ty}px - 50%), 0) scale(${finalScale})`;
        el.style.zIndex = isHovered ? '9999' : Math.round(projectionScale * 100).toString();
        el.style.opacity = isHovered ? '1' : opacity.toString();
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [projected]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 640) return;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mousePosRef.current = {
      x: (e.clientX - rect.left - centerX) / centerX,
      y: (e.clientY - rect.top - centerY) / centerY,
    };
  };

  const handleMouseEnter = () => { if (window.innerWidth >= 640) isMouseInRef.current = true; };
  const handleMouseLeave = () => {
    isMouseInRef.current = false;
    mousePosRef.current = { x: 0, y: 0 };
  };

  const setHoverState = (skill: Skill | null) => {
    setHoveredSkill(skill);
    hoveredSkillRef.current = skill ? skill.name : null;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <Layout className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Backend': return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case 'Creative/XR': return <Compass className="w-3.5 h-3.5 text-rose-400" />;
      case 'DevOps/Tools': return <Terminal className="w-3.5 h-3.5 text-amber-400" />;
      default: return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'Frontend': return { text: 'text-cyan-400', bg: 'bg-cyan-400', shadow: 'shadow-[0_0_8px_rgba(34,211,238,0.8)]' };
      case 'Backend': return { text: 'text-purple-400', bg: 'bg-purple-400', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]' };
      case 'Creative/XR': return { text: 'text-rose-400', bg: 'bg-rose-400', shadow: 'shadow-[0_0_8px_rgba(251,113,133,0.8)]' };
      case 'DevOps/Tools': return { text: 'text-amber-400', bg: 'bg-amber-400', shadow: 'shadow-[0_0_8px_rgba(251,191,36,0.8)]' };
      default: return { text: 'text-zinc-400', bg: 'bg-zinc-400', shadow: 'shadow-[0_0_8px_rgba(161,161,170,0.8)]' };
    }
  };

  return (
    <div id={sphereId} ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-6xl pt-0 pb-6 px-4">
      
      <div 
        className="lg:col-span-7 relative flex items-center justify-center h-[320px] sm:h-[520px] bg-[#020204] border border-cyan-900/30 rounded-3xl overflow-hidden cursor-crosshair group shadow-[0_0_40px_rgba(6,182,212,0.03)] hover:border-cyan-400/50 hover:bg-zinc-900/20 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_0_40px_rgba(76,29,149,0.25)] transition-all duration-500 ease-out z-10 hover:z-20"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.4)_0%,rgba(3,3,3,1)_80%)] z-0 pointer-events-none" />
        
        <div className="absolute w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] border border-dashed border-zinc-850/50 rounded-full animate-spin-slow pointer-events-none z-0" />
        <div className="absolute w-[160px] h-[160px] sm:w-[260px] sm:h-[260px] border border-dotted border-zinc-800/30 rounded-full animate-spin-reverse pointer-events-none z-0" />

        <div className="absolute top-6 left-6 text-[10px] uppercase font-mono tracking-widest text-cyan-500 pointer-events-none select-none z-10 flex items-center gap-2">
          <div className="w-3 h-3 border border-cyan-500/50 flex items-center justify-center">
             <div className="w-1 h-1 bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
          </div>
          <span className="font-semibold text-cyan-400">3D PROFICIENCY LATTICE</span>
        </div>

        <div className="absolute bottom-6 text-[10px] uppercase font-mono tracking-widest text-zinc-500 pointer-events-none select-none z-10 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity max-md:hidden">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>
          <span>Move cursor to accelerate orbit</span>
        </div>

        {projected.map((item, idx) => {
          const isHovered = hoveredSkill?.name === item.name;
          const colors = getColorForCategory(item.category);

          return (
            <div
              ref={(el) => { tagsRef.current[idx] = el; }}
              id={`skill-tag-${idx}`}
              key={item.name}
              className={`absolute left-[50%] top-[50%] pl-1 pr-3 py-1 sm:pl-1.5 sm:pr-4 sm:py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md transition-colors duration-300 ${
                isHovered
                  ? 'border-white/20 bg-zinc-900/90 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                  : 'bg-[#050508]/80 border-white/5 hover:border-white/10'
              }`}
              onMouseEnter={() => setHoverState(item)}
              onMouseLeave={() => setHoverState(null)}
              onClick={() => setHoverState(item)}
            >
              {/* Icon Container */}
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                {getCategoryIcon(item.category)}
              </div>
              
              {/* Text Info */}
              <div className="flex flex-col pointer-events-none select-none">
                <span className="text-zinc-100 text-[10px] sm:text-[11px] font-medium tracking-wide leading-tight">{item.name}</span>
                <span className={`text-[7px] font-mono tracking-widest uppercase mt-0.5 font-semibold ${colors.text}`}>
                  {item.level}
                </span>
              </div>

              {/* Glowing Dot */}
              <div className={`w-1 h-1 rounded-full ml-1 sm:ml-1.5 ${colors.bg} ${colors.shadow}`} />
            </div>
          );
        })}
      </div>

      {/* Skills HUD Inspection Panel (5/12 cols columns) */}
      <div 
        id={`${sphereId}-hud-panel`} 
        className="lg:col-span-5 flex flex-col justify-center h-full"
        onMouseLeave={() => setHoverState(null)}
      >
        {/* Gradient Border Wrapper */}
        <div className="relative p-5 sm:p-6 rounded-3xl bg-[#020204] border border-cyan-900/30 w-full max-md:h-auto max-md:min-h-[320px] sm:h-[520px] flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.03)] group/card hover:border-cyan-400/50 hover:bg-zinc-900/20 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_0_40px_rgba(76,29,149,0.25)] transition-all duration-500 ease-out z-10 hover:z-20">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-cyan-400 font-mono font-bold text-sm">{'>_'}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 font-semibold">
                  Cognitive Lab Diagnostics
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                Interactive Tech Matrix
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed max-md:hidden">
                Hover over items in the rotating 3D lattice, or select directly from the index below, to inspect proficiency levels.
              </p>
            </div>

            {/* Inspection View Body */}
            <div className="my-3.5 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {hoveredSkill ? (
                  <motion.div
                    key={hoveredSkill.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-lg text-white">
                        {hoveredSkill.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-800 rounded bg-zinc-950 text-zinc-400">
                        {hoveredSkill.level}
                      </span>
                    </div>

                    {/* Level Details */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-500">PRO LEVEL</span>
                        <span className="text-zinc-300 font-medium">{hoveredSkill.ratingValue}%</span>
                      </div>
                      
                      {/* Retro Grid Progress bar */}
                      <div className="h-3 w-full bg-[#050508] border border-white/5 p-0.5 rounded-md flex overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-500"
                          style={{
                            width: `${hoveredSkill.ratingValue}%`,
                            backgroundColor: hoveredSkill.color,
                            boxShadow: `0 0 10px ${hoveredSkill.color}40`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Category Pill HUD */}
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                      {getCategoryIcon(hoveredSkill.category)}
                      <span>Category: <strong className="text-white font-normal">{hoveredSkill.category}</strong></span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 max-md:space-y-4"
                  >
                    <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                      <span className="font-semibold">Active Lattice Index</span>
                    </div>
                    
                    <div className="space-y-4 max-md:space-y-3">
                      {['Frontend', 'Backend', 'DevOps/Tools'].map((cat) => {
                        // Filter the globally visible skills we sliced earlier
                        const categorySkills = SKILLS.slice(0, 9).filter((s) => s.category === cat);
                        if (categorySkills.length === 0) return null;
                        
                        const icon = getCategoryIcon(cat);
                        
                        return (
                          <div key={cat} className="flex gap-4 items-start">
                            {/* Category Icon Box */}
                            <div className="mt-3.5 w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                              {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 opacity-70' })}
                            </div>
                            
                            {/* Category Tags */}
                            <div className="flex-1 space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-semibold">
                                {cat} Core
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {categorySkills.map((s) => (
                                  <button
                                    key={s.name}
                                    onMouseEnter={() => setHoverState(s)}
                                    className="px-2.5 py-1.5 rounded-xl bg-[#050508]/80 border border-white/5 flex items-center gap-2 hover:border-white/20 transition-all duration-300"
                                  >
                                    <div style={{ color: s.color }}>
                                      {React.cloneElement(getCategoryIcon(s.category) as React.ReactElement, { className: 'w-3.5 h-3.5 drop-shadow-[0_0_5px_currentColor]' })}
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-mono text-zinc-300 font-medium tracking-tight">
                                      {s.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Retro Grid diagnostics summary footer */}
            <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-widest font-semibold uppercase">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                <span>Nodes: <span className="text-cyan-400">9 Live</span></span>
              </div>
              <span>Perspective: 3D Matrix</span>
            </div>

          </div>
      </div>

    </div>
  );
}
