import React, { useEffect, useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import initialProjects from '../data/projects.json';
import ProjectDetailModal from './ProjectDetailModal';

gsap.registerPlugin(ScrollTrigger);

const CACHE_KEY = 'github_repos_cache';
const CACHE_TIME_KEY = 'github_repos_cache_time';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// Requested priority order: 1. Dolphin, 2. personal-api, 3. Lofi Radio-VsCode, 4. Portfolio, then all remaining
const priorityOrder = [
  'dolphin',
  'personal-api',
  'lofi-radio-vscode',
  'portfolio'
];

const sortProjects = (list) => {
  if (!Array.isArray(list)) return [];
  const priorityIndex = (name = '') => {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = priorityOrder.findIndex(p => p.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
    return idx === -1 ? 999 : idx;
  };

  return [...list].sort((a, b) => {
    const idxA = priorityIndex(a.name);
    const idxB = priorityIndex(b.name);
    if (idxA !== idxB) {
      return idxA - idxB;
    }
    return (b.stargazers_count || 0) - (a.stargazers_count || 0);
  });
};

const formatTitle = (name = '') => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Bespoke metadata mapping for Naveen's repositories to create rich interactive cards
const projectMeta = {
  'dolphin': {
    category: 'LOCAL AI / PWA / APK',
    badge: 'Offline LLM',
    type: 'ai',
    snippet: 'local-weights • offline inference',
    image: '/projects/dolphin-screen1.png',
    tags: ['React', 'Local LLM', 'PWA', 'Android'],
    color: 'bg-[#F0FDFA]',
    border: 'border-[#99F6E4]',
    accent: '#0D9488',
  },
  'Lofi-Radio-VsCode': {
    category: 'DEVELOPER TOOLING',
    badge: 'VS Code Extension',
    type: 'audio',
    snippet: '128kbps Lo-Fi Audio • In-Editor',
    image: '/projects/lofi-vscode.jpg',
    tags: ['VS Code API', 'Audio', 'JavaScript'],
    color: 'bg-[#FAF5FF]',
    border: 'border-[#E9D5FF]',
    accent: '#7C3AED',
  },
  'lofi-cli': {
    category: 'TERMINAL UTILITY',
    badge: 'CLI Tool',
    type: 'terminal',
    snippet: '$ lofi-cli --play --genre chillhop',
    image: '/projects/lofi-cli.jpg',
    tags: ['Shell', 'Terminal Audio', 'Background'],
    color: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    accent: '#D97706',
  },
  'personal-api': {
    category: 'LIVE REST API',
    badge: 'Live Backend',
    type: 'api',
    snippet: 'http://140.245.24.219 • 200 OK (0.4ms)',
    image: '/projects/personal-api.svg',
    liveUrl: 'http://140.245.24.219',
    docsUrl: 'http://140.245.24.219/docs',
    tags: ['Node.js', 'Express', 'Live REST API', 'Swagger'],
    color: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]',
    accent: '#16A34A',
  },
  'Portfolio': {
    category: 'CREATIVE ENGINEERING',
    badge: 'Interactive UI',
    type: 'ui',
    snippet: 'Physics Canvas • GSAP 3D • React 19',
    image: '/projects/portfolio.svg',
    tags: ['React', 'GSAP', 'Tailwind', 'Motion'],
    color: 'bg-[#FDF2F8]',
    border: 'border-[#FBCFE8]',
    accent: '#DB2777',
  },
  'Markdown': {
    category: 'KNOWLEDGE BASE',
    badge: 'Documentation',
    type: 'docs',
    snippet: 'Technical Architecture & Cheatsheets',
    image: '/projects/markdown.svg',
    tags: ['Markdown', 'Notes', 'Docs'],
    color: 'bg-[#FAF5FF]',
    border: 'border-[#E9D5FF]',
    accent: '#9333EA',
  },
  'SdeNaveenKumar': {
    category: 'DEVELOPER PROFILE',
    badge: 'GitHub Config',
    type: 'profile',
    snippet: 'Developer Toolchain & Automation',
    image: '/projects/sdenaveenkumar.svg',
    tags: ['GitHub', 'Config', 'Workflows'],
    color: 'bg-[#F0F9FF]',
    border: 'border-[#BAE6FD]',
    accent: '#0284C7',
  }
};

const defaultColorDeck = [
  { color: 'bg-[#F0FDFA]', border: 'border-[#99F6E4]', accent: '#0D9488', category: 'ENGINEERING WORK', image: '/projects/portfolio.svg' },
  { color: 'bg-[#FAF5FF]', border: 'border-[#E9D5FF]', accent: '#7C3AED', category: 'CREATIVE CODE', image: '/projects/lofi-vscode.jpg' },
  { color: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', accent: '#D97706', category: 'DEVELOPER TOOL', image: '/projects/lofi-cli.jpg' },
  { color: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', accent: '#16A34A', category: 'SYSTEM ARCHITECTURE', image: '/projects/personal-api.svg' },
  { color: 'bg-[#FDF2F8]', border: 'border-[#FBCFE8]', accent: '#DB2777', category: 'WEB PLATFORM', image: '/projects/dolphin.jpg' }
];

const Projects = () => {
  const containerRef = useRef(null);
  const folderWrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Memoize sorted repos by priority: 1. Dolphin, 2. personal-api, 3. Lofi Radio-VsCode, 4. Portfolio, then all remaining
  const displayRepos = useMemo(() => {
    const source = repos.length > 0 ? repos : initialProjects;
    return sortProjects(source);
  }, [repos]);

  const getProjectMeta = (repoName = '') => {
    if (!repoName) return null;
    if (projectMeta[repoName]) return projectMeta[repoName];
    const clean = repoName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = Object.keys(projectMeta).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
    return key ? projectMeta[key] : null;
  };

  useGSAP(() => {
    if (displayRepos.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 420;
    const totalCards = displayRepos.length;
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
    const folderWidth = isMobile ? (isSmallMobile ? 250 : 290) : 450;
    const cardWidth = isMobile ? (isSmallMobile ? 260 : 300) : 360;
    const cardGap = isMobile ? (isSmallMobile ? 35 : 45) : 70;
    const cardStep = cardWidth + cardGap;
    // folderOffset ensures the gap between folder and first card is identical to the gap between cards
    const folderOffset = (folderWidth - cardWidth) / 2;

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

      const xSpread = folderOffset + (index + 1) * cardStep;
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
        const centerPan = folderOffset + cardStep * totalCards;
        const rightEdgeOffset = window.innerWidth * 0.5 - (isMobile ? (isSmallMobile ? 115 : 130) : 180);
        return -(centerPan - rightEdgeOffset);
      },
      duration: totalCards * 0.8,
      ease: "power1.inOut"
    }, "-=0.4");

    return () => {
      tl.kill();
    };

  }, { scope: containerRef, dependencies: [displayRepos] });

  return (
    <div id="projects" ref={containerRef} className="relative w-full" style={{ height: `${Math.max(300, displayRepos.length * 48)}vh` }}>
      <div className="absolute inset-0 bg-[#F7F7F8] -z-10" />
      
      {/* Sticky Fullscreen Presentation Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-14 sm:pt-20">

        {/* Section Header - positioned safely below the floating navbar */}
        <h2 className="absolute top-24 sm:top-28 md:top-32 text-[28px] sm:text-[42px] md:text-[54px] font-black text-[#1F1F1F] tracking-tighter uppercase z-10 pointer-events-none">
          Projects
        </h2>

        {/* Folder Container Wrapper */}
        <div ref={folderWrapperRef} className="relative w-[250px] sm:w-[290px] md:w-[450px] h-[175px] sm:h-[200px] md:h-[300px] mt-24 sm:mt-32 md:mt-40">

          {/* Back of the Folder */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-[#E5E5E7] rounded-3xl shadow-inner border border-gray-300/80">
            {/* Back tab */}
            <div className="absolute -top-8 left-6 w-28 sm:w-32 h-10 bg-[#E5E5E7] rounded-t-2xl border-t border-l border-r border-gray-300/80" />
          </div>

          {/* Project Cards Deck */}
          <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end justify-center pointer-events-none">
            {displayRepos.map((repo, i) => {
              const meta = getProjectMeta(repo.name) || defaultColorDeck[i % defaultColorDeck.length];
              const categoryTag = meta.category || 'SOFTWARE ENGINEERING';
              const badgeLabel = meta.badge || repo.language || 'Code';
              const previewImg = meta.image || '/projects/portfolio.svg';
              const formattedTitle = formatTitle(repo.name);

              return (
                <div
                  key={repo.id || i}
                  ref={el => cardsRef.current[i] = el}
                  className="absolute bottom-4 w-[260px] sm:w-[300px] md:w-[360px] h-[365px] sm:h-[405px] md:h-[450px] origin-bottom z-10 pointer-events-auto cursor-pointer group select-none will-change-transform"
                  onClick={() => setSelectedProject(repo)}
                >
                  <div
                    className="w-full h-full bg-white rounded-[26px] sm:rounded-[30px] border border-black/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] p-3.5 sm:p-4.5 md:p-5 flex flex-col justify-between transition-[transform,box-shadow] duration-200 ease-out group-hover:scale-[1.02] group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_44px_-10px_rgba(0,0,0,0.14)] relative overflow-hidden"
                  >
                    {/* TOP: IMAGE SHOWCASE VIEWPORT */}
                    <div className="relative w-full aspect-[16/10] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-[#0F172A] border border-black/5 shadow-inner shrink-0">
                      {/* Visual Image */}
                      <img
                        src={previewImg}
                        alt={formattedTitle}
                        decoding="async"
                        className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-300 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Floating Category Pill */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/20 shadow-xs z-10">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: meta.accent || '#10B981' }}
                        />
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-white uppercase truncate max-w-[130px] sm:max-w-[170px]">
                          {categoryTag}
                        </span>
                      </div>

                      {/* Live Badge if liveUrl exists */}
                      {(meta.liveUrl || repo.homepage) && (
                        <a
                          href={meta.liveUrl || repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2.5 right-11 sm:right-12 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/85 border border-emerald-400/40 shadow-xs z-10 hover:bg-emerald-900 transition-colors group/live"
                          title="Open Live API (http://140.245.24.219)"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-300">
                            LIVE
                          </span>
                        </a>
                      )}

                      {/* External Link Action Arrow */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(meta.liveUrl || repo.homepage || repo.html_url, '_blank');
                        }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/75 border border-white/25 shadow-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-200 z-10 hover:scale-110 active:scale-95 cursor-pointer"
                        title={meta.liveUrl || repo.homepage ? "Open Live Deployment" : "View on GitHub"}
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </button>

                      {/* Inset Bottom Gradient for Contrast */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                      {/* Badge in Bottom Right of Image */}
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-md bg-black/80 border border-white/15 text-[9px] font-mono font-bold text-white/90">
                          {badgeLabel}
                        </span>
                      </div>
                    </div>

                    {/* MIDDLE: PROJECT DETAILS */}
                    <div className="my-auto py-1.5 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg sm:text-xl md:text-[22px] font-black tracking-tight text-[#111827] group-hover:text-black transition-colors line-clamp-1">
                          {formattedTitle}
                        </h3>
                        {repo.stargazers_count > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold text-amber-700 flex items-center gap-1 shrink-0">
                            ★ {repo.stargazers_count}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] text-gray-600 font-medium line-clamp-2 leading-relaxed">
                        {repo.description || "Production-grade, extensible codebase with modular architecture and rigorous standards."}
                      </p>

                      {/* Mini snippet status row */}
                      {meta.snippet && (
                        <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/70 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.accent || '#10B981' }} />
                          <span className="font-mono text-[10px] sm:text-[11px] font-medium truncate">
                            {meta.snippet}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* BOTTOM: TECH PILLS & EXPLORE CTA */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {meta.tags ? (
                          meta.tags.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-gray-100/90 text-[10px] font-semibold text-gray-700">
                              {t}
                            </span>
                          ))
                        ) : (
                          repo.language && (
                            <span className="px-2 py-0.5 rounded-lg bg-gray-100/90 text-[10px] font-semibold text-gray-700">
                              {repo.language}
                            </span>
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold text-gray-900 group-hover:text-black group-hover:translate-x-1 transition-all duration-200 shrink-0">
                        <span>DETAILS</span>
                        <span>→</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Front Translucent Gloss Folder (Zero Backdrop Blur for High FPS) */}
          <div className="absolute bottom-0 left-0 w-full h-[95%] z-20 pointer-events-none">
            {/* Front Tab */}
            <div className="absolute -top-10 left-0 w-[45%] h-12 bg-white/80 rounded-tr-3xl rounded-tl-3xl border-t border-l border-r border-white/90 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]" />

            {/* Front Body */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-white/80 rounded-3xl rounded-tl-none border border-white/90 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] flex items-end justify-end p-4 sm:p-6">
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

      {/* Interactive Card Morph / Expansion Modal */}
      <ProjectDetailModal
        project={selectedProject}
        meta={selectedProject ? (getProjectMeta(selectedProject.name) || defaultColorDeck[0]) : null}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Projects;
