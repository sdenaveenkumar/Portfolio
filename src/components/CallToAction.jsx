import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CallToAction = () => {
  const containerRef = useRef(null);

  // Track scroll progress within this 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase 1 (0 -> 0.3): "Have an Idea?" is centered.
  // Phase 2 (0.15 -> 0.3): Fade in soft purple highlight on "Idea?"
  const highlightOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  // Phase 3 (0.4 -> 0.65): Shift "Have an Idea?" to the left so "Idea?" is centered.
  // On desktop, shifting by -15vw roughly centers the last word depending on font size.
  // We'll use a responsive approach by shifting the container left.
  const textX = useTransform(scrollYProgress, [0.4, 0.65], ["0%", "-18%"]);

  // Phase 4 (0.65 -> 0.9): Reveal "Let's build it" and the button below it.
  const revealOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.65, 0.85], [40, 0]);
  const revealPointerEvents = useTransform(scrollYProgress, (val) => val > 0.8 ? "auto" : "none");

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-white">
      {/* Sticky container that stays on screen while scrolling */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Main Text Container - Have an Idea? always centered */}
        <motion.div 
          className="absolute flex items-center justify-center w-full top-1/2 -translate-y-1/2 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#111111]"
        >
          <div className="whitespace-nowrap flex items-center">
            <span>Have an&nbsp;</span>
            <span className="relative inline-block z-20">
              <motion.div 
                style={{ opacity: highlightOpacity }}
                className="absolute inset-0 bg-[#dcfce7] scale-110 rounded-2xl -z-10 shadow-[0_0_40px_rgba(220,252,231,1)]"
              />
              <span className="relative z-10 px-2">Idea?</span>
              
              {/* The revealed content absolute positioned so it doesn't push 'Have an Idea?' off center */}
              <motion.div 
                style={{ 
                  opacity: revealOpacity,
                  // slight slide from the left (underneath "Idea?") as it reveals
                  x: useTransform(scrollYProgress, [0.65, 0.85], [-50, 0]),
                  pointerEvents: revealPointerEvents
                }}
                className="absolute left-[100%] top-0 h-full ml-4 md:ml-8 flex items-center z-10 whitespace-nowrap"
              >
                <span> Let's build it.</span>
              </motion.div>
            </span>
          </div>
        </motion.div>

        {/* Button reveals below */}
        <motion.div 
          style={{ 
            opacity: revealOpacity, 
            y: revealY,
            pointerEvents: revealPointerEvents
          }}
          className="absolute top-[65%] flex justify-center w-full z-30"
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[#111111] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
          >
            Start a Project
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;
