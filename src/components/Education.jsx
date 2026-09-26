import React, { useRef, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const gpaData = [
  { semester: 'Sem 1', cgpa: 9.50, status: 'Outstanding' },
  { semester: 'Sem 2', cgpa: 8.55, status: 'Excellent' },
  { semester: 'Sem 3', cgpa: 9.11, status: 'Outstanding' },
  { semester: 'Sem 4', cgpa: 8.10, status: 'Very Good' },
];

const transcriptData = [
  {
    sem: "Sem 1",
    sgpa: 9.50,
    status: "Cohort Peak • Outstanding",
    rankBadge: "Rank 1 Tier",
    subjects: [
      { code: "DCA1101", name: "Fundamentals of IT & Programming", total: 83, grade: "A" },
      { code: "DCA1102", name: "Programming in C", total: 93, grade: "A+" },
      { code: "DCA1103", name: "Basic Mathematics", total: 94, grade: "A+" },
      { code: "DCA1104", name: "Understanding PC & Troubleshooting", total: 86, grade: "A" },
      { code: "DCA1130", name: "Programming in C – Practical", total: 81, grade: "A" }
    ]
  },
  {
    sem: "Sem 2",
    sgpa: 8.55,
    status: "Distinction Honors",
    rankBadge: "High Distinction",
    subjects: [
      { code: "DCA1201", name: "Operating System", total: 77, grade: "B+" },
      { code: "DCA1202", name: "Data Structures & Algorithms", total: 79, grade: "B+" },
      { code: "DCA1203", name: "Object Oriented Programming – C++", total: 77, grade: "B+" },
      { code: "DCA1204", name: "Communication Skills & Dev", total: 83, grade: "A" },
      { code: "DCA1205", name: "Digital Logic", total: 80, grade: "A" },
      { code: "DCA1230", name: "DSA using C++ – Practical", total: 92, grade: "A+" }
    ]
  },
  {
    sem: "Sem 3",
    sgpa: 9.11,
    status: "Outstanding Distinction",
    rankBadge: "Top 2% Tier",
    subjects: [
      { code: "DCA2101", name: "Numerical Methods", total: 82, grade: "A" },
      { code: "DCA2102", name: "Database Management Systems (DBMS)", total: 85, grade: "A" },
      { code: "DCA2103", name: "Computer Organization", total: 90, grade: "A+" },
      { code: "DCA2104", name: "Basics of Data Communication", total: 79, grade: "B+" },
      { code: "DCA2130", name: "DBMS – Practical", total: 96, grade: "A+" }
    ]
  },
  {
    sem: "Sem 4",
    sgpa: 8.10,
    status: "Distinction Honors",
    rankBadge: "Distinction",
    subjects: [
      { code: "DCA2201", name: "Computer Networking", total: 75, grade: "B+" },
      { code: "DCA2202", name: "Java Programming", total: 77, grade: "B+" },
      { code: "DCA2203", name: "System Software", total: 84, grade: "A" },
      { code: "DCA2204", name: "Principles of Financial Management", total: 69, grade: "C+" },
      { code: "DCA2230", name: "Java Programming – Practical", total: 84, grade: "A" },
      { code: "DCA2231", name: "System Software – Practical", total: 100, grade: "A+" }
    ]
  }
];

// High-End Brutalist Editorial Colorways (Monochromatic Precision with Graphite Tiers)
const semThemes = [
  {
    cardBg: 'bg-[#0b0b0f]',
    cardBorder: 'border-white/15',
    watermark: 'text-white/[0.04]',
    subCardBg: 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.07]',
    badgeBg: 'bg-white text-black font-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-white',
    accentColor: '#FFFFFF',
    footerBorder: 'border-white/10',
  },
  {
    cardBg: 'bg-[#0e0e14]',
    cardBorder: 'border-white/15',
    watermark: 'text-white/[0.04]',
    subCardBg: 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.07]',
    badgeBg: 'bg-white text-black font-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-neutral-200',
    accentColor: '#E4E4E7',
    footerBorder: 'border-white/10',
  },
  {
    cardBg: 'bg-[#0b0b0f]',
    cardBorder: 'border-white/15',
    watermark: 'text-white/[0.04]',
    subCardBg: 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.07]',
    badgeBg: 'bg-white text-black font-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-white',
    accentColor: '#FFFFFF',
    footerBorder: 'border-white/10',
  },
  {
    cardBg: 'bg-[#0e0e14]',
    cardBorder: 'border-white/15',
    watermark: 'text-white/[0.04]',
    subCardBg: 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.07]',
    badgeBg: 'bg-white text-black font-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-neutral-200',
    accentColor: '#E4E4E7',
    footerBorder: 'border-white/10',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = gpaData.find(d => d.semester === label);
    return (
      <div className="bg-[#101015] text-white p-3 rounded-none shadow-2xl border border-white/20 font-mono flex flex-col gap-0.5 min-w-[130px]">
        <span className="text-[10px] uppercase text-neutral-400 tracking-widest">{label} RECORD</span>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-xl font-black text-white">{payload[0].value}</span>
          <span className="text-[10px] font-bold text-neutral-400">SGPA</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{item?.status}</span>
      </div>
    );
  }
  return null;
};

