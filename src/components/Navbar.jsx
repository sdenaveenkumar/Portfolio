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
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center w-full pointer-events-none">
      <nav 
        className={`pointer-events-auto flex items-center justify-between px-2 md:px-4 py-2 w-[95%] ${scrolled ? 'max-w-[700px] md:min-w-[650px]' : 'max-w-[500px] md:min-w-[500px]'} rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 mx-auto transition-all duration-500`}
      >
        {/* Left side: Logo */}
        <div className="flex items-center pl-2 md:pl-4 pr-2 md:pr-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logo.png" alt="RabbitFolio" className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Right side: Links */}
        <motion.div layout className="flex items-center space-x-0 sm:space-x-1 pr-1 text-[11px] md:text-[13px] font-semibold text-[#111111] group">
          <motion.button layout onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/50 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">Skills</motion.button>
          <motion.button layout onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/50 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">Projects</motion.button>
          <motion.button layout onClick={() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/50 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">Academics</motion.button>
          <motion.button layout onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-transparent transition-all duration-300 cursor-pointer group-hover:text-gray-400 hover:!text-black hover:bg-white/50 hover:backdrop-blur-xl hover:border-white/60 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">Experience</motion.button>
          
          <AnimatePresence>
            {scrolled && (
              <motion.div
                layout
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 96 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden flex items-center justify-end"
              >
                <button 
                  onClick={onResumeClick}
                  className="px-3 md:px-4 py-1.5 md:py-2 ml-1 bg-black text-white hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap cursor-pointer">
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
