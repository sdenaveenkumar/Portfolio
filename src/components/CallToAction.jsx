import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const CallToAction = () => {
  const containerRef = useRef(null);
  const [timeString, setTimeString] = useState('');
  const [copied, setCopied] = useState(false);

  // Live IST Clock (Asia/Kolkata)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      setTimeString(`${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll progress within this sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Snappy yet smooth editorial spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    restDelta: 0.001
  });

  // =========================================================================
  // KINETIC SPLIT-SHUTTER CHOREOGRAPHY (BRUTALIST EDITORIAL)
  // Phase 1 (0.0 -> 0.25): Shutters locked, monolithic typography intact.
  // Phase 2 (0.25 -> 0.70): Dual diagonal shutters shear apart in opposite directions.
  // Phase 3 (0.60 -> 1.0): Inner Vault Chamber revealed with high-contrast trigger.
  // =========================================================================

  // Top Shutter Blade translation (slides Up & Left)
  const topShutterX = useTransform(smoothProgress, [0.22, 0.68], ["0%", "-42%"]);
  const topShutterY = useTransform(smoothProgress, [0.22, 0.68], ["0%", "-36%"]);
  const topShutterRotate = useTransform(smoothProgress, [0.22, 0.68], [0, -2]);

  // Bottom Shutter Blade translation (slides Down & Right)
  const bottomShutterX = useTransform(smoothProgress, [0.22, 0.68], ["0%", "42%"]);
  const bottomShutterY = useTransform(smoothProgress, [0.22, 0.68], ["0%", "36%"]);
  const bottomShutterRotate = useTransform(smoothProgress, [0.22, 0.68], [0, 2]);

  // Seam line indicator opacity (fades as shutter splits)
  const seamOpacity = useTransform(smoothProgress, [0, 0.2, 0.35], [0.8, 1, 0]);

  // Under-Chamber (Inner Vault) reveal transforms
  const vaultScale = useTransform(smoothProgress, [0.25, 0.68], [0.88, 1]);
  const vaultOpacity = useTransform(smoothProgress, [0.25, 0.55], [0, 1]);
  const vaultY = useTransform(smoothProgress, [0.25, 0.68], [40, 0]);
  const pointerEvents = useTransform(smoothProgress, (v) => (v > 0.45 ? "auto" : "none"));

  const copyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('sdenaveenkumar@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Reusable Monolithic Typography Block (rendered identically inside both shutter blades)
  const ShutterContent = ({ bladeId }) => (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 md:p-16 select-none pointer-events-none">
      
      {/* Top Editorial Bar */}
      <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] text-neutral-400 uppercase">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">[ REF. 2026 // COLLABORATE ]</span>
          <span className="hidden sm:inline text-neutral-600">| BLADE: {bladeId}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{timeString || "17:50 IST"} • BENGALURU</span>
        </div>
      </div>

      {/* Monumental Headline */}
      <div className="w-full max-w-6xl mx-auto text-center flex flex-col items-center justify-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-neutral-900 border border-neutral-800 text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6">
          <span>// PHASE 04: INITIATION</span>
        </div>

        <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.88] text-white">
          HAVE AN<br />
          <span className="text-neutral-500">IDEA?</span>
        </h2>
      </div>

      {/* Bottom Editorial Bar */}
      <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] text-neutral-500 uppercase">
        <div className="hidden sm:block">
          <span>LAT: 12.9716° N / LON: 77.5946° E</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 mx-auto sm:mx-0">
          <span>SCROLL TO DISSECT</span>
          <span className="font-sans">↓</span>
        </div>
        <div className="hidden sm:block">
          <span>AVAILABILITY: OPEN</span>
        </div>
      </div>

    </div>
  );

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[280vh] bg-[#070709] text-white selection:bg-white selection:text-black font-sans"
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center select-none bg-[#070709]">
        
        {/* ================================================================= */}
        {/* 4 CORNER ARCHITECTURAL CROSSHAIRS (+)                             */}
        {/* ================================================================= */}
        <div className="absolute top-4 left-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute top-4 right-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute bottom-4 left-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute bottom-4 right-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>

        {/* ================================================================= */}
        {/* LAYER 0: THE REVEALED INNER VAULT CHAMBER (UNDERLAYER)             */}
        {/* Exposed when the kinetic shutters slice and separate              */}
        {/* ================================================================= */}
        <motion.div 
          style={{ 
            scale: vaultScale, 
            opacity: vaultOpacity, 
            y: vaultY,
            pointerEvents: pointerEvents
          }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center will-change-transform"
        >
          {/* Brutalist Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.06] border border-white/15 backdrop-blur-md rounded-full text-neutral-300 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DIRECT ACCESS PROTOCOL</span>
          </div>

          {/* Sliced Monumental Call to Action */}
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[6.5rem] font-black uppercase tracking-tight leading-[0.92] text-white">
            LET’S BUILD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500">
              SOMETHING ICONIC.
            </span>
          </h2>

          <p className="mt-4 sm:mt-6 text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-mono tracking-tight leading-relaxed">
            Engineering resilient architectures and bespoke, tactile digital interfaces. Ready for bold challenges and high-impact engineering roles.
          </p>

          {/* =============================================================== */}
          {/* HIGH-CONTRAST BRUTALIST TRIGGER CONSOLE                          */}
          {/* =============================================================== */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
            
            {/* Monumental Primary Action Button */}
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 bg-white text-black font-black font-mono text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-white shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:bg-black hover:text-white hover:border-white transition-all duration-300 cursor-pointer"
            >
              <span>INITIATE PROJECT</span>
              <span className="font-sans font-bold text-base group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </button>

            {/* Brutalist Email Quick-Copy Pill */}
            <div 
              onClick={copyEmail}
              className="group relative w-full sm:w-auto px-6 py-4 bg-black/60 hover:bg-neutral-900 border border-neutral-700 hover:border-white font-mono text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>

              <span>sdenaveenkumar@gmail.com</span>

              {/* Tooltip feedback */}
              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-none shadow-xl pointer-events-none whitespace-nowrap">
                  ✓ Copied to clipboard
                </span>
              )}
            </div>

          </div>

          {/* Transmission Metadata Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-xs tracking-widest text-neutral-500 uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              STATUS: READY TO DEPLOY
            </span>
            <span>•</span>
            <span>RESPONSE TIME &lt; 24H</span>
            <span>•</span>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-neutral-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            >
              SCROLL DOWN TO TRANSMIT DETAILS ↓
            </button>
          </div>

        </motion.div>

        {/* ================================================================= */}
        {/* LAYER 1: TOP/LEFT SHUTTER BLADE                                   */}
        {/* Clipped diagonally: from top-left (0,0) to right (100%, 46%)       */}
        {/* ================================================================= */}
        <motion.div 
          style={{ 
            x: topShutterX, 
            y: topShutterY, 
            rotate: topShutterRotate,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 46%, 0% 54%)'
          }}
          className="absolute inset-0 z-20 bg-[#0d0d11] border-b border-neutral-700/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden will-change-transform"
        >
          {/* Subtle architectural dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <ShutterContent bladeId="ALPHA // UPPER" />
        </motion.div>

        {/* ================================================================= */}
        {/* LAYER 2: BOTTOM/RIGHT SHUTTER BLADE                                */}
        {/* Clipped diagonally: from left (0, 54%) to bottom-right (100%, 100%)*/}
        {/* ================================================================= */}
        <motion.div 
          style={{ 
            x: bottomShutterX, 
            y: bottomShutterY, 
            rotate: bottomShutterRotate,
            clipPath: 'polygon(0% 54%, 100% 46%, 100% 100%, 0% 100%)'
          }}
          className="absolute inset-0 z-20 bg-[#09090c] border-t border-neutral-800 shadow-[0_-25px_60px_rgba(0,0,0,0.9)] overflow-hidden will-change-transform"
        >
          {/* Subtle architectural dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <ShutterContent bladeId="BETA // LOWER" />
        </motion.div>

        {/* ================================================================= */}
        {/* SEAM RULE INDICATOR (VISUAL GUIDE BEFORE SPLIT)                   */}
        {/* ================================================================= */}
        <motion.div 
          style={{ opacity: seamOpacity }}
          className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center"
        >
          <div 
            style={{ 
              transform: 'rotate(-4.5deg)',
              width: '120vw'
            }}
            className="h-[1px] bg-neutral-600/60 flex items-center justify-between px-16 text-[9px] font-mono text-neutral-400 tracking-[0.3em] uppercase"
          >
            <span>[ SPLIT AXIS // 01 ]</span>
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span>[ MECHANICAL SEAM ]</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CallToAction;
