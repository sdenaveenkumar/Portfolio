import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import initialProjects from '../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const CACHE_KEY = 'github_repos_cache';
const CACHE_TIME_KEY = 'github_repos_cache_time';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// Bespoke metadata mapping for Naveen's repositories to create rich interactive cards
const projectMeta = {
  'dolphin': {
    category: 'LOCAL AI / PWA / APK',
    badge: 'Offline LLM',
    type: 'ai',
    snippet: 'model: local-weights • status: ready',
    tags: ['React', 'Local LLM', 'PWA', 'Android'],
    color: 'bg-[#E0F7FA]', // Soft sky cyan
    border: 'border-[#B2EBF2]',
    accent: '#0891B2',
  },
  'Lofi-Radio-VsCode': {
    category: 'DEVELOPER TOOLING',
    badge: 'VS Code Extension',
    type: 'audio',
    snippet: '▶ 128kbps Lo-Fi Audio Stream • In-Editor',
    tags: ['VS Code API', 'Audio', 'JavaScript'],
    color: 'bg-[#E9E3FF]', // Soft lavender
    border: 'border-[#D4C7FF]',
    accent: '#7C3AED',
  },
  'lofi-cli': {
    category: 'TERMINAL UTILITY',
    badge: 'CLI Tool',
    type: 'terminal',
    snippet: '$ lofi-cli --play --genre chillhop',
    tags: ['Shell', 'Terminal Audio', 'Background'],
    color: 'bg-[#FFF3E0]', // Soft peach
    border: 'border-[#FFE0B2]',
    accent: '#EA580C',
  },
  'personal-api': {
    category: 'BACKEND ARCHITECTURE',
    badge: 'RESTful API',
    type: 'api',
    snippet: 'GET /v1/health → 200 OK (14ms)',
    tags: ['Node.js', 'Express', 'CI/CD', 'REST'],
    color: 'bg-[#E8F5E9]', // Soft sage green
    border: 'border-[#C8E6C9]',
    accent: '#16A34A',
  },
  'Portfolio': {
    category: 'CREATIVE ENGINEERING',
    badge: 'Interactive UI',
    type: 'ui',
    snippet: 'Physics Canvas • GSAP 3D • React 19',
    tags: ['React', 'GSAP', 'Tailwind', 'Motion'],
    color: 'bg-[#FCE4EC]', // Soft rose
    border: 'border-[#F8BBD0]',
    accent: '#DB2777',
  },
  'Markdown': {
    category: 'KNOWLEDGE BASE',
    badge: 'Documentation',
    type: 'docs',
    snippet: 'Technical Architecture & Cheatsheets',
    tags: ['Markdown', 'Notes', 'Docs'],
    color: 'bg-[#F3E5F5]', // Soft orchid
    border: 'border-[#E1BEE7]',
    accent: '#9333EA',
  },
  'SdeNaveenKumar': {
    category: 'DEVELOPER PROFILE',
    badge: 'GitHub Config',
    type: 'profile',
    snippet: 'Developer Toolchain & Automation',
    tags: ['GitHub', 'Config', 'Workflows'],
    color: 'bg-[#E0F2FE]', // Soft ice blue
    border: 'border-[#BAE6FD]',
    accent: '#0284C7',
  }
};

const defaultColorDeck = [
  { color: 'bg-[#E0F7FA]', border: 'border-[#B2EBF2]', accent: '#0891B2', category: 'ENGINEERING WORK' },
  { color: 'bg-[#E9E3FF]', border: 'border-[#D4C7FF]', accent: '#7C3AED', category: 'CREATIVE CODE' },
  { color: 'bg-[#FFF3E0]', border: 'border-[#FFE0B2]', accent: '#EA580C', category: 'DEVELOPER TOOL' },
  { color: 'bg-[#E8F5E9]', border: 'border-[#C8E6C9]', accent: '#16A34A', category: 'SYSTEM ARCHITECTURE' },
  { color: 'bg-[#FCE4EC]', border: 'border-[#F8BBD0]', accent: '#DB2777', category: 'WEB PLATFORM' }
];

