import React, { useState, useId, useMemo, useRef } from 'react';
import { Layers, RotateCcw, Info, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Block {
  x: number; // grid row
  y: number; // grid col
  height: number; // block height factor
  color: string; // neon color tint
}

export default function Sandbox() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<Block[]>([
    { x: 2, y: 2, height: 3, color: '#06b6d4' },
    { x: 2, y: 3, height: 2, color: '#06b6d4' },
    { x: 3, y: 2, height: 2, color: '#3178c6' },
    { x: 4, y: 4, height: 4, color: '#a855f7' },
  ]);
  const [selectedColor, setSelectedColor] = useState('#06b6d4');
  const [selectedHeight, setSelectedHeight] = useState(2);
  const [yaw, setYaw] = useState(-35); // 3D rotation angles
  const [pitch, setPitch] = useState(45);
  const [showHelper, setShowHelper] = useState(false);
  const [hoverCell, setHoverCell] = useState<{x: number, y: number} | null>(null);
  const sandboxId = useId();

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // Narrative Transition 2: Sandbox -> Skills
      // On scroll out, nodes collapse gracefully
      gsap.to('.isometric-block', {
        x: 0,
        y: 100, // Move down towards the skills sphere
        scale: 0.1,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 60%', // Trigger when bottom of sandbox passes the 60% mark
          end: 'bottom 10%',   // End when bottom of sandbox is near the top
          scrub: 1,
        }
      });
    });
  }, { scope: containerRef, dependencies: [blocks.length] });

  const GRID_SIZE = 6; // compact 6x6 grid fits easily on all screens

  const gridCells = useMemo(() => {
    const cells = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        cells.push({ x, y });
      }
    }
    return cells;
  }, []);

  const handleCellClick = (x: number, y: number) => {
    // Check if block already exists at position
    const existingIdx = blocks.findIndex((b) => b.x === x && b.y === y);

    if (existingIdx > -1) {
      const currentHeight = blocks[existingIdx].height;
      if (currentHeight >= 5) {
        // Remove on max height click (cycle)
        setBlocks((prev) => prev.filter((_, idx) => idx !== existingIdx));
      } else {
        // Upgrade height
        setBlocks((prev) =>
          prev.map((b, idx) => (idx === existingIdx ? { ...b, height: b.height + 1, color: selectedColor } : b))
        );
      }
    } else {
      // Spawn new
      setBlocks((prev) => [...prev, { x, y, height: selectedHeight, color: selectedColor }]);
    }
  };

  const clearSandbox = () => {
    setBlocks([]);
  };

  const getBlockAt = (x: number, y: number) => {
    return blocks.find((b) => b.x === x && b.y === y);
  };

  return (
    <div id={sandboxId} ref={containerRef} className="w-full max-w-5xl px-4 pt-0 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Narrative & Controls Panel (5/12 cols columns) */}
      <div id={`${sandboxId}-narrative`} className="lg:col-span-5 flex flex-col justify-start w-full sandbox-animate-item">
        <div className="border border-zinc-850 p-5 sm:p-6 rounded-3xl bg-zinc-900/10 backdrop-blur-xl w-full h-[340px] sm:h-[450px] flex flex-col justify-between shadow-2xl relative overflow-hidden group/card hover:border-cyan-400/50 hover:bg-zinc-800/30 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-all duration-500 ease-out z-10 hover:z-20">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-400 animate-pulse group-hover/card:text-cyan-400 transition-colors duration-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Systems Architecture
              </span>
            </div>

            <h3 className="text-2xl font-display font-medium text-white tracking-tight">
              Cluster Topology Sandbox
            </h3>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-md:hidden">
              Draft high-performance topologies. Build service and database tiers directly on the perspective grid. Deploy interactive nodes and scale replica instances.
            </p>

            {/* Builder controls */}
            <div className="space-y-3 my-3 p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-2xl">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest">
                    Service Component
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {selectedColor === '#06b6d4' ? 'React Client' : selectedColor === '#a855f7' ? 'Express API' : selectedColor === '#a21caf' ? 'Redis Cache' : 'PostgreSQL DB'}
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {[
                    { hex: '#06b6d4', name: 'React Client (Cyan)' },
                    { hex: '#a855f7', name: 'Express API (Purple)' },
                    { hex: '#a21caf', name: 'Redis Cache (Magenta)' },
                    { hex: '#10b981', name: 'PostgreSQL DB (Emerald)' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(c.hex)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor === c.hex ? 'border-white scale-110 shadow-md shadow-zinc-800' : 'border-black'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      <span className="text-[9px] text-zinc-950 font-bold select-none font-mono">
                        {c.hex === '#06b6d4' ? 'FE' : c.hex === '#a855f7' ? 'API' : c.hex === '#a21caf' ? 'MEM' : 'DB'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest">
                  Deploy Replicas ({selectedHeight} replicas)
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={selectedHeight}
                  onChange={(e) => setSelectedHeight(Number(e.target.value))}
                  className="w-32 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase">Orbit Yaw</span>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={yaw}
                    onChange={(e) => setYaw(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-550 uppercase">Pitch Tilt</span>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={clearSandbox}
                className="flex items-center gap-1.5 px-3 py-2 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer bg-zinc-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cluster</span>
              </button>
              
              <button
                onClick={() => setShowHelper((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 border border-zinc-850 hover:border-zinc-700 text-zinc-50 hover:text-zinc-300 rounded-lg text-xs font-mono transition-all cursor-pointer bg-zinc-950/40"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Deployment Guide</span>
              </button>
            </div>

            <AnimatePresence>
              {showHelper && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-mono text-zinc-500 leading-relaxed bg-zinc-950/30 border border-zinc-900 p-2.5 rounded-xl overflow-hidden"
                >
                  • **Click empty cell** to deploy node.<br />
                  • **Click active node** to adjust replica counts (height).<br />
                  • **Max (5) replicas** recycles/deletes the node.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Interactive 3D Canvas Grid (7/12 cols columns) */}
      <div 
        id={`${sandboxId}-canvas-viewport`} 
        className="lg:col-span-7 relative flex items-center justify-center w-full h-[340px] sm:h-[450px] border border-zinc-850 bg-gradient-to-b from-zinc-950/20 to-transparent rounded-3xl overflow-hidden group/canvas shadow-2xl hover:border-purple-400/50 hover:from-zinc-900/40 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_0_50px_rgba(168,85,247,0.25)] transition-all duration-500 ease-out z-10 hover:z-20 sandbox-animate-item"
      >
        {/* Futuristic Corner Bracket markings */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-zinc-800 pointer-events-none group-hover/canvas:border-purple-400 group-hover/canvas:scale-150 group-hover/canvas:-translate-x-1 group-hover/canvas:-translate-y-1 transition-all duration-500 ease-out" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-zinc-800 pointer-events-none group-hover/canvas:border-purple-400 group-hover/canvas:scale-150 group-hover/canvas:translate-x-1 group-hover/canvas:-translate-y-1 transition-all duration-500 ease-out" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-zinc-800 pointer-events-none group-hover/canvas:border-purple-400 group-hover/canvas:scale-150 group-hover/canvas:-translate-x-1 group-hover/canvas:translate-y-1 transition-all duration-500 ease-out" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-zinc-800 pointer-events-none group-hover/canvas:border-purple-400 group-hover/canvas:scale-150 group-hover/canvas:translate-x-1 group-hover/canvas:translate-y-1 transition-all duration-500 ease-out" />

        {/* Live HUD telemetry overlays */}
        <div className="absolute top-4 left-10 text-[8px] font-mono tracking-widest text-zinc-600 flex items-center gap-1.5 pointer-events-none select-none">
          <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          <span>SYSTEM_HUD: TOPOLOGY_SANDBOX_V1.1_SIM_ACTIVE</span>
        </div>
        <div className="absolute top-4 right-10 text-[8px] font-mono tracking-widest text-zinc-600 pointer-events-none select-none uppercase">
          Nodes: {blocks.length} | Pitch: {pitch}° | Yaw: {yaw}°
        </div>

        {/* Lattice blueprint references */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1200px]">
          
          <div
            className="relative transition-transform duration-1000 ease-out preserve-3d"
            style={{
              width: `${GRID_SIZE * 50}px`,
              height: `${GRID_SIZE * 50}px`,
              transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* The Main Base Platform */}
            <div
              className="absolute inset-0 pointer-events-auto bg-zinc-950/40 backdrop-blur-sm"
              style={{
                backgroundSize: `50px 50px`,
                backgroundImage: `
                  linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
                `,
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.05), inset 0 0 20px rgba(0, 0, 0, 0.5)',
                transform: 'translateZ(0px)',
              }}
              onMouseLeave={() => setHoverCell(null)}
            >
              {/* Highlight Hover Cell (Premium Crosshair Effect) */}
              {hoverCell && (
                <div
                  className="absolute pointer-events-none transition-all duration-75 ease-out flex items-center justify-center"
                  style={{
                    width: `50px`,
                    height: `50px`,
                    left: `${hoverCell.y * 50}px`,
                    top: `${hoverCell.x * 50}px`,
                    transform: 'translateZ(2px)',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    boxShadow: 'inset 0 0 15px rgba(6, 182, 212, 0.2), 0 0 20px rgba(6, 182, 212, 0.2)'
                  }}
                >
                  {/* Inner targeting brackets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                  
                  <span className="text-[7px] font-mono font-bold text-cyan-300 drop-shadow-[0_0_2px_rgba(6,182,212,0.8)]">
                    [{hoverCell.x},{hoverCell.y}]
                  </span>
                </div>
              )}
            </div>

          {/* Base Grid Plane (Invisible Hitboxes) */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 rounded-xl overflow-hidden preserve-3d z-10" style={{ transform: 'translateZ(0px)' }}>
            {gridCells.map((cell) => (
              <div
                key={`${cell.x}-${cell.y}`}
                onClick={() => handleCellClick(cell.x, cell.y)}
                onMouseEnter={() => setHoverCell(cell)}
                className="cursor-pointer pointer-events-auto w-full h-full"
              />
            ))}
          </div>

          {/* Render 3D Blocks */}
          {blocks.map((block, idx) => {
            const size = 300 / GRID_SIZE; // width of each cell (50px for size 6)
            
            // Calculate absolute pixel displacements from top-left (isometric orientation layout)
            const left = block.y * size;
            const top = block.x * size;
            
            // A height level of 1 block correlates to 25px extrusion
            const heightPx = block.height * 24;

            return (
              <div
                key={`${block.x}-${block.y}-${idx}`}
                className="isometric-block absolute preserve-3d pointer-events-none"
                style={{
                  width: `${size - 4}px`,
                  height: `${size - 4}px`,
                  left: `${left + 2}px`,
                  top: `${top + 2}px`,
                  transform: 'translateZ(0px)', // anchor bottom base
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* 3D CUBOID EXTRUSION FACES FOR CSS MATRIX */}
                
                {/* 1. FRONT FACE */}
                <div
                  className="absolute bottom-0 left-0 right-0 origin-bottom border border-black/30"
                  style={{
                    height: `${heightPx}px`,
                    transform: 'rotateX(-90deg)',
                    transformOrigin: 'bottom',
                    backgroundColor: block.color,
                    filter: 'brightness(0.85)',
                    opacity: 0.92,
                  }}
                />

                {/* 2. BACK FACE */}
                <div
                  className="absolute top-0 left-0 right-0 origin-top border border-black/30"
                  style={{
                    height: `${heightPx}px`,
                    transform: 'rotateX(90deg) rotateY(180deg)',
                    transformOrigin: 'top',
                    backgroundColor: block.color,
                    filter: 'brightness(0.65)',
                    opacity: 0.92,
                  }}
                />

                {/* 3. RIGHT FACE */}
                <div
                  className="absolute top-0 bottom-0 right-0 origin-right border border-black/30"
                  style={{
                    width: `${heightPx}px`,
                    height: '100%',
                    transform: 'rotateY(90deg)',
                    transformOrigin: 'right',
                    backgroundColor: block.color,
                    filter: 'brightness(0.75)',
                    opacity: 0.92,
                  }}
                />

                {/* 4. LEFT FACE */}
                <div
                  className="absolute top-0 bottom-0 left-0 origin-left border border-black/30"
                  style={{
                    width: `${heightPx}px`,
                    height: '100%',
                    transform: 'rotateY(-90deg)',
                    transformOrigin: 'left',
                    backgroundColor: block.color,
                    filter: 'brightness(0.65)',
                    opacity: 0.92,
                  }}
                />

                {/* 5. TOP (CAP) FACE */}
                <div
                  className="absolute inset-0 border border-black/30 rounded-t-sm"
                  style={{
                    transform: `translateZ(${heightPx}px)`,
                    backgroundColor: block.color,
                    filter: 'brightness(1.05)',
                    opacity: 0.95,
                    boxShadow: `0 0 15px ${block.color}50`,
                  }}
                />

              </div>
            );
          })}
        </div>
        </div>

      </div>
    </div>
  );
}
