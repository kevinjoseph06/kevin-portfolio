import React, { useState, useId, useRef } from 'react';
import { TIMELINE } from '../data';
import { TimelineItem } from '../types';
import { Briefcase, GraduationCap, Award, Sliders, ChevronDown, Globe, Users, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeDTilt from './ThreeDTilt';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ExperienceTimeline() {
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const timelineId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // Narrative Transition 4 & 5: Subtle Data Flow Connection & Infinite Extension
      gsap.fromTo('.timeline-progress-line', 
        { height: '0%' },
        {
          height: 'calc(100% + 300px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', // Starts growing as soon as timeline enters from Bento
            end: 'bottom -200px', // Extends far into the Contact section
            scrub: 1
          }
        }
      );

      // Replayable scroll animation for each timeline item
      gsap.utils.toArray('.timeline-card').forEach((card: any) => {
        gsap.fromTo(card,
          { opacity: 0, x: -30, filter: 'blur(5px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              end: 'bottom 15%',
              toggleActions: 'play reset play reset'
            }
          }
        );
      });
    });
  }, { scope: containerRef });

  const filteredTimeline = TIMELINE.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'border-cyan-500/20 hover:border-cyan-400/60';
      case 'education':
        return 'border-purple-500/20 hover:border-purple-400/60';
      default:
        return 'border-amber-500/20 hover:border-amber-400/60';
    }
  };

  return (
    <div id={timelineId} className="w-full max-w-5xl px-4 max-md:py-4 py-12 flex flex-col items-center">
      
      {/* Filtering Station */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-b border-zinc-900 pb-6 mb-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center justify-center sm:justify-start gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            Engineering Timestream
          </span>
          <h3 className="text-2xl font-display font-bold text-white mt-1.5 tracking-tight">
            Milestones & Roles
          </h3>
        </div>

        <div className="flex gap-2 bg-zinc-950 p-1 border border-zinc-850 rounded-xl">
          {(['all', 'experience', 'education'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filter === type
                  ? 'bg-zinc-850 text-white font-medium shadow-sm'
                  : 'text-zinc-550 hover:text-zinc-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* The Visual Timestream line (Subtle Data Flow Connector) */}
      <div ref={containerRef} className="relative w-full border-l border-zinc-850 pl-6 sm:pl-10 space-y-6">
        <div className="timeline-progress-line absolute top-[-150px] left-[-0.5px] w-[1px] opacity-15 bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 z-0 origin-top" />
        <AnimatePresence mode="popLayout">
          {filteredTimeline.map((item, index) => {
            const isExpanded = expandedItem === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="timeline-card relative w-full">
                  {/* Connecting Node Anchor */}
                  <div className="absolute -left-[30px] sm:-left-[46px] top-6 w-5 h-5 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center z-10">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'experience' ? 'bg-cyan-400' : 'bg-purple-400'
                    }`} style={{ boxShadow: `0 0 10px ${item.type === 'experience' ? '#22d3ee' : '#c084fc'}` }} />
                  </div>

                  <ThreeDTilt maxRotate={2} className="w-full">
                    <div
                      className={`group w-full text-left bg-zinc-950/60 border rounded-xl backdrop-blur-md shadow-xl transition-all duration-300 ${getBorderColor(item.type)}`}
                    >
                      {/* MAIN CARD BODY */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between max-md:gap-2 gap-4">
                          {/* Left: Icon, Title, Subtitle */}
                          <div className="flex gap-3">
                            <div className={`max-md:w-10 max-md:h-10 w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                              item.type === 'experience' 
                                ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400' 
                                : 'bg-purple-950/20 border-purple-900/30 text-purple-400'
                            }`}>
                              {getIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-display font-bold max-md:text-sm text-lg text-white tracking-tight">
                                {item.title}
                              </h4>
                              <p className="max-md:text-[10px] text-xs mt-0.5 leading-tight">
                                <span className={item.type === 'experience' ? 'text-cyan-400' : 'text-purple-400'}>{item.organization}</span>
                                <span className="text-zinc-600 mx-1 sm:mx-2">/</span>
                                <span className="text-zinc-400">{item.role}</span>
                              </p>
                            </div>
                          </div>

                          {/* Right: Date and Status */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end max-md:gap-3 gap-1.5 shrink-0 max-md:ml-[52px]">
                            <div className="flex items-center gap-1.5 max-md:px-1.5 px-2.5 max-md:py-0.5 py-1 rounded border border-zinc-800/60 bg-zinc-900/40 max-md:text-[9px] text-[11px] font-mono">
                              <Calendar className={`max-md:w-2.5 max-md:h-2.5 w-3 h-3 ${item.type === 'experience' ? 'text-cyan-400' : 'text-purple-400'}`} />
                              <span className={item.type === 'experience' ? 'text-cyan-400' : 'text-purple-400'}>{item.period}</span>
                            </div>
                            {item.status && (
                              <div className="flex items-center gap-1.5 max-md:text-[9px] text-xs text-zinc-400 font-medium sm:mr-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'experience' ? 'bg-cyan-400' : 'bg-purple-400'}`} style={{ boxShadow: `0 0 8px ${item.type === 'experience' ? '#22d3ee' : '#c084fc'}` }} />
                                {item.status}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-350 max-md:text-[11px] text-xs sm:text-sm max-md:mt-2.5 mt-3.5 leading-relaxed max-w-3xl max-md:ml-0 ml-[60px]">
                          {item.description}
                        </p>

                        {/* Optional Tags */}
                        {item.tags && (
                          <div className="flex flex-wrap gap-2 max-md:mt-2 mt-3.5 max-md:ml-0 ml-[60px]">
                            {item.tags.map((tag, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 px-2 max-md:py-0.5 sm:px-2.5 sm:py-1 rounded bg-zinc-900/50 border border-zinc-800/50 max-md:text-[9px] text-[11px] text-zinc-300 font-medium">
                                {tag.label}
                                {tag.dotColor && <div className={`w-1.5 h-1.5 rounded-full ${tag.dotColor}`} />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* DELIVERABLES FOOTER */}
                      {(item.deliverables) && (
                        <div className="w-full border-t border-zinc-800/50 bg-zinc-900/20 max-md:px-3 px-5 sm:px-6 max-md:py-2.5 py-3.5 flex flex-row items-center justify-between max-md:gap-2 gap-4 rounded-b-xl">
                          <div className="flex flex-row items-center max-md:gap-3 gap-4 sm:gap-6 w-full max-md:overflow-x-auto no-scrollbar max-md:pb-1">
                            <span className="max-md:text-[8px] text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold shrink-0">
                              Unravel Deliverables
                            </span>
                            
                            {/* Render Metrics */}
                            {item.deliverables.type === 'metrics' && item.deliverables.metrics && (
                              <div className="flex flex-row items-center max-md:gap-4 gap-6 sm:gap-8 shrink-0">
                                {item.deliverables.metrics.map((metric, idx) => {
                                  const renderIcon = () => {
                                    switch (metric.icon) {
                                      case 'globe': return <Globe className="max-md:w-3 max-md:h-3 w-4 h-4 text-cyan-400" />;
                                      case 'sliders': return <Sliders className="max-md:w-3 max-md:h-3 w-4 h-4 text-cyan-400" />;
                                      case 'users': return <Users className="max-md:w-3 max-md:h-3 w-4 h-4 text-cyan-400" />;
                                      case 'chart': return <TrendingUp className="max-md:w-3 max-md:h-3 w-4 h-4 text-cyan-400" />;
                                      default: return null;
                                    }
                                  };
                                  return (
                                    <div key={idx} className="flex items-center max-md:gap-1.5 gap-2 shrink-0">
                                      {renderIcon()}
                                      <div className="flex flex-col">
                                        <span className="max-md:text-[11px] text-[13px] font-bold text-white leading-none">{metric.value}</span>
                                        <span className="max-md:text-[7px] text-[9px] text-zinc-500 mt-0.5">{metric.label}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Render Tags */}
                            {item.deliverables.type === 'tags' && item.deliverables.tags && (
                              <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                                {item.deliverables.tags.map((tag, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 max-md:px-2 max-md:py-0.5 px-2.5 py-1 rounded-full bg-zinc-900/50 border border-zinc-800/50 max-md:text-[9px] text-[11px] text-zinc-300 font-medium shrink-0">
                                    {tag.dotColor && <div className={`w-1 h-1 rounded-full ${tag.dotColor}`} />}
                                    {tag.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* CTA Arrow */}
                          <button className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            item.type === 'experience' 
                              ? 'border-cyan-900/50 text-cyan-400 hover:bg-cyan-950/30' 
                              : 'border-purple-900/50 text-purple-400 hover:bg-purple-950/30'
                          }`}>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </ThreeDTilt>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
