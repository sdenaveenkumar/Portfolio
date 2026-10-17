import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Mail, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * Three-Slide Triptych Call To Action Section:
 * - Left & Right slides are equal in width; Middle slide is narrower.
 * - Sequence:
 *   1. Middle slide drops down from the TOP of the viewport with text "an".
 *   2. Once middle slide reaches position, Left slide sweeps in from the LEFT corner ("Have")
 *      and Right slide sweeps in from the RIGHT corner ("Idea!") with physics, overshoot bounce & inertia!
 *   3. Together they form: "Have an Idea!"
 */
const CallToAction = () => {
  const containerRef = useRef(null);
  const leftSlideRef = useRef(null);
  const middleSlideRef = useRef(null);
  const rightSlideRef = useRef(null);
  const ctaBarRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2 // Smooth 1:1 control with natural inertia, avoiding sudden speed bursts
      }
    });

    // ==============================================================
    // ACT 1: Middle section slide plunges from top with slow, graceful,
    // wide spring oscillation (starts at 0s, settles at 2.8s)
    // ==============================================================
    tl.fromTo(middleSlideRef.current,
      {
        yPercent: -170,
        opacity: 0,
        scale: 0.82,
        force3D: true
      },
      {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        duration: 2.8,
        ease: "elastic.out(1.15, 0.65)" // Slower, wider, luxurious spring bounce
      },
      0
    );

    // Dedicated pause for the middle slide to be clearly seen resting at center
    tl.to({}, { duration: 0.8 });

    // ==============================================================
    // ACT 2: Left and Right slides swoop in from corners slowly and
    // deliberately with wide, cinematic spring bounce & inertia
    // (starts at 3.6s, completes at 6.8s)
    // ==============================================================
    // Left slide from bottom-left corner:
    tl.fromTo(leftSlideRef.current,
      {
        xPercent: -150,
        yPercent: 45,
        rotation: -25,
        scale: 0.68,
        opacity: 0,
        transformOrigin: "bottom left",
        force3D: true
      },
      {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 3.2,
        ease: "elastic.out(1.2, 0.65)" // Slower, wider, graceful spring bounce
      },
      3.6
    );

    // Right slide from bottom-right corner:
    tl.fromTo(rightSlideRef.current,
      {
        xPercent: 150,
        yPercent: 45,
        rotation: 25,
        scale: 0.68,
        opacity: 0,
        transformOrigin: "bottom right",
        force3D: true
      },
      {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 3.2,
        ease: "elastic.out(1.2, 0.65)" // Matching slow, graceful spring bounce
      },
      3.6
    );

    // Kinetic spring pulse on Middle slide as side slides land:
    tl.fromTo(middleSlideRef.current,
      { scaleX: 1, scaleY: 1 },
      {
        scaleX: 0.94,
        scaleY: 1.04,
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      },
      5.2
    );

    // CTA interactive console reveals slowly with gentle spring bounce
    if (ctaBarRef.current) {
      tl.fromTo(ctaBarRef.current,
        {
          y: 45,
          opacity: 0,
          scale: 0.88
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "back.out(2.0)"
        },
        5.6
      );
    }

    // ==============================================================
    // ACT 3: Generous Showcase Holding Pause
    // Holds the resting state so all floating slides remain in full view
    // ==============================================================
    tl.to({}, { duration: 4.8 });

  }, { scope: containerRef });

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('sde.naveenkumar@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="cta"
      ref={containerRef}
      className="relative z-[45] w-full h-[400vh] sm:h-[480vh] -mt-[100vh] bg-transparent text-gray-900 select-none overflow-clip"
    >
      {/* Sticky Fullscreen Presentation Stage (Using 100dvh for exact mobile viewport heights + bottom dock clearance) */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-center items-center px-3 sm:px-6 md:px-10 pb-16 sm:pb-0 bg-[#fafafc] border-t border-black/[0.08] shadow-[0_-30px_90px_rgba(0,0,0,0.1)] [perspective:1200px]">

        {/* Top Pull Tab Indicator */}
        <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1.5 rounded-full bg-black/10 z-30 pointer-events-none" />

        {/* Ambient Glows (GPU radial gradients, zero blur filter lag) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[500px] md:w-[800px] h-[500px] md:h-[800px] ambient-glow-purple rounded-full -translate-x-1/3 -translate-y-1/4 opacity-75" />
          <div className="absolute w-[450px] md:w-[700px] h-[450px] md:h-[700px] ambient-glow-cyan rounded-full translate-x-1/3 translate-y-1/4 opacity-75" />
        </div>

        {/* Subtle Background Radial Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#111111 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        {/* Ambient Floating Styles for Zero-Gravity Levitation */}
        <style>{`
          @keyframes ctaFloatLeft {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(-1deg);
            }
            66% {
              transform: translateY(4px) rotate(0.5deg);
            }
          }

          @keyframes ctaFloatMiddle {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            40% {
              transform: translateY(11px) rotate(0.8deg);
            }
            75% {
              transform: translateY(-6px) rotate(-0.5deg);
            }
          }

          @keyframes ctaFloatRight {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            30% {
              transform: translateY(-8px) rotate(1deg);
            }
            70% {
              transform: translateY(6px) rotate(-0.7deg);
            }
          }

          @keyframes ctaFloatBar {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          .cta-float-card-left {
            animation: ctaFloatLeft 6.6s ease-in-out infinite;
            will-change: transform;
          }

          .cta-float-card-middle {
            animation: ctaFloatMiddle 5.8s ease-in-out infinite;
            animation-delay: 0.6s;
            will-change: transform;
          }

          .cta-float-card-right {
            animation: ctaFloatRight 7.2s ease-in-out infinite;
            animation-delay: 1.2s;
            will-change: transform;
          }

          .cta-float-bar {
            animation: ctaFloatBar 5.0s ease-in-out infinite;
            animation-delay: 0.4s;
            will-change: transform;
          }
        `}</style>

        {/* ==============================================================
            CENTERED HERO PRESENTATION UNIT
            - Centered directly to viewport
            - Left & Right slides are equal (flex-[1.25])
            - Middle slide is narrower (flex-[0.85])
           ============================================================== */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">

          {/* THE THREE-SLIDE TRIPTYCH */}
          <div className="w-full flex flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 h-[42vh] sm:h-[50vh] md:h-[56vh]">

            {/* 1. LEFT SLIDE: "Have" (Continuous Spring Bounce on Scroll + Ambient Float) */}
            <div
              ref={leftSlideRef}
              className="flex-[1.25] h-full will-change-transform"
            >
              <div className="w-full h-full rounded-[22px] sm:rounded-[36px] md:rounded-[44px] bg-white/80 backdrop-blur-xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] px-2 py-3 sm:p-6 md:p-8 flex items-center justify-center text-center overflow-hidden relative cta-float-card-left transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.12)]">
                {/* Core Word: "Have" */}
                <span className="text-[clamp(1.4rem,5.8vw,2.5rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight leading-none select-none block whitespace-nowrap">
                  Have
                </span>
              </div>
            </div>

            {/* 2. MIDDLE SLIDE: "an" (Continuous Spring Oscillation + Ambient Float) */}
            <div
              ref={middleSlideRef}
              className="flex-[0.85] h-full will-change-transform"
            >
              <div className="w-full h-full rounded-[22px] sm:rounded-[36px] md:rounded-[44px] bg-[#111111] text-white border border-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.25)] px-2 py-3 sm:p-6 md:p-8 flex items-center justify-center text-center overflow-hidden relative cta-float-card-middle transition-shadow duration-300 hover:shadow-[0_32px_70px_rgba(0,0,0,0.35)]">
                {/* Subtle top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Core Word: "an" */}
                <span className="relative z-10 text-[clamp(1.25rem,5.2vw,2.25rem)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic text-white tracking-tight leading-none select-none block whitespace-nowrap">
                  an
                </span>
              </div>
            </div>

            {/* 3. RIGHT SLIDE: "Idea!" (Continuous Spring Bounce on Scroll + Ambient Float) */}
            <div
              ref={rightSlideRef}
              className="flex-[1.25] h-full will-change-transform"
            >
              <div className="w-full h-full rounded-[22px] sm:rounded-[36px] md:rounded-[44px] bg-white/80 backdrop-blur-xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] px-2 py-3 sm:p-6 md:p-8 flex items-center justify-center text-center overflow-hidden relative cta-float-card-right transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.12)]">
                {/* Core Word: "Idea!" (Each letter is an interactive stepping stone for the rabbit) */}
                <span className="text-[clamp(1.35rem,5.5vw,2.5rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight leading-none select-none block whitespace-nowrap">
                  {['I', 'd', 'e', 'a', '!'].map((char, index) => (
                    <span
                      key={index}
                      id={`cta-idea-letter-${index}`}
                      data-cta-idea-letter={char}
                      data-cta-idea-index={index}
                      data-rabbit-target={`cta-idea-${char}`}
                      data-skill-bounce={`cta-idea-${index}`}
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('rabbit-leap-to-letter', { detail: { index, char } }));
                      }}
                      className="inline-block relative cursor-pointer transform-gpu hover:scale-105 active:scale-95 transition-transform touch-manipulation px-[1px] sm:px-0.5 py-1 -my-1"
                      style={{ transformOrigin: 'center bottom' }}
                      title={`Rabbit perch on "${char}"`}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
            </div>

          </div>

          {/* ==============================================================
              INTERACTIVE CALL TO ACTION CONTROL BAR
              Docked cleanly below the 3 slides with subtle floating hover
             ============================================================== */}
          <div
            ref={ctaBarRef}
            className="mt-4 sm:mt-6 w-full max-w-xl mx-auto will-change-transform px-2 sm:px-0"
          >
            <div
              data-cta-card
              className="w-full flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.08)] cta-float-bar"
            >
              {/* Primary Action Button */}
              <button
                data-cta-button
                onClick={scrollToContact}
                className="px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
              >
                <span className="hidden sm:inline">Start a Conversation</span>
                <span className="sm:hidden font-semibold">Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Quick Actions & Socials */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Copy Email */}
                <button
                  onClick={handleCopyEmail}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-full border text-[11px] sm:text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.04] text-gray-800 hover:text-black'
                  }`}
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-700 font-bold text-[11px] sm:text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="hidden sm:inline">Email</span>
                    </>
                  )}
                </button>

                {/* GitHub */}
                <a
                  href="https://github.com/sdenaveenkumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.04] text-gray-700 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/sdenaveenkumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.04] text-gray-700 hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToAction;