const Projects = () => {
  const containerRef = useRef(null);
  const folderWrapperRef = useRef(null);
  const cardsRef = useRef([]);

  // Initialize immediately from localStorage cache or bundled static projects
  const [repos, setRepos] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading repo cache from localStorage:', e);
    }
    return initialProjects;
  });

  useEffect(() => {
    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const cachedData = localStorage.getItem(CACHE_KEY);
      const isCacheFresh = cachedTime && Date.now() - Number(cachedTime) < CACHE_DURATION;

      if (isCacheFresh && cachedData) {
        return;
      }
    } catch (e) {
      console.warn('Error checking cache freshness:', e);
    }

    fetch('https://api.github.com/users/sdenaveenkumar/repos?sort=updated&direction=desc&per_page=100')
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(r => !r.fork);
          setRepos(filtered);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          } catch (e) {
            console.warn('Failed to save repos to localStorage:', e);
          }
        }
      })
      .catch(err => {
        console.warn('Could not refresh repos from GitHub, using existing data:', err);
      });
  }, []);

  useGSAP(() => {
    if (repos.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const totalCards = repos.length;
    const centerIndex = (totalCards - 1) / 2;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4
      }
    });

    gsap.set(folderWrapperRef.current, { willChange: "transform" });
    cardsRef.current.forEach(card => {
      if (card) gsap.set(card, { willChange: "transform" });
    });

    // PHASE 1: Cards fan out organically
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const rotation = (index - centerIndex) * 10;
      const yOffset = -190 - Math.abs(index - centerIndex) * 12;

      tl.to(card, {
        y: yOffset,
        rotationZ: rotation,
        scale: 0.95,
        duration: 1.4,
        ease: "power2.out"
      }, index * 0.12);
    });

    // PHASE 2: Folder scales & glides
    const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 420;
    const cardStep = isMobile ? (isSmallMobile ? 260 : 290) : 430;

    tl.to(folderWrapperRef.current, {
      scale: isMobile ? (isSmallMobile ? 0.8 : 0.85) : 0.72,
      x: isMobile ? (isSmallMobile ? "-10vw" : "-15vw") : "-26vw",
      y: isMobile ? "-4vh" : "0",
      duration: 2.2,
      ease: "power2.inOut"
    }, "-=0.2");

    // PHASE 3: Cards slide out smoothly
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const xSpread = cardStep * (index + 1);
      const ySpread = isMobile ? 15 : 40;

      tl.to(card, {
        x: xSpread,
        y: ySpread,
        rotationZ: 0,
        scale: 1,
        duration: 1.4,
        ease: "power2.out"
      }, `-=${1.2 - (index * 0.1)}`);
    });

    // PHASE 4: Smooth camera pan across all project cards
    tl.to(folderWrapperRef.current, {
      x: () => {
        const centerPan = cardStep * totalCards;
        const rightEdgeOffset = window.innerWidth * 0.5 - (isMobile ? (isSmallMobile ? 115 : 130) : 180);
        return -(centerPan - rightEdgeOffset);
      },
      duration: totalCards * 0.8,
      ease: "power1.inOut"
    }, "-=0.4");

    return () => {
      tl.kill();
    };

  }, { scope: containerRef, dependencies: [repos] });

  const displayRepos = repos.length > 0 ? repos : initialProjects;

  return (
    <div id="projects" ref={containerRef} className="relative w-full" style={{ height: `${Math.max(300, displayRepos.length * 48)}vh` }}>
      <div className="absolute inset-0 bg-[#F7F7F8] -z-10" />
      
      {/* Sticky Fullscreen Presentation Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-14 sm:pt-20">

        {/* Section Header */}
        <h2 className="absolute top-8 sm:top-14 md:top-24 text-[26px] sm:text-[44px] md:text-[64px] font-black text-[#1F1F1F] tracking-tighter uppercase z-10 pointer-events-none">
          Projects
        </h2>

        {/* Folder Container Wrapper */}
        <div ref={folderWrapperRef} className="relative w-[250px] sm:w-[290px] md:w-[450px] h-[175px] sm:h-[200px] md:h-[300px]">

          {/* Back of the Folder */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-[#E5E5E7]/70 rounded-3xl shadow-inner border border-gray-300/60">
            {/* Back tab */}
            <div className="absolute -top-8 left-6 w-28 sm:w-32 h-10 bg-[#E5E5E7]/70 rounded-t-2xl border-t border-l border-r border-gray-300/60" />
          </div>

          {/* Project Cards Deck */}
          <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end justify-center pointer-events-none">
            {displayRepos.map((repo, i) => {
              const meta = projectMeta[repo.name] || defaultColorDeck[i % defaultColorDeck.length];
              const cardColor = meta.color || 'bg-[#E0F7FA]';
              const cardBorder = meta.border || 'border-[#B2EBF2]';
              const categoryTag = meta.category || 'SOFTWARE ENGINEERING';
              const badgeLabel = meta.badge || repo.language || 'Code';

              return (
                <div
                  key={repo.id || i}
                  ref={el => cardsRef.current[i] = el}
                  className="absolute bottom-4 w-[240px] sm:w-[275px] md:w-[340px] h-[340px] sm:h-[385px] md:h-[450px] transform-gpu origin-bottom z-10 pointer-events-auto cursor-pointer group select-none"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <motion.div
                    className={`w-full h-full ${cardColor} rounded-[28px] sm:rounded-[32px] border ${cardBorder} shadow-[0_12px_36px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-6.5 flex flex-col justify-between transition-transform duration-200 ease-out group-hover:scale-[1.025] group-hover:-translate-y-1.5 relative overflow-hidden`}
                  >
                    {/* Top Inset Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                    {/* CARD HEADER: Category Pill & Tactical External Arrow */}
                    <div className="flex items-center justify-between gap-2 shrink-0 relative z-10">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-gray-800 uppercase truncate max-w-[150px] sm:max-w-[190px]">
                          {categoryTag}
                        </span>
                      </div>

                      {/* External Arrow Action Icon */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 border border-white shadow-xs flex items-center justify-center text-gray-800 group-hover:bg-black group-hover:text-white transition-colors duration-200 shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>

                    {/* CARD BODY: Title & Description */}
                    <div className="my-auto py-2 relative z-10">
                      <h3 className="text-xl sm:text-2xl md:text-[26px] font-black tracking-tight text-gray-950 mb-2 leading-tight group-hover:text-black transition-colors line-clamp-1">
                        {repo.name}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-gray-600 font-medium line-clamp-3 leading-relaxed">
                        {repo.description || "Production-grade, extensible codebase with modular architecture and rigorous standards."}
                      </p>
                    </div>

                    {/* TACTICAL PREVIEW STAGE (Lightweight Glass Inset) */}
                    <div className="my-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-white shadow-xs flex items-center justify-between gap-2 shrink-0 relative z-10">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {meta.type === 'audio' ? (
                          <div className="flex items-end gap-0.5 h-3.5 w-4 shrink-0">
                            <span className="w-1 bg-purple-600 rounded-full h-full" />
                            <span className="w-1 bg-purple-600 rounded-full h-2/3" />
                            <span className="w-1 bg-purple-600 rounded-full h-4/5" />
                          </div>
                        ) : meta.type === 'ai' ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                        ) : meta.type === 'terminal' ? (
                          <span className="font-mono text-xs font-black text-amber-600 shrink-0">&gt;_</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}

                        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-gray-700 truncate">
                          {meta.snippet || `${repo.language || 'JS'} • Repository Active`}
                        </span>
                      </div>

                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-black/5 text-gray-700 rounded-md shrink-0">
                        {badgeLabel}
                      </span>
                    </div>

                    {/* CARD FOOTER: Tech Pills, Stars & Action */}
                    <div className="pt-2.5 border-t border-black/5 flex items-center justify-between gap-2 shrink-0 relative z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {meta.tags ? (
                          meta.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full bg-white/80 border border-white text-[9px] sm:text-[10px] font-bold text-gray-700 shadow-xs">
                              {t}
                            </span>
                          ))
                        ) : (
                          repo.language && (
                            <span className="px-2 py-0.5 rounded-full bg-white/80 border border-white text-[9px] sm:text-[10px] font-bold text-gray-700 shadow-xs">
                              {repo.language}
                            </span>
                          )
                        )}

                        {repo.stargazers_count > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/80 border border-white text-[9px] sm:text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-xs">
                            ★ {repo.stargazers_count}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold text-gray-900 group-hover:translate-x-1 transition-transform duration-200">
                        <span>EXPLORE</span>
                        <span>→</span>
                      </div>
                    </div>

                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Front Translucent Glass Folder */}
          <div className="absolute bottom-0 left-0 w-full h-[95%] z-20 pointer-events-none">
            {/* Front Tab */}
            <div className="absolute -top-10 left-0 w-[45%] h-12 bg-white/40 backdrop-blur-sm rounded-tr-3xl rounded-tl-3xl border-t border-l border-r border-white/60 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]" />

            {/* Front Body */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-white/40 backdrop-blur-sm rounded-3xl rounded-tl-none border border-white/60 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] flex items-end justify-end p-4 sm:p-6">
              {/* Action Button to GitHub Repos */}
              <a
                href="https://github.com/sdenaveenkumar?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 sm:w-16 sm:h-16 bg-[#1F1F1F] hover:bg-black rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
