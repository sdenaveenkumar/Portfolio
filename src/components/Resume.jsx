import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Download, FileText } from 'lucide-react';

const Resume = ({ onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <>
      {/* Dark backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] cursor-pointer"
      />

      {/* Slide-in drawer (The Resume Viewer itself) */}
      <motion.section
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220, mass: 0.8 }}
        className="fixed top-0 right-0 w-full md:w-[80vw] max-w-[1000px] h-screen bg-[#0e0e12]/95 backdrop-blur-3xl border-l border-white/10 shadow-[-30px_0_80px_rgba(0,0,0,0.7)] z-[101] flex flex-col rounded-none sm:rounded-l-3xl overflow-hidden text-white"
      >

        {/* Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-14 sm:h-16 bg-[#16161c]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10"
        >
          {/* Left: Window Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 shadow-sm cursor-pointer transition-colors" 
              title="Close (Esc)" 
            />
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-sm" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-sm" />
          </div>

          {/* Center: File Title Badge */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest bg-white/[0.06] backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>resume.pdf</span>
          </div>

          {/* Right: Actions (Theme Toggle & Download) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold border border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
              <span className="text-[11px] font-mono hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Download Button */}
            <a
              href="/resume.pdf"
              download="NaveenKumar_Resume.pdf"
              title="Download PDF"
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="w-full flex-1 bg-[#09090c] relative overflow-hidden"
        >
          <object
            data="/resume.pdf"
            type="application/pdf"
            style={{
              filter: isDarkMode ? 'invert(0.92) hue-rotate(180deg) contrast(0.95) brightness(0.95)' : 'none',
              transition: 'filter 0.3s ease-in-out'
            }}
            className="w-full h-full bg-[#09090c]"
          >
            {/* Fallback if PDF embedding fails */}
            <div className="p-8 text-center flex flex-col items-center justify-center h-full text-zinc-400">
              <FileText className="w-16 h-16 text-zinc-600 mb-4" />
              <p className="font-medium mb-6 text-zinc-300">
                It looks like your browser doesn't support embedded PDFs directly.
              </p>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Open / Download PDF
              </a>
            </div>
          </object>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Resume;
