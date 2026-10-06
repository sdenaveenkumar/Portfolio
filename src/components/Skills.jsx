import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ModelIcon3D from './ModelIcon3D';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const containerRef = useRef(null);
  const textStackRef = useRef([]);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Allow rabbit companion to trigger hover/inspection tooltips on skill items
  useEffect(() => {
    const handleRabbitPerch = (e) => {
      if (e.detail?.skillName !== undefined) {
        setHoveredSkill(e.detail.skillName);
      }
    };
    window.addEventListener('rabbit-skill-hover', handleRabbitPerch);
    return () => window.removeEventListener('rabbit-skill-hover', handleRabbitPerch);
  }, []);

  const stackItems = [
    { text: "By building 7+ projects", tag: "Engineering Depth" },
    { text: "Specialized Frontend", tag: "Interactive & Fast" },
    { text: "Backend & Deployment", tag: "Scalable Systems" },
  ];

  const skills = [
    // Roughly 10:00
    { name: 'React', category: 'UI Library', icon: 'https://skillicons.dev/icons?i=react', top: '25%', left: '20%', mTop: '22%', mLeft: '14%', size: 'w-11 h-11 md:w-20 md:h-20', delay: 0.90, floatDuration: 3.2 },
    // Roughly 1:30
    { name: 'Node.js', category: 'Backend Runtime', icon: 'https://skillicons.dev/icons?i=nodejs', modelKey: 'nodejs', glowColor: 'rgba(65,168,67,0.3)', top: '15%', left: '70%', mTop: '16%', mLeft: '72%', size: 'w-16 h-16 md:w-32 md:h-32', delay: 0.18, floatDuration: 3.5 },
    // Roughly 8:00
    { name: 'MongoDB', category: 'NoSQL Database', icon: 'https://skillicons.dev/icons?i=mongodb', top: '65%', left: '15%', mTop: '64%', mLeft: '12%', size: 'w-12 h-12 md:w-24 md:h-24', delay: 0.74, floatDuration: 4.1 },
    // Roughly 6:00
    { name: 'MySQL', category: 'Relational DB', icon: 'https://skillicons.dev/icons?i=mysql', top: '80%', left: '45%', mTop: '82%', mLeft: '46%', size: 'w-11 h-11 md:w-20 md:h-20', delay: 0.58, floatDuration: 3.8 },
    // Roughly 4:30
    { name: 'Express', category: 'REST APIs', icon: 'https://skillicons.dev/icons?i=express', modelKey: 'express', glowColor: 'rgba(100,100,100,0.25)', top: '60%', left: '80%', mTop: '65%', mLeft: '76%', size: 'w-16 h-16 md:w-28 md:h-28', delay: 0.42, floatDuration: 3.3 },
    // Roughly 9:00
    { name: 'Tailwind', category: 'Styling Engine', icon: 'https://skillicons.dev/icons?i=tailwind', top: '40%', left: '10%', mTop: '42%', mLeft: '10%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.82, floatDuration: 4.5 },
    // Roughly 2:30
    { name: 'AWS', category: 'Cloud Infrastructure', icon: 'https://skillicons.dev/icons?i=aws', top: '35%', left: '85%', mTop: '32%', mLeft: '78%', size: 'w-12 h-12 md:w-28 md:h-28', delay: 0.26, floatDuration: 4.0 },
    // Roughly 5:00
    { name: 'Docker', category: 'Containers', icon: 'https://skillicons.dev/icons?i=docker', modelKey: 'docker', glowColor: 'rgba(37,157,247,0.3)', top: '85%', left: '75%', mTop: '80%', mLeft: '72%', size: 'w-16 h-16 md:w-28 md:h-28', delay: 0.50, floatDuration: 3.6 },
    // Roughly 12:00
    { name: 'TypeScript', category: 'Type Safety', icon: 'https://skillicons.dev/icons?i=ts', modelKey: 'typescript', glowColor: 'rgba(6,89,153,0.3)', top: '12%', left: '45%', mTop: '12%', mLeft: '46%', size: 'w-16 h-16 md:w-28 md:h-28', delay: 0.10, floatDuration: 3.9 },
    // Roughly 3:00
    { name: 'Figma', category: 'UI/UX Design', icon: 'https://skillicons.dev/icons?i=figma', top: '50%', left: '90%', mTop: '50%', mLeft: '80%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.34, floatDuration: 4.2 },
    // Roughly 7:00
    { name: 'Python', category: 'Scripting & AI', icon: 'https://skillicons.dev/icons?i=python', top: '85%', left: '25%', mTop: '80%', mLeft: '22%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.66, floatDuration: 3.7 },
    // Roughly 11:00
    { name: 'Git', category: 'Version Control', icon: 'https://skillicons.dev/icons?i=git', top: '25%', left: '35%', mTop: '24%', mLeft: '32%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.98, floatDuration: 3.4 },
  ];

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    // We create a timeline mapped strictly to scroll progress (0 to 1)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2
      }
    });

    // 1. Icons Entry Animation (Original Explosion from center tied to scroll)
    const icons = gsap.utils.toArray(".skill-icon");
    icons.forEach((icon, i) => {
      const targetTop = isMobile && skills[i].mTop ? skills[i].mTop : skills[i].top;
      const targetLeft = isMobile && skills[i].mLeft ? skills[i].mLeft : skills[i].left;

      tl.fromTo(icon, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
      }, {
        top: targetTop,
        left: targetLeft,
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        duration: 0.15,
      }, skills[i].delay * 0.15); // Uses original staggered timing, scaled to timeline
    });

    // 2. Icons Float Animation (Paused when out of viewport to eliminate idle GPU load)
    const floatTweens = gsap.utils.toArray(".skill-float").map((el, i) => {
      return gsap.to(el, {
        y: -10,
        duration: skills[i].floatDuration / 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: Math.random() * 1.5,
        paused: true
      });
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => floatTweens.forEach(t => t.play()),
      onLeave: () => floatTweens.forEach(t => t.pause()),
      onEnterBack: () => floatTweens.forEach(t => t.play()),
      onLeaveBack: () => floatTweens.forEach(t => t.pause()),
    });

    // 3. Stack Items Progression (Unified single tween - zero blinking)
    textStackRef.current.forEach((item, index) => {
      if (!item) return;

      const yStart = [0.10, 0.35, 0.60][index];
      const yEnd = [0.25, 0.50, 0.75][index];

      tl.fromTo(item, 
        { 
          y: 70, 
          opacity: 0 
        }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: yEnd - yStart, 
          ease: "power2.out" 
        }, 
        yStart
      );
    });

  }, { scope: containerRef });

  return (
    <div 
      id="skills" 
      ref={containerRef} 
      className="relative w-full h-[500vh] border-t border-gray-100 bg-[#F7F7F8]"
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Ambient Subtle Background Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#111111 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        {/* Central Text Stack */}
        <div className="text-center z-10 px-4 max-w-3xl pointer-events-none select-none">
          <div data-skill-target="pill" data-skill-bounce="pill" className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 text-[11px] font-bold tracking-widest uppercase mb-4 md:mb-6 pointer-events-auto cursor-pointer transform-gpu" style={{ transformOrigin: 'center bottom' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Stack & Technologies
          </div>

          <h2 data-skill-target="heading" data-skill-bounce="heading" className="text-[20px] sm:text-[28px] md:text-[40px] font-black text-[#111111] tracking-tight leading-tight mb-3 md:mb-6 pointer-events-auto cursor-pointer transform-gpu" style={{ transformOrigin: 'center bottom' }}>
            A growing library of skills
          </h2>
          
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            {stackItems.map((item, index) => (
              <div
                key={index}
                ref={el => textStackRef.current[index] = el}
                data-skill-target={`stack-${index}`}
                data-skill-bounce={`stack-${index}`}
                style={{ opacity: 0, transformOrigin: 'center bottom' }}
                className="flex items-center gap-3 text-gray-800 font-extrabold text-[18px] sm:text-[28px] md:text-[44px] tracking-tight will-change-transform whitespace-nowrap pointer-events-auto cursor-pointer transform-gpu"
              >
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scattered Skill Icons (Previous Animation Concept) */}
        {skills.map((skill) => (
          <div
            key={skill.name}
            data-skill-card={skill.name}
            className={`absolute ${skill.size} z-20 skill-icon`}
            style={{ opacity: 0 }}
          >
            {/* Dedicated Physics Bounce Cushion Layer */}
            <div
              data-skill-bounce={skill.name}
              className="w-full h-full transform-gpu"
              style={{ transformOrigin: 'center bottom' }}
            >
              <div
                data-skill-interactive={skill.name}
                className={`relative w-full h-full ${
                  skill.modelKey
                    ? 'flex items-center justify-center cursor-pointer skill-float group transition-transform duration-200 hover:scale-115'
                    : 'rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center cursor-pointer skill-float group transition-transform duration-200 hover:scale-110'
                }`}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {skill.modelKey ? (
                  <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.15)]">
                    <ModelIcon3D
                      modelKey={skill.modelKey}
                      fallbackIcon={skill.icon}
                      glowColor={skill.glowColor}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <img 
                    src={skill.icon} 
                    alt={skill.name} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                    className="w-full h-full object-contain drop-shadow-md rounded-[22px] transition-transform duration-200" 
                  />
                )}
                
                {/* Fallback Badge */}
                <div 
                  style={{ display: 'none' }}
                  className="w-full h-full rounded-[22px] bg-gray-900 text-white font-bold text-xs items-center justify-center p-1 text-center shadow-inner"
                >
                  {skill.name}
                </div>

                {/* Interactive Tooltip Pill with smooth glide in and glide shut transitions */}
                <div 
                  className={`absolute left-1/2 -bottom-9 -translate-x-1/2 px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap transition-all duration-300 ease-out z-30 flex items-center gap-1.5 ${
                    hoveredSkill === skill.name
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 -translate-y-1.5 scale-90 pointer-events-none'
                  }`}
                >
                  <span>{skill.name}</span>
                  <span className="text-gray-400 font-normal">· {skill.category}</span>
                  {skill.modelKey && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-blue-500/30 text-blue-300 border border-blue-400/40">
                      3D
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Skills;
