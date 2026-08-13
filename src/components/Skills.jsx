import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const containerRef = useRef(null);
  const textStackRef = useRef([]);

  const stackItems = [
    { text: "By building 6 project" },
    { text: "Specialised Frontend" },
    { text: "Backend & Deployment" },
  ];

  const skills = [
    // Roughly 10:00
    { name: 'React', icon: 'https://skillicons.dev/icons?i=react', top: '25%', left: '20%', size: 'w-12 h-12 md:w-20 md:h-20', delay: 0.90, floatDuration: 3.2 },
    // Roughly 1:30
    { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs', top: '15%', left: '70%', size: 'w-14 h-14 md:w-24 md:h-24', delay: 0.18, floatDuration: 3.5 },
    // Roughly 8:00
    { name: 'MongoDB', icon: 'https://skillicons.dev/icons?i=mongodb', top: '65%', left: '15%', size: 'w-14 h-14 md:w-24 md:h-24', delay: 0.74, floatDuration: 4.1 },
    // Roughly 6:00
    { name: 'MySQL', icon: 'https://skillicons.dev/icons?i=mysql', top: '80%', left: '45%', size: 'w-12 h-12 md:w-20 md:h-20', delay: 0.58, floatDuration: 3.8 },
    // Roughly 4:30
    { name: 'Express', icon: 'https://skillicons.dev/icons?i=express', top: '60%', left: '80%', size: 'w-12 h-12 md:w-20 md:h-20', delay: 0.42, floatDuration: 3.3 },
    // Roughly 9:00
    { name: 'Tailwind', icon: 'https://skillicons.dev/icons?i=tailwind', top: '40%', left: '10%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.82, floatDuration: 4.5 },
    // Roughly 2:30
    { name: 'AWS', icon: 'https://skillicons.dev/icons?i=aws', top: '35%', left: '85%', size: 'w-16 h-16 md:w-28 md:h-28', delay: 0.26, floatDuration: 4.0 },
    // Roughly 5:00
    { name: 'Docker', icon: 'https://skillicons.dev/icons?i=docker', top: '85%', left: '75%', size: 'w-12 h-12 md:w-20 md:h-20', delay: 0.50, floatDuration: 3.6 },
    // Roughly 12:00
    { name: 'TypeScript', icon: 'https://skillicons.dev/icons?i=ts', top: '12%', left: '45%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.10, floatDuration: 3.9 },
    // Roughly 3:00
    { name: 'Figma', icon: 'https://skillicons.dev/icons?i=figma', top: '50%', left: '90%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.34, floatDuration: 4.2 },
    // Roughly 7:00
    { name: 'Python', icon: 'https://skillicons.dev/icons?i=python', top: '85%', left: '25%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.66, floatDuration: 3.7 },
    // Roughly 11:00
    { name: 'Git', icon: 'https://skillicons.dev/icons?i=git', top: '25%', left: '35%', size: 'w-10 h-10 md:w-16 md:h-16', delay: 0.98, floatDuration: 3.4 },
  ];

  useGSAP(() => {
    // We create a timeline mapped strictly to scroll progress (0 to 1)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // smooth scrubbing
      }
    });

    // 1. Icons Entry Animation (Explosion from center tied to scroll)
    const icons = gsap.utils.toArray(".skill-icon");
    icons.forEach((icon, i) => {
      tl.fromTo(icon, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
      }, {
        top: skills[i].top,
        left: skills[i].left,
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        duration: 0.15,
      }, skills[i].delay * 0.15); // Uses original staggered timing, scaled to timeline
    });

    // 2. Icons Float Animation
    gsap.utils.toArray(".skill-float").forEach((el, i) => {
      gsap.to(el, {
        y: -15,
        duration: skills[i].floatDuration / 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: Math.random() * 2 // slight random offset for floating
      });
    });

    // 3. Stack Items Scroll Animation


    textStackRef.current.forEach((item, index) => {
      const yStart = [0.10, 0.35, 0.60][index];
      const yEnd = [0.25, 0.50, 0.75][index];
      const oStart = [0.17, 0.42, 0.67][index];
      const oEnd = [0.25, 0.50, 0.75][index];

      // Insert Y tween at absolute position `yStart`
      tl.fromTo(item, 
        { y: 800 }, 
        { y: 0, duration: yEnd - yStart, ease: "none" }, 
        yStart
      );

      // Insert Opacity tween at absolute position `oStart`
      tl.fromTo(item,
        { opacity: 0 },
        { opacity: 1, duration: oEnd - oStart, ease: "none" },
        oStart
      );
    });

  }, { scope: containerRef });

  return (
    <div id="skills" ref={containerRef} className="relative w-full h-[500vh] border-t border-gray-100">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Central Text */}
        <div className="text-center z-10 px-4">
          <h2 className="text-[22px] md:text-[32px] font-bold text-[#111111] tracking-tight mb-4 md:mb-6">
            A growing library of skills
          </h2>
          
          <div className="flex flex-col items-center space-y-1">
            {stackItems.map((item, index) => (
               <div
                 key={index}
                 ref={el => textStackRef.current[index] = el}
                 className="text-gray-800 font-bold text-[24px] md:text-[48px] tracking-tight will-change-transform"
                 style={{ opacity: 0, transform: 'translateY(800px)' }}
               >
                 {item.text}
               </div>
            ))}
          </div>
        </div>

        {/* Scattered Skill Icons */}
        {skills.map((skill, index) => (
          <div
            key={index}
            className={`absolute ${skill.size} z-0 skill-icon`}
            style={{ opacity: 0 }}
          >
            <div
              className="w-full h-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center cursor-pointer skill-float"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain drop-shadow-md rounded-[22px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