const Education = () => {
  const [activeSemIndex, setActiveSemIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('vault'); // 'vault' | 'trajectory'

  const containerRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroNumberRef = useRef(null);
  const heroSubtextRef = useRef(null);
  const targetSlotRef = useRef(null);
  const mainStageRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const totalCards = transcriptData.length;

    // ScrollTrigger to calculate semester index
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const adjustedProgress = Math.max(0, Math.min(1, (self.progress - 0.28) / 0.72));
        const step = Math.min(totalCards - 1, Math.floor(adjustedProgress * totalCards));
        setActiveSemIndex((prev) => (prev !== step ? step : prev));
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });

    // ==============================================================
    // ACT 1: Dynamic Morph of the Big 8.82 directly into Target Slot
    // ==============================================================
    const getMorphDelta = () => {
      if (!heroNumberRef.current || !targetSlotRef.current) return { x: 0, y: 0, scale: 0.35 };
      
      const heroEl = heroNumberRef.current;
      const targetEl = targetSlotRef.current;

      const prevHeroTransform = heroEl.style.transform;
      heroEl.style.transform = 'none';

      const heroRect = heroEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      heroEl.style.transform = prevHeroTransform;

      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top + heroRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      return {
        x: targetCenterX - heroCenterX,
        y: targetCenterY - heroCenterY,
        scale: targetRect.width / heroRect.width
      };
    };

    let morphDelta = getMorphDelta();
    ScrollTrigger.addEventListener("refreshInit", () => {
      morphDelta = getMorphDelta();
    });

    // 1. Hero text badges fade out
    tl.to([heroBadgeRef.current, heroSubtextRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.in"
    }, 0);

    // 2. The Big 8.82 physically flies, scales down, and locks into the target slot
    tl.to(heroNumberRef.current, {
      x: () => morphDelta.x,
      y: () => morphDelta.y,
      scale: () => morphDelta.scale,
      duration: 1.4,
      ease: "power2.inOut"
    }, 0);

    // 3. The surrounding command stage fades in smoothly
    tl.fromTo(mainStageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      0.3
    );

    // 4. Seamless Handover: Once landed, target slot reveals native 8.82
    tl.to(heroNumberRef.current, {
      opacity: 0,
      duration: 0.08,
      ease: "none"
    }, 1.35);

    tl.to(targetSlotRef.current, {
      opacity: 1,
      duration: 0.08,
      ease: "none"
    }, 1.35);

    // 5. Sem 1 progress bars surge as the main stage reveals
    const sem1Card = cardsRef.current[0];
    if (sem1Card) {
      const sem1Bars = sem1Card.querySelectorAll('.sem-progress-bar');
      sem1Bars.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width') || '0%';
        tl.fromTo(bar,
          { width: "0%" },
          { width: targetWidth, duration: 0.8, ease: "power2.out" },
          0.6
        );
      });
    }

    // ==============================================================
    // ACT 2: 3D Physical Stacking Cards on Scroll
    // ==============================================================
    transcriptData.forEach((_, index) => {
      if (index === 0) return;

      const currentCard = cardsRef.current[index];
      const prevCard = cardsRef.current[index - 1];

      if (currentCard) {
        tl.fromTo(currentCard,
          {
            y: "115%",
            rotateX: 16,
            rotateZ: index % 2 === 0 ? 1 : -1,
            opacity: 0,
            scale: 0.94
          },
          {
            y: "0%",
            rotateX: 0,
            rotateZ: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out"
          }
        );

        const cardBars = currentCard.querySelectorAll('.sem-progress-bar');
        cardBars.forEach((bar) => {
          const targetWidth = bar.getAttribute('data-width') || '0%';
          tl.fromTo(bar,
            { width: "0%" },
            { width: targetWidth, duration: 0.8, ease: "power2.out" },
            "<+=0.4"
          );
        });
      }

      if (prevCard) {
        tl.to(prevCard, {
          scale: 0.96 - (index * 0.02),
          y: -16 * index,
          opacity: 0.25,
          duration: 1.5,
          ease: "power3.out"
        }, "<");
      }
    });

    return () => {
      scrollTriggerInstance.kill();
    };

  }, { scope: containerRef });

  return (
    <div 
      id="education" 
      ref={containerRef}
      className="relative w-full h-[380vh] bg-[#070709] text-white selection:bg-white selection:text-black font-sans rounded-t-[44px] md:rounded-t-[64px] border-t border-white/10 shadow-[0_-30px_90px_rgba(0,0,0,0.7)] -mt-16 md:-mt-24 z-30"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-8 sm:pt-12 md:pt-14 pb-5 px-4 sm:px-8 md:px-12 select-none bg-[#070709]">
        
        {/* =============================================================== */}
        {/* 4 CORNER ARCHITECTURAL CROSSHAIRS (+)                           */}
        {/* =============================================================== */}
        <div className="absolute top-4 left-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute top-4 right-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute bottom-4 left-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>
        <div className="absolute bottom-4 right-4 z-40 text-neutral-600 font-mono text-xs pointer-events-none">+</div>

        {/* =============================================================== */}
        {/* ARCHITECTURAL BACKGROUND SYSTEM (Monochrome Technical Dossier)  */}
        {/* =============================================================== */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          
          {/* 1. Precision Technical Grid */}
          <div 
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* 2. Micro Dot Grid */}
          <div 
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* 3. Massive Typographic Watermark */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black uppercase text-transparent tracking-tighter select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0"
            style={{ WebkitTextStroke: '2px #FFFFFF' }}
          >
            DOSSIER
          </div>

          {/* 4. Concentric Geometry Audit Seal & Compass Wireframe */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[840px] md:h-[840px] pointer-events-none opacity-[0.05] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-white" />
            <div className="absolute inset-16 rounded-full border border-white" />
            <div className="absolute inset-32 rounded-full border border-dotted border-white" />
            <div className="absolute w-full h-[1px] bg-white/40" />
            <div className="absolute h-full w-[1px] bg-white/40" />
          </div>

          {/* 5. Editorial Blueprint Technical Markings */}
          <div className="absolute top-4 left-8 font-mono text-[9px] text-neutral-500 tracking-widest hidden md:flex items-center gap-2">
            <span className="font-bold text-neutral-300">+ RECORD // 03</span>
            <span>LAT: 26.8439°N</span>
            <span>LON: 75.5652°E</span>
            <span>• MANIPAL JAIPUR</span>
          </div>

          <div className="absolute top-4 right-8 font-mono text-[9px] text-neutral-500 tracking-widest hidden md:flex items-center gap-2">
            <span>SPEC: ISO-9001-BCA</span>
            <span>• REG: 230970043</span>
            <span className="font-bold text-neutral-300">AUDIT VERIFIED +</span>
          </div>

        </div>

        {/* =============================================================== */}
        {/* HERO 8.82 OVERLAY: Monumental Number that morphs into card slot */}
        {/* =============================================================== */}
        <div className="absolute inset-0 pointer-events-none z-40 flex flex-col items-center justify-center">
          
          <div ref={heroBadgeRef} className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-4 text-center">
            <span className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-neutral-200 text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase backdrop-blur-md max-w-[90vw]">
              MANIPAL UNIVERSITY JAIPUR • CLASS OF 2027
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // ACADEMIC AUDIT RECORD
            </span>
          </div>

          {/* The BIG 8.82 Monolith */}
          <div 
            ref={heroNumberRef}
            style={{ transformOrigin: 'center center' }}
            className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black tracking-tighter text-white leading-none select-none will-change-transform will-change-opacity drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          >
            8.82
          </div>

          <div ref={heroSubtextRef} className="flex flex-col items-center gap-2 sm:gap-3 mt-2 sm:mt-3 px-4 text-center">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 text-xs sm:text-sm md:text-base font-mono text-neutral-300 uppercase tracking-widest">
              <span>Cumulative GPA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white font-bold">Distinction Honors</span>
            </div>
            
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-400">
              <span>SCROLL DOWN TO INSPECT DOSSIER</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>

        </div>

        {/* =============================================================== */}
        {/* Top Header Row                                                  */}
        {/* =============================================================== */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-white/10 shrink-0 relative z-20">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-white text-black font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
                Manipal University Jaipur
              </span>
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
                BCA Degree
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Academic Excellence
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View Toggle Switcher (< md) */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-white/[0.05] border border-white/10 rounded-full text-[11px] font-mono">
              <button 
                type="button"
                onClick={() => setMobileTab('vault')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${mobileTab === 'vault' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Dossier
              </button>
              <button 
                type="button"
                onClick={() => setMobileTab('trajectory')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${mobileTab === 'trajectory' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Curve
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 sm:px-3.5 bg-white/[0.05] border border-white/10 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">{transcriptData[activeSemIndex].sem} Active</span>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">
              Distinction Standing
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* Main Dual Stage (Overview Card + 3D Card Stack)                  */}
        {/* =============================================================== */}
        <div 
          ref={mainStageRef}
          className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 my-2 overflow-hidden items-center relative z-10 opacity-0"
        >
          {/* Left Column (5 Cols): Overview Card, Metric Splits, Trajectory Chart */}
          <div className="md:col-span-5 flex flex-col gap-3 justify-between h-full max-h-[74vh]">
            
            {/* Cumulative GPA Card (Destination of the Morphing 8.82) */}
            <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[#0c0c10] border border-white/15 shadow-sm flex flex-col justify-between relative overflow-hidden shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Cumulative GPA
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                  Distinction Honors
                </span>
              </div>

              {/* Destination Slot */}
              <div className="flex items-baseline gap-2 my-1">
                <div 
                  ref={targetSlotRef}
                  className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none select-none opacity-0 will-change-opacity"
                >
                  8.82
                </div>
                <span className="text-base font-mono font-bold text-neutral-400">/ 10.0</span>
              </div>

              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Graduation standing maintained across all 4 completed semesters in Core Computer Science, Software Engineering, and Mathematics.
              </p>
            </div>

            {/* Quick Metrics & Trajectory Area Chart */}
            <div className={`${mobileTab === 'trajectory' ? 'flex' : 'hidden'} md:flex flex-col gap-3 flex-1 justify-between`}>
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0c0c10] border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Peak SGPA</span>
                  <span className="text-2xl font-black text-white block mt-0.5 font-mono">9.50</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Semester 01</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0c0c10] border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Flawless Score</span>
                  <span className="text-2xl font-black text-white block mt-0.5 font-mono">100/100</span>
                  <span className="text-[10px] text-neutral-400 font-mono">System Software Lab</span>
                </div>
              </div>

              {/* Trajectory Area Chart */}
              <div className="p-5 rounded-2xl bg-[#0c0c10] border border-white/10 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Trajectory Curve
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Range: 6.0 – 10.0</span>
                </div>

                <div className="w-full h-[120px] md:h-[145px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={gpaData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis 
                        dataKey="semester" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888888', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        domain={[6, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#666666', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="cgpa" 
                        stroke="#FFFFFF" 
                        strokeWidth={2.5} 
                        fill="url(#gpaGradient)"
                        activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#000000', strokeWidth: 2 }}
                        dot={{ r: 3.5, fill: '#FFFFFF' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-neutral-400">
                  {transcriptData.map((d, i) => (
                    <span 
                      key={i} 
                      className={`transition-colors duration-200 ${activeSemIndex === i ? 'text-white font-bold underline underline-offset-4' : ''}`}
                    >
                      {d.sem}: {d.sgpa}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Physical 3D Vault Stacking Deck */}
          <div className={`${mobileTab === 'vault' ? 'flex' : 'hidden'} md:flex md:col-span-7 relative h-full max-h-[74vh] items-center justify-center [perspective:1200px]`}>
            
            <div className="relative w-full h-[360px] sm:h-[440px] md:h-[530px]">
              {transcriptData.map((card, idx) => {
                const theme = semThemes[idx % semThemes.length];
                return (
                  <div
                    key={card.sem}
                    ref={el => cardsRef.current[idx] = el}
                    style={{ zIndex: 10 + idx }}
                    className={`absolute inset-0 w-full h-full ${theme.cardBg} rounded-2xl sm:rounded-3xl border ${theme.cardBorder} shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-4 sm:p-6 md:p-7 flex flex-col justify-between overflow-hidden will-change-transform`}
                  >
                    {/* Large Background Watermark Number */}
                    <div className={`absolute right-4 bottom-2 text-[100px] md:text-[140px] font-black ${theme.watermark} pointer-events-none select-none leading-none z-0`}>
                      0{idx + 1}
                    </div>

                    {/* Top Bar of the Card */}
                    <div className={`flex items-center justify-between pb-3 border-b ${theme.footerBorder} shrink-0 relative z-10`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                            [ DOSSIER 0{idx + 1} ]
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none border border-white/20 bg-white/10 text-white shadow-xs`}>
                            {card.rankBadge}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
                          {card.sem}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400 hidden sm:inline">{card.status}</span>
                        <div className="px-4 py-1.5 bg-white text-black font-mono text-sm font-black shadow-md">
                          {card.sgpa} SGPA
                        </div>
                      </div>
                    </div>

                    {/* Course Subjects Grid with Brutalist Progress Bars */}
                    <div className="flex-1 my-3 overflow-y-auto pr-1 space-y-2 relative z-10">
                      {card.subjects.map((sub, sIdx) => {
                        return (
                          <div
                            key={sIdx}
                            className={`p-3 rounded-xl ${theme.subCardBg} border flex flex-col justify-between gap-1.5 transition-colors`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">
                                  {sub.code}
                                </span>
                                <h4 className="text-xs md:text-sm font-bold text-white leading-snug">
                                  {sub.name}
                                </h4>
                              </div>

                              <span className="px-2 py-0.5 text-xs font-black font-mono bg-white text-black border border-white shrink-0">
                                {sub.grade}
                              </span>
                            </div>

                            {/* Brutalist Progress Bar */}
                            <div className="flex items-center gap-3 pt-1 border-t border-white/[0.06]">
                              <div className={`flex-1 h-2 ${theme.progressTrack} rounded-full overflow-hidden p-[1px]`}>
                                <div
                                  data-width={`${sub.total}%`}
                                  style={{ width: `${sub.total}%` }}
                                  className={`sem-progress-bar h-full ${theme.progressBar} rounded-full`}
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-white shrink-0">
                                {sub.total}<span className="text-[10px] text-neutral-400 font-normal">/100</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Footer Info */}
                    <div className={`pt-2.5 border-t ${theme.footerBorder} flex items-center justify-between text-[10px] font-mono text-neutral-400 shrink-0 relative z-10`}>
                      <span>{card.subjects.length} REGISTERED COURSES</span>
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ACADEMIC AUDIT VERIFIED
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* =============================================================== */}
        {/* Bottom Scroll Progress Bar                                      */}
        {/* =============================================================== */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-400 pt-2 shrink-0 border-t border-white/10 relative z-20">
          <span className="font-mono text-[11px] text-neutral-400">
            OFFICIAL TRANSCRIPT RECORDS • MANIPAL UNIVERSITY JAIPUR
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">0{activeSemIndex + 1}</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                style={{ width: `${((activeSemIndex + 1) / transcriptData.length) * 100}%` }}
                className="h-full bg-white rounded-full transition-all duration-300"
              />
            </div>
            <span className="font-mono text-neutral-500">0{transcriptData.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Education;
