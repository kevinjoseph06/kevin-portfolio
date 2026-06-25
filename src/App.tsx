import React, { useState, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Terminal, 
  Compass, 
  ArrowUpRight, 
  Globe, 
  Mail, 
  ArrowRight,
  Github, 
  Code, 
  Workflow, 
  FolderLock, 
  Command, 
  Sparkles,
  ChevronDown,
  Linkedin,
  Instagram,
  Layers,
  Box,
  Boxes,
  Activity,
  Focus,
  GitBranch,
  BarChart2,
  Network,
  Menu,
  X
} from 'lucide-react';
import ThreeDCube from './components/ThreeDCube';
import ThreeDSphere from './components/ThreeDSphere';
import BentoGrid from './components/BentoGrid';
import ExperienceTimeline from './components/ExperienceTimeline';
import ContactForm from './components/ContactForm';
import Sandbox from './components/Sandbox';
import ProjectModal from './components/ProjectModal';
import Magnetic from './components/Magnetic';
import TextSpotlight from './components/TextSpotlight';
import { Project } from './types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AMBIENT_GRID_NODES = [
  { id: 1, top: '15%', left: '8%', size: 'w-4 h-4', speed: 0.025 },
  { id: 2, top: '22%', left: '88%', size: 'w-3 h-3', speed: -0.04 },
  { id: 3, top: '42%', left: '14%', size: 'w-5 h-5', speed: 0.018 },
  { id: 4, top: '56%', left: '82%', size: 'w-4 h-4', speed: -0.022 },
  { id: 5, top: '68%', left: '10%', size: 'w-3.5 h-3.5', speed: 0.035 },
  { id: 6, top: '78%', left: '87%', size: 'w-5.5 h-5.5', speed: -0.03 },
  { id: 7, top: '33%', left: '48%', size: 'w-4 h-4', speed: 0.012 },
  { id: 8, top: '62%', left: '38%', size: 'w-3 h-3', speed: -0.018 },
  { id: 9, top: '88%', left: '58%', size: 'w-4.5 h-4.5', speed: 0.03 },
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [metricPulse, setMetricPulse] = useState(true);
  const [navPulse, setNavPulse] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const appId = useId();
  const appRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const headerBgOpacity = useTransform(scrollY, [0, 300], [0.03, 0.1]);
  const headerBlur = useTransform(scrollY, [0, 300], [12, 24]);
  const headerBg = useTransform(headerBgOpacity, opacity => `rgba(255, 255, 255, ${opacity})`);

  useGSAP(() => {
    // 1. High-Performance Mouse Physics using GSAP quickTo and CSS Variables
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const xTo = gsap.quickTo(pos, "x", { 
      duration: 0.8, ease: "power3.out", 
      onUpdate: () => appRef.current?.style.setProperty('--mouse-x', `${pos.x}px`) 
    });
    const yTo = gsap.quickTo(pos, "y", { 
      duration: 0.8, ease: "power3.out", 
      onUpdate: () => appRef.current?.style.setProperty('--mouse-y', `${pos.y}px`) 
    });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 2. Cinematic Hero Reveal
    const tl = gsap.timeline({ 
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: "#home",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reset play reset"
      }
    });
    tl.fromTo('.hero-telemetry', 
        { opacity: 0, y: -20, filter: 'blur(5px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }
      )
      .fromTo('.hero-title', 
        { opacity: 0, y: 30, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2 }, 
        "-=0.4"
      )
      .fromTo('.hero-subtitle', 
        { opacity: 0, y: 20, filter: 'blur(5px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 
        "-=0.8"
      )
      .fromTo('.hero-socials', 
        { opacity: 0, y: 20, filter: 'blur(5px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1 }, 
        "-=0.8"
      )
      .fromTo('.hero-explore', 
        { opacity: 0, filter: 'blur(5px)' }, 
        { opacity: 1, filter: 'blur(0px)', duration: 1 }, 
        "-=0.5"
      );

    // 3. Premium Scroll Reveals for Standard Sections
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray('.gsap-reveal').forEach((elem: any) => {
        gsap.fromTo(elem,
          { opacity: 0, y: 50, filter: 'blur(8px)', scale: 0.96 },
          {
            opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 95%", // Trigger right as it enters viewport to prevent loading lag
              end: "bottom 15%", // Reset when fully off-screen
              toggleActions: "play reset play reset", // Smooth replay on scroll back
            }
          }
        );
      });
    });

    // Narrative Transition 1: Projects -> Sandbox (Cube Energy Transfer)
    gsap.to('.cube-container', {
      y: -150,
      opacity: 0,
      scale: 0.85,
      filter: 'blur(10px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#sandbox',
        start: 'top bottom', // When sandbox top enters viewport bottom
        end: 'top center', // When sandbox top reaches center
        scrub: 1, // Smooth scrub
      }
    });

    // Sandbox Staggered Entrance Animation
    gsap.fromTo('.sandbox-animate-item',
      { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.98 },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#sandbox',
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Seamless Background Fade for Sandbox
    gsap.fromTo('.sandbox-bg-wrapper',
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#sandbox',
          start: 'top bottom', // Start fading right as Sandbox hits the bottom of viewport
          end: 'top center',   // Finish fading when Sandbox reaches the center
          scrub: true,
        }
      }
    );



    // 4. Parallax Background Depth
    gsap.utils.toArray('.parallax-bg').forEach((elem: any) => {
      const speed = parseFloat(elem.getAttribute('data-speed') || "0.5");
      gsap.to(elem, {
        y: () => (ScrollTrigger.maxScroll(window) * speed * 0.15),
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 1.5 // Silky smooth scrubbing
        }
      });
    });

    // 5. Hero -> Projects Seamless Transition (Dissolve)
    gsap.to('.hero-bg-wrapper', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom', // Start fading right as Projects hits the bottom of viewport
        end: 'top 30%',      // Finish fading when Projects reaches 30% from the top
        scrub: true,
      }
    });

    // Hero Character Floating Physics removed to keep background idle

    // 6. Setup Ambient Grid CSS values initially
    appRef.current?.style.setProperty('--mouse-x', `${pos.x}px`);
    appRef.current?.style.setProperty('--mouse-y', `${pos.y}px`);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: appRef });

  // Gentle metric interval indicator pulse
  useEffect(() => {
    const timer = setInterval(() => setMetricPulse((prev) => !prev), 2000);
    return () => clearInterval(timer);
  }, []);

  // Pulse animation on active section change
  useEffect(() => {
    setNavPulse(true);
    const timer = setTimeout(() => setNavPulse(false), 800);
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Update active navigation class during scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'sandbox', 'skills', 'bento', 'timeline', 'connect'];
      const scrollPosition = window.scrollY + (window.innerHeight * 0.4);

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id={appId} ref={appRef} className="relative min-h-screen bg-[#030303] text-[#f4f4f5] font-sans antialiased overflow-hidden select-none">
      
      {/* Mobile Right-Edge Scroll Progress Line */}
      <motion.div 
        className="fixed top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 to-indigo-500 origin-top z-[999] md:hidden shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        style={{ scaleY: scrollYProgress }}
      />

      {/* Mobile Left-Edge Scroll Progress Line */}
      <motion.div 
        className="fixed top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 to-cyan-400 origin-top z-[999] md:hidden shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        style={{ scaleY: scrollYProgress }}
      />

      {/* Absolute Aesthetic Background Lattice Grids */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none parallax-bg" data-speed="0.2" />
      
      {/* Interactive Background Grid Elements Tracking the Cursor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 parallax-bg" data-speed="0.4">
        {AMBIENT_GRID_NODES.map((node) => (
          <div
            key={node.id}
            className="absolute transition-colors duration-300"
            style={{
              top: node.top,
              left: node.left,
              transform: `translate3d(calc(var(--mouse-x, 0px) * ${node.speed}), calc(var(--mouse-y, 0px) * ${node.speed}), 0)`,
              willChange: 'transform',
            }}
          >
            {node.id % 3 === 0 ? (
              <span className="text-[14px] font-mono select-none text-cyan-400/20 font-light">+</span>
            ) : node.id % 3 === 1 ? (
              <div className="w-1.5 h-1.5 border border-purple-500/30 rotate-45" />
            ) : (
              <div className="w-1 h-1 rounded-full bg-cyan-500/25 shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
            )}
          </div>
        ))}
      </div>
      
      {/* Dynamic Cursor Spotlight Tracking Aura */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-75"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x, -200px) var(--mouse-y, -200px), rgba(6, 182, 212, 0.045) 0%, rgba(139, 92, 246, 0.015) 50%, transparent 100%)`
        }}
      />

      {/* Floating telemetry grid coordinate pointers */}
      <div 
        className="fixed pointer-events-none z-0 text-cyan-500/15 font-mono text-[9px] uppercase tracking-widest hidden md:flex items-center justify-center select-none"
        style={{
          left: `var(--mouse-x, -200px)`,
          top: `var(--mouse-y, -200px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span className="absolute w-4 h-4 border border-cyan-500/10 rounded-full animate-ping [animation-duration:3s]" />
        <span className="absolute w-2.5 h-2.5 border border-purple-500/15 rotate-45" />
        <span className="absolute top-4 left-4 text-[7px] text-zinc-700/60 font-semibold select-none font-sans whitespace-nowrap">
          SYSTEM_POS: TRACKING
        </span>
      </div>

      {/* Ambient Corner Gradient Orbs */}
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0 parallax-bg" data-speed="0.1" />
      <div className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none z-0 parallax-bg" data-speed="0.3" />
      <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-orange-500/3 blur-[110px] pointer-events-none z-0 parallax-bg" data-speed="0.2" />

      {/* 1. INTERACTIVE FLOATING NAVIGATION HEAD PANEL */}
      <motion.header 
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-max h-14 border border-zinc-800/60 rounded-full z-[100] flex items-center justify-between lg:justify-center gap-2 lg:gap-8 px-2 sm:px-4 shadow-2xl transition-all"
        style={{
          backgroundColor: headerBg,
          backdropFilter: useTransform(headerBlur, blur => `blur(${blur}px)`),
        }}
      >
        
        {/* LEFT COMPONENT */}
        <div className="flex items-center gap-4 pl-1">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '#home');
              const el = document.getElementById('home');
              if (el && (window as any).lenis) {
                (window as any).lenis.scrollTo(el, { immediate: true, duration: 0 });
              } else if (el) {
                el.scrollIntoView({ behavior: 'auto' });
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 bg-[#0a0a0c] border border-zinc-800/80 rounded-xl flex items-center justify-center shadow-inner overflow-hidden transition-colors duration-300 group-hover:border-zinc-700">
              {/* Central KJ Logo */}
              <img src="/navbar_logo.png" alt="KJ Logo" className="w-[80%] h-[80%] object-contain z-10 transition-all duration-700 group-hover:brightness-150 group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.4)] drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]" />
              {/* Circular SVG Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-[5px]" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* violet-500 */}
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="44" className="stroke-zinc-800/40" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="50" cy="50" r="44" 
                  stroke="url(#progress-gradient)"
                  className="drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" 
                  strokeWidth="8" fill="none" strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>
            </div>
          </a>

          {/* MOBILE ACTIVE SECTION PILL */}
          <AnimatePresence>
            {activeSection !== 'home' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                className="md:hidden flex items-center justify-center px-5 h-11 bg-[#0a0a0c] rounded-2xl border border-zinc-800/80 shadow-inner relative overflow-hidden"
              >
                <motion.div 
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 pointer-events-none origin-left shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: '100%', zIndex: 0 }}
                />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider relative z-10">
                  {[
                    { id: 'projects', label: 'Projects' },
                    { id: 'sandbox', label: 'Sandbox' },
                    { id: 'skills', label: 'Tech Skills' },
                    { id: 'bento', label: 'Analytics' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'connect', label: 'Connect' },
                  ].find(item => item.id === activeSection)?.label || activeSection}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER COMPONENT (LINKS) */}
        <motion.nav 
          className="hidden lg:flex items-center relative rounded-2xl transition-shadow duration-500 h-full"
          animate={{ boxShadow: navPulse ? '0 0 20px rgba(6,182,212,0.15)' : '0 0 0px rgba(6,182,212,0)' }}
          onMouseLeave={() => setHoveredNav(null)}
        >
          {/* Subtle track background */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-zinc-800/30 pointer-events-none" style={{ zIndex: -3 }} />
          
          {/* Active Progress fill line */}
          <motion.div 
            className="absolute bottom-0 left-4 h-[1px] bg-gradient-to-r from-indigo-500/70 to-violet-500/70 pointer-events-none origin-left shadow-[0_0_4px_rgba(99,102,241,0.3)]"
            style={{ 
              scaleX: scrollYProgress,
              width: 'calc(100% - 32px)',
              zIndex: -2 
            }}
          />

          {[
            { id: 'projects', label: 'Projects' },
            { id: 'sandbox', label: 'Sandbox' },
            { id: 'skills', label: 'Tech Skills' },
            { id: 'bento', label: 'Analytics' },
            { id: 'timeline', label: 'Timeline' },
          ].map((navItem, idx, arr) => {
            const fullSections = ['home', 'projects', 'sandbox', 'skills', 'bento', 'timeline', 'connect'];
            const currentFullIdx = fullSections.indexOf(activeSection);
            const myFullIdx = fullSections.indexOf(navItem.id);
            const isCompleted = currentFullIdx > myFullIdx;
            const isActive = activeSection === navItem.id;

            return (
            <React.Fragment key={navItem.id}>
                <a
                  href={`#${navItem.id}`}
                  onMouseEnter={() => setHoveredNav(navItem.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', `#${navItem.id}`);
                    const el = document.getElementById(navItem.id);
                    if (el && (window as any).lenis) {
                      let offset = 75;
                      if (navItem.id === 'projects') offset = 40;
                      if (navItem.id === 'skills') offset = 60;
                      if (navItem.id === 'bento') offset = 60;
                      if (navItem.id === 'timeline') offset = 100;
                      (window as any).lenis.scrollTo(el, { offset, immediate: true, duration: 0 });
                    } else if (el) {
                      el.scrollIntoView({ behavior: 'auto' });
                    }
                  }}
                  className={`relative flex items-center justify-center px-4 h-9 rounded-full transition-colors duration-300 group ${
                    isActive ? 'text-white font-bold' : isCompleted ? 'text-zinc-400 hover:text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {hoveredNav === navItem.id && !isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/[0.08] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      style={{ zIndex: -1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                    />
                  )}
                  <span className={`text-[10px] sm:text-[11px] font-sans uppercase tracking-wide relative z-10 mt-px transition-colors duration-300 ${isActive ? 'font-bold' : 'font-medium group-hover:text-white'}`}>{navItem.label}</span>
                </a>
              {idx < arr.length - 1 && (
                <span className="text-zinc-600 text-[8px] mx-1 select-none relative z-10">•</span>
              )}
            </React.Fragment>
          )})}
        </motion.nav>

        {/* RIGHT COMPONENT */}
        <div className="hidden md:flex items-center gap-3 pr-1">
            <a
              href="#connect"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '#connect');
                const el = document.getElementById('connect');
                if (el && (window as any).lenis) {
                  (window as any).lenis.scrollTo(el, { offset: 40, immediate: true, duration: 0 });
                } else if (el) {
                  el.scrollIntoView({ behavior: 'auto' });
                }
              }}
              className="flex items-center justify-center gap-2 px-4 h-9 bg-[#0a0a0c] border border-indigo-500/20 text-white font-semibold text-[8px] font-mono uppercase rounded-full hover:bg-[#15151a] hover:border-indigo-500/50 hover:shadow-[0_8px_15px_rgba(99,102,241,0.25)] hover:-translate-y-[2px] hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="mt-px">PING TERMINAL</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-cyan-300 transition-colors duration-500" />
            </a>
        </div>

        {/* MOBILE END SECTION */}
        <div className="flex md:hidden items-center gap-2">
            <a
              href="#connect"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                window.history.pushState(null, '', '#connect');
                const el = document.getElementById('connect');
                if (el && (window as any).lenis) {
                  (window as any).lenis.scrollTo(el, { offset: 40, immediate: true, duration: 0 });
                } else if (el) {
                  el.scrollIntoView({ behavior: 'auto' });
                }
              }}
              className="flex items-center justify-center gap-2 px-4 h-11 bg-[#0a0a0c] border border-indigo-500/20 text-white font-semibold text-[9px] font-mono uppercase rounded-2xl cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="mt-px hidden sm:inline">PING TERMINAL</span>
              <span className="mt-px sm:hidden">PING</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
            </a>

            {/* HAMBURGER */}
            <div 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-12 h-11 border border-zinc-800/80 rounded-xl bg-[#0a0a0c] shadow-inner text-zinc-400 cursor-pointer hover:text-white transition-colors relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-[#030303]/95 backdrop-blur-2xl flex flex-col pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 font-display text-2xl tracking-tight mt-4">
              {[
                { id: 'home', label: 'Home' },
                { id: 'projects', label: 'Projects' },
                { id: 'sandbox', label: 'Sandbox' },
                { id: 'skills', label: 'Tech Skills' },
                { id: 'bento', label: 'Analytics' },
                { id: 'timeline', label: 'Timeline' },
              ].map((navItem, index) => (
                <motion.a
                  key={navItem.id}
                  href={`#${navItem.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    window.history.pushState(null, '', `#${navItem.id}`);
                    const el = document.getElementById(navItem.id);
                    if (el && (window as any).lenis) {
                      let offset = 75;
                      if (navItem.id === 'projects') offset = 40;
                      if (navItem.id === 'skills') offset = 60;
                      if (navItem.id === 'bento') offset = 60;
                      if (navItem.id === 'timeline') offset = 100;
                      (window as any).lenis.scrollTo(el, { offset, immediate: true, duration: 0 });
                    } else if (el) {
                      el.scrollIntoView({ behavior: 'auto' });
                    }
                  }}
                  className={`border-b border-zinc-800/50 pb-4 transition-colors ${
                    activeSection === navItem.id ? 'text-white font-medium' : 'text-zinc-500'
                  }`}
                >
                  {navItem.label}
                </motion.a>
              ))}
            </div>
            
            <div className="mt-auto pb-12">
              <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-4">Connect</p>
              <div className="flex gap-4">
                <a href="https://github.com/kevinjoseph06" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0a0a0c] border border-zinc-800 flex items-center justify-center text-zinc-400 active:scale-95 transition-transform">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/kevinjoseph06/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0a0a0c] border border-zinc-800 flex items-center justify-center text-zinc-400 active:scale-95 transition-transform">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:kevinkalapurackal06@gmail.com" className="w-12 h-12 rounded-full bg-[#0a0a0c] border border-zinc-800 flex items-center justify-center text-zinc-400 active:scale-95 transition-transform">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT LAYOUT */}
      <main className="relative z-10 w-full flex flex-col items-center overflow-hidden">

        <section id="home" className="relative min-h-[90vh] sm:min-h-screen w-full flex max-md:flex-col items-center max-md:items-start overflow-hidden max-md:overflow-visible max-md:bg-black">
          
          {/* FULL-SCREEN HERO BACKGROUND - Pinned for Seamless Transition */}
          <div className="hero-bg-wrapper fixed inset-0 z-[1] w-full h-[100vh] pointer-events-none flex items-center justify-center max-md:items-start">
            <div className="hero-character w-full h-full max-md:h-[52vh] max-md:mt-8 relative z-0 flex items-center justify-center">
              <img 
                src="/hero-bg.png" 
                alt="AI Sentinel Background" 
                className="hero-character-img w-full h-full object-cover object-right max-md:object-[84%_top] scale-105 max-md:scale-100 max-md:origin-top"
              />
            </div>
          </div>

          {/* CONTENT COMPOSITION */}
          <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col justify-center text-left max-md:pt-32">
            
            <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col items-start max-md:mt-[35vh]">
              {/* Header active system telemetry */}
              <div className="hero-telemetry flex items-center gap-3 px-4 py-2 bg-zinc-950/60 border border-zinc-800/80 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-300 uppercase mb-6 lg:mb-8 backdrop-blur-xl shadow-lg shadow-black/40 max-md:mx-auto">
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse-slow" />
                <span>INDIA (UTC+5:30)</span>
                <span className="text-zinc-700 select-none">|</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${metricPulse ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-indigo-500'}`} />
                  PROD_SYS: ACTIVE
                </span>
              </div>

              {/* Headline - Refined typography and max width */}
              <TextSpotlight>
                <h1 className="hero-title font-display font-medium text-[1.75rem] min-[400px]:text-[2.25rem] sm:text-[3.2rem] md:text-[3.25rem] lg:text-[3.6rem] xl:text-[4rem] tracking-tight text-white leading-[1.1] max-w-[800px]">
                  <span className="font-mono font-normal tracking-tight">ENGINEERING</span> <br className="hidden sm:inline" />
                  <span className="text-[1.05em] bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent italic font-normal block sm:inline whitespace-nowrap pr-2">
                    DIGITAL EXPERIENCES
                  </span>
                </h1>
              </TextSpotlight>

              {/* Description - Constrained width and increased spacing */}
              <p className="hero-subtitle text-zinc-400 text-sm sm:text-base max-w-[500px] mt-6 leading-[1.7] font-sans">
                Building scalable, intuitive and <br />
                high-performance <span className="text-cyan-500">web applications.</span>
              </p>

              {/* Social connections bar - Equal spacing beneath description (DESKTOP) */}
              <div className="hero-socials max-md:hidden flex items-center gap-4 mt-6 flex-wrap font-mono text-xs">
                <Magnetic range={55}>
                  <a
                    href="https://github.com/kevinjoseph06"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-4 py-2.5 rounded-xl bg-zinc-900/40 backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-black/20"
                  >
                    <Github className="w-4 h-4" />
                    <span>@kevinjoseph06</span>
                  </a>
                </Magnetic>

                <Magnetic range={55}>
                  <a
                    href="https://www.linkedin.com/in/kevinjoseph06/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-4 py-2.5 rounded-xl bg-zinc-900/40 backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-black/20"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>LinkedIn</span>
                  </a>
                </Magnetic>
                
                <Magnetic range={55}>
                  <a
                    href="mailto:kevinkalapurackal06@gmail.com"
                    className="flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-500 px-4 py-2.5 rounded-xl bg-zinc-900/40 backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-black/20"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                </Magnetic>
              </div>

              {/* Social connections bar (MOBILE - Full width stacked cards) */}
              <div className="flex md:hidden flex-col gap-3 w-full mt-8 font-mono text-xs z-30">
                <a href="https://github.com/kevinjoseph06" target="_blank" rel="noreferrer" className="flex items-center justify-between w-full px-5 py-4 bg-[#030303] border border-zinc-900 rounded-2xl text-zinc-300 active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <Github className="w-5 h-5 text-white" />
                    <span>@kevinjoseph06</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                </a>
                <a href="https://www.linkedin.com/in/kevinjoseph06/" target="_blank" rel="noreferrer" className="flex items-center justify-between w-full px-5 py-4 bg-[#030303] border border-zinc-900 rounded-2xl text-zinc-300 active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <Linkedin className="w-5 h-5 text-cyan-400" />
                    <span>LinkedIn</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                </a>
                <a href="mailto:kevinkalapurackal06@gmail.com" className="flex items-center justify-between w-full px-5 py-4 bg-[#030303] border border-zinc-900 rounded-2xl text-zinc-300 active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-white" />
                    <span>Contact</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore Chevron - Bottom Flow on Mobile, Absolute on Desktop */}
          <div className="hero-explore absolute bottom-8 left-1/2 transform -translate-x-1/2 max-md:relative max-md:bottom-auto max-md:left-0 max-md:translate-x-0 max-md:w-full flex flex-col items-center justify-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest z-20 max-md:mt-12 max-md:pb-12">
            <span>Scroll To Explore</span>
            <ChevronDown className="w-4 h-4 text-cyan-400/70 animate-bounce" />
          </div>

        </section>

        {/* 3. PROJECTS CAROUSEL (DRAGGABLE 3D CSS CUBE) */}
        <section id="projects" className="py-10 sm:py-12 w-full flex flex-col items-center bg-transparent relative z-10">
          {/* Atmospheric System Glow - Transitions from Hero into Grid */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
          
          <div className="gsap-reveal w-full flex flex-col items-center relative z-10">
            <div className="w-full max-w-5xl px-4 text-center mb-6 max-md:mt-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Interactive Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight mt-1">
                The Showcase Prism
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed max-md:hidden">
                Interact with the rotating Project Prisma below. Spin the faces directly or use navigation elements to examine specific software systems.
              </p>
            </div>

            <div className="cube-container w-full flex flex-col items-center">
              <ThreeDCube onSelectProject={(project) => setSelectedProject(project)} />
            </div>
          </div>
        </section>

        {/* 4. THE INTERACTIVE BLUEPRINT SANDBOX (ISO BUILDER) */}
        <section id="sandbox" className="py-10 sm:py-16 w-full flex flex-col items-center relative overflow-hidden">
          
          {/* Animated Background layer for smooth transition from Projects */}
          <div className="sandbox-bg-wrapper absolute inset-0 bg-[#050506]/30 border-t border-zinc-950 pointer-events-none z-0" />

          {/* Atmospheric Background Glow */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08)_0%,rgba(6,182,212,0.03)_40%,transparent_70%)] pointer-events-none z-0" />

          <div className="sandbox-container w-full flex flex-col items-center relative z-10">
            
            {/* Custom Header matching screenshot */}
            <div className="w-full max-w-5xl px-4 text-center mb-6 pt-4 sandbox-animate-item">
              <div className="flex items-center justify-center gap-2 mb-4 max-md:hidden">
                <Layers className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 font-semibold">
                  Interactive Sandbox
                </span>
              </div>
              <h2 className="text-[1.3rem] min-[400px]:text-2xl sm:text-5xl font-display font-bold text-white tracking-tight whitespace-nowrap">
                System Topology <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">Playground</span>
              </h2>

              {/* Features Row */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 max-md:hidden">
                {[
                  { icon: Box, title: "VISUAL SIMULATION", desc: "Live 3D topology view" },
                  { icon: Boxes, title: "SCALABLE NODES", desc: "Add, remove, scale" },
                  { icon: Activity, title: "REAL-TIME METRICS", desc: "Latency, load, health" },
                  { icon: Focus, title: "EXPORT & DEPLOY", desc: "Deploy to your stack" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-left sandbox-animate-item">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <feature.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-zinc-200 uppercase tracking-widest">{feature.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Sandbox />
          </div>
        </section>

        {/* 5. COGNITIVE MATRIX (3D FIBONACCI TAG CLOUD) */}
        <section id="skills" className="max-md:py-4 py-10 sm:py-12 w-full border-t border-zinc-950 flex flex-col items-center scroll-mt-8 sm:scroll-mt-6">
          <div className="gsap-reveal w-full flex flex-col items-center">
            <div className="w-full max-w-5xl px-4 text-left mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                Skill Vectors
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white/80 tracking-tight">
                Proficiency Matrix
              </h2>
            </div>

            <ThreeDSphere />
          </div>
        </section>

        {/* 6. BENTO METADATA TELEMETRY */}
        <section id="bento" className="max-md:py-4 py-10 sm:py-12 w-full border-t border-zinc-950 flex flex-col items-center scroll-mt-8 sm:scroll-mt-6 bg-[#050506]/30">
          <div className="gsap-reveal w-full flex flex-col items-center">
            <div className="w-full max-w-5xl px-4 text-center mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                Profile analytics
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-zinc-100 tracking-tight">
                Developer Profile
              </h2>
            </div>

            <BentoGrid />

          </div>
        </section>

        {/* 7. EXPERIENCES TIMELINE */}
        <section id="timeline" className="max-md:py-4 py-10 sm:py-12 w-full border-t border-zinc-950 flex flex-col items-center scroll-mt-8 sm:scroll-mt-6">
          <div className="gsap-reveal w-full flex flex-col items-center">
            <ExperienceTimeline />
          </div>
        </section>

        {/* 8. CONNECT TELEMETRY FORM */}
        <section id="connect" className="max-md:py-4 py-10 sm:py-12 w-full border-t border-zinc-950 flex flex-col items-center scroll-mt-8 sm:scroll-mt-6 bg-[#050506]/30">
          <div className="gsap-reveal w-full flex flex-col items-center">
            <div className="w-full max-w-5xl px-4 text-center mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                Establish connection
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight mt-1">
                Link with Kevin
              </h2>
            </div>

            <ContactForm />
          </div>
        </section>

      </main>

      {/* FOOTER METRICS SYSTEM AND CREDITS */}
      <footer className="relative border-t border-zinc-900 bg-black max-md:pt-8 max-md:pb-6 pt-16 pb-12 px-5 z-10 flex flex-col items-center w-full overflow-hidden">
        {/* Ambient Footer Glow */}
        <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1000px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none z-0" />
        
        <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start max-md:gap-4 gap-8 text-xs text-zinc-400 font-mono">
          
          <div className="text-center md:text-left relative z-10">
            <p className="font-display font-bold tracking-wider uppercase text-lg mb-1 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              KEVIN JOSEPH
            </p>
            <p className="text-[10px] text-zinc-300">
              Engineered with React, Tailwind CSS, GSAP, and Framer Motion.
            </p>
          </div>

          <div className="flex items-center max-md:gap-4 gap-6 text-[10px] uppercase font-semibold tracking-widest text-zinc-300 md:pt-1">
            <a href="https://www.linkedin.com/in/kevinjoseph06/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/kevin._.joseph/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#skills" className="hover:text-white transition-colors">SKILLS</a>
            <a href="#connect" className="hover:text-white transition-colors">CONTACT</a>
          </div>

        </div>

        <div className="relative z-10 w-full max-w-6xl border-t border-zinc-800/60 max-md:mt-6 max-md:pt-4 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center max-md:gap-2 gap-4 max-md:text-[8px] text-[9px] font-mono font-semibold tracking-widest text-zinc-400 uppercase">
          <span>SECURED TRANSACTIONS @ 2026 KEVIN JOSEPH</span>
          <span>CELL_ID: C6355D1A-3A_NODE</span>
        </div>
      </footer>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
