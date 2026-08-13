import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const marqueeItems = [
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
  ];

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 250]);

  const floatingBadge = (text, top, left, right, bottom, delayOffset = 0) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className={`absolute z-20 ${top} ${left} ${right} ${bottom}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delayOffset }}
        style={{ willChange: "transform" }}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100"
      >
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        <span className="text-[10px] font-bold tracking-widest text-gray-800">{text}</span>
      </motion.div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ willChange: "opacity" }}
      className="relative w-full min-h-[100vh] bg-white flex flex-col justify-center overflow-hidden pt-20"
    >

      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none select-none pt-[30vh] md:pt-[40vh]">
        <motion.h1
          className="text-[20vw] md:text-[28vw] font-bold text-gray-100 leading-none tracking-tighter flex"
          style={{ y: textY, willChange: "transform" }}
        >
          {Array.from("Naveen").map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* THREE COLUMN FOREGROUND */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 items-center h-full pb-20">

        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-center items-start pt-10 md:pt-0 z-20 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          >

            <motion.h2 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-[2.5rem] md:text-[4rem] font-black leading-[0.9] text-gray-900 tracking-tighter"
            >
              {"Fullstack".split("").map((char, index) => (
                <motion.span key={`char-1-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
              ))}
              <br />
              <span>
                {"Software".split("").map((char, index) => (
                  <motion.span key={`char-2-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                ))}
              </span>
              <br />
              {"Engineer".split("").map((char, index) => (
                <motion.span key={`char-3-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
              ))}
            </motion.h2>
          </motion.div>
        </div>

        {/* CENTER COLUMN (IMAGE & BADGES) */}
        <div className="relative flex justify-center items-end h-[50vh] md:h-[60vh] lg:h-[80vh] w-full md:w-[400px] lg:w-[500px] mx-auto">
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            src="/image.png"
            alt="Naveen"
            className="w-full h-full object-contain object-bottom relative z-10 filter contrast-[1.05] drop-shadow-2xl rounded-b-none rounded-t-[40px] scale-[1.35] md:scale-[1.5] lg:scale-[1.75] origin-bottom translate-y-12 md:translate-y-16 lg:translate-y-24 -translate-x-4 md:-translate-x-8 lg:-translate-x-12"
          />

          {/* Floating Badges */}
          {floatingBadge("NODE.JS", "top-[10%]", "left-[-10%]", "auto", "auto", 0)}
          {floatingBadge("REACT.JS", "top-[40%]", "auto", "right-[-15%]", "auto", 1)}
          {floatingBadge("GSAP", "auto", "left-[-5%]", "auto", "bottom-[30%]", 2)}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col justify-center items-start md:items-end text-left md:text-right pt-10 md:pt-0 -mt-12 md:-mt-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[14px] md:text-[15px] leading-relaxed text-gray-600 max-w-[280px] mb-8"
          >
            Hi, I'm Naveen — a Fullstack Engineer dedicated to building high-performance applications with clean code and bold design.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 bg-[#111111] text-white px-6 py-3.5 rounded-full font-semibold text-[13px] hover:opacity-80 transition-opacity"
          >
            See my works
            <span className="flex items-center justify-center bg-white text-black w-6 h-6 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </motion.button>
        </div>

      </div>

      {/* BOTTOM MARQUEE */}
      <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-[#F9FAFB] py-4 overflow-hidden z-20">
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            style={{ willChange: "transform" }}
            className="flex items-center space-x-12 px-6"
          >
            {marqueeItems.map((item, idx) => (
              <div key={`m1-${idx}`} className="flex items-center space-x-12">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="text-[11px] font-black tracking-[0.2em] text-gray-800">{item}</span>
              </div>
            ))}
          </motion.div>
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            style={{ willChange: "transform" }}
            className="flex items-center space-x-12 px-6"
          >
            {marqueeItems.map((item, idx) => (
              <div key={`m2-${idx}`} className="flex items-center space-x-12">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="text-[11px] font-black tracking-[0.2em] text-gray-800">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </motion.section>
  );
};

export default Hero;
