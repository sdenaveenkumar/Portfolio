import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, X } from 'lucide-react';

const resumePages = [
  '/resume-pages/page-1.jpg',
  '/resume-pages/page-2.jpg',
  '/resume-pages/page-3.jpg',
  '/resume-pages/page-4.jpg',
  '/resume-pages/page-5.jpg',
  '/resume-pages/page-6.jpg',
  '/resume-pages/page-7.jpg',
  '/resume-pages/page-8.jpg',
];

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
          className="h-14 sm:h-16 bg-[#16161c]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10"
        >
          {/* Left: Window Controls / Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 shadow-sm cursor-pointer transition-colors flex items-center justify-center group"
              title="Close (Esc)"
              aria-label="Close Resume"
            >
              <X className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-sm hidden sm:block" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-sm hidden sm:block" />
          </div>

          {/* Center: File Title Badge */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest bg-white/[0.06] backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>resume.pdf</span>
            <span className="text-zinc-500 font-normal">({resumePages.length} Pages)</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Open raw PDF in new tab"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>
            <a
              href="/resume.pdf"
              download="NaveenKumar_Resume.pdf"
              title="Download PDF"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </motion.div>

        {/* In-App Direct Document Viewer (100% Mobile & Desktop Compatible) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="w-full flex-1 bg-[#141418] relative overflow-y-auto overscroll-contain scroll-smooth"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6 py-4 sm:py-6 px-2.5 sm:px-6 max-w-[840px] mx-auto">
            {resumePages.map((pageSrc, idx) => (
              <div
                key={idx}
                className="relative w-full bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
              >
                <img
                  src={pageSrc}
                  alt={`Resume page ${idx + 1}`}
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="w-full h-auto object-contain select-none block"
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] font-mono font-bold text-black/60 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm select-none border border-black/5">
                  Page {idx + 1} of {resumePages.length}
                </div>
              </div>
            ))}

            {/* Bottom Actions footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full py-4 text-xs text-zinc-400 border-t border-white/10 gap-3">
              <span className="font-mono text-[11px] text-zinc-500">
                End of Resume • {resumePages.length} Pages
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF File</span>
                </a>
                <a
                  href="/resume.pdf"
                  download="NaveenKumar_Resume.pdf"
                  className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Resume;
