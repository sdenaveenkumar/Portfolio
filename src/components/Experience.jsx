import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const containerRef = useRef(null);
  const progressLineRef = useRef(null);
  const hireMeCardRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });

    // Animate the central progress line growing downwards
    tl.fromTo(progressLineRef.current,
      { scaleY: 0 },
      { scaleY: 1, ease: "none", duration: 2.6 },
      0
    );

    // Animate the Hire Me card flying in from far top-right
    tl.fromTo(hireMeCardRef.current,
      {
        x: "50vw", // start way to the right
        y: "-50vh", // start way to the top
        scale: 0,   // start tiny (far away)
        rotationZ: 75,
        opacity: 0
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotationZ: -8, // land with a cool slight tilt
        opacity: 1,
        duration: 1.6,
        ease: "power2.out"
      },
      1.0 // Start at 1.0s, finishes at 2.6s
    );

    // Generous settling pause so the landed card rests completely before CallToAction arrives
    tl.to({}, { duration: 1.4 });

  }, { scope: containerRef });

  return (
    <div id="experience" ref={containerRef} className="relative z-40 w-full h-[400vh] -mt-[100vh] bg-[#fafafc] text-gray-900 rounded-t-[44px] sm:rounded-t-[60px] border-t border-black/[0.08] shadow-[0_-30px_70px_rgba(0,0,0,0.08)]">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col pt-16 sm:pt-20 px-6 md:px-12 bg-[#fafafc] rounded-t-[44px] sm:rounded-t-[60px]">

        {/* Ambient Glows from Contact Us Theme */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-br from-purple-200/35 via-pink-200/20 to-transparent rounded-full blur-[80px] md:blur-[120px] -translate-x-1/4 -translate-y-1/4 opacity-60" />
          <div className="absolute w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-tl from-cyan-200/35 via-blue-100/20 to-transparent rounded-full blur-[80px] md:blur-[120px] translate-x-1/3 translate-y-1/4 opacity-60" />
        </div>

        {/* Pull tab indicator */}
        <div className="w-12 sm:w-16 h-1.5 rounded-full bg-black/10 mx-auto mb-3 pointer-events-none" />

        {/* Title */}
        <h2 className="text-[32px] md:text-[56px] lg:text-[64px] font-black text-[#1F1F1F] tracking-tighter mb-2 uppercase text-center relative z-10 leading-none">
          The Journey Has Just Started
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-mono text-neutral-500 max-w-xl mx-auto uppercase tracking-wide text-center mb-8 sm:mb-12">
          From academic foundations at Manipal University to building production-grade scalable systems.
        </p>

        {/* Timeline Container */}
        <div className="relative flex-1 w-full max-w-5xl mx-auto flex">

          {/* Central Spine */}
          <div className="absolute left-1/2 top-0 bottom-12 w-1 bg-gray-200 transform -translate-x-1/2 rounded-full overflow-hidden hidden md:block">
            {/* The Black Progress Fill */}
            <div ref={progressLineRef} className="w-full h-full bg-[#111111] transform origin-top" />
          </div>

          {/* Hire Me Card Container (Centered perfectly) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-24">
            <div
              ref={hireMeCardRef}
              className="relative w-[260px] md:w-[300px] h-[320px] md:h-[360px] bg-gradient-to-br from-gray-900 via-[#111] to-gray-800 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-6 border border-gray-700/50 flex flex-col items-center justify-center pointer-events-auto cursor-pointer group will-change-transform overflow-hidden"
            >
              {/* Subtle background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Inner dashed container to look like a placeholder/ticket */}
              <div className="w-full h-full rounded-[20px] border-2 border-dashed border-gray-600/50 group-hover:border-purple-500/40 transition-colors duration-500 flex flex-col items-center justify-center p-6 text-center relative z-10">

                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">
                  Be the first to
                </p>

                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 leading-[1.1] bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-500">
                  Get Your <br /> Name Here
                </h3>

                <span
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-100 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <span>Click Here</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Experience;
