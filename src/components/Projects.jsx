import React, { useEffect, useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import initialProjects from '../data/projects.json';
import ProjectDetailModal from './ProjectDetailModal';
import ProjectCardFace from './ProjectCardFace';
import { updateSeoMeta, SECTION_SEO } from '../utils/seoRouter';

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
  const [originRect, setOriginRect] = useState(null);
  const [activeCardName, setActiveCardName] = useState(null);

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

  const openProject = (repo, rect = null) => {
    setOriginRect(rect);
    setActiveCardName(repo.name);
    setSelectedProject(repo);

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('project', repo.name);
      window.history.pushState({ modal: 'project', project: repo.name }, '', currentUrl.toString());
    } catch {
      // Fallback
    }

    const meta = getProjectMeta(repo.name);
    updateSeoMeta({
      title: `${repo.name} | Project Case Study — Naveen Kumar`,
      description: meta?.snippet || repo.description || `Case study and technical architecture of ${repo.name} by Naveen Kumar.`,
      canonical: 'https://www.rabbitfolio.me/#projects'
    });
  };

  const closeProject = () => {
    setSelectedProject(null);
    try {
      if (window.history.state?.modal === 'project') {
        window.history.back();
      } else {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('project');
        window.history.replaceState(null, '', currentUrl.toString());
      }
    } catch {
      // Fallback
    }
    updateSeoMeta(SECTION_SEO.projects);
  };

  // Back button closing modal
  useEffect(() => {
    const handlePopState = (e) => {
      if (e?.state?.modal !== 'project') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const deepLinkHandledRef = useRef(false);

  // Deep linking: If URL has ?project=..., automatically open it on mount
  useEffect(() => {
    if (displayRepos.length === 0 || deepLinkHandledRef.current) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const targetProjectName = params.get('project');
      if (targetProjectName && !selectedProject) {
        deepLinkHandledRef.current = true;
        const match = displayRepos.find(
          r => r.name.toLowerCase() === targetProjectName.toLowerCase()
        );
        if (match) {
          const fallbackRect = {
            top: window.innerHeight * 0.25,
            left: window.innerWidth * 0.5 - 180,
            width: 360,
            height: 480
          };
          openProject(match, fallbackRect);
        }
      }
    } catch {
      // Fallback
    }
  }, [displayRepos, selectedProject]);

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
        scrub: 1.2 // Responsive scrub to ensure reverse tracking completes without trailing lag
      }
    });

    // BUFFER 0: Dedicated entry cushion zone.
    // When scrolling up, ensures the reverse animation (folding cards back into deck)
    // is 100% completed and resting before the section unpins and reveals Skills!
    const entryBuffer = 1.2;
    tl.to({}, { duration: entryBuffer });

    // PHASE 1: Cards fan out with spring overshoot ejection physics
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const rotation = (index - centerIndex) * 10;
      const yOffset = -190 - Math.abs(index - centerIndex) * 12;

      tl.to(card, {
        y: yOffset,
        rotationZ: rotation,
        scale: 0.96,
        duration: 1.5,
        ease: "back.out(1.8)" // Spring overshoot ejection as cards pop out of folder
      }, entryBuffer + index * 0.12);
    });

    // PHASE 2: Folder scales & glides with cushioned momentum
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
      ease: "power3.inOut"
    }, "-=0.2");

    // PHASE 3: Cards slide out and spring-settle into horizontal slots
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const xSpread = folderOffset + (index + 1) * cardStep;
      const ySpread = isMobile ? 15 : 40;

      tl.to(card, {
        x: xSpread,
        y: ySpread,
        rotationZ: 0,
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.4)" // Elastic spring settling into resting slot positions
      }, `-=${1.25 - (index * 0.08)}`);
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

    // BUFFER 5: Exit cushion zone before unpinning to Education
    tl.to({}, { duration: 0.8 });

    return () => {
      tl.kill();
    };

  }, { scope: containerRef, dependencies: [displayRepos] });

  return (
    <div id="projects" ref={containerRef} className="relative w-full bg-[#fafafc]" style={{ height: `${Math.max(340, displayRepos.length * 52)}vh` }}>
      <div className="absolute inset-0 bg-[#fafafc] -z-10" />

      {/* Sticky Fullscreen Presentation Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-14 sm:pt-20 bg-[#fafafc]">
        
        {/* Ambient Glows from Contact Us Theme */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-br from-purple-200/40 via-pink-200/25 to-transparent rounded-full blur-[80px] md:blur-[120px] -translate-x-1/3 -translate-y-1/4 opacity-60" />
          <div className="absolute w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-tl from-cyan-200/40 via-blue-100/25 to-transparent rounded-full blur-[80px] md:blur-[120px] translate-x-1/3 translate-y-1/4 opacity-60" />
        </div>

        {/* Section Header - positioned safely behind unstacking cards in the z-axis */}
        <h2 className="absolute top-24 sm:top-28 md:top-32 text-[28px] sm:text-[42px] md:text-[54px] font-black text-[#1F1F1F] tracking-tighter uppercase z-0 pointer-events-none select-none">
          Projects
        </h2>

        {/* Folder Container Wrapper */}
        <div ref={folderWrapperRef} className="relative z-10 w-[250px] sm:w-[290px] md:w-[450px] h-[175px] sm:h-[200px] md:h-[300px] mt-24 sm:mt-32 md:mt-40">

          {/* Back of the Folder */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-[#E5E5E7] rounded-3xl shadow-inner border border-gray-300/80">
            {/* Back tab */}
            <div className="absolute -top-8 left-6 w-28 sm:w-32 h-10 bg-[#E5E5E7] rounded-t-2xl border-t border-l border-r border-gray-300/80" />
          </div>

          {/* Project Cards Deck */}
          <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end justify-center pointer-events-none">
            {displayRepos.map((repo, i) => {
              const meta = getProjectMeta(repo.name) || defaultColorDeck[i % defaultColorDeck.length];

              return (
                <div
                  key={repo.id || i}
                  ref={el => cardsRef.current[i] = el}
                  className="absolute bottom-4 w-[260px] sm:w-[300px] md:w-[360px] h-[395px] sm:h-[445px] md:h-[500px] origin-bottom z-10 pointer-events-auto cursor-pointer group select-none will-change-transform"
                  onClick={(e) => {
                    const visualCard = e.currentTarget.querySelector('.visual-card-surface') || e.currentTarget;
                    const rect = visualCard.getBoundingClientRect();
                    openProject(repo, {
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                    });
                  }}
                >
                  {/* Subtle Recessed Dock Silhouette while Card is Open */}
                  {activeCardName === repo.name && (
                    <div className="absolute inset-0 rounded-[26px] sm:rounded-[30px] bg-black/[0.03] border border-black/[0.04] shadow-inner pointer-events-none z-0" />
                  )}

                  {/* Zero-Gravity Floating Wrapper (Staggered Natural Levitation) */}
                  <div
                    className="w-full h-full animate-card-float group-hover:[animation-play-state:paused]"
                    style={{
                      animationDuration: `${4.2 + (i % 4) * 0.6}s`,
                      animationDelay: `${(i * 0.8) % 3.2}s`,
                      animationPlayState: activeCardName === repo.name ? 'paused' : undefined,
                    }}
                  >
                    <div
                      className={`visual-card-surface w-full h-full transition-[transform,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03] group-hover:-translate-y-2.5 group-hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.16)] active:scale-[0.97] ${
                        activeCardName === repo.name ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <ProjectCardFace repo={repo} meta={meta} />
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

      {/* Interactive Card Morph / 3D Turnaround Expansion Modal */}
      <ProjectDetailModal
        project={selectedProject}
        meta={selectedProject ? (getProjectMeta(selectedProject.name) || defaultColorDeck[0]) : null}
        originRect={originRect}
        isOpen={!!selectedProject}
        onClose={closeProject}
        onExitComplete={() => {
          setOriginRect(null);
          setActiveCardName(null);
        }}
      />
    </div>
  );
};

export default Projects;
