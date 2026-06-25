import React, { useState, useEffect, useRef, useId } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data';
import { ArrowLeft, ArrowRight, RotateCw, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

interface ThreeDCubeProps {
  onSelectProject: (project: Project) => void;
}

export default function ThreeDCube({ onSelectProject }: ThreeDCubeProps) {
  // Angle states for the 3D Cube
  const [rotX, setRotX] = useState(-15);
  const [rotY, setRotY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeFace, setActiveFace] = useState<'front' | 'right' | 'back' | 'left'>('front');
  const [translateZ, setTranslateZ] = useState(140);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const angleStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cubeId = useId();

  // GSAP quickTo for CSS variable-based cursor spotlight
  useEffect(() => {
    if (!panelRef.current) return;
    const panel = panelRef.current;
    
    // Create highly performant GSAP quick setters bound to CSS variables
    const setX = gsap.quickSetter(panel, '--mouse-x', 'px');
    const setY = gsap.quickSetter(panel, '--mouse-y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      setX(e.clientX - rect.left);
      setY(e.clientY - rect.top);
    };

    panel.addEventListener('mousemove', handleMouseMove);
    return () => panel.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Responsive cube extrusion sizing
  useEffect(() => {
    const handleResize = () => {
      setTranslateZ(window.innerWidth >= 640 ? 140 : 120);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Face definition: Front (0), Right (90), Back (180), Left (270)
  // Maps target projects to cube faces
  const faces: { key: 'front' | 'right' | 'back' | 'left'; angleY: number; project: Project }[] = [
    { key: 'front', angleY: 0, project: PROJECTS[0] },
    { key: 'right', angleY: -90, project: PROJECTS[1] },
    { key: 'back', angleY: -180, project: PROJECTS[2] },
    { key: 'left', angleY: -270, project: PROJECTS[3] },
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  // Determine which is the current "active" face (closest to facing the user)
  useEffect(() => {
    // Standardize Y rotation to [0, 360)
    let normalizedY = rotY % 360;
    if (normalizedY < 0) normalizedY += 360;

    // Find closest angle: Front (0 or 360), Left (90), Back (180), Right (270)
    // Note our offset rotations of the faces. When container is rotated Y, the project facing us changes.
    // Let's map target container rotation Y:
    // Y=0 -> front faces front
    // Y=90 -> left faces front
    // Y=180 -> back faces front
    // Y=270 -> right faces front
    const distToFront = Math.min(Math.abs(normalizedY - 0), Math.abs(normalizedY - 360));
    const distToLeft = Math.abs(normalizedY - 90);
    const distToBack = Math.abs(normalizedY - 180);
    const distToRight = Math.abs(normalizedY - 270);

    const minDist = Math.min(distToFront, distToLeft, distToBack, distToRight);

    if (minDist === distToFront) setActiveFace('front');
    else if (minDist === distToLeft) setActiveFace('left');
    else if (minDist === distToBack) setActiveFace('back');
    else setActiveFace('right');
  }, [rotY]);

  // Mouse drag handlers to rotate in 3D space
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStart.current = { x: e.clientX, y: e.clientY };
    angleStart.current = { x: rotX, y: rotY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Scale sensitivity
    setRotY(angleStart.current.y + dx * 0.5);
    // Clamp vertical tilt to prevent gimbal lock / upside down rotation
    setRotX(Math.max(-45, Math.min(45, angleStart.current.x - dy * 0.5)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, rotX, rotY]);

  // Rotate specifically to fit a face to the screen front on click
  const snapToFace = (faceKey: 'front' | 'right' | 'back' | 'left') => {
    setAutoRotate(false);
    let targetY = 0;
    if (faceKey === 'front') targetY = 0;
    else if (faceKey === 'left') targetY = 90;
    else if (faceKey === 'back') targetY = 180;
    else if (faceKey === 'right') targetY = 270;

    // Find shortest rotational direction
    let currentY = rotY % 360;
    if (currentY < 0) currentY += 360;

    const diff = targetY - currentY;
    let shortestDiff = diff;
    if (diff > 180) shortestDiff = diff - 360;
    if (diff < -180) shortestDiff = diff + 360;

    setRotY((prev) => prev + shortestDiff);
    setRotX(-15); // standard comfortable vertical look-down angle
  };

  const activeProject = faces.find((f) => f.key === activeFace)?.project || PROJECTS[0];

  const themeColors: Record<string, { border: string, bgHover: string, borderHover: string, shadowHover: string, shadowInset: string, gradient: string, dot: string, line: string, spotlight: string }> = {
    front: { // Cyan
      border: 'border-cyan-900/30', bgHover: 'hover:bg-cyan-950/30', borderHover: 'hover:border-cyan-700/60', shadowHover: 'hover:shadow-cyan-900/30', shadowInset: 'shadow-[inset_0_0_80px_rgba(6,182,212,0.03)]', gradient: 'from-cyan-400 to-cyan-200', dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]', line: 'via-cyan-500/40', spotlight: 'rgba(6,182,212,0.15)'
    },
    right: { // Purple
      border: 'border-purple-900/30', bgHover: 'hover:bg-purple-950/30', borderHover: 'hover:border-purple-700/60', shadowHover: 'hover:shadow-purple-900/30', shadowInset: 'shadow-[inset_0_0_80px_rgba(168,85,247,0.03)]', gradient: 'from-purple-400 to-purple-200', dot: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]', line: 'via-purple-500/40', spotlight: 'rgba(168,85,247,0.15)'
    },
    back: { // Emerald
      border: 'border-emerald-900/30', bgHover: 'hover:bg-emerald-950/30', borderHover: 'hover:border-emerald-700/60', shadowHover: 'hover:shadow-emerald-900/30', shadowInset: 'shadow-[inset_0_0_80px_rgba(16,185,129,0.03)]', gradient: 'from-emerald-400 to-emerald-200', dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]', line: 'via-emerald-500/40', spotlight: 'rgba(16,185,129,0.15)'
    },
    left: { // Orange
      border: 'border-orange-900/30', bgHover: 'hover:bg-orange-950/30', borderHover: 'hover:border-orange-700/60', shadowHover: 'hover:shadow-orange-900/30', shadowInset: 'shadow-[inset_0_0_80px_rgba(249,115,22,0.03)]', gradient: 'from-orange-400 to-orange-200', dot: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]', line: 'via-orange-500/40', spotlight: 'rgba(249,115,22,0.15)'
    }
  };
  const theme = themeColors[activeFace];

  const panelVariants = {};

  return (
    <div id={cubeId} className="flex flex-col lg:flex-row items-center justify-center gap-6 max-md:gap-2 sm:gap-12 w-full max-w-6xl pb-12 pt-4 px-4 select-none max-md:-mt-10">
      
      {/* 3D Cube Canvas Frame Container */}
      <div 
        id={`${cubeId}-canvas-container`}
        className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] perspective-2000"
        ref={containerRef}
      >
        {/* Helper instructions overlay */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-[10px] uppercase tracking-widest text-zinc-400 font-mono z-20 pointer-events-none backdrop-blur-md max-md:hidden">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Click & Drag to Spin Cube</span>
        </div>

        {/* Ambient Ring Glow underneath */}
        <div className="absolute w-[240px] h-[240px] rounded-full bg-cyan-500/10 blur-[60px] translate-y-[140px] pointer-events-none z-0" />
        <div className="absolute w-[180px] h-[30px] rounded-full bg-cyan-900/30 blur-[20px] translate-y-[160px] [transform:rotateX(75deg)] pointer-events-none z-0 border border-cyan-500/15" />

        {/* The 3D Cube Core */}
        <div
          id={`${cubeId}-core`}
          className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] preserve-3d cursor-grab active:cursor-grabbing transition-transform ease-out duration-300 max-md:pointer-events-none"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* FACE 1: FRONT */}
          <div
            className="absolute inset-0 bg-zinc-950/95 border-2 border-cyan-500/60 rounded-xl preserve-3d backface-hidden p-5 flex flex-col justify-between"
            style={{ transform: `rotateY(0deg) translateZ(${translateZ}px)` }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md bg-cyan-500/5">
                {faces[0].project.category}
              </span>
              <span className="text-xs font-mono text-zinc-500">[FACE A]</span>
            </div>
            
            <div className="my-auto">
              <h4 className="font-display text-lg font-bold text-white tracking-tight line-clamp-1">
                {faces[0].project.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                {faces[0].project.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {faces[0].project.tags.slice(0, 3).map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* FACE 2: RIGHT (Projects[1]) */}
          <div
            className="absolute inset-0 bg-zinc-950/95 border-2 border-purple-500/60 rounded-xl preserve-3d backface-hidden p-5 flex flex-col justify-between"
            style={{ transform: `rotateY(90deg) translateZ(${translateZ}px)` }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md bg-purple-500/5">
                {faces[1].project.category}
              </span>
              <span className="text-xs font-mono text-zinc-500">[FACE B]</span>
            </div>
            
            <div className="my-auto">
              <h4 className="font-display text-lg font-bold text-white tracking-tight line-clamp-1">
                {faces[1].project.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                {faces[1].project.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {faces[1].project.tags.slice(0, 3).map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* FACE 3: BACK (Projects[2]) */}
          <div
            className="absolute inset-0 bg-zinc-950/95 border-2 border-emerald-500/60 rounded-xl preserve-3d backface-hidden p-5 flex flex-col justify-between"
            style={{ transform: `rotateY(180deg) translateZ(${translateZ}px)` }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md bg-emerald-500/5">
                {faces[2].project.category}
              </span>
              <span className="text-xs font-mono text-zinc-500">[FACE C]</span>
            </div>
            
            <div className="my-auto">
              <h4 className="font-display text-lg font-bold text-white tracking-tight line-clamp-1">
                {faces[2].project.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                {faces[2].project.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {faces[2].project.tags.slice(0, 3).map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* FACE 4: LEFT (Projects[3]) */}
          <div
            className="absolute inset-0 bg-zinc-950/95 border-2 border-orange-500/60 rounded-xl preserve-3d backface-hidden p-5 flex flex-col justify-between"
            style={{ transform: `rotateY(270deg) translateZ(${translateZ}px)` }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md bg-orange-500/5">
                {faces[3].project.category}
              </span>
              <span className="text-xs font-mono text-zinc-500">[FACE D]</span>
            </div>
            
            <div className="my-auto">
              <h4 className="font-display text-lg font-bold text-white tracking-tight line-clamp-1">
                {faces[3].project.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                {faces[3].project.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {faces[3].project.tags.slice(0, 3).map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* FACE 5: TOP */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl preserve-3d backface-hidden flex items-center justify-center p-4"
            style={{ transform: `rotateX(90deg) translateZ(${translateZ}px)` }}
          >
            <div className="text-center">
              <Cpu className="w-8 h-8 text-cyan-500/40 mx-auto animate-pulse-slow mb-2" />
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                System Grid
              </div>
              <div className="text-[8px] font-mono text-zinc-600 mt-1">
                0x01AA3FC9
              </div>
            </div>
          </div>

          {/* FACE 6: BOTTOM */}
          <div
            className="absolute inset-0 bg-zinc-950 border border-zinc-805 rounded-xl preserve-3d backface-hidden flex items-center justify-center p-4"
            style={{ transform: `rotateX(-90deg) translateZ(${translateZ}px)` }}
          >
            <div className="text-center">
              <div className="text-[11px] font-display font-medium tracking-tight text-zinc-400">
                PORTFOLIO CORE
              </div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mt-1">
                3D-CSS RENDER
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Control Station Panel */}
      <div 
        id={`${cubeId}-control-station`} 
        ref={panelRef}
        className={`group flex-1 flex flex-col justify-center items-start border bg-zinc-950/50 backdrop-blur-3xl p-4 sm:p-8 rounded-2xl w-full relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${theme.border} ${theme.bgHover} ${theme.borderHover} ${theme.shadowHover} ${theme.shadowInset}`}
      >
        
        {/* Soft Noise Texture Overlay for premium glass look */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Ambient Top Glow Edge */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${theme.line} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        
        {/* Highly Performant CSS Variable Spotlight Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(32px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${theme.spotlight} 0%, transparent 80%)`
          }}
        />

        <div className="relative z-10 w-full">
          {/* Active Face Metadata HUD Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-1.5 h-1.5 rounded-full animate-ping ${theme.dot}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Holographic Detail Interface
            </span>
          </div>

        {/* Project detail container mapped dynamically using framer keys */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFace}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="flex items-center gap-3">
              <h2 className={`text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient} tracking-tight`}>
                {activeProject.title}
              </h2>
            </div>

            <p className="text-zinc-300 text-sm mt-3 leading-relaxed max-md:line-clamp-2 max-md:min-h-[44px]">
              {activeProject.longDescription}
            </p>

            {/* Micro Specs */}
            {activeProject.metrics && (
              <div className="grid grid-cols-3 gap-0 my-6 py-4 border border-zinc-800/60 bg-zinc-950/40 rounded-xl overflow-hidden divide-x divide-zinc-800/60 shadow-inner">
                {activeProject.metrics.map((m, i) => (
                  <div key={i} className="flex flex-col justify-center px-4 hover:bg-zinc-800/20 transition-colors relative group/metric">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {i === 2 && <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />}
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{m.label}</p>
                    </div>
                    <p className="font-display text-sm sm:text-base font-semibold text-zinc-100">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-5">
              <button
                onClick={() => onSelectProject(activeProject)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-xs font-mono rounded-lg hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:shadow-white/5 active:scale-95"
              >
                <span>Read Blueprint</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  autoRotate
                    ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                <span>Orbit {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Face Navigator Controllers */}
        <div className="flex items-center gap-2 mt-4 sm:mt-8 w-full border-t border-zinc-850 pt-4 sm:pt-5">
          <button
            onClick={() => {
              const order: ('front' | 'right' | 'back' | 'left')[] = ['front', 'right', 'back', 'left'];
              const currIdx = order.indexOf(activeFace);
              const prevFace = order[(currIdx - 1 + 4) % 4];
              snapToFace(prevFace);
            }}
            className="p-2 sm:p-2.5 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95 bg-zinc-950/40"
            title="Rotate Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 grid grid-cols-4 gap-1.5 bg-zinc-950/80 p-1 border border-zinc-850 rounded-xl">
            {faces.map((f) => (
              <button
                key={f.key}
                onClick={() => snapToFace(f.key)}
                className={`text-[9px] sm:text-[10px] font-mono py-1 rounded transition-all cursor-pointer uppercase ${
                  activeFace === f.key
                    ? 'bg-zinc-850 text-white font-medium border border-zinc-700 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f.key}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const order: ('front' | 'right' | 'back' | 'left')[] = ['front', 'right', 'back', 'left'];
              const currIdx = order.indexOf(activeFace);
              const nextFace = order[(currIdx + 1) % 4];
              snapToFace(nextFace);
            }}
            className="p-2 sm:p-2.5 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95 bg-zinc-950/40"
            title="Rotate Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      </div>
    </div>
  );
}
