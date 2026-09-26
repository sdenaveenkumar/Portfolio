import React from 'react';
import { motion } from 'framer-motion';

const Resume = ({ onClose }) => {
  return (
    <>
      {/* Dark backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
      />

      {/* Slide-in drawer (The Resume Viewer itself) */}
      <motion.section
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220, mass: 0.8 }}
        className="fixed top-0 right-0 w-full md:w-[80vw] max-w-[1000px] h-screen bg-white/40 backdrop-blur-3xl border-l border-white/50 shadow-[-30px_0_80px_rgba(0,0,0,0.15)] z-[101] flex flex-col rounded-none sm:rounded-l-3xl overflow-hidden"
      >

        {/* Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-14 sm:h-16 bg-white/30 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10"
        >
          <div className="flex gap-1.5 sm:gap-2">
            <button onClick={onClose} className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-400 hover:bg-red-500 shadow-sm cursor-pointer transition-colors" title="Close" />
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400 shadow-sm" />
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-400 shadow-sm" />
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-widest bg-white/50 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-md shadow-sm border border-white/40">
            resume.pdf
          </div>
          <div className="flex justify-end">
            <a
              href="/resume.pdf"
              download="NaveenKumar_Resume.pdf"
              title="Download PDF"
              className="group relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#111111] text-white rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Download</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="w-full flex-1 bg-black/5 relative"
        >
            <object
              data="/resume.pdf"
              type="application/pdf"
              className="w-full h-full"
            >
              {/* Fallback if PDF embedding fails */}
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium mb-6">
                  It looks like your browser doesn't support embedded PDFs.
                </p>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#111111] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Download PDF Instead
                </a>
              </div>
            </object>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Resume;
