import React, { useState, useEffect, useId, useRef } from 'react';
import { Clock, Play, Radio, MapPin, Smile, MessageCircleCode, AudioWaveform, Flame, Code, Layers, GitBranch, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import ThreeDTilt from './ThreeDTilt';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BentoGrid() {
  const [time, setTime] = useState(new Date());
  const [isPlayingSynth, setIsPlayingSynth] = useState<string | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const gridId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo('.bento-item',
        { opacity: 0, y: 40, scale: 0.95, filter: 'blur(5px)' },
        {
          opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
            end: 'bottom 15%',
            toggleActions: 'play reset play reset'
          }
        }
      );
    });
  }, { scope: containerRef });

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format local clock time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // Format local date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to trigger interactive pure synth notes using raw Web Audio API
  const playSynthesizerNote = (frequency: number, noteLabel: string) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        console.warn('AudioContext is not available or disabled in this window/iframe environment.');
        return;
      }

      let ctx = audioCtx;
      if (!ctx) {
        ctx = new AudioCtxClass();
        setAudioCtx(ctx);
      }

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlayingSynth(noteLabel);
      setTimeout(() => setIsPlayingSynth(null), 150);

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Creative synth envelope: quick attack, fast release
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn('Audio synthesis initialized incorrectly or suspended.', err);
    }
  };

  // Key frequencies for pentatonic ambient scale (C major pentatonic)
  const synthButtons = [
    { note: 'C4', label: 'C4', freq: 261.63 },
    { note: 'D4', label: 'D4', freq: 293.66 },
    { note: 'E4', label: 'E4', freq: 329.63 },
    { note: 'F4', label: 'F4', freq: 349.23 },
    { note: 'G4', label: 'G4', freq: 392.00 },
    { note: 'A4', label: 'A4', freq: 440.00 },
    { note: 'B4', label: 'B4', freq: 493.88 },
    { note: 'C5', label: 'C5', freq: 523.25 },
  ];

  const blackKeys = [
    { note: 'C#4', left: '12.5%' },
    { note: 'D#4', left: '25%' },
    { note: 'F#4', left: '50%' },
    { note: 'G#4', left: '62.5%' },
    { note: 'A#4', left: '75%' },
  ];

  // Symmetrical-ish waveform data matching the screenshot
  const waveformHeights = [
    2, 2, 3, 2, 4, 3, 5, 4, 6, 5, 8, 6, 10, 14, 12, 18, 15,
    22, 16,
    12, 10, 8, 6, 8, 10,
    14, 18, 24, 20, 30, 26, 38, 32, 40, 36, 42, 38, 30, 24, 20,
    16, 12, 10, 8,
    12, 16, 20, 18, 24, 20,
    15, 12, 10, 8, 6, 5, 4, 3, 2, 2
  ];

  return (
    <div id={gridId} ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 max-md:gap-3 w-full max-w-6xl px-4 pt-0 pb-8">
      
      {/* CARD 1: Profile & Timezone Location */}
      <ThreeDTilt maxRotate={2} scale={1.01} glowColor="rgba(6,182,212,0.15)" className="bento-item md:col-span-2 max-md:h-auto sm:h-[220px]">
        <div 
          id={`${gridId}-profile`}
          className="w-full h-full border border-cyan-900/30 bg-cyan-950/10 backdrop-blur-2xl max-md:p-4 p-6 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(6,182,212,0.05)] transition-all duration-500"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="relative max-md:w-9 max-md:h-9 w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-inner shrink-0">
                {/* Abstract structural avatar representation */}
                <div className="w-6 h-6 rounded-full border border-dashed border-cyan-400 rotate-45 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base">Kevin Joseph</h4>
                <p className="text-zinc-500 text-xs font-mono max-md:hidden">B.Tech CSE Student & Web Dev</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/80 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 shadow-sm">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>India / Remote</span>
            </div>
          </div>

          <div className="flex justify-between items-start pt-4 border-t border-zinc-800/50 mt-4 max-md:pt-2 max-md:mt-2">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>TIMEZONE / UTC +8</span>
              </div>
              <div className="font-display text-2xl font-bold font-mono text-white tracking-tight drop-shadow-md">
                {formatTime(time)}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-1">
                {formatDate(time)}
              </div>
            </div>

            <div className="w-px h-full bg-zinc-800/50 mx-4"></div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                STATUS
              </div>
              <div className="text-[10px] font-mono text-emerald-400 mb-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Available for Opportunities
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 rounded-lg backdrop-blur-md">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Open to SDE internships</span>
              </div>
            </div>
          </div>
        </div>
      </ThreeDTilt>

      {/* CARD 2: Interactive Mechanical Synth */}
      <ThreeDTilt maxRotate={3} scale={1.02} glowColor="rgba(168,85,247,0.15)" className="bento-item max-md:h-auto sm:h-[220px]">
        <div 
          id={`${gridId}-synth`}
          className="w-full h-full border border-purple-900/30 bg-purple-950/10 backdrop-blur-2xl max-md:p-2.5 p-4 sm:p-5 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(168,85,247,0.05)] transition-all duration-500"
        >
          {/* Header & Waveform */}
          <div className="flex flex-col gap-3 max-md:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-1 max-md:mb-0">
                <AudioWaveform className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase">
                  Tactile Sound Synthesizer
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug drop-shadow-sm max-md:hidden">
                I believe code should have acoustic weight. Play notes to generate simple oscillator waveforms:
              </p>
            </div>
            
            {/* Waveform Visualization */}
            <div className="w-full max-md:h-6 h-8 bg-zinc-950/50 rounded-md border border-zinc-800/80 p-1 flex items-center justify-center overflow-hidden max-md:mt-1 max-md:hidden">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="20%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="80%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                {waveformHeights.map((h, i) => {
                  const maxH = 42; 
                  const normalizedH = Math.max(3, (h / maxH) * 85);
                  const currentH = isPlayingSynth ? normalizedH : 2;
                  const currentY = 50 - currentH / 2;
                  return (
                    <rect 
                      key={i}
                      x={(i / (waveformHeights.length - 1)) * 98.5} 
                      width="1.5" 
                      fill="url(#waveGrad)" 
                      rx="0.5" 
                      style={{
                        y: currentY,
                        height: currentH,
                        transition: isPlayingSynth ? 'all 0.05s ease-out' : 'all 0.4s ease-in-out'
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Piano Keyboard */}
          <div className="relative w-full max-md:h-[35px] h-[65px] flex justify-between rounded-b-md max-md:mt-1 mt-2">
            {/* White Keys */}
            {synthButtons.map((btn) => {
              const isActive = isPlayingSynth === btn.note;
              return (
                <button
                  key={btn.note}
                  onClick={() => playSynthesizerNote(btn.freq, btn.note)}
                  className={`relative w-[12%] h-full rounded-b-md border transition-all flex items-end justify-center pb-1.5 cursor-pointer origin-top backdrop-blur-md
                    ${isActive 
                      ? 'bg-gradient-to-b from-cyan-400/80 to-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] text-cyan-950 scale-y-[0.96] z-10' 
                      : 'bg-gradient-to-b from-white/10 to-white/5 border-white/20 text-zinc-300 hover:from-cyan-400/30 hover:to-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:text-white hover:z-10 z-0'
                    }`}
                >
                  <span className="text-[8px] font-mono font-semibold select-none">{btn.label}</span>
                </button>
              );
            })}

            {/* Black Keys */}
            {blackKeys.map((bk) => (
              <button
                key={bk.note}
                className="absolute top-0 w-[7.5%] max-md:h-[18px] h-[35px] bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/80 rounded-b-sm shadow-md z-20 hover:from-zinc-800 hover:to-zinc-950 transition-colors cursor-pointer"
                style={{ left: bk.left, transform: 'translateX(-50%)' }}
              />
            ))}
          </div>
        </div>
      </ThreeDTilt>

      {/* CARD 3: Creative Philosophy */}
      <ThreeDTilt maxRotate={4} scale={1.03} glowColor="rgba(249,115,22,0.15)" className="bento-item max-md:h-auto sm:h-[180px]">
        <div 
          id={`${gridId}-philosophy`}
          className="w-full h-full border border-orange-900/30 bg-orange-950/10 backdrop-blur-2xl max-md:p-3 p-6 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(249,115,22,0.05)] transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase">
              Product Ethos
            </span>
          </div>

          <p className="font-display font-medium max-md:text-[11px] text-sm text-zinc-200 leading-relaxed max-md:leading-snug mt-2 max-md:mt-1 drop-shadow-md">
            <span className="text-orange-400">"</span>Pristine design is the translation of engineering values into tactile, spatial aesthetics that feel lightweight yet physically solid.<span className="text-orange-400">"</span>
          </p>

          <div className="text-[10px] font-mono text-zinc-500 uppercase mt-4 max-md:mt-2">
            — DESIGN PARADIGM
          </div>
        </div>
      </ThreeDTilt>

      {/* CARD 4: Blueprint Sandbox Info */}
      <ThreeDTilt maxRotate={2} scale={1.01} glowColor="rgba(16,185,129,0.15)" className="bento-item md:col-span-2 max-md:h-auto sm:h-[180px]">
        <div 
          id={`${gridId}-sandbox`}
          className="w-full h-full border border-emerald-900/30 bg-emerald-950/10 backdrop-blur-2xl max-md:p-3 p-6 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(16,185,129,0.05)] transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <MessageCircleCode className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              Architectural Blueprinting
            </span>
          </div>

          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed drop-shadow-sm">
            I combine core computer science concepts with modern full-stack workflows. From recursive search query optimization to fluid custom css transitions, I build responsive workspaces that feel lightweight yet robust.
          </p>

          <div className="flex flex-wrap gap-4 max-md:gap-2 mt-4 max-md:mt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800/60 pt-3 max-md:pt-2">
            <span className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> WEB_GL MATRIX
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> REACT CORE
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" /> 3D PERSPECTIVE
            </span>
          </div>
        </div>
      </ThreeDTilt>

      {/* Global Stats Bar */}
      <ThreeDTilt maxRotate={1} scale={1.01} glowColor="rgba(59,130,246,0.12)" className="bento-item md:col-span-3">
        <div className="w-full border border-blue-900/30 bg-blue-950/10 backdrop-blur-2xl rounded-2xl max-md:p-2 p-4 sm:p-5 flex flex-row items-center justify-between sm:divide-x divide-zinc-800/50 shadow-[0_8px_30px_rgba(59,130,246,0.05)] transition-all duration-500">
          {/* Stat 1 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-4 px-1 sm:px-6 w-full justify-center">
            <div className="max-md:w-6 max-md:h-6 w-10 h-10 rounded-full border border-cyan-900/30 bg-cyan-950/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <Code className="max-md:w-3 max-md:h-3 w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-bold max-md:text-sm text-lg leading-tight">20+</span>
              <span className="text-zinc-500 font-mono max-md:text-[7px] text-[10px] sm:text-[11px] uppercase tracking-wider">Projects Built</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-4 px-1 sm:px-6 w-full justify-center">
            <div className="max-md:w-6 max-md:h-6 w-10 h-10 rounded-full border border-purple-900/30 bg-purple-950/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Layers className="max-md:w-3 max-md:h-3 w-4 h-4 text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-bold max-md:text-sm text-lg leading-tight">15+</span>
              <span className="text-zinc-500 font-mono max-md:text-[7px] text-[10px] sm:text-[11px] uppercase tracking-wider">Technologies</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-4 px-1 sm:px-6 w-full justify-center">
            <div className="max-md:w-6 max-md:h-6 w-10 h-10 rounded-full border border-amber-900/30 bg-amber-950/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <GitBranch className="max-md:w-3 max-md:h-3 w-4 h-4 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-bold max-md:text-sm text-lg leading-tight">1.2K+</span>
              <span className="text-zinc-500 font-mono max-md:text-[7px] text-[10px] sm:text-[11px] uppercase tracking-wider">Commits</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-4 px-1 sm:px-6 w-full justify-center">
            <div className="max-md:w-6 max-md:h-6 w-10 h-10 rounded-full border border-blue-900/30 bg-blue-950/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <Activity className="max-md:w-3 max-md:h-3 w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-bold max-md:text-sm text-lg leading-tight">98%</span>
              <span className="text-zinc-500 font-mono max-md:text-[7px] text-[10px] sm:text-[11px] uppercase tracking-wider">Consistency</span>
            </div>
          </div>
        </div>
      </ThreeDTilt>

    </div>
  );
}
