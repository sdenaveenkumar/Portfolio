import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative md:fixed bottom-0 left-0 w-full min-h-[50vh] md:h-[75vh] h-auto bg-black text-white pt-16 pb-12 md:pb-0 px-6 md:px-16 overflow-hidden flex flex-col justify-between z-0">
      
      {/* Ambient glowing orbs in the background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-900/30 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-purple-900/30 to-transparent blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full relative z-10">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 border-b border-white/10 pb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Let's build<br />something <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">amazing.</span>
          </h2>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-10 py-4 bg-white text-black rounded-full text-lg font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Get in Touch
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* 3-Column Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-auto">
          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white mb-2">Navigation</h3>
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Home</span>
            <span onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Skills</span>
            <span onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Projects</span>
            <span onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Experience</span>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white mb-2">Connect</h3>
            <span onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Contact Me</span>
            <a href="/resume.pdf" download="sdenaveenkumar.pdf" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Resume</a>
          </div>

          {/* Say hello! */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white mb-2">Socials</h3>
            <div className="flex flex-row gap-4 items-start">
              <a href="https://github.com/sdenaveenkumar" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all cursor-pointer">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/sdenaveenkumar" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all cursor-pointer">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Massive Name */}
        <div className="w-full flex justify-center mt-auto pb-20 md:pb-32">
          <div className="text-[20vw] md:text-[22vw] font-black leading-none tracking-tighter select-none mb-0 flex py-4">
            {Array.from("naveen").map((letter, i) => (
              <motion.span
                key={i}
                className="text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/0 inline-block"
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
