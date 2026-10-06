import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Mail, Copy, Check } from 'lucide-react';

/**
 * CALL TO ACTION SECTION (Dark Mode Edition)
 * 
 * Features:
 * - Monochromatic dark canvas (#070709) with soft gray/zinc ambient glow.
 * - Dual Kinetic Typography Marquees running across the background driven by scroll physics.
 * - 3D Depth Bottom-Rising Card: On scroll down, the card ascends from the bottom of the viewport
 *   with camera rack-focus blur, 3D tilt (rotateX), scale expansion, and dimensional shadow depth.
 * - Minimalist content: "Have an Idea!" headline + "Get in Touch" & "Copy Email" action dock.
 */

const CallToAction = () => {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Scroll Progression
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001
  });

  // --- Kinetic Typography Marquee Offsets ---
  const marquee1X = useTransform(smoothProgress, [0, 1], ['-15%', '12%']);
  const marquee2X = useTransform(smoothProgress, [0, 1], ['10%', '-20%']);
  const marqueeOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.65, 1, 0.95, 0.55]);

  // --- 3D Depth & Bottom-Rising Card Transforms ---
  // 1. Ascends & levels flat by 0.18 (75vh)
  // 2. STICKS firmly in center from 0.18 to 0.76 (giving a huge 245vh track — user scrolls twice while stuck)
  // 3. Contact Us page begins its overlap only after 0.76 (320vh)
  const cardY = useTransform(smoothProgress, [0, 0.18, 0.76, 0.98], ['80vh', '0vh', '0vh', '-30px']);
  const cardRotateX = useTransform(smoothProgress, [0, 0.18, 0.76, 0.98], [36, 0, 0, -3]);
  const cardScale = useTransform(smoothProgress, [0, 0.18, 0.76, 0.98], [0.62, 1, 1, 0.93]);
  const cardOpacity = useTransform(smoothProgress, [0, 0.05, 0.18, 0.76, 0.98], [0, 0.85, 1, 1, 0.6]);
  const cardFilter = useTransform(smoothProgress, [0, 0.14], ['blur(14px)', 'blur(0px)']);
  const cardPointerEvents = useTransform(smoothProgress, p => (p >= 0.12 && p <= 0.76 ? 'auto' : 'none'));

  // Ambient depth pedestal glow under the card (fully bloomed by 0.18, stays stuck until 0.76)
  const depthGlowScale = useTransform(smoothProgress, [0, 0.18], [0.5, 1]);
  const depthGlowOpacity = useTransform(smoothProgress, [0, 0.10, 0.18, 0.76], [0, 0.35, 0.7, 0.4]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sdenaveenkumar@gmail.com');
    setCopied(true);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="cta"
      ref={containerRef}
      className="relative z-10 w-full h-[420vh] bg-[#070709] text-white select-none overflow-clip"
    >
      {/* Sticky Presentation Viewport with 3D Perspective */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 md:px-8 [perspective:1400px]">
        
        {/* Dynamic Multi-layered Ambient Plasma Backdrop (Monochrome Grays & Zinc) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Cyber Grid */}
          <div 
            className="absolute inset-0 opacity-[0.16]" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '36px 36px'
            }} 
          />
          {/* Ambient Monochromatic Glow (Soft Grays & Zinc) */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-zinc-700/20 via-zinc-800/15 to-transparent rounded-full blur-[140px]" />
          <div className="absolute -bottom-24 right-1/4 w-[620px] h-[620px] bg-gradient-to-bl from-neutral-600/20 via-zinc-700/15 to-transparent rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-zinc-900/40 rounded-full blur-[150px]" />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            1. KINETIC TYPOGRAPHY PARALLAX RUNNERS (Scroll-Driven)
           ───────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-10 md:py-14 overflow-hidden z-0">
          {/* Top Marquee Strip */}
          <motion.div 
            style={{ x: marquee1X, opacity: marqueeOpacity }}
            className="whitespace-nowrap flex items-center gap-8 text-[48px] sm:text-[76px] md:text-[104px] font-black uppercase tracking-tighter text-white/[0.22] leading-none will-change-transform drop-shadow-[0_4px_24px_rgba(255,255,255,0.04)]"
          >
            <span>✦ ARCHITECT THE EXCEPTIONAL</span>
            <span>✦ CRAFT WITH PRECISION</span>
            <span>✦ FULL STACK MASTERY</span>
            <span>✦ SEAMLESS EXPERIENCES</span>
            <span>✦ ARCHITECT THE EXCEPTIONAL</span>
          </motion.div>

          {/* Bottom Marquee Strip */}
          <motion.div 
            style={{ x: marquee2X, opacity: marqueeOpacity }}
            className="whitespace-nowrap flex items-center gap-8 text-[48px] sm:text-[76px] md:text-[104px] font-black uppercase tracking-tighter text-white/[0.22] leading-none will-change-transform drop-shadow-[0_4px_24px_rgba(255,255,255,0.04)]"
          >
            <span>✦ NEXT-GEN WEB APPS</span>
            <span>✦ PRODUCTION READY CODE</span>
            <span>✦ FLUID 3D MOTION</span>
            <span>✦ ACCELERATE YOUR VISION</span>
            <span>✦ NEXT-GEN WEB APPS</span>
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. 3D BOTTOM-RISING DEPTH CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Ambient 3D Depth Floor Glow */}
          <motion.div 
            style={{ 
              scale: depthGlowScale, 
              opacity: depthGlowOpacity 
            }}
            className="absolute -bottom-12 w-4/5 h-24 bg-gradient-to-t from-white/10 via-zinc-400/5 to-transparent rounded-full blur-2xl pointer-events-none"
          />

          <motion.div 
            style={{ 
              y: cardY,
              rotateX: cardRotateX,
              scale: cardScale,
              opacity: cardOpacity,
              filter: cardFilter,
              pointerEvents: cardPointerEvents,
              transformStyle: 'preserve-3d'
            }}
            data-cta-landmark="corner-card"
            className="relative w-full rounded-[32px] sm:rounded-[42px] bg-white/90 backdrop-blur-3xl border border-white/90 shadow-[0_45px_120px_-20px_rgba(0,0,0,0.4),0_15px_40px_-10px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] p-8 sm:p-12 md:p-16 will-change-transform flex flex-col items-center text-center overflow-hidden"
          >
            {/* Subtle Top Rim Light */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

            {/* Main Headline (Day Mode Obsidian) */}
            <h2 
              data-cta-landmark="card-title"
              className="text-4xl sm:text-6xl md:text-7xl font-black text-[#111111] tracking-tight leading-none mb-8 sm:mb-10 text-center"
            >
              Have an Idea!
            </h2>

            {/* Action Buttons Dock */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md">
              {/* Primary Action Button */}
              <button
                onClick={scrollToContact}
                data-cta-button="primary"
                className="w-full sm:w-auto flex-1 group px-8 sm:px-10 py-4 sm:py-4.5 bg-[#111111] text-white hover:bg-black rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              {/* Direct Email Copy Capsule */}
              <button
                onClick={handleCopyEmail}
                data-cta-button="copy-email"
                className="w-full sm:w-auto px-7 py-4 sm:py-4.5 bg-gray-100 hover:bg-gray-200/90 text-gray-900 border border-gray-200/90 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Click to copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Copy Email</span>
                    <Copy className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CallToAction;
