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
    timeline: "Jul – Dec 2023",
    sgpa: 9.50,
    status: "Outstanding",
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
    timeline: "Jan – Jun 2024",
    sgpa: 8.55,
    status: "Distinction Honors",
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
    timeline: "Jul – Dec 2024",
    sgpa: 9.11,
    status: "Outstanding",
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
    timeline: "Jan – Jun 2025",
    sgpa: 8.10,
    status: "Distinction Honors",
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

// Alternating Natural Paper and Warm Graphite Stone Themes matching reference design
const semThemes = [
  {
    isDark: false,
    cardBg: 'bg-[#FCFBF9]',
    cardBorder: 'border-black/[0.08]',
    textTitle: 'text-neutral-950',
    textMuted: 'text-neutral-500',
    subCardBg: 'bg-black/[0.025] hover:bg-black/[0.045] border-black/[0.04]',
    subText: 'text-neutral-800',
    pillBg: 'bg-neutral-950 text-white',
    pillIconBg: 'bg-white text-black',
    gradeBadge: 'bg-neutral-950 text-white',
    progressTrack: 'bg-black/[0.07]',
    progressBar: 'bg-neutral-900',
    footerBorder: 'border-black/[0.06]',
    footerText: 'text-neutral-500',
    brandText: 'text-neutral-900',
  },
  {
    isDark: true,
    cardBg: 'bg-[#33302E]',
    cardBorder: 'border-white/[0.12]',
    textTitle: 'text-[#FAF9F5]',
    textMuted: 'text-[#B8B4AC]',
    subCardBg: 'bg-white/[0.06] hover:bg-white/[0.09] border-white/[0.06]',
    subText: 'text-[#F3F2EE]',
    pillBg: 'bg-[#FAF9F5] text-neutral-950',
    pillIconBg: 'bg-neutral-950 text-[#FAF9F5]',
    gradeBadge: 'bg-white text-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-[#FAF9F5]',
    footerBorder: 'border-white/[0.08]',
    footerText: 'text-[#AAA69F]',
    brandText: 'text-[#FAF9F5]',
  },
  {
    isDark: false,
    cardBg: 'bg-[#FFFFFF]',
    cardBorder: 'border-black/[0.08]',
    textTitle: 'text-neutral-950',
    textMuted: 'text-neutral-500',
    subCardBg: 'bg-black/[0.025] hover:bg-black/[0.045] border-black/[0.04]',
    subText: 'text-neutral-800',
    pillBg: 'bg-neutral-950 text-white',
    pillIconBg: 'bg-white text-black',
    gradeBadge: 'bg-neutral-950 text-white',
    progressTrack: 'bg-black/[0.07]',
    progressBar: 'bg-neutral-900',
    footerBorder: 'border-black/[0.06]',
    footerText: 'text-neutral-500',
    brandText: 'text-neutral-900',
  },
  {
    isDark: true,
    cardBg: 'bg-[#2E2C2A]',
    cardBorder: 'border-white/[0.12]',
    textTitle: 'text-[#FAF9F5]',
    textMuted: 'text-[#B8B4AC]',
    subCardBg: 'bg-white/[0.06] hover:bg-white/[0.09] border-white/[0.06]',
    subText: 'text-[#F3F2EE]',
    pillBg: 'bg-[#FAF9F5] text-neutral-950',
    pillIconBg: 'bg-neutral-950 text-[#FAF9F5]',
    gradeBadge: 'bg-white text-black',
    progressTrack: 'bg-white/10',
    progressBar: 'bg-[#FAF9F5]',
    footerBorder: 'border-white/[0.08]',
    footerText: 'text-[#AAA69F]',
    brandText: 'text-[#FAF9F5]',
  },
];

