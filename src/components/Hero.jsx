import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const marqueeItems = [
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
  ];

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 250]);

  const floatingBadge = (text, top, left, right, bottom, delayOffset = 0, color = "#10B981") => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className={`absolute z-20 ${top} ${left} ${right} ${bottom}`}
    >
      <div
        className="flex items-center gap-1.5 sm:gap-2 bg-white/95 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-md transition-shadow"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-800">{text}</span>
      </div>
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
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ willChange: "opacity" }}
      className="relative w-full min-h-[100vh] bg-white flex flex-col justify-between overflow-hidden pt-16 sm:pt-20 pb-16 sm:pb-20 md:pb-6"
    >

      {/* SEMANTIC ACCESSIBLE HEADING FOR SEARCH ENGINES */}
      <h1 className="sr-only">Naveen Kumar — Fullstack Software Engineer &amp; Creative Technologist (RabbitFolio)</h1>

      {/* MASSIVE BACKGROUND TEXT (Anchored directly behind profile portrait on mobile & desktop) */}
      <div aria-hidden="true" className="absolute inset-0 flex items-start md:items-center justify-center overflow-hidden z-0 pointer-events-none select-none pt-[12vh] sm:pt-[15vh] md:pt-[40vh]">
        <motion.div
          className="text-[26vw] md:text-[28vw] font-bold text-gray-100 leading-none tracking-tighter flex"
          style={{ y: textY }}
        >
          Naveen
        </motion.div>
      </div>

      {/* THREE COLUMN FOREGROUND */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 lg:gap-12 items-center flex-1 my-auto py-4 sm:py-6 md:py-10">

        {/* LEFT COLUMN: Fullstack Software Engineer (Order 2 on mobile, Order 1 on desktop) */}
        <div className="order-2 md:order-1 flex flex-col justify-center items-center md:items-start text-center md:text-left pt-1 sm:pt-3 md:pt-0 z-20 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          >

            <motion.h2
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-[1.85rem] sm:text-[2.6rem] md:text-[2.4rem] lg:text-[3.2rem] xl:text-[3.8rem] font-black leading-[0.96] text-gray-900 tracking-tighter"
            >
              <span className="block">
                {"Fullstack".split("").map((char, index) => (
                  <motion.span key={`char-1-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                ))}
              </span>
              <span className="block whitespace-nowrap">
                {"Software Engineer".split("").map((char, index) => (
                  <motion.span key={`char-2-${index}`} variants={childVariants} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h2>
          </motion.div>
        </div>

        {/* CENTER COLUMN: IMAGE & BADGES (Order 1 on mobile, Order 2 on desktop) */}
        <div className="order-1 md:order-2 relative flex justify-center items-end h-[36vh] sm:h-[44vh] md:h-[54vh] lg:h-[72vh] xl:h-[80vh] w-full max-w-[260px] sm:max-w-[320px] md:max-w-none md:w-[280px] lg:w-[380px] xl:w-[460px] mx-auto mt-2 sm:mt-4 md:mt-0">
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            src="/image.webp"
            alt="Naveen Kumar — Fullstack Software Engineer Portrait"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-contain object-bottom relative z-10 filter contrast-[1.05] drop-shadow-2xl rounded-b-none rounded-t-[40px] scale-[1.10] sm:scale-[1.20] md:scale-[1.32] lg:scale-[1.55] xl:scale-[1.72] origin-bottom translate-y-3 sm:translate-y-6 md:translate-y-12 lg:translate-y-20 md:-translate-x-4 lg:-translate-x-8"
          />

          {/* Floating Badges (Fluid offsets preventing edge collisions on mobile & tablet) */}
          {floatingBadge("NODE.JS", "top-[8%] sm:top-[10%]", "left-1 sm:left-2 md:left-[-6%] lg:left-[-10%]", "auto", "auto", 0, "#22c55e")}
          {floatingBadge("DOCKER", "top-[36%] sm:top-[40%]", "auto", "right-1 sm:right-2 md:right-[-8%] lg:right-[-12%]", "auto", 1, "#0284c7")}
          {floatingBadge("TYPESCRIPT", "auto", "left-1 sm:left-3 md:left-[-4%] lg:left-[-6%]", "auto", "bottom-[22%] sm:bottom-[26%]", 2, "#3b82f6")}
        </div>

        {/* RIGHT COLUMN: BIO & CTA (Order 3) */}
        <div className="order-3 md:order-3 flex flex-col justify-center items-center md:items-end text-center md:text-right pt-2 sm:pt-4 md:pt-0 -mt-1 md:-mt-10 lg:-mt-20 z-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] sm:text-[14px] md:text-[13px] lg:text-[15px] leading-relaxed text-gray-600 max-w-[260px] sm:max-w-[280px] lg:max-w-[320px] mb-5 sm:mb-6 md:mb-8"
          >
            Hi, I'm Naveen — a Fullstack Engineer dedicated to building high-performance applications with clean code and bold design.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Explore featured software engineering projects by Naveen Kumar"
            className="flex items-center gap-2.5 sm:gap-3 bg-[#111111] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-[13px] hover:opacity-80 transition-opacity cursor-pointer shadow-md"
          >
            See my works
            <span className="flex items-center justify-center bg-white text-black w-5 h-5 sm:w-6 sm:h-6 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </motion.button>
        </div>

      </div>

      {/* BOTTOM MARQUEE / TECH STACK BANNER */}
      <div className="relative z-20 w-full mt-auto shrink-0 border-t border-b border-gray-200/80 bg-[#F9FAFB] py-3.5 sm:py-4 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            style={{ willChange: "transform" }}
            className="flex items-center space-x-12 px-6 shrink-0"
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
            className="flex items-center space-x-12 px-6 shrink-0"
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
