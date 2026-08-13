import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const containerRef = useRef(null);
  const folderWrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    // Fetch user repos
    fetch('https://api.github.com/users/sdenaveenkumar/repos?sort=updated&direction=desc')
      .then(res => res.json())
      .then(data => {
        // Filter out forks and show all of them
        const filtered = data.filter(r => !r.fork);
        setRepos(filtered);
      })
      .catch(err => console.error(err));
  }, []);

  useGSAP(() => {
    if (repos.length === 0) return; // wait until repos are loaded

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });

    const totalCards = repos.length;
    const centerIndex = (totalCards - 1) / 2;

    // PHASE 1: Cards slide up and fan out
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const rotation = (index - centerIndex) * 12; // spread by 12 degrees
      const yOffset = -220 - Math.abs(index - centerIndex) * 15; // middle cards go slightly higher

      tl.to(card, {
        y: yOffset,
        rotationZ: rotation,
        duration: 2,
        ease: "power2.out"
      }, index * 0.2); // Stagger the pop-outs
    });

    // Pause briefly, then PHASE 2: Folder scales down and moves left (or up on mobile)
    const phase2Start = tl.duration() + 0.5;
    const isMobile = window.innerWidth < 768;

    tl.to(folderWrapperRef.current, {
      scale: 0.7,
      x: isMobile ? "0" : "-25vw", // move left on desktop, stay center on mobile
      y: isMobile ? "-20vh" : "0", // move up on mobile

      duration: 3,
      ease: "power2.inOut"
    }, phase2Start);

    // Pause briefly, then PHASE 3: Cards slide out to the right (or down on mobile) one by one
    const phase3Start = tl.duration() + 0.5;
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const isMobile = window.innerWidth < 768;
      // On desktop, spread horizontally. On mobile, stack vertically below the folder.
      const xSpread = isMobile ? 0 : 450 * (index + 1);
      const ySpread = isMobile ? (380 * (index + 1)) : 50; // moved down by 150px on desktop

      tl.to(card, {
        x: xSpread,
        y: ySpread,
        rotationZ: 0, // reset rotation so they are straight
        height: isMobile ? 440 : 500, // expand size when coming out
        duration: 1.5,
        ease: "power2.inOut"
      }, phase3Start + (index * 0.8)); // Reveal one by one!
    });

    // PHASE 4: Pan left so the user can see all the cards that slid out
    const phase4Start = tl.duration() + 0.5;
    if (window.innerWidth >= 768) {
       tl.to(folderWrapperRef.current, {
         x: () => {
           // To bring the last card to the right corner of the viewport:
           // If we translate by -(450 * totalCards), the last card is perfectly centered.
           // To keep it on the right side instead of the center, we pan less to the left
           // by half the screen width, minus a little padding (e.g. 200px).
           const centerPan = 450 * totalCards;
           const rightEdgeOffset = window.innerWidth * 0.5 - 200;
           return -(centerPan - rightEdgeOffset);
         },
         duration: totalCards * 1.2,
         ease: "none"
       }, phase4Start);
    }

    // Refresh ScrollTrigger after a slight delay to ensure the new dynamic height
    // has been fully rendered in the DOM, so the Experience section updates its markers.
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

  }, { scope: containerRef, dependencies: [repos] });

  // Fallback placeholder data if GitHub fails/rate limited temporarily
  const displayRepos = repos.length > 0 ? repos : Array(5).fill({ name: "Loading...", description: "Fetching from GitHub..." });

  const colors = [
    'bg-[#E9E3FF]', // Light purple
    'bg-[#E0F7FA]', // Cyan
    'bg-[#FCE4EC]', // Pink
    'bg-[#FFF3E0]', // Orange
    'bg-[#E8F5E9]', // Green
  ];

  return (
    <div id="projects" ref={containerRef} className="relative w-full" style={{ height: `${Math.max(600, displayRepos.length * 80)}vh` }}>
      <div className="absolute inset-0 bg-[#F7F7F7] -z-10" />
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-20">

        {/* Title like the image */}
        <h2 className="absolute top-12 md:top-24 text-[40px] md:text-[64px] font-black text-[#1F1F1F] tracking-tighter uppercase">
          Projects
        </h2>

        {/* Folder Container Wrapper (Animated in Phase 2) */}
        <div ref={folderWrapperRef} className="relative w-[280px] md:w-[450px] h-[200px] md:h-[300px]">

          {/* Back of the Folder */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-[#E5E5E5] rounded-3xl shadow-inner border border-gray-200">
            {/* Back tab */}
            <div className="absolute -top-8 left-6 w-32 h-10 bg-[#E5E5E5] rounded-t-2xl border-t border-l border-r border-gray-200" />
          </div>

          {/* Cards (Sandwiched inside) */}
          <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end justify-center pointer-events-none">
            {displayRepos.map((repo, i) => {
              const colorClass = colors[i % colors.length];
              return (
                <div
                  key={repo.id || i}
                  ref={el => cardsRef.current[i] = el}
                  className="absolute bottom-4 w-[260px] md:w-[320px] h-[340px] md:h-[400px] transform-gpu origin-bottom z-10 pointer-events-auto cursor-pointer group"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <motion.div
                    className={`w-full h-full ${colorClass} rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 border border-white/40 flex flex-col items-center text-center transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group-hover:-translate-y-2`}
                  >
                    <div className="w-12 h-12 bg-white/60 rounded-xl mb-6 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">{repo.name}</h3>
                    <p className="text-gray-600 font-medium line-clamp-4 leading-relaxed">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="mt-auto flex gap-3 justify-center w-full flex-wrap">
                      {repo.language && (
                        <span className="px-4 py-2 bg-white/50 text-gray-800 rounded-full text-sm font-semibold backdrop-blur-sm">
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="px-4 py-2 bg-white/50 text-gray-800 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
                          ⭐ {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Front Glass Folder */}
          {/* Note: The Z-index must be higher than the cards (z-10) to cover them! */}
          <div className="absolute bottom-0 left-0 w-full h-[95%] z-20 pointer-events-none">
            {/* Front Tab */}
            <div className="absolute -top-10 left-0 w-[45%] h-12 bg-white/30 backdrop-blur-2xl rounded-tr-3xl rounded-tl-3xl border-t border-l border-r border-white/50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]" />

            {/* Front Body */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/30 backdrop-blur-2xl rounded-3xl rounded-tl-none border border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-end justify-end p-6">
              {/* Action button matching the screenshot */}
              <a
                href="https://github.com/sdenaveenkumar?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-[#2B2B2B] rounded-full shadow-lg flex items-center justify-center backdrop-blur-md pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Projects;
