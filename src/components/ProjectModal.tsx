import React, { useId } from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github, Code, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalId = useId();
  if (!project) return null;

  return (
    <div id={modalId} className="fixed inset-0 min-h-screen w-full flex items-center justify-center p-4 z-50 overflow-y-auto bg-black/85 backdrop-blur-md">
      
      {/* Absolute Backdrop Click trigger */}
      <div 
        id={`${modalId}-backdrop`}
        className="absolute inset-0 cursor-crosshair" 
        onClick={onClose} 
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden shadow-2xl z-20 flex flex-col items-center"
      >
        
        {/* Floating close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer z-35 active:scale-90"
          title="Exit overlay"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image header viewport */}
        <div className="relative w-full h-[220px] sm:h-[280px]">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover filter brightness-[0.4] contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 sm:left-10 text-left">
            <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {project.category}
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mt-3">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content body layout split into two sections: 7/12 cols info, 5/12 cols specs */}
        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          
          {/* Main narrative & features specifications (7/12 cols) */}
          <div className="md:col-span-7 space-y-6 text-left">
            <div>
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-zinc-500" /> System Architecture
              </h4>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {project.longDescription}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3.5">
                Primary Deliverables
              </h4>
              <ul className="space-y-3">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-zinc-450 leading-relaxed bg-zinc-900/10 border border-zinc-900/30 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics & blueprints variables (5/12 cols) */}
          <div className="md:col-span-5 space-y-6 text-left">
            
            {/* Project Metrics HUD */}
            {project.metrics && (
              <div className="border border-zinc-900 bg-zinc-900/15 p-5 rounded-2xl">
                <h5 className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest mb-4">
                  Operational Metrics
                </h5>
                <div className="space-y-3.5">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                      <span className="text-xs font-mono text-zinc-500">{m.label}</span>
                      <span className="text-xs font-mono font-semibold text-white bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 shadow-sm">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies tags container */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                Integrated Framework Modules
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-zinc-300 bg-zinc-900/60 border border-zinc-850 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project code repositories / links */}
            <div className="pt-4 border-t border-zinc-900 space-y-3.5 w-full">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black font-semibold text-xs font-mono rounded-xl hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                >
                  <span>Launch Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-white rounded-xl text-xs font-mono transition-all cursor-pointer bg-zinc-950/20"
                >
                  <Github className="w-4 h-4" />
                  <span>Inspect Blueprint Repo</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Diagonal stats watermark decorative bar */}
        <div className="w-full bg-zinc-900/10 border-t border-zinc-900 py-4 px-6 text-[10px] font-mono text-zinc-550 flex justify-between items-center bg-transparent mt-4">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>ENCRYPTED LAB BLUEPRINT MODEL</span>
          </div>
          <span>SEC_KEY: 0xF37-C2</span>
        </div>

      </motion.div>
    </div>
  );
}
