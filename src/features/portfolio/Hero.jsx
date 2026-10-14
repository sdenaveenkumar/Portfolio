import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { syncUrlHash, updateSeoMeta, SECTION_SEO } from '../../utils/seoRouter';

const Hero = () => {
  const marqueeItems = [
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
    "AWS", "DOCKER", "REACT.JS", "NODE.JS", "NEXT.JS", "JAVA",
  ];

  // Smooth downward scroll translation exclusively for background Naveen typography
  const { scrollY } = useScroll();
  const rawNaveenY = useTransform(scrollY, [0, 750], [0, 240]);
  const naveenScrollY = useSpring(rawNaveenY, { damping: 25, stiffness: 100 });

  const floatingBadge = (
    text,
    top,
    left,
    right,
    bottom,
    delayOffset = 0,
    color = "#ef4444",
    desktopText = null,
    desktopColor = null
  ) => {
    const hasDesktopOverride = Boolean(desktopText);
    const resolvedDesktopColor = desktopColor || color;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + delayOffset * 0.08, type: "spring" }}
        className={`absolute z-20 ${top} ${left} ${right} ${bottom}`}
      >
        <motion.div
          animate={{
            y: [0, delayOffset % 2 === 0 ? -6 : 6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4.8 + delayOffset * 0.6,
            ease: "easeInOut",
          }}
          className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] lg:shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md lg:hover:shadow-[0_18px_36px_rgba(0,0,0,0.14)] lg:hover:scale-105 transition-all duration-300 cursor-default"
        >
          {hasDesktopOverride ? (
            <>
              <span className="md:hidden w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="hidden md:inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: resolvedDesktopColor }} />
            </>
          ) : (
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          )}

          <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-800">
            {hasDesktopOverride ? (
              <>
                <span className="md:hidden">{text}</span>
                <span className="hidden md:inline">{desktopText}</span>
              </>
            ) : (
              text
            )}
          </span>
        </motion.div>
      </motion.div>
    );
  };

  // Fast, crisp entrance for Fullstack Software Engineer
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.04 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 14, stiffness: 140 },
    },
  };

  const handleSeeMyWorks = (e) => {
    e?.preventDefault();
    const projectsEl = document.getElementById('projects');
    if (!projectsEl) return;

    window.__navTargetLock = {
      target: 'projects',
      rawTarget: 'projects',
      startTime: performance.now(),
      expiryTime: performance.now() + 2500,
    };

    syncUrlHash('projects', false);
    if (SECTION_SEO?.projects) {
      updateSeoMeta(SECTION_SEO.projects);
    }

    window.dispatchEvent(new CustomEvent('rabbit-nav-leap', {
      detail: { target: 'projects' }
    }));

    const rect = projectsEl.getBoundingClientRect();
    const targetY = window.pageYOffset + rect.top;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full min-h-[100vh] lg:h-screen lg:min-h-screen bg-white flex flex-col justify-between overflow-hidden pt-16 sm:pt-20 pb-16 sm:pb-20 md:pb-6 lg:pb-0"
    >
      {/* SEMANTIC ACCESSIBLE HEADING FOR SEARCH ENGINES */}
      <h1 className="sr-only">Naveen Kumar — Fullstack Software Engineer &amp; Creative Technologist (RabbitFolio)</h1>

      {/* Dynamic Profile Blend Styling: Blended on Mobile/Tablet, Removed on Laptop */}
      <style>{`
        .hero-profile-blend {
          -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 98%);
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 98%);
        }
        @media (min-width: 1024px) {
          .hero-profile-blend {
            -webkit-mask-image: none !important;
            mask-image: none !important;
          }
        }
      `}</style>

      {/* MASSIVE BACKGROUND TEXT WITH DYNAMIC AMBIENT WAVE & SHIMMER */}
      <motion.div 
        aria-hidden="true" 
        style={{ y: naveenScrollY }}
        className="absolute inset-0 flex items-start md:items-center justify-center overflow-hidden z-0 pointer-events-none select-none pt-[18vh] sm:pt-[22vh] md:pt-[44vh] will-change-transform"
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          className="text-[26vw] md:text-[28vw] font-black leading-none tracking-tighter flex select-none will-change-transform"
        >
          {"Naveen".split("").map((letter, idx) => (
            <motion.span
              key={`hero-char-${idx}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                backgroundPosition: ["0% 50%", "200% 50%"],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.08 + idx * 0.07, ease: "easeOut" },
                y: {
                  repeat: Infinity,
                  duration: 4.8,
                  delay: 0.2 + idx * 0.25,
                  ease: "easeInOut",
                },
                backgroundPosition: {
                  repeat: Infinity,
                  duration: 12,
                  ease: "linear",
                },
              }}
              style={{
                backgroundImage: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 25%, #F3F4F6 50%, #D1D5DB 75%, #E5E7EB 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="inline-block drop-shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* THREE COLUMN FOREGROUND */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 lg:gap-12 items-center flex-1 my-auto py-4 sm:py-6 md:py-10 lg:py-4 lg:pb-16">

        {/* LEFT COLUMN: Fullstack Software Engineer (Order 2 on mobile, Order 1 on desktop) */}
        <div className="order-2 md:order-1 flex flex-col justify-center items-center md:items-start text-center md:text-left pt-0 sm:pt-3 md:pt-0 -mt-2.5 sm:mt-0 z-20 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <motion.h2
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-[1.85rem] sm:text-[2.6rem] md:text-[2.6rem] lg:text-[3.5rem] xl:text-[4rem] font-black leading-[0.96] md:leading-[0.92] text-gray-900 tracking-tighter lg:drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
            >
              {/* Mobile device (< md): 2 lines */}
              <span className="block md:hidden">
                <span className="block">
                  {"Fullstack".split("").map((char, index) => (
                    <motion.span key={`m-char-1-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                  ))}
                </span>
                <span className="block">
                  {"Software Engineer".split("").map((char, index) => (
                    <motion.span key={`m-char-2-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                  ))}
                </span>
              </span>

              {/* Laptop / Desktop device (>= md): 3 lines */}
              <span className="hidden md:block">
                {"Fullstack".split("").map((char, index) => (
                  <motion.span key={`d-char-1-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                ))}
                <br />
                <span>
                  {"Software".split("").map((char, index) => (
                    <motion.span key={`d-char-2-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                  ))}
                </span>
                <br />
                {"Engineer".split("").map((char, index) => (
                  <motion.span key={`d-char-3-${index}`} variants={childVariants} className="inline-block">{char}</motion.span>
                ))}
              </span>
            </motion.h2>
          </motion.div>
        </div>

        {/* CENTER COLUMN: IMAGE & BADGES (Order 1 on mobile, Order 2 on desktop) */}
        <div className="order-1 md:order-2 relative flex justify-center items-end h-[39vh] sm:h-[46vh] md:h-[56vh] lg:h-[74vh] xl:h-[82vh] w-full max-w-[285px] sm:max-w-[340px] md:max-w-none md:w-[300px] lg:w-[400px] xl:w-[480px] mx-auto mt-2 sm:mt-4 md:mt-0">
          {/* Ambient Radiant Glow behind Portrait */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
            className="absolute bottom-6 sm:bottom-8 w-[240px] sm:w-[320px] md:w-[380px] h-[240px] sm:h-[320px] md:h-[380px] bg-gradient-to-tr from-blue-200/40 via-purple-100/30 to-amber-100/40 rounded-full blur-3xl pointer-events-none -z-0"
          />

          {/* Profile Picture with Ambient Floating Levitation & Bottom Blend Mask */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="w-full h-full flex items-end justify-center relative z-10 pointer-events-none"
          >
            <motion.div
              animate={{
                y: [0, -9, 0],
                rotate: [0, 0.4, 0, -0.4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5.8,
                ease: "easeInOut",
              }}
              className="w-full h-full flex items-end justify-center pointer-events-none select-none"
            >
              <img
                src="/image.webp"
                alt="Naveen Kumar — Fullstack Software Engineer Portrait"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-contain object-bottom relative z-10 filter contrast-[1.05] drop-shadow-2xl rounded-b-none scale-[1.18] sm:scale-[1.28] md:scale-[1.38] lg:scale-[1.62] xl:scale-[1.78] origin-bottom -translate-y-2 sm:translate-y-6 md:translate-y-12 lg:translate-y-20 md:-translate-x-4 lg:-translate-x-8 transition-transform duration-300 hero-profile-blend pointer-events-none select-none"
              />
            </motion.div>
          </motion.div>

          {/* Floating Badges */}
          {floatingBadge("REDIS", "top-[8%] sm:top-[10%]", "left-1 sm:left-2 md:left-[-6%] lg:left-[-10%]", "auto", "auto", 0, "#ef4444", "NODE.JS", "#ef4444")}
          {floatingBadge("DOCKER", "top-[36%] sm:top-[40%]", "auto", "right-1 sm:right-2 md:right-[-8%] lg:right-[-12%]", "auto", 1, "#ef4444")}
          {floatingBadge("NODE.JS", "auto", "left-1 sm:left-3 md:left-[-4%] lg:left-[-6%]", "auto", "bottom-[22%] sm:bottom-[26%]", 2, "#ef4444", "TYPESCRIPT", "#ef4444")}
        </div>

        {/* RIGHT COLUMN: BIO & CTA (Order 3) */}
        <div className="order-3 md:order-3 relative z-30 pointer-events-auto flex flex-col justify-center items-center md:items-end text-center md:text-right pt-0 sm:pt-4 md:pt-0 -mt-3.5 sm:-mt-1 md:-mt-10 lg:-mt-20">
          <div className="flex flex-col justify-center items-center md:items-end w-full">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[13px] sm:text-[14px] md:text-[13px] lg:text-[15px] leading-relaxed text-gray-600 max-w-[260px] sm:max-w-[280px] lg:max-w-[320px] mb-4 sm:mb-6 md:mb-8 lg:drop-shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            >
              Hi, I'm Naveen — a Fullstack Engineer dedicated to building high-performance applications with clean code and bold design.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSeeMyWorks}
              aria-label="Explore featured software engineering projects by Naveen Kumar"
              className="relative z-30 pointer-events-auto flex items-center gap-2.5 sm:gap-3 bg-[#111111] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-[13px] hover:bg-black transition-all cursor-pointer shadow-md lg:shadow-[0_12px_28px_rgba(0,0,0,0.22)] lg:hover:shadow-[0_20px_40px_rgba(0,0,0,0.32)]"
            >
              See my works
              <span className="flex items-center justify-center bg-white text-black w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </motion.button>
          </div>
        </div>

      </div>

      {/* BOTTOM MARQUEE / TECH STACK BANNER (Stuck to bottom on laptop) */}
      <div className="relative z-20 w-full mt-auto shrink-0 border-t border-b border-gray-200/80 bg-[#F9FAFB] py-3.5 sm:py-4 overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:w-full lg:z-30 lg:mt-0 lg:border-b-0">
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
