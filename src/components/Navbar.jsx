import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onResumeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Section scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      setScrolled(scrollY > 100);

      const sections = [
        { id: 'experience', offset: 260 },
        { id: 'education', offset: 260 },
        { id: 'projects', offset: 260 },
        { id: 'skills', offset: 260 },
      ];

      if (scrollY < 180) {
        setActiveSection('home');
        return;
      }

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= sec.offset && rect.bottom > 100) {
            setActiveSection(sec.id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 sm:top-7 inset-x-0 z-50 flex justify-center w-full pointer-events-none px-2">
      <nav 
        className={`relative pointer-events-auto flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-full max-w-[96vw] ${scrolled ? 'md:max-w-[700px] md:min-w-[620px]' : 'md:max-w-[520px] md:min-w-[480px]'} rounded-full bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 mx-auto transition-all duration-500`}
      >
        {/* Left side: Home Base / Logo Dock */}
        <div data-nav-item="home" className="flex items-center pl-1 sm:pl-2 md:pl-3 pr-1 sm:pr-2 md:pr-3 shrink-0">
          <button 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-1.5 cursor-pointer group"
            aria-label="RabbitFolio Home"
          >
            {/* Home Dock */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full" />
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
  );
};

export default Navbar;
