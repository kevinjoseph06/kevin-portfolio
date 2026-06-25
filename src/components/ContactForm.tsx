import React, { useState, useId, useRef } from 'react';
import { Send, Terminal, Shield, Copy, User, Lock, Mail, Linkedin, Instagram, ArrowRight, Paperclip, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThreeDTilt from './ThreeDTilt';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'complete' | 'error'>('idle');
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);
  
  // We keep file picking UI for aesthetics, but Web3Forms JSON submission doesn't support files via AJAX on free tier
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('transmitting');

    try {
      // Switched to JSON fetch because Web3Forms free tier blocks file attachments via AJAX/Fetch
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '',
          name: name,
          email: email,
          message: message,
          subject: "New Transmission from Quantum Portal",
          from_name: "Portfolio Portal"
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmittedMessageId(`TX-${Date.now().toString().slice(-6)}`);
        setStatus('complete');
      } else {
        console.error("Web3Forms Error:", data);
        setStatus('error');
      }
    } catch (err) {
      console.error("Transmission Error:", err);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setStatus('idle');
    setSubmittedMessageId(null);
    setAttachedFileName(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  return (
    <div id={formId} className="w-full max-w-5xl px-4 pt-2 max-md:pb-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-cyan-900/30 bg-[#090b0e] max-md:p-3 p-4 sm:p-6 rounded-[2rem] max-md:rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.02)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400">
                &gt;_ LINK VAULT
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Establish Connection
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed max-md:hidden">
              Have a high-frequency layout challenge or spatial application idea? Let's craft something solid.
            </p>
          </div>

          <div className="max-md:my-2 my-4 flex flex-col max-md:gap-1.5 gap-3">
            <div className="flex flex-col gap-1 text-xs font-mono bg-[#0c0e12] border border-zinc-800/60 max-md:p-2 p-3 rounded-2xl max-md:rounded-xl relative group">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest absolute top-4 left-10">Email Alias</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-cyan-400 truncate">kevinkalapurackal06@gmail.com</span>
                <button 
                  onClick={() => navigator.clipboard.writeText('kevinkalapurackal06@gmail.com')}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 max-md:gap-1.5 gap-2.5">
              <a href="https://www.linkedin.com/in/kevinjoseph06/" target="_blank" rel="noreferrer"
                 className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-300 bg-[#0c0e12] border border-zinc-800/60 max-md:px-2 max-md:py-1.5 px-3 py-2.5 rounded-xl max-md:rounded-lg hover:border-cyan-500/30 transition-all group">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a href="https://www.instagram.com/kevin._.joseph/" target="_blank" rel="noreferrer"
                 className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-300 bg-[#0c0e12] border border-zinc-800/60 max-md:px-2 max-md:py-1.5 px-3 py-2.5 rounded-xl max-md:rounded-lg hover:border-purple-500/30 transition-all group">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Instagram className="w-3.5 h-3.5 text-purple-400" />
                  <span>Instagram</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
              </a>
            </div>

            <div className="flex max-md:gap-1.5 gap-2.5 text-[10px] font-mono text-zinc-400 leading-relaxed bg-[#0c0e12]/40 border border-zinc-800/40 max-md:p-2 p-3 rounded-xl max-md:rounded-lg items-center max-md:hidden">
              <Shield className="w-5 h-5 text-zinc-500 shrink-0" />
              <p>Connections are secured and routed directly via Web3Forms infrastructure.</p>
            </div>
          </div>

          <div className="pt-3 text-[10px] font-mono flex justify-between items-center border-t border-zinc-800/50 mt-auto">
            <div className="flex flex-col">
              <span className="text-zinc-600 mb-0.5">STATUS</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 flex items-center justify-center shrink-0">
                  <div className="w-[1px] h-[7px] bg-emerald-400 absolute" />
                  <div className="w-[7px] h-[1px] bg-emerald-400 absolute" />
                </span> 
                ONLINE
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 mb-0.5">ID</span>
              <span className="text-cyan-400">@KEV_LINK</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <ThreeDTilt maxRotate={1.5} className="h-full w-full">
            <div className="flex flex-col justify-between border border-purple-900/30 bg-[#090b0e] max-md:p-3 p-4 sm:p-6 rounded-[2rem] max-md:rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.02)] h-full w-full">
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center max-md:gap-1.5 gap-3 max-md:mb-2 mb-4 border-b border-zinc-800/50 max-md:pb-1.5 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    Transmission Portal
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#0c0e12] border border-zinc-800/80 px-3 py-1.5 rounded-full">
                  <Shield className="w-3 h-3 text-zinc-500" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 pt-[1px]">Secured</span>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] ml-1" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.form
                    key="form"
                    onSubmit={handleTransmit}
                    className="max-md:space-y-1.5 space-y-3 flex-1 flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-2 max-md:gap-1.5 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block font-semibold">
                          Name
                        </label>
                        <div className="relative">
                          <User className="absolute max-md:left-2.5 left-4 top-1/2 -translate-y-1/2 max-md:w-3 max-md:h-3 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-[#0c0e12] border border-zinc-800/80 rounded-xl max-md:rounded-lg pl-10 max-md:pl-7 pr-3 max-md:py-1.5 py-2.5 text-xs sm:text-sm font-sans text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block font-semibold">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute max-md:left-2.5 left-4 top-1/2 -translate-y-1/2 max-md:w-3 max-md:h-3 w-4 h-4 text-zinc-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-[#0c0e12] border border-zinc-800/80 rounded-xl max-md:rounded-lg pl-10 max-md:pl-7 pr-3 max-md:py-1.5 py-2.5 text-xs sm:text-sm font-sans text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col min-h-[70px] max-md:min-h-[50px]">
                      <label className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block font-semibold">
                        Message
                      </label>
                      <div className="relative flex-1">
                        <FileText className="absolute max-md:left-2.5 left-4 max-md:top-2.5 top-3.5 max-md:w-3 max-md:h-3 w-4 h-4 text-zinc-500" />
                        <textarea
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="How can I help you?"
                          className="w-full h-full bg-[#0c0e12] border border-zinc-800/80 rounded-xl max-md:rounded-lg pl-10 max-md:pl-7 pr-3 max-md:py-2 py-3 text-xs sm:text-sm font-sans text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 transition-all resize-none min-h-[60px] max-md:min-h-[40px]"
                        />
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".pdf,.md,.zip,.json" 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border border-dashed border-zinc-800 rounded-xl max-md:rounded-lg max-md:p-2 p-3 flex justify-between items-center bg-[#0c0e12]/30 hover:bg-[#0c0e12]/60 hover:border-zinc-700 transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col gap-1 overflow-hidden pr-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                           <Terminal className="w-3 h-3 text-zinc-600" /> ATTACH FILES
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 flex items-center gap-2 ml-[18px] truncate">
                          <Paperclip className={`w-3.5 h-3.5 shrink-0 ${attachedFileName ? 'text-purple-400' : 'text-cyan-400'}`} />
                          <span className="truncate">{attachedFileName ? attachedFileName : 'Drag files or click'}</span>
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600 hidden sm:block shrink-0">
                        .pdf .md .zip
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full max-md:py-1.5 py-2.5 max-md:mt-0 mt-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-bold text-sm font-mono rounded-xl max-md:rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)] relative overflow-hidden group shrink-0"
                    >
                      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay group-hover:opacity-30 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)' }} />
                      <span className="relative z-10 tracking-wide">Send Request</span>
                      <Send className="w-4 h-4 relative z-10" />
                    </button>
                  </motion.form>
                )}

                {status === 'transmitting' && (
                  <motion.div
                    key="transmitting"
                    className="flex flex-col items-center justify-center text-center py-12 flex-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border border-dashed border-cyan-500/40 animate-spin-slow flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-cyan-400 rotate-animation animate-spin" />
                      </div>
                      <div className="absolute inset-0 w-16 h-16 rounded-full border border-dotted border-purple-500/20 animate-spin-reverse pointer-events-none" />
                    </div>

                    <h4 className="font-display font-bold text-lg text-white mt-6 tracking-tight">
                      Processing...
                    </h4>
                  </motion.div>
                )}

                {status === 'complete' && (
                  <motion.div
                    key="complete"
                    className="flex flex-col items-center justify-center text-center py-12 flex-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-2xl text-white tracking-tight">
                      Transmission Confirmed
                    </h4>
                    
                    <p className="text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
                      Delivery complete. Your message was processed and stored safely.
                    </p>

                    {submittedMessageId && (
                      <div className="mt-6 bg-[#0c0e12] border border-zinc-800/80 px-4 py-2.5 rounded-xl font-mono text-[10px] text-zinc-300 uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        SIG_REF: {submittedMessageId}
                      </div>
                    )}

                    <button
                      onClick={resetForm}
                      className="mt-6 px-6 py-3 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#0c0e12] text-zinc-400 hover:text-white rounded-xl text-xs font-mono transition-all cursor-pointer bg-transparent"
                    >
                      New Request
                    </button>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    key="error"
                    className="flex flex-col items-center justify-center text-center py-12 flex-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/5 border border-rose-500/10 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20">
                        <span className="text-rose-400 font-bold text-xl">!</span>
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-2xl text-white tracking-tight">
                      Transmission Failed
                    </h4>
                    
                    <p className="text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
                      Secure routing was interrupted. The payload could not be delivered to the target terminal.
                    </p>

                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 px-6 py-3 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#0c0e12] text-zinc-400 hover:text-white rounded-xl text-xs font-mono transition-all cursor-pointer bg-transparent"
                    >
                      Retry Transmission
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ThreeDTilt>
        </div>

      </div>
    </div>
  );
}
