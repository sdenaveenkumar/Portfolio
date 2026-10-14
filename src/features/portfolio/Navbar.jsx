import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Terminal, FolderGit2, GraduationCap, MessageSquare, FileText } from 'lucide-react';
import { updateSeoMeta, SECTION_SEO, syncUrlHash, scrollToHash } from '../../utils/seoRouter';

const mobileTabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'skills', label: 'Skills', Icon: Terminal },
  { id: 'projects', label: 'Projects', Icon: FolderGit2 },
  { id: 'education', label: 'Academics', Icon: GraduationCap },
  { id: 'experience', label: 'Contact', Icon: MessageSquare },
];

const Navbar = ({ onResumeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pendingRabbitHomeRef = useRef(false);
  const rabbitHomeTimeoutRef = useRef(null);

  // Synchronize Resume section disappearance with the rabbit jumping to his place first
  useEffect(() => {
    const handleRabbitLandedHome = () => {
      if (pendingRabbitHomeRef.current) {
        if (rabbitHomeTimeoutRef.current) {
          clearTimeout(rabbitHomeTimeoutRef.current);
          rabbitHomeTimeoutRef.current = null;
        }
        pendingRabbitHomeRef.current = false;
        // Natural micro-pause upon landing so user sees the rabbit in his place before resume folds away
        setTimeout(() => {
          setScrolled(false);
        }, 80);
      }
    };

    window.addEventListener('rabbit-landed-home', handleRabbitLandedHome);
    return () => {
      window.removeEventListener('rabbit-landed-home', handleRabbitLandedHome);
      if (rabbitHomeTimeoutRef.current) {
        clearTimeout(rabbitHomeTimeoutRef.current);
      }
    };
  }, []);

  // Section scroll tracking with requestAnimationFrame throttle and navigation lock
  useEffect(() => {
    let ticking = false;
    let currentScrolled = false;
    let currentSection = 'home';
    let scrollEndDebounceTimer = null;

    const clearNavLock = () => {
      if (window.__navTargetLock) {
        window.__navTargetLock = null;
      }
    };

    const updateScroll = () => {
      ticking = false;
      const scrollY = window.scrollY || 0;
      const isScrolled = scrollY > 100;

      // Navigation lock: during programmatic smooth scroll to a selected tab, freeze activeSection to target
      if (window.__navTargetLock) {
        const now = performance.now();
        if (now < window.__navTargetLock.expiryTime) {
          const lockTarget = window.__navTargetLock.target;
          if (currentSection !== lockTarget) {
            currentSection = lockTarget;
            setActiveSection(lockTarget);
          }
          return;
        } else {
          window.__navTargetLock = null;
        }
      }

      if (isScrolled) {
        // Scrolling down: show resume section immediately and expand navbar
        if (rabbitHomeTimeoutRef.current) {
          clearTimeout(rabbitHomeTimeoutRef.current);
          rabbitHomeTimeoutRef.current = null;
        }
        pendingRabbitHomeRef.current = false;
        if (!currentScrolled) {
          currentScrolled = true;
          setScrolled(true);
        }
      } else {
        // Scrolling up to home: if resume is currently visible, hold it until the rabbit jumps home!
        if (currentScrolled && !pendingRabbitHomeRef.current) {
          pendingRabbitHomeRef.current = true;
          currentScrolled = false;
          // Safe fallback in case rabbit is already docked or event delayed
          rabbitHomeTimeoutRef.current = setTimeout(() => {
            if (pendingRabbitHomeRef.current) {
              pendingRabbitHomeRef.current = false;
              setScrolled(false);
            }
          }, 520);
        }
      }

      let newSection = 'home';
      if (scrollY >= 140) {
        const sections = [
          { id: 'contact', offset: 280 },
          { id: 'cta', offset: 280 },
          { id: 'experience', offset: 280 },
          { id: 'education', offset: 280 },
          { id: 'projects', offset: 280 },
          { id: 'skills', offset: 280 },
        ];

        // Hysteresis preference: if currently on an active section and its container remains comfortably in view, stay on it!
        const curEl = currentSection !== 'home' ? document.getElementById(currentSection) : null;
        if (curEl) {
          const cRect = curEl.getBoundingClientRect();
          if (cRect.top <= 280 && cRect.bottom > 150) {
            newSection = currentSection;
          }
        }

        if (newSection === 'home') {
          for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= sec.offset && rect.bottom > 120) {
                newSection = (sec.id === 'contact' || sec.id === 'cta') ? 'experience' : sec.id;
                break;
              }
            }
          }
        }
      }

      if (newSection !== currentSection) {
        currentSection = newSection;
        setActiveSection(newSection);
        syncUrlHash(newSection, true);
        if (SECTION_SEO[newSection]) {
          updateSeoMeta(SECTION_SEO[newSection]);
        }
      }
    };

    const handleScroll = () => {
      // Clear nav lock once scroll has been quiet for 220ms
      if (window.__navTargetLock) {
        if (scrollEndDebounceTimer) clearTimeout(scrollEndDebounceTimer);
        scrollEndDebounceTimer = setTimeout(() => {
          clearNavLock();
          updateScroll();
        }, 220);
      }

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const handleScrollEnd = () => {
      clearNavLock();
      updateScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollEndDebounceTimer) clearTimeout(scrollEndDebounceTimer);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const effectiveTarget = (sectionId === 'contact' || sectionId === 'cta') ? 'experience' : sectionId;
    
    // Set global navigation lock so intermediate sections are not activated during smooth scroll
    window.__navTargetLock = {
      target: effectiveTarget,
      rawTarget: sectionId,
      startTime: performance.now(),
      expiryTime: performance.now() + 2000,
    };

    setActiveSection(effectiveTarget);
    syncUrlHash(effectiveTarget, false);
    if (SECTION_SEO[effectiveTarget]) {
      updateSeoMeta(SECTION_SEO[effectiveTarget]);
    }

    // Broadcast direct leap event to RabbitCompanion
    window.dispatchEvent(new CustomEvent('rabbit-nav-leap', {
      detail: { target: effectiveTarget }
    }));

    if (effectiveTarget === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // When navigating to home, keep resume visible until the rabbit jumps to his place
      if (scrolled) {
        pendingRabbitHomeRef.current = true;
        if (rabbitHomeTimeoutRef.current) clearTimeout(rabbitHomeTimeoutRef.current);
        rabbitHomeTimeoutRef.current = setTimeout(() => {
          if (pendingRabbitHomeRef.current) {
            pendingRabbitHomeRef.current = false;
            setScrolled(false);
          }
        }, 550);
      }
    } else {
      scrollToHash(sectionId);
    }
  };

  return (
    <>
      {/* 📱 Mobile Top-Left Floating Button: Resume (Symmetrically balances Rabbit Tree on Top-Right) */}
      <div className="fixed top-[calc(env(safe-area-inset-top,0px)+0.75rem)] left-3 sm:left-6 z-40 flex md:hidden pointer-events-none">
        <button 
          onClick={onResumeClick}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/85 hover:bg-white text-gray-900 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
          title="Open Resume"
          aria-label="Open Resume"
        >
          <FileText className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-bold text-xs tracking-tight text-black">
            Resume
          </span>
        </button>
      </div>

      {/* 💻 Desktop / Tablet Top Island Navbar (>= 768px) */}
      <div className="fixed top-8 inset-x-0 z-40 hidden md:flex justify-center w-full pointer-events-none px-2">
        <nav 
          data-desktop-nav
          className={`relative pointer-events-auto flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-full max-w-[96vw] ${scrolled ? 'md:max-w-[700px] md:min-w-[620px]' : 'md:max-w-[520px] md:min-w-[480px]'} rounded-full bg-white/75 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 mx-auto transition-all duration-500`}
        >
          {/* Left side: Home Base / Logo Dock */}
          <div data-nav-item="home" className="flex items-center pl-1 sm:pl-2 md:pl-3 pr-1 sm:pr-2 md:pr-3 shrink-0">
            <button 
              onClick={() => scrollToSection('home')} 
              className="flex items-center cursor-pointer group"
              aria-label="RabbitFolio Home"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9" />
            </button>
          </div>

          {/* Right side: Navigation Links */}
          <motion.div layout className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-[11px] md:text-[13px] font-semibold text-[#111111] group">
            <motion.button 
              layout 
              data-nav-item="skills"
              onClick={() => scrollToSection('skills')} 
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${activeSection === 'skills' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              <span className="inline-block pointer-events-none">Skills</span>
            </motion.button>

            <motion.button 
              layout 
              data-nav-item="projects"
              onClick={() => scrollToSection('projects')} 
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${activeSection === 'projects' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              <span className="inline-block pointer-events-none">Projects</span>
            </motion.button>

            <motion.button 
              layout 
              data-nav-item="education"
              onClick={() => scrollToSection('education')} 
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${activeSection === 'education' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              <span className="inline-block pointer-events-none">
                <span className="sm:hidden">Edu</span>
                <span className="hidden sm:inline">Academics</span>
              </span>
            </motion.button>

            <motion.button 
              layout 
              data-nav-item="experience"
              onClick={() => scrollToSection('experience')} 
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-colors duration-200 cursor-pointer ${activeSection === 'experience' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              <span className="inline-block pointer-events-none">
                <span className="sm:hidden">Exp</span>
                <span className="hidden sm:inline">Experience</span>
              </span>
            </motion.button>
            
            <AnimatePresence>
              {scrolled && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden flex items-center justify-end"
                >
                  <button 
                    onClick={onResumeClick}
                    className="px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 ml-1 bg-black text-white hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[10px] sm:text-xs font-bold shadow-sm"
                  >
                    Resume
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </div>

      {/* 📱 Mobile iOS / Android Floating Bottom Tab Bar (< 768px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex md:hidden justify-center w-full pointer-events-none pb-[calc(env(safe-area-inset-bottom,0px)+0.6rem)] px-3">
        <nav
          data-mobile-tab-bar
          className="pointer-events-auto flex items-center justify-around px-2 py-1.5 w-full max-w-[380px] rounded-[28px] bg-white/85 backdrop-blur-2xl border border-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)] text-gray-800 mx-auto transition-all"
        >
          {mobileTabs.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                data-nav-item={id}
                onClick={() => scrollToSection(id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 select-none ${
                  isActive ? 'text-black' : 'text-gray-400 hover:text-gray-700'
                }`}
                title={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTabGlow"
                    className="absolute inset-0 bg-black/[0.06] rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${isActive ? 'font-black' : 'font-medium'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
