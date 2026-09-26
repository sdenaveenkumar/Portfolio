import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onResumeClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center w-full pointer-events-none px-2">
      <nav 
        className={`pointer-events-auto flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-full max-w-[96vw] ${scrolled ? 'md:max-w-[700px] md:min-w-[620px]' : 'md:max-w-[520px] md:min-w-[480px]'} rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 mx-auto transition-all duration-500`}
      >
        {/* Left side: Logo */}
        <div className="flex items-center pl-1 sm:pl-2 md:pl-4 pr-1 sm:pr-2 md:pr-4 shrink-0">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2 cursor-pointer"
            aria-label="RabbitFolio Home"
          >
            <img src="/logo.png" alt="RabbitFolio" className="w-7 h-7 sm:w-8 sm:h-8 object-contain hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Right side: Links */}
        <motion.div layout className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-[11px] md:text-[13px] font-semibold text-[#111111] group">
          <motion.button layout onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-sm">Skills</motion.button>
          <motion.button layout onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-sm">Projects</motion.button>
          <motion.button layout onClick={() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-sm">
            <span className="inline sm:hidden">Edu</span>
            <span className="hidden sm:inline">Academics</span>
          </motion.button>
          <motion.button layout onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-sm">
            <span className="inline sm:hidden">Exp</span>
            <span className="hidden sm:inline">Experience</span>
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
                  className="px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 ml-1 bg-black text-white hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[10px] sm:text-xs font-bold">
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
