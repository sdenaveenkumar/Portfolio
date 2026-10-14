import React, { useRef, useState, useEffect } from 'react';
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
  { semester: 'Sem 5', cgpa: 9.00, status: 'Outstanding' },
];

const transcriptData = [
  {
    sem: "Semester 1",
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
    sem: "Semester 2",
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
    sem: "Semester 3",
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
    sem: "Semester 4",
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
  },
  {
    sem: "Semester 5",
    timeline: "Jul – Dec 2025",
    sgpa: 9.00,
    status: "Outstanding",
    subjects: [
      { code: "DCA3101", name: "Web Design", total: 83, grade: "A" },
      { code: "DCA3102", name: "Visual Programming", total: 76, grade: "B+" },
      { code: "DCA3103", name: "Software Engineering", total: 90, grade: "A+" },
      { code: "DCA3104", name: "Python Programming", total: 76, grade: "B+" },
      { code: "DCA3130", name: "Visual Programming – Practical", total: 89, grade: "A" },
      { code: "DCA3131", name: "Web Design – Practical", total: 82, grade: "A" },
      { code: "DCA3132", name: "Python Programming – Practical", total: 84, grade: "A" },
      { code: "DCA3141", name: "Compiler Design", total: 93, grade: "A+" }
    ]
  },
  {
    sem: "Semester 6",
    timeline: "Jan – Jun 2026",
    isCurrentSem: true,
    status: "Ongoing",
    subjects: []
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
  { rotateZ: 0, y: 0 },
  { rotateZ: 0, y: 0 },
  { rotateZ: 0, y: 0 },
  { rotateZ: 0, y: 0 },
  { rotateZ: 0, y: 0 },
  { rotateZ: 0, y: 0 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = gpaData.find(d => d.semester === label);
    return (
      <div className="bg-white text-gray-900 p-3 rounded-xl shadow-xl border border-black/10 font-mono flex flex-col gap-0.5 min-w-[120px]">
        <span className="text-[10px] uppercase text-neutral-500 tracking-wider">{label}</span>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-xl font-black text-neutral-950">
            {typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}
          </span>
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoProgress, setAutoProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setAutoProgress(100);
      return;
    }

    const duration = 3500; // 3.5s cycle per semester
    const intervalTime = 35;
    const step = (intervalTime / duration) * 100;

    let currentProgress = 0;
    setAutoProgress(0);

    const timer = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setActiveSemIndex(curr => (curr + 1) % transcriptData.length);
      } else {
        setAutoProgress(currentProgress);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeSemIndex]);

  const handleSelectSemester = (index) => {
    setActiveSemIndex(index);
    setAutoProgress(0);
  };

  const containerRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroNumberRef = useRef(null);
  const heroSubtextRef = useRef(null);
  const targetSlotRef = useRef(null);
  const mainStageRef = useRef(null);
  const leftColRef = useRef(null);
  const gpaCardRef = useRef(null);
  const peakSgpaRef = useRef(null);
  const topPracticalRef = useRef(null);
  const trajectoryRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Dynamic Morph of the Big 8.85 directly into Target Slot
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

      const scale = heroRect.width > 0 ? (targetRect.width / heroRect.width) : 0.35;

      return {
        x: targetCenterX - heroCenterX,
        y: targetCenterY - heroCenterY,
        scale
      };
    };

    let morphDelta = getMorphDelta();
    ScrollTrigger.addEventListener("refreshInit", () => {
      morphDelta = getMorphDelta();
    });

    // ==============================================================
    // 1. DESKTOP & TABLET ANIMATION (min-width: 768px) - 100% UNTOUCHED
    // ==============================================================
    mm.add("(min-width: 768px)", () => {
      let lastActiveIdx = -1;
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          if (self.progress < 0.32) {
            if (lastActiveIdx !== 0) {
              lastActiveIdx = 0;
              setActiveSemIndex(0);
            }
          } else {
            const range = Math.min(1, Math.max(0, (self.progress - 0.32) / 0.62));
            const totalSems = transcriptData.length;
            const nextIdx = Math.min(totalSems - 1, Math.floor(range * totalSems));
            if (nextIdx !== lastActiveIdx) {
              lastActiveIdx = nextIdx;
              setActiveSemIndex(nextIdx);
            }
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

      // 4. Ultra-smooth aerodynamic glide of 8.85 into the destination card slot
      tl.to(heroNumberRef.current, {
        keyframes: [
          // Phase 1: Gentle lift and smooth arc towards incoming card
          {
            x: () => morphDelta.x * 0.45,
            y: () => morphDelta.y * 0.50 - 18,
            scale: () => 1 - (1 - morphDelta.scale) * 0.38,
            duration: 0.95,
            ease: "sine.inOut"
          },
          // Phase 2: Gentle cushion settle right into the exact pixel position
          {
            x: () => morphDelta.x,
            y: () => morphDelta.y,
            scale: () => morphDelta.scale,
            duration: 1.05,
            ease: "power2.out"
          }
        ]
      }, 0.20);

      // Seamless Handover crossfade: 100% invisible transition
      tl.to(heroNumberRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power1.out"
      }, 2.15);

      tl.to(targetSlotRef.current, {
        opacity: 1,
        duration: 0.22,
        ease: "power1.in"
      }, 2.15);

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

      tl.to(cardsRef.current, {
        keyframes: [
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

      const allBars = containerRef.current.querySelectorAll('.sem-progress-bar');
      allBars.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width') || '0%';
        tl.fromTo(bar,
          { width: "0%" },
          { width: targetWidth, duration: 1.1, ease: "power2.out" },
          2.50
        );
      });

      tl.to({}, { duration: 1.4 });

      const exitStartTime = 5.40;

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

      if (mainStageRef.current) {
        tl.to(mainStageRef.current, {
          opacity: 0,
          duration: 1.0,
          ease: "power2.in"
        }, exitStartTime + 0.8);
      }

      tl.to({}, { duration: 0.5 });
    });

    // ==============================================================
    // 2. MOBILE ANIMATION (max-width: 767px) - FAN MODE
    // ==============================================================
    mm.add("(max-width: 767px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.30) {
            setActiveSemIndex(0);
          } else if (p < 0.44) {
            setActiveSemIndex(1);
          } else if (p < 0.58) {
            setActiveSemIndex(2);
          } else if (p < 0.72) {
            setActiveSemIndex(3);
          } else if (p < 0.86) {
            setActiveSemIndex(4);
          } else {
            setActiveSemIndex(5);
          }
        }
      });

      const mtl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1 // Responsive, tactile scrub with smooth tracking
        }
      });

      // Initialize mobile trajectory components offscreen with 3D aerodynamic flight angles
      const mobileLeftItems = [
        { ref: gpaCardRef, x: "-80vw", y: "30vh", rotZ: -28, rotY: 24 },
        { ref: peakSgpaRef, x: "-70vw", y: "34vh", rotZ: -24, rotY: 20 },
        { ref: topPracticalRef, x: "-64vw", y: "38vh", rotZ: -20, rotY: 18 },
        { ref: trajectoryRef, x: "-80vw", y: "42vh", rotZ: -30, rotY: 26 }
      ];

      mobileLeftItems.forEach(({ ref, x, y, rotZ, rotY }) => {
        if (!ref.current) return;
        gsap.set(ref.current, {
          x,
          y,
          rotateZ: rotZ,
          rotateY: rotY,
          rotateX: 12,
          scale: 0.70,
          opacity: 0,
          transformOrigin: "center center"
        });
      });

      // Initialize all cards parked offscreen at DOWN RIGHT CORNER with bottom-handle fan pivot (50% 125%)
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.set(card, {
          x: "60vw",
          y: "32vh",
          rotateZ: 48 + idx * 2,
          rotateY: -16,
          rotateX: 6,
          scale: 0.82,
          opacity: 0,
          transformOrigin: "50% 125%"
        });
      });

      // 1. Hero text badges fade out
      mtl.to([heroBadgeRef.current, heroSubtextRef.current], {
        opacity: 0,
        y: -18,
        duration: 0.7,
        ease: "power2.in"
      }, 0);

      // 2. Main stage fades in
      mtl.fromTo(mainStageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: "power2.out" },
        0.2
      );

      // 3. Cumulative GPA Card sweeps in smoothly from bottom-left corner to meet the morphing 8.85
      if (gpaCardRef.current) {
        mtl.to(gpaCardRef.current, {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "back.out(1.8)"
        }, 0.25);
      }

      // 4. Ultra-smooth glide of 8.85 on mobile into the card slot
      mtl.to(heroNumberRef.current, {
        keyframes: [
          {
            x: () => morphDelta.x * 0.45,
            y: () => morphDelta.y * 0.50 - 12,
            scale: () => 1 - (1 - morphDelta.scale) * 0.38,
            duration: 0.90,
            ease: "sine.inOut"
          },
          {
            x: () => morphDelta.x,
            y: () => morphDelta.y,
            scale: () => morphDelta.scale,
            duration: 1.00,
            ease: "power2.out"
          }
        ]
      }, 0.20);

      // Seamless Handover crossfade:
      mtl.to(heroNumberRef.current, { opacity: 0, duration: 0.20, ease: "power1.out" }, 2.05);
      mtl.to(targetSlotRef.current, { opacity: 1, duration: 0.20, ease: "power1.in" }, 2.05);

      // 5. Peak SGPA tile sweeps in with lively spring bounce
      if (peakSgpaRef.current) {
        mtl.to(peakSgpaRef.current, {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "back.out(2.0)"
        }, 0.55);
      }

      // 6. Top Practical tile sweeps in with lively spring bounce
      if (topPracticalRef.current) {
        mtl.to(topPracticalRef.current, {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "back.out(2.0)"
        }, 0.75);
      }

      // 7. Trajectory Curve card sweeps in with deep momentum spring bounce
      if (trajectoryRef.current) {
        mtl.to(trajectoryRef.current, {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)"
        }, 0.95);
      }

      // FIRST: TRAJECTORY SECTION IS FULLY VISIBLE & DWELLS IN VIEWPORT
      mtl.to({}, { duration: 1.8 });

      // Transition Trajectory Section out towards top
      if (leftColRef.current) {
        mtl.to(leftColRef.current, {
          y: "-50vh",
          opacity: 0,
          scale: 0.92,
          pointerEvents: "none",
          duration: 1.4,
          ease: "power2.inOut"
        });
      }

      // CARD 1 (Sem 1):
      // 1a. Card 1 sweeps in from DOWN RIGHT CORNER along fan arc with elastic spring bounce & docks
      if (cardsRef.current[0]) {
        mtl.to(cardsRef.current[0], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics as fan blade snaps upright
        }, "-=0.8");

        const bars0 = cardsRef.current[0].querySelectorAll('.sem-progress-bar');
        if (bars0.length > 0) {
          mtl.fromTo(bars0,
            { width: "0%" },
            {
              width: (i, target) => target.getAttribute('data-width') || '100%',
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out"
            },
            "-=0.9"
          );
        }

        // Card 1 sticks to viewport for reading
        mtl.to({}, { duration: 1.6 });

        // 1b. Card 1 slides like a fan blade along arc to the DOWN LEFT CORNER while Card 2 arrives
        mtl.to(cardsRef.current[0], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut"
        });
      }

      // CARD 2 (Sem 2):
      // 2a. Card 2 sweeps in from DOWN RIGHT CORNER along fan arc while Card 1 fans to down-left
      if (cardsRef.current[1]) {
        mtl.to(cardsRef.current[1], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics
        }, "<+=0.2");

        const bars1 = cardsRef.current[1].querySelectorAll('.sem-progress-bar');
        if (bars1.length > 0) {
          mtl.fromTo(bars1,
            { width: "0%" },
            {
              width: (i, target) => target.getAttribute('data-width') || '100%',
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out"
            },
            "-=0.9"
          );
        }

        // Card 2 sticks to viewport
        mtl.to({}, { duration: 1.6 });

        // 2b. Card 2 slides like a fan blade along arc to the DOWN LEFT CORNER while Card 3 arrives
        mtl.to(cardsRef.current[1], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut"
        });
      }

      // CARD 3 (Sem 3):
      // 3a. Card 3 sweeps in from DOWN RIGHT CORNER along fan arc while Card 2 fans to down-left
      if (cardsRef.current[2]) {
        mtl.to(cardsRef.current[2], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics
        }, "<+=0.2");

        const bars2 = cardsRef.current[2].querySelectorAll('.sem-progress-bar');
        if (bars2.length > 0) {
          mtl.fromTo(bars2,
            { width: "0%" },
            {
              width: (i, target) => target.getAttribute('data-width') || '100%',
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out"
            },
            "-=0.9"
          );
        }

        // Card 3 sticks to viewport
        mtl.to({}, { duration: 1.6 });

        // 3b. Card 3 slides like a fan blade along arc to the DOWN LEFT CORNER while Card 4 arrives
        mtl.to(cardsRef.current[2], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut"
        });
      }

      // CARD 4 (Sem 4):
      // 4a. Card 4 sweeps in from DOWN RIGHT CORNER along fan arc while Card 3 fans to down-left
      if (cardsRef.current[3]) {
        mtl.to(cardsRef.current[3], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics
        }, "<+=0.2");

        const bars3 = cardsRef.current[3].querySelectorAll('.sem-progress-bar');
        if (bars3.length > 0) {
          mtl.fromTo(bars3,
            { width: "0%" },
            {
              width: (i, target) => target.getAttribute('data-width') || '100%',
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out"
            },
            "-=0.9"
          );
        }

        // Card 4 sticks to viewport
        mtl.to({}, { duration: 1.6 });

        // 4b. Card 4 slides like a fan blade along arc to the DOWN LEFT CORNER while Card 5 arrives
        mtl.to(cardsRef.current[3], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut"
        });
      }

      // CARD 5 (Sem 5):
      // 5a. Card 5 sweeps in from DOWN RIGHT CORNER along fan arc while Card 4 fans to down-left
      if (cardsRef.current[4]) {
        mtl.to(cardsRef.current[4], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics
        }, "<+=0.2");

        const bars4 = cardsRef.current[4].querySelectorAll('.sem-progress-bar');
        if (bars4.length > 0) {
          mtl.fromTo(bars4,
            { width: "0%" },
            {
              width: (i, target) => target.getAttribute('data-width') || '100%',
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out"
            },
            "-=0.9"
          );
        }

        // Card 5 sticks to viewport for reading
        mtl.to({}, { duration: 1.6 });

        // 5b. Card 5 slides like a fan blade along arc to the DOWN LEFT CORNER while Card 6 arrives
        mtl.to(cardsRef.current[4], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut"
        });
      }

      // CARD 6 (Sem 6):
      // 6a. Card 6 sweeps in from DOWN RIGHT CORNER along fan arc while Card 5 fans to down-left
      if (cardsRef.current[5]) {
        mtl.to(cardsRef.current[5], {
          x: 0,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.7,
          ease: "back.out(2.2)" // Elastic spring bounce physics
        }, "<+=0.2");

        // Card 6 sticks to viewport for reading
        mtl.to({}, { duration: 1.6 });

        // 6b. Card 6 slides like a fan blade along arc to the DOWN LEFT CORNER and exits
        mtl.to(cardsRef.current[5], {
          x: "-60vw",
          y: "32vh",
          rotateZ: -48,
          rotateY: 16,
          scale: 0.82,
          opacity: 0,
          duration: 1.6,
          ease: "power2.in"
        });
      }

      // Main stage fades out cleanly before unpinning
      if (mainStageRef.current) {
        mtl.to(mainStageRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.in"
        }, "-=0.6");
      }

      mtl.to({}, { duration: 0.5 });
    });

    return () => {
      mm.revert();
    };
  }, { scope: containerRef });

  return (
    <div
      id="education"
      ref={containerRef}
      className="relative w-full h-[620vh] bg-[#fafafc] text-gray-900 selection:bg-black selection:text-white font-sans rounded-t-[44px] md:rounded-t-[64px] border-t border-black/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] -mt-16 md:-mt-24 z-30"
    >
      {/* Sticky Fullscreen Stage (Vertically centered in viewport) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center pt-14 sm:pt-16 md:pt-14 pb-8 sm:pb-10 md:pb-12 px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 select-none bg-[#fafafc]">

        {/* Dynamic Ambient Background Glow from Contact Us Theme */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-gradient-to-br from-purple-200/35 via-pink-200/20 to-transparent rounded-full blur-[90px] md:blur-[130px] -translate-x-1/4 -translate-y-1/4 opacity-60" />
          <div className="absolute w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-gradient-to-tl from-cyan-200/35 via-blue-100/20 to-transparent rounded-full blur-[90px] md:blur-[130px] translate-x-1/3 translate-y-1/4 opacity-60" />
        </div>

        {/* 3D Spotlight Carousel Styles (Active across Desktop, Tablet & Mobile) */}
        <style>{`
          @media (min-width: 768px) {
            .carousel-card-center {
              transform: translateX(0px) translateZ(0px) rotateY(0deg) scale(1) !important;
              opacity: 1 !important;
              z-index: 50 !important;
              cursor: default !important;
            }
            .carousel-card-left-1 {
              transform: translateX(-160px) translateZ(-65px) rotateY(15deg) scale(0.92) !important;
              opacity: 0.90 !important;
              z-index: 40 !important;
              cursor: pointer !important;
            }
            .carousel-card-left-1:hover {
              opacity: 1 !important;
              transform: translateX(-160px) translateZ(-35px) rotateY(11deg) scale(0.95) !important;
            }
            .carousel-card-right-1 {
              transform: translateX(160px) translateZ(-65px) rotateY(-15deg) scale(0.92) !important;
              opacity: 0.90 !important;
              z-index: 40 !important;
              cursor: pointer !important;
            }
            .carousel-card-right-1:hover {
              opacity: 1 !important;
              transform: translateX(160px) translateZ(-35px) rotateY(-11deg) scale(0.95) !important;
            }
            .carousel-card-left-2 {
              transform: translateX(-290px) translateZ(-120px) rotateY(23deg) scale(0.84) !important;
              opacity: 0.75 !important;
              z-index: 30 !important;
              cursor: pointer !important;
            }
            .carousel-card-left-2:hover {
              opacity: 0.95 !important;
              transform: translateX(-290px) translateZ(-80px) rotateY(17deg) scale(0.88) !important;
            }
            .carousel-card-right-2 {
              transform: translateX(290px) translateZ(-120px) rotateY(-23deg) scale(0.84) !important;
              opacity: 0.75 !important;
              z-index: 30 !important;
              cursor: pointer !important;
            }
            .carousel-card-right-2:hover {
              opacity: 0.95 !important;
              transform: translateX(290px) translateZ(-80px) rotateY(-17deg) scale(0.88) !important;
            }
            .carousel-card-left-3 {
              transform: translateX(-395px) translateZ(-165px) rotateY(29deg) scale(0.77) !important;
              opacity: 0.60 !important;
              z-index: 20 !important;
              cursor: pointer !important;
            }
            .carousel-card-left-3:hover {
              opacity: 0.88 !important;
              transform: translateX(-395px) translateZ(-120px) rotateY(22deg) scale(0.82) !important;
            }
            .carousel-card-right-3 {
              transform: translateX(395px) translateZ(-165px) rotateY(-29deg) scale(0.77) !important;
              opacity: 0.60 !important;
              z-index: 20 !important;
              cursor: pointer !important;
            }
            .carousel-card-right-3:hover {
              opacity: 0.88 !important;
              transform: translateX(395px) translateZ(-120px) rotateY(-22deg) scale(0.82) !important;
            }
            .carousel-card-left-4 {
              transform: translateX(-475px) translateZ(-200px) rotateY(33deg) scale(0.70) !important;
              opacity: 0.45 !important;
              z-index: 10 !important;
              cursor: pointer !important;
            }
            .carousel-card-right-4 {
              transform: translateX(475px) translateZ(-200px) rotateY(-33deg) scale(0.70) !important;
              opacity: 0.45 !important;
              z-index: 10 !important;
              cursor: pointer !important;
            }
            .carousel-card-left-5, .carousel-card-left-far {
              transform: translateX(-540px) translateZ(-230px) rotateY(36deg) scale(0.64) !important;
              opacity: 0.35 !important;
              z-index: 5 !important;
              cursor: pointer !important;
            }
            .carousel-card-right-5, .carousel-card-right-far {
              transform: translateX(540px) translateZ(-230px) rotateY(-36deg) scale(0.64) !important;
              opacity: 0.35 !important;
              z-index: 5 !important;
              cursor: pointer !important;
            }
          }

          @media (max-width: 767px) {
            .carousel-card-center {
              transform: translateX(0px) scale(1) !important;
              opacity: 1 !important;
              z-index: 50 !important;
            }
            .carousel-card-left-1 {
              transform: translateX(-75px) scale(0.90) !important;
              opacity: 0.80 !important;
              z-index: 40 !important;
            }
            .carousel-card-right-1 {
              transform: translateX(75px) scale(0.90) !important;
              opacity: 0.80 !important;
              z-index: 40 !important;
            }
            .carousel-card-left-2 {
              transform: translateX(-130px) scale(0.82) !important;
              opacity: 0.55 !important;
              z-index: 30 !important;
            }
            .carousel-card-right-2 {
              transform: translateX(130px) scale(0.82) !important;
              opacity: 0.55 !important;
              z-index: 30 !important;
            }
            .carousel-card-left-3, .carousel-card-left-4, .carousel-card-left-5, .carousel-card-left-far {
              transform: translateX(-170px) scale(0.75) !important;
              opacity: 0.35 !important;
              z-index: 20 !important;
            }
            .carousel-card-right-3, .carousel-card-right-4, .carousel-card-right-5, .carousel-card-right-far {
              transform: translateX(170px) scale(0.75) !important;
              opacity: 0.35 !important;
              z-index: 20 !important;
            }
          }
        `}</style>

        {/* HERO 8.85 OVERLAY: Monumental Number centered below navbar */}
        <div className="absolute inset-0 pointer-events-none z-40 flex flex-col items-center justify-center pt-16 sm:pt-20 [perspective:1400px]">

          <div ref={heroBadgeRef} className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-4 text-center">
            <span className="px-3.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-neutral-800 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-md max-w-[90vw]">
              MANIPAL UNIVERSITY JAIPUR • CLASS OF 2027
            </span>
          </div>

          {/* Monumental 8.85 Academic Metric */}
          <div
            ref={heroNumberRef}
            style={{ transformOrigin: 'center center' }}
            className="inline-flex items-center justify-center select-none will-change-transform will-change-opacity pointer-events-auto my-1"
          >
            <span className="text-[5.5rem] sm:text-[7.5rem] md:text-[9.5rem] lg:text-[11rem] font-black tracking-tighter text-neutral-950 leading-none select-none font-sans drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              8.85
            </span>
          </div>

          <div ref={heroSubtextRef} className="flex flex-col items-center gap-2 sm:gap-3 mt-2 sm:mt-3 px-4 text-center">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 text-xs sm:text-sm md:text-base font-mono text-neutral-600 uppercase tracking-widest">
              <span>Cumulative GPA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-900 font-bold">Distinction Honors</span>
            </div>
          </div>

        </div>


        {/* =============================================================== */}
        {/* Main Dual Stage (Overview on Left + Compact Vertical Row)       */}
        {/* =============================================================== */}
        <div
          ref={mainStageRef}
          className="w-full flex-1 flex flex-col md:flex-row gap-3.5 md:gap-4 lg:gap-6 my-auto overflow-hidden items-center justify-center relative z-10 opacity-0"
        >
          {/* Left Column (Spacious Cumulative GPA, Metrics, Trajectory - Centered in Viewport) */}
          <div
            ref={leftColRef}
            className="w-full md:w-[270px] lg:w-[330px] xl:w-[380px] 2xl:w-[420px] shrink-0 flex flex-col gap-2.5 sm:gap-3.5 justify-center h-fit max-h-[84vh] md:max-h-[78vh] [perspective:1400px] absolute md:relative inset-x-0 inset-y-0 my-auto md:inset-auto z-20 md:z-auto will-change-transform"
          >

            {/* Cumulative GPA Card (Destination of the Morphing 8.85) */}
            <div
              ref={gpaCardRef}
              className="p-3.5 sm:p-4 lg:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_6px_20px_rgba(0,0,0,0.035)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:scale-[1.015] sem-card-spring flex flex-col justify-between relative overflow-hidden shrink-0 will-change-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-medium">
                  Cumulative GPA
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>Distinction Honors</span>
                  <span className="text-emerald-400">✦</span>
                </span>
              </div>

              {/* Destination Slot */}
              <div className="flex items-baseline gap-2.5 my-1">
                <div
                  ref={targetSlotRef}
                  style={{ transformOrigin: 'center center' }}
                  className="inline-flex items-center text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-950 leading-none select-none opacity-0 will-change-opacity"
                >
                  <span>8.85</span>
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-mono font-bold text-neutral-400">/ 10.0</span>
              </div>

              <p className="text-[11px] sm:text-xs lg:text-[13px] text-neutral-600 font-mono leading-relaxed">
                Maintained across all completed semesters in Core Computer Science, Software Engineering, and Mathematics.
              </p>

              {/* Manipal University Jaipur Full Campus View */}
              <div className="relative w-full aspect-[1920/592] rounded-xl overflow-hidden mt-2 border border-black/[0.08] shadow-xs group/campus shrink-0 bg-neutral-100">
                <img
                  src="/muj-uni.webp"
                  alt="Manipal University Jaipur Campus"
                  className="w-full h-full object-cover object-center group-hover/campus:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-2 pointer-events-none">
                  <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold text-white tracking-tight drop-shadow-sm">
                    Manipal University Jaipur
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] font-mono font-semibold text-white/95 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    NAAC A+
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics & Trajectory Area Chart */}
            <div className="flex flex-col gap-2.5 sm:gap-3.5 flex-1 justify-between">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
                <div
                  ref={peakSgpaRef}
                  className="p-3 sm:p-3.5 lg:p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_3px_10px_rgba(0,0,0,0.025)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)] hover:-translate-y-2 hover:scale-[1.03] sem-card-spring will-change-transform cursor-pointer"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase block font-medium">Peak SGPA</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 block mt-0.5 sm:mt-1 font-mono">9.50</span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">Sem 01</span>
                </div>
                <div
                  ref={topPracticalRef}
                  className="p-3 sm:p-3.5 lg:p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_3px_10px_rgba(0,0,0,0.025)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)] hover:-translate-y-2 hover:scale-[1.03] sem-card-spring will-change-transform cursor-pointer"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase block font-medium">Top Practical</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 block mt-0.5 sm:mt-1 font-mono">100/100</span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">System Software Lab</span>
                </div>
              </div>

              {/* Trajectory Area Chart */}
              <div
                ref={trajectoryRef}
                className="p-3.5 sm:p-4 lg:p-5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_6px_20px_rgba(0,0,0,0.035)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:scale-[1.015] sem-card-spring flex-1 flex flex-col justify-between will-change-transform cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] sm:text-xs lg:text-sm font-mono font-bold text-neutral-950 uppercase tracking-wider">
                    Trajectory Curve
                  </span>
                </div>

                <div className="w-full h-[95px] sm:h-[110px] md:h-[115px] lg:h-[130px] xl:h-[145px]">
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

                <div className="flex items-center justify-between pt-2 border-t border-black/[0.08] text-[9.5px] font-mono text-neutral-500 overflow-x-auto gap-2">
                  {transcriptData.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSemIndex(i)}
                      className={`whitespace-nowrap transition-colors duration-200 cursor-pointer ${activeSemIndex === i ? 'text-black font-bold underline underline-offset-4' : 'hover:text-black'}`}
                    >
                      {d.sem.replace('Semester', 'Sem')}: {d.sgpa != null ? (typeof d.sgpa === 'number' ? d.sgpa.toFixed(2) : d.sgpa) : (d.status || 'Ongoing')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Spotlight Carousel Showcase on Laptop */}
          <div className="flex flex-1 min-w-0 h-full flex-col items-center justify-between [perspective:1400px] relative w-full pb-1 md:pb-2">

            {/* 3D Carousel Stage (Optically centered with left column) */}
            <div className="w-full flex-1 flex items-center justify-center relative md:static [perspective:1600px] -translate-y-1 sm:-translate-y-2 md:-translate-y-3">
              {transcriptData.map((card, idx) => {
                const theme = semThemes[idx % semThemes.length];
                const diff = idx - activeSemIndex;
                const isCenter = diff === 0;

                let carouselClass = 'carousel-card-center';
                if (diff === -1) carouselClass = 'carousel-card-left-1';
                else if (diff === 1) carouselClass = 'carousel-card-right-1';
                else if (diff === -2) carouselClass = 'carousel-card-left-2';
                else if (diff === 2) carouselClass = 'carousel-card-right-2';
                else if (diff === -3) carouselClass = 'carousel-card-left-3';
                else if (diff === 3) carouselClass = 'carousel-card-right-3';
                else if (diff === -4) carouselClass = 'carousel-card-left-4';
                else if (diff === 4) carouselClass = 'carousel-card-right-4';
                else if (diff === -5) carouselClass = 'carousel-card-left-5';
                else if (diff === 5) carouselClass = 'carousel-card-right-5';
                else if (diff < -5) carouselClass = 'carousel-card-left-far';
                else if (diff > 5) carouselClass = 'carousel-card-right-far';

                return (
                  <div
                    key={card.sem}
                    ref={el => cardsRef.current[idx] = el}
                    onClick={() => {
                      if (!isCenter) setActiveSemIndex(idx);
                    }}
                    className="absolute md:relative lg:absolute lg:inset-x-0 lg:mx-auto flex-shrink-0 w-[290px] sm:w-[330px] md:w-[350px] lg:w-[400px] xl:w-[440px] 2xl:w-[460px] will-change-transform"
                    style={{ zIndex: 50 - Math.abs(diff) * 8 }}
                  >
                    {/* Organic Floating Wrapper (Continuous Asynchronous Elevation on Desktop) */}
                    <div className={`md:sem-card-floating-wrapper md:animate-sem-float-${idx} w-full`}>

                      {/* Tactile Editorial Card with 3D Carousel Positioning on Laptop */}
                      <div
                        className={`group w-full h-[410px] sm:h-[440px] md:h-[470px] lg:h-[520px] xl:h-[550px] max-h-[66vh] sm:max-h-[70vh] md:max-h-[74vh] lg:max-h-[78vh] ${theme.cardBg} rounded-[26px] sm:rounded-[30px] border ${theme.cardBorder} ${
                          isCenter
                            ? (theme.isDark ? 'ring-2 ring-white/90 shadow-[0_32px_70px_rgba(0,0,0,0.45)]' : 'ring-2 ring-black/80 shadow-[0_32px_70px_rgba(0,0,0,0.20)]')
                            : (theme.isDark ? 'shadow-[0_18px_40px_rgba(0,0,0,0.25)]' : 'shadow-[0_16px_36px_rgba(0,0,0,0.08)]')
                        } ${carouselClass} p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between overflow-hidden will-change-transform sem-card-spring transition-all duration-500`}
                      >
                        {/* Top Bar: Semester Title + Pill Badge */}
                        <div className={`pb-2 border-b ${theme.footerBorder} shrink-0 relative z-10`}>
                          <div className="flex items-center justify-between">
                            <h3 className={`text-base xl:text-lg font-black ${theme.textTitle} tracking-tight`}>
                              {card.sem}
                            </h3>

                            {/* Top-Right Pill Action Badge */}
                            <div className={`px-2.5 py-0.5 rounded-full ${theme.pillBg} flex items-center gap-1.5 shadow-xs transition-transform group-hover:scale-105`}>
                              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">
                                {card.isComingSoon ? 'SOON' : card.isCurrentSem ? 'ONGOING' : `${typeof card.sgpa === 'number' ? card.sgpa.toFixed(2) : card.sgpa} SGPA`}
                              </span>
                              <span className={`w-3.5 h-3.5 rounded-full ${theme.pillIconBg} flex items-center justify-center text-[7px] font-black`}>
                                {card.isCurrentSem ? '⚡' : '↗'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between mt-1">
                            <span className={`text-[9px] font-mono ${theme.textMuted}`}>{card.status}</span>
                          </div>
                        </div>

                        {/* Card Body: Coming Soon for Semester 5, Ongoing for Semester 6, Subjects Grid for 1-4 */}
                        {card.isComingSoon ? (
                          <div className="flex-1 my-2 flex flex-col items-center justify-center p-4 text-center relative z-10">
                            <h4 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${theme.textTitle}`}>
                              Coming Soon
                            </h4>
                          </div>
                        ) : card.isCurrentSem ? (
                          <div className="flex-1 my-2 flex items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] relative z-10">
                            <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white select-none">
                              Ongoing
                            </h4>
                          </div>
                        ) : (
                          <div className="flex-1 my-1.5 overflow-y-auto pr-0.5 space-y-1 relative z-10">
                            {card.subjects.map((sub, sIdx) => {
                              return (
                                <div
                                  key={sIdx}
                                  className={`p-1.5 rounded-lg ${theme.subCardBg} border flex flex-col justify-between gap-0.5 transition-colors`}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="min-w-0 flex-1">
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
                        )}

                        {/* Bottom Footer: Brand Mark + Status */}
                        <div className={`pt-1.5 border-t ${theme.footerBorder} flex items-center justify-between text-[9px] font-mono shrink-0 relative z-10`}>
                          <span className={`font-black tracking-tight ${theme.brandText}`}>Manipal Univ.</span>
                          <span className={`flex items-center gap-1 ${theme.footerText}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${card.isComingSoon ? 'bg-amber-400' : 'bg-emerald-500'} ${card.isCurrentSem ? 'animate-pulse' : ''}`} />
                            {card.isComingSoon ? 'Upcoming' : card.isCurrentSem ? 'Ongoing' : 'Completed'}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimalist Pill Pagination & Autoplay Controller matching reference design */}
            <div className="flex items-center justify-center gap-3.5 z-30 select-none mt-auto pb-2">
              {/* Pill Container with Dot Indicators & Active Capsule */}
              <div className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-[#eceef1] border border-black/[0.04] shadow-xs flex items-center gap-3">
                {transcriptData.map((d, i) => {
                  const isActive = i === activeSemIndex;
                  return isActive ? (
                    <div
                      key={i}
                      onClick={() => handleSelectSemester(i)}
                      className="w-11 sm:w-12 h-3 rounded-full bg-[#8e8e93]/65 overflow-hidden relative cursor-pointer"
                      title={`Semester ${i + 1}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Semester ${i + 1} (active)`}
                    >
                      <div
                        style={{ width: isPlaying ? `${autoProgress}%` : '100%' }}
                        className="h-full bg-[#1c1c1e] rounded-full transition-all duration-75"
                      />
                    </div>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSemester(i)}
                      className="w-2.5 h-2.5 rounded-full bg-[#8e8e93] hover:bg-[#1c1c1e] transition-colors cursor-pointer"
                      title={`Semester ${i + 1}`}
                      aria-label={`Go to Semester ${i + 1}`}
                    />
                  );
                })}
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(prev => !prev);
                  setAutoProgress(0);
                }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#eceef1] border border-black/[0.04] shadow-xs hover:bg-[#e2e5e9] active:scale-95 flex items-center justify-center text-[#1c1c1e] transition-all cursor-pointer"
                title={isPlaying ? "Pause autoplay" : "Play autoplay"}
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              >
                {isPlaying ? (
                  /* Pause Icon (||) matching screenshot 1 */
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4.5" width="3.5" height="15" rx="1.5" />
                    <rect x="14.5" y="4.5" width="3.5" height="15" rx="1.5" />
                  </svg>
                ) : (
                  /* Play Icon (▶) matching screenshot 2 */
                  <svg className="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4.5v15a1 1 0 0 0 1.55.83l12-7.5a1 1 0 0 0 0-1.66l-12-7.5A1 1 0 0 0 7 4.5z" />
                  </svg>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Education;
