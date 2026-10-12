import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const Resume = ({ onClose }) => {
  // Prevent background page scrolling while resume modal is open
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* Dark backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] cursor-pointer"
      />

      {/* Slide-in drawer (The Resume Viewer itself) */}
      <motion.section
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220, mass: 0.8 }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="fixed top-0 right-0 w-full md:w-[80vw] max-w-[1000px] h-screen bg-[#0e0e12]/95 backdrop-blur-3xl border-l border-white/10 shadow-[-30px_0_80px_rgba(0,0,0,0.7)] z-[101] flex flex-col rounded-none sm:rounded-l-3xl overflow-hidden text-white overscroll-contain"
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

          {/* Right: Action (Download) */}
          <div className="flex items-center gap-2 sm:gap-3">
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

        {/* PDF Viewer - Clean Light Mode Rendering */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="w-full flex-1 bg-[#18181c] relative overflow-hidden"
        >
          <object
            data="/resume.pdf"
            type="application/pdf"
            className="w-full h-full bg-[#18181c]"
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