const restTransforms = [
  { rotateZ: -2.8, y: 5 },
  { rotateZ: 1.8, y: -6 },
  { rotateZ: -2.0, y: 4 },
  { rotateZ: 2.6, y: -5 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = gpaData.find(d => d.semester === label);
    return (
      <div className="bg-white text-gray-900 p-3 rounded-xl shadow-xl border border-black/10 font-mono flex flex-col gap-0.5 min-w-[120px]">
        <span className="text-[10px] uppercase text-neutral-500 tracking-wider">{label}</span>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-xl font-black text-neutral-950">{payload[0].value}</span>
          <span className="text-[10px] font-bold text-neutral-500">SGPA</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{item?.status}</span>
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
  const gpaCardRef = useRef(null);
  const peakSgpaRef = useRef(null);
  const topPracticalRef = useRef(null);
  const trajectoryRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    // ScrollTrigger to calculate active semester index during scrub (gated to prevent continuous re-renders)
    let lastActiveIdx = -1;
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        let nextIdx = 0;
        if (self.progress < 0.59) {
          nextIdx = 0;
        } else if (self.progress < 0.69) {
          nextIdx = 1;
        } else {
          nextIdx = 2;
        }
        if (nextIdx !== lastActiveIdx) {
          lastActiveIdx = nextIdx;
          setActiveSemIndex(nextIdx);
        }
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.6
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
      const prevCardTransform = gpaCardRef.current?.style.transform;

      heroEl.style.transform = 'none';
      if (gpaCardRef.current) gpaCardRef.current.style.transform = 'none';

      const heroRect = heroEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      heroEl.style.transform = prevHeroTransform;
      if (gpaCardRef.current && prevCardTransform) gpaCardRef.current.style.transform = prevCardTransform;

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

    // Initialize left-column items offscreen with strong 3D aerodynamic entry angles
    const leftItems = [
      { ref: gpaCardRef, x: "-88vw", y: "44vh", rotZ: -32, rotY: 34 },
      { ref: peakSgpaRef, x: "-76vw", y: "48vh", rotZ: -28, rotY: 30 },
      { ref: topPracticalRef, x: "-68vw", y: "52vh", rotZ: -24, rotY: 26 },
      { ref: trajectoryRef, x: "-88vw", y: "56vh", rotZ: -34, rotY: 36 }
    ];

    leftItems.forEach(({ ref, x, y, rotZ, rotY }) => {
      if (!ref.current) return;
      gsap.set(ref.current, {
        x,
        y,
        rotateZ: rotZ,
        rotateY: rotY,
        rotateX: 14,
        scale: 0.66,
        opacity: 0,
        transformOrigin: "center center"
      });
    });

    // Initialize cards offscreen at bottom-right corner with strong 3D momentum pitch & yaw
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      gsap.set(card, {
        x: "96vw",
        y: "50vh",
        rotateZ: 42 + idx * 6,
        rotateY: -35,
        rotateX: 20,
        scale: 0.65,
        opacity: 0,
        transformOrigin: "center center"
      });
    });

    // 1. Hero text badges fade out gently
    tl.to([heroBadgeRef.current, heroSubtextRef.current], {
      opacity: 0,
      y: -25,
      duration: 0.8,
      ease: "power2.in"
    }, 0);

    // 2. The surrounding command stage fades in smoothly
    tl.fromTo(mainStageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      0.25
    );

    // 3. SEQUENTIAL ENTRANCE OF LEFT-COLUMN ITEMS
    // 3a. Cumulative GPA Card sweeps in smoothly from bottom-left corner to meet the morphing 8.82
    if (gpaCardRef.current) {
      tl.to(gpaCardRef.current, {
        x: 0,
        y: 0,
        rotateZ: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 1.70,
        ease: "power2.out"
      }, 0.30);
    }

    // 3b. The Big 8.82 physically glides, scales down, and docks with pixel precision directly into target slot
    tl.to(heroNumberRef.current, {
      x: () => morphDelta.x,
      y: () => morphDelta.y,
      scale: () => morphDelta.scale,
      duration: 1.70,
      ease: "power2.inOut"
    }, 0.30);

    // Seamless Handover: At exact docking moment, crossfade smoothly from hero 8.82 to native slot
    tl.to(heroNumberRef.current, {
      opacity: 0,
      duration: 0.18,
      ease: "power1.out"
    }, 1.90);

    tl.to(targetSlotRef.current, {
      opacity: 1,
      duration: 0.18,
      ease: "power1.in"
    }, 1.90);

    // 3c. Peak SGPA tile sweeps in with lively harmonic bounce
    if (peakSgpaRef.current) {
      tl.to(peakSgpaRef.current, {
        keyframes: [
          { x: 26, y: -16, rotateZ: 4.8, rotateY: -8, scale: 1.095, opacity: 1, duration: 1.25, ease: "power2.out" },
          { x: -10, y: 8, rotateZ: -2.2, rotateY: 3.2, scale: 0.96, duration: 0.58, ease: "power1.inOut" },
          { x: 4, y: -3, rotateZ: 0.9, rotateY: -1.2, scale: 1.015, duration: 0.42, ease: "sine.inOut" },
          { x: 0, y: 0, rotateZ: 0, rotateY: 0, scale: 1, duration: 0.35, ease: "sine.out" }
        ]
      }, 0.65);
    }

    // 3d. Top Practical tile sweeps in with lively harmonic bounce
    if (topPracticalRef.current) {
      tl.to(topPracticalRef.current, {
        keyframes: [
          { x: 26, y: -16, rotateZ: 4.8, rotateY: -8, scale: 1.095, opacity: 1, duration: 1.25, ease: "power2.out" },
          { x: -10, y: 8, rotateZ: -2.2, rotateY: 3.2, scale: 0.96, duration: 0.58, ease: "power1.inOut" },
          { x: 4, y: -3, rotateZ: 0.9, rotateY: -1.2, scale: 1.015, duration: 0.42, ease: "sine.inOut" },
          { x: 0, y: 0, rotateZ: 0, rotateY: 0, scale: 1, duration: 0.35, ease: "sine.out" }
        ]
      }, 0.88);
    }

    // 3e. Trajectory Curve card sweeps in with deep momentum bounce
    if (trajectoryRef.current) {
      tl.to(trajectoryRef.current, {
        keyframes: [
          { x: 32, y: -22, rotateZ: 5.5, rotateY: -9, scale: 1.085, opacity: 1, duration: 1.35, ease: "power2.out" },
          { x: -14, y: 10, rotateZ: -2.8, rotateY: 4, scale: 0.962, duration: 0.62, ease: "power1.inOut" },
          { x: 6, y: -4, rotateZ: 1.1, rotateY: -1.5, scale: 1.018, duration: 0.45, ease: "sine.inOut" },
          { x: 0, y: 0, rotateZ: 0, rotateY: 0, scale: 1, duration: 0.38, ease: "sine.out" }
        ]
      }, 1.05);
    }

    // 4. Slide all semester cards in from right corner with maximum 3D aerodynamic flight & 4-stage harmonic damped bounce
    tl.to(cardsRef.current, {
      keyframes: [
        // Phase 1: High-velocity inertial sweep cutting through 3D space, massive overshoot past target
        {
          x: -38,
          y: (i) => (restTransforms[i]?.y || 0) - 26,
          rotateZ: (i) => (restTransforms[i]?.rotateZ || 0) - (10 - i * 2.2),
          rotateY: 15,
          rotateX: -5.5,
          scale: 1.095,
          opacity: 1,
          duration: 1.45,
          ease: "power2.out"
        },
        // Phase 2: Vigorous elastic spring recoil absorbing kinetic momentum
        {
          x: 16,
          y: (i) => (restTransforms[i]?.y || 0) + 12,
          rotateZ: (i) => (restTransforms[i]?.rotateZ || 0) + (5.5 - i * 1.3),
          rotateY: -6.5,
          rotateX: 3,
          scale: 0.955,
          duration: 0.65,
          ease: "power1.inOut"
        },
        // Phase 3: Secondary harmonic spring wobble
        {
          x: -7,
          y: (i) => (restTransforms[i]?.y || 0) - 5,
          rotateZ: (i) => (restTransforms[i]?.rotateZ || 0) - (2.2 - i * 0.5),
          rotateY: 2.5,
          rotateX: -1.2,
          scale: 1.02,
          duration: 0.46,
          ease: "sine.inOut"
        },
        // Phase 4: Fine micro-decay settling smoothly to resting equilibrium
        {
          x: 0,
          y: (i) => restTransforms[i]?.y || 0,
          rotateZ: (i) => restTransforms[i]?.rotateZ || 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.38,
          ease: "sine.out"
        }
      ],
      stagger: 0.16
    }, 0.60);

    // 5. All course progress bars surge simultaneously once landed
    const allBars = containerRef.current.querySelectorAll('.sem-progress-bar');
    allBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-width') || '0%';
      tl.fromTo(bar,
        { width: "0%" },
        { width: targetWidth, duration: 1.1, ease: "power2.out" },
        2.50
      );
    });

    // 6. Viewing dwell period across Sem 1 and Sem 2
    tl.to({}, { duration: 1.4 });

    // 7. EXIT ANIMATION: On scroll when Sem 3 card is selected, move all cards out of the viewport from the left corner
    const exitStartTime = 5.40;

    // 7a. All semester cards fly across and sweep out through the left corner with 3D aerodynamic velocity
    tl.to(cardsRef.current, {
      x: "-120vw",
      y: "45vh",
      rotateZ: (i) => -32 - (i * 4),
      rotateY: 28,
      rotateX: 12,
      scale: 0.65,
      opacity: 0,
      duration: 1.6,
      ease: "power2.in",
      stagger: 0.10
    }, exitStartTime);

    // 7b. Left-column overview cards (Cumulative GPA, Peak SGPA, Top Practical, Trajectory) sweep out through the left corner
    const leftExitTargets = [
      { ref: gpaCardRef, x: "-95vw", y: "42vh", rotZ: -28, rotY: 24 },
      { ref: peakSgpaRef, x: "-85vw", y: "46vh", rotZ: -25, rotY: 22 },
      { ref: topPracticalRef, x: "-78vw", y: "50vh", rotZ: -22, rotY: 20 },
      { ref: trajectoryRef, x: "-95vw", y: "54vh", rotZ: -30, rotY: 26 }
    ];

    leftExitTargets.forEach(({ ref, x, y, rotZ, rotY }, i) => {
      if (ref.current) {
        tl.to(ref.current, {
          x,
          y,
          rotateZ: rotZ,
          rotateY: rotY,
          rotateX: 10,
          scale: 0.65,
          opacity: 0,
          duration: 1.4,
          ease: "power2.in"
        }, exitStartTime + i * 0.05);
      }
    });

    // 7c. Main stage fades out smoothly as cards exit offscreen
    if (mainStageRef.current) {
      tl.to(mainStageRef.current, {
        opacity: 0,
        duration: 1.0,
        ease: "power2.in"
      }, exitStartTime + 0.8);
    }

    // 7d. Terminal buffer before releasing the sticky pin to Experience section
    tl.to({}, { duration: 0.5 });

    return () => {
      scrollTriggerInstance.kill();
    };

  }, { scope: containerRef });

  return (
    <div
      id="education"
      ref={containerRef}
      className="relative w-full h-[480vh] bg-[#fafafc] text-gray-900 selection:bg-black selection:text-white font-sans rounded-t-[44px] md:rounded-t-[64px] border-t border-black/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] -mt-16 md:-mt-24 z-30"
    >
      {/* Sticky Fullscreen Stage (Anchored down to bottom of viewport) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 md:pt-26 pb-1 sm:pb-2 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 select-none bg-[#fafafc]">

        {/* Dynamic Ambient Background Glow from Contact Us Theme */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-gradient-to-br from-purple-200/35 via-pink-200/20 to-transparent rounded-full blur-[90px] md:blur-[130px] -translate-x-1/4 -translate-y-1/4 opacity-60" />
          <div className="absolute w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-gradient-to-tl from-cyan-200/35 via-blue-100/20 to-transparent rounded-full blur-[90px] md:blur-[130px] translate-x-1/3 translate-y-1/4 opacity-60" />
        </div>

        {/* HERO 8.82 OVERLAY: Monumental Number centered below navbar */}
        <div className="absolute inset-0 pointer-events-none z-40 flex flex-col items-center justify-center pt-16 sm:pt-20">

          <div ref={heroBadgeRef} className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-4 text-center">
            <span className="px-3.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-neutral-800 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-md max-w-[90vw]">
              MANIPAL UNIVERSITY JAIPUR • CLASS OF 2027
            </span>
          </div>

          {/* The BIG 8.82 Monolith */}
          <div
            ref={heroNumberRef}
            style={{ transformOrigin: 'center center' }}
            className="text-[18vw] sm:text-[16vw] md:text-[15vw] font-black tracking-tighter text-neutral-950 leading-none select-none will-change-transform will-change-opacity"
          >
            8.82
          </div>

          <div ref={heroSubtextRef} className="flex flex-col items-center gap-2 sm:gap-3 mt-2 sm:mt-3 px-4 text-center">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 text-xs sm:text-sm md:text-base font-mono text-neutral-600 uppercase tracking-widest">
              <span>Cumulative GPA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-900 font-bold">Distinction Honors</span>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-500">
              <span>Scroll to explore</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>

        </div>

        {/* Top Header Row (Spans full viewport width) */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-black/[0.08] shrink-0 relative z-20">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-black text-white font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
                Manipal University Jaipur
              </span>
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-neutral-700 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
                BCA
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-neutral-950 tracking-tighter uppercase leading-none">
              Academic Excellence
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile View Toggle Switcher (< md) */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-black/[0.04] border border-black/[0.08] rounded-full text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setMobileTab('vault')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${mobileTab === 'vault' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'}`}
              >
                Semesters
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('trajectory')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${mobileTab === 'trajectory' ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:text-black'}`}
              >
                Trajectory
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 sm:px-3.5 bg-white border border-black/10 shadow-xs rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-900">{transcriptData[activeSemIndex]?.sem || transcriptData[0]?.sem} Active</span>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* Main Dual Stage (Overview on Left + Compact Vertical Row)       */}
        {/* =============================================================== */}
        <div
          ref={mainStageRef}
          className="w-full flex-1 flex flex-col lg:flex-row gap-4 lg:gap-5 my-1.5 overflow-hidden items-stretch relative z-10 opacity-0"
        >
          {/* Left Column (Spacious Cumulative GPA, Metrics, Trajectory) */}
          <div className="w-full lg:w-[350px] xl:w-[390px] 2xl:w-[420px] shrink-0 flex flex-col gap-3.5 justify-between h-full max-h-[70vh] md:max-h-[72vh] [perspective:1400px]">

            {/* Cumulative GPA Card (Destination of the Morphing 8.82) */}
            <div
              ref={gpaCardRef}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_6px_20px_rgba(0,0,0,0.035)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:scale-[1.015] sem-card-spring flex flex-col justify-between relative overflow-hidden shrink-0 will-change-transform cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-medium">
                  Cumulative GPA
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider">
                  Distinction Honors
                </span>
              </div>

              {/* Destination Slot */}
              <div className="flex items-baseline gap-2.5 my-1">
                <div
                  ref={targetSlotRef}
                  className="text-5xl md:text-6xl font-black tracking-tighter text-neutral-950 leading-none select-none opacity-0 will-change-opacity"
                >
                  8.82
                </div>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-400">/ 10.0</span>
              </div>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-mono leading-relaxed">
                Maintained across all completed semesters in Core Computer Science, Software Engineering, and Mathematics.
              </p>
            </div>

            {/* Quick Metrics & Trajectory Area Chart */}
            <div className={`${mobileTab === 'trajectory' ? 'flex' : 'hidden'} md:flex flex-col gap-3.5 flex-1 justify-between`}>
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div
                  ref={peakSgpaRef}
                  className="p-3.5 sm:p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_3px_10px_rgba(0,0,0,0.025)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)] hover:-translate-y-2 hover:scale-[1.03] sem-card-spring will-change-transform cursor-pointer"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase block font-medium">Peak SGPA</span>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 block mt-1 font-mono">9.50</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Semester 01</span>
                </div>
                <div
                  ref={topPracticalRef}
                  className="p-3.5 sm:p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_3px_10px_rgba(0,0,0,0.025)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)] hover:-translate-y-2 hover:scale-[1.03] sem-card-spring will-change-transform cursor-pointer"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase block font-medium">Top Practical</span>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 block mt-1 font-mono">100/100</span>
                  <span className="text-[10px] text-neutral-500 font-mono">System Software Lab</span>
                </div>
              </div>

              {/* Trajectory Area Chart */}
              <div
                ref={trajectoryRef}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_6px_20px_rgba(0,0,0,0.035)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:scale-[1.015] sem-card-spring flex-1 flex flex-col justify-between will-change-transform cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-mono font-bold text-neutral-950 uppercase tracking-wider">
                    Trajectory Curve
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">Range: 6.0 – 10.0</span>
                </div>

                <div className="w-full h-[115px] md:h-[130px] xl:h-[145px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={gpaData}
                      margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                      <XAxis
                        dataKey="semester"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#737373', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}
                      />
                      <YAxis
                        domain={[6, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#8C8C8C', fontSize: 9, fontFamily: 'monospace' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="cgpa"
                        stroke="#111111"
                        strokeWidth={2.2}
                        fill="url(#gpaGradient)"
                        activeDot={{ r: 5, fill: '#111111', stroke: '#FFFFFF', strokeWidth: 2 }}
                        dot={{ r: 3.5, fill: '#111111' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/[0.08] text-[10px] font-mono text-neutral-500">
                  {transcriptData.map((d, i) => (
                    <span
                      key={i}
                      className={`transition-colors duration-200 ${activeSemIndex === i ? 'text-black font-bold underline underline-offset-4' : ''}`}
                    >
                      {d.sem}: {d.sgpa}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 4 Editorial Cards Lifted Up Comfortably from Viewport Bottom */}
          <div className={`${mobileTab === 'vault' ? 'flex' : 'hidden'} md:flex flex-1 min-w-0 h-full items-end justify-center [perspective:1400px]`}>

            <div className="w-full flex gap-3 xl:gap-4 items-end justify-center overflow-x-auto lg:overflow-visible pb-7 sm:pb-9 md:pb-12 mb-1 sm:mb-2">
              {transcriptData.map((card, idx) => {
                const theme = semThemes[idx % semThemes.length];
                const isActive = activeSemIndex === idx;
                return (
                  <div
                    key={card.sem}
                    ref={el => cardsRef.current[idx] = el}
                    className="flex-shrink-0 w-[210px] sm:w-[225px] lg:flex-shrink lg:flex-1 lg:max-w-[270px] will-change-transform"
                    style={{ zIndex: 10 + idx }}
                  >
                    {/* Organic Floating Wrapper (Continuous Asynchronous Elevation) */}
                    <div className={`sem-card-floating-wrapper animate-sem-float-${idx} w-full`}>

                      {/* Tactile Editorial Card with Bouncy Spring Physics */}
                      <div
                        onMouseEnter={() => setActiveSemIndex(idx)}
                        className={`group w-full h-[400px] sm:h-[430px] md:h-[460px] lg:h-[480px] max-h-[66vh] md:max-h-[68vh] ${theme.cardBg} rounded-[24px] sm:rounded-[28px] border ${theme.cardBorder} ${isActive
                            ? (theme.isDark ? 'ring-2 ring-white/90 shadow-[0_24px_50px_rgba(0,0,0,0.30)]' : 'ring-2 ring-black/80 shadow-[0_24px_50px_rgba(0,0,0,0.14)]')
                            : (theme.isDark ? 'shadow-[0_16px_36px_rgba(0,0,0,0.20)]' : 'shadow-[0_14px_34px_rgba(0,0,0,0.06)]')
                          } ${theme.isDark
                            ? 'hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)]'
                            : 'hover:shadow-[0_28px_56px_rgba(0,0,0,0.16)]'
                          } hover:-translate-y-4 hover:scale-[1.035] hover:rotate-0 hover:z-30 p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer will-change-transform sem-card-spring`}
                      >
                        {/* Top Bar: Semester Timeline + Contact-Style Pill Badge */}
                        <div className={`pb-2 border-b ${theme.footerBorder} shrink-0 relative z-10`}>
                          <div className="flex items-center justify-between">
                            {/* Semester Timeline */}
                            <div className={`flex items-center gap-1.5 text-[9.5px] xl:text-[10.5px] font-mono font-medium ${theme.textMuted} select-none`}>
                              <svg className="w-3 h-3 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="tracking-tight">{card.timeline}</span>
                            </div>

                            {/* Top-Right Pill Action Badge */}
                            <div className={`px-2.5 py-0.5 rounded-full ${theme.pillBg} flex items-center gap-1.5 shadow-xs transition-transform group-hover:scale-105`}>
                              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">
                                {card.sgpa} SGPA
                              </span>
                              <span className={`w-3.5 h-3.5 rounded-full ${theme.pillIconBg} flex items-center justify-center text-[7px] font-black`}>
                                ↗
                              </span>
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between mt-1">
                            <h3 className={`text-base xl:text-lg font-black ${theme.textTitle} tracking-tight`}>
                              {card.sem}
                            </h3>
                            <span className={`text-[9px] font-mono ${theme.textMuted}`}>{card.status}</span>
                          </div>
                        </div>

                        {/* Course Subjects Grid with Progress Bars */}
                        <div className="flex-1 my-1.5 overflow-y-auto pr-0.5 space-y-1 relative z-10">
                          {card.subjects.map((sub, sIdx) => {
                            return (
                              <div
                                key={sIdx}
                                className={`p-1.5 rounded-lg ${theme.subCardBg} border flex flex-col justify-between gap-0.5 transition-colors`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <div className="min-w-0 flex-1">
                                    <span className={`text-[8px] font-mono ${theme.textMuted} uppercase tracking-wider block`}>
                                      {sub.code}
                                    </span>
                                    <h4 className={`text-[10px] xl:text-[11px] font-bold ${theme.subText} leading-tight truncate`} title={sub.name}>
                                      {sub.name}
                                    </h4>
                                  </div>

                                  <span className={`px-1 py-0.2 text-[8px] font-black font-mono ${theme.gradeBadge} rounded-xs`}>
                                    {sub.grade}
                                  </span>
                                </div>

                                {/* Progress Bar */}
                                <div className={`flex items-center gap-1.5 pt-0.5 border-t ${theme.footerBorder}`}>
                                  <div className={`flex-1 h-1 ${theme.progressTrack} rounded-full overflow-hidden`}>
                                    <div
                                      data-width={`${sub.total}%`}
                                      style={{ width: `${sub.total}%` }}
                                      className={`sem-progress-bar h-full ${theme.progressBar} rounded-full`}
                                    />
                                  </div>
                                  <span className={`text-[9px] font-mono font-bold ${theme.subText} shrink-0`}>
                                    {sub.total}<span className={`text-[8px] ${theme.textMuted} font-normal`}>/100</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bottom Footer: Brand Mark + Completed Status */}
                        <div className={`pt-1.5 border-t ${theme.footerBorder} flex items-center justify-between text-[9px] font-mono shrink-0 relative z-10`}>
                          <span className={`font-black tracking-tight ${theme.brandText}`}>Manipal Univ.</span>
                          <span className={`flex items-center gap-1 ${theme.footerText}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Completed
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* =============================================================== */}
        {/* Bottom Scroll Progress Bar (Snug against viewport bottom)       */}
        {/* =============================================================== */}
        <div className="w-full flex items-center justify-end text-xs text-neutral-500 pt-1 pb-0.5 shrink-0 border-t border-black/[0.06] relative z-20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950 font-mono">0{activeSemIndex + 1}</span>
            <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${((activeSemIndex + 1) / transcriptData.length) * 100}%` }}
                className="h-full bg-black rounded-full transition-all duration-300"
              />
            </div>
            <span className="font-mono text-neutral-400">0{transcriptData.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Education;
