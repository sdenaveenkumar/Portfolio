import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Download,
  Copy,
  Check,
  Star,
  GitFork,
  ArrowUpRight,
  Code2,
  Terminal,
  FileText,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';

/**
 * TABLET PREVIEW FRAME
 * 
 * Renders an iPad/Tablet-sized interactive preview frame positioned to the
 * left of the mobile Rabbit Tree chassis when clicking on any link item.
 */
const TabletPreviewFrame = ({ link, onClose, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [resumeDarkMode, setResumeDarkMode] = useState(true);
  const [emailSubject, setEmailSubject] = useState('Project Inquiry / Collaboration');
  const [emailBody, setEmailBody] = useState('Hi Naveen,\n\nI was browsing your portfolio and would love to discuss a project with you.');
  const [waMessage, setWaMessage] = useState('Hi Naveen! I saw your portfolio and would love to connect.');
  const [apiEndpoint, setApiEndpoint] = useState('/health');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    status: 'healthy',
    server: 'Oracle Cloud Ubuntu VPS (140.245.24.219)',
    uptime: '99.98%',
    activeVersion: 'v2.4.0',
    timestamp: new Date().toISOString()
  });

  if (!link) return null;

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestApi = (endpoint) => {
    setApiEndpoint(endpoint);
    setApiLoading(true);
    setTimeout(() => {
      setApiLoading(false);
      if (endpoint === '/health') {
        setApiResponse({
          status: 'healthy',
          server: 'VPS 140.245.24.219',
          latency: '28ms',
          timestamp: new Date().toISOString()
        });
      } else if (endpoint === '/api/v1/projects') {
        setApiResponse({
          count: 3,
          projects: [
            { id: 'dolphin', name: 'Dolphin AI Assistant', status: 'live' },
            { id: 'lofi-cli', name: 'Lofi CLI Workspace', status: 'open-source' },
            { id: 'api', name: 'Cloud REST Gateway', status: 'active' }
          ]
        });
      } else {
        setApiResponse({
          skills: ['React 19', 'Node.js', 'Python', 'TailwindCSS', 'Docker', 'REST API'],
          level: 'Senior Full Stack'
        });
      }
    }, 400);
  };

  return (
    <motion.div
      data-device-chassis="true"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, x: typeof window !== 'undefined' ? -Math.max(window.innerWidth * 0.85, 800) : -800, scale: 0.97 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 30,
          stiffness: 170,
          mass: 0.9
        }
      }}
      exit={{
        opacity: 0,
        x: typeof window !== 'undefined' ? -Math.max(window.innerWidth * 0.85, 800) : -800,
        scale: 0.98,
        transition: {
          x: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.42, delay: 0.18, ease: 'easeInOut' }
        }
      }}
      className="pointer-events-auto relative flex-1 min-w-0 h-[94vh] max-h-[840px] rounded-[38px] sm:rounded-[44px] p-[10px] sm:p-[12px] bg-gradient-to-b from-[#3c3c3e] via-[#1a1a1c] to-[#2a2a2c] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.18)] flex flex-col select-none cursor-default"
    >
      {/* Tablet Screen Container */}
      <div className="relative w-full h-full rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#0c0c0e] border border-white/[0.08] flex flex-col shadow-inner">

        {/* ─────────────────────────────────────────────────────────────
            TABLET TOP BROWSER / SYSTEM HEADER
           ───────────────────────────────────────────────────────────── */}
        <div className="w-full px-4 sm:px-5 py-3 bg-[#161618] border-b border-white/[0.08] flex items-center justify-between shrink-0 gap-3 select-none">
          
          {/* Left: Window Controls & Back on Mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group"
              title="Close Preview"
            >
              <X className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
            <button
              onClick={onClose}
              className="lg:hidden flex items-center gap-1 ml-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
              title="Back to Links"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>

          {/* Center: Tablet URL Pill */}
          <div className="flex-1 max-w-[340px] px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300 font-mono truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {link.id === 'resume' && 'naveenkumar.dev/resume.pdf'}
              {link.id === 'github' && 'github.com/sdenaveenkumar'}
              {link.id === 'linkedin' && 'linkedin.com/in/sdenaveenkumar'}
              {link.id === 'email' && 'mailto:sdenaveenkumar@gmail.com'}
              {link.id === 'whatsapp' && 'wa.me/sdenaveenkumar'}
              {link.id === 'projects' && 'naveenkumar.dev/#projects'}
              {link.id === 'portfolio' && 'naveenkumar.dev/'}
              {link.id === 'live-api' && 'api.naveenkumar.dev (140.245.24.219)'}
            </span>
          </div>

          {/* Right: Actions (Open New Tab & Close) */}
          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              download={link.download}
              onClick={(e) => {
                if (link.isInternal && onNavigate) {
                  e.preventDefault();
                  onNavigate(link.url);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Open full page in new tab"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TABLET VIEWPORT CONTENT (Specialized by link type)
           ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-[#0e0e11] text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="h-full flex flex-col justify-start"
            >

          {/* 1. RESUME PREVIEW */}
          {link.id === 'resume' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">Full Stack Engineer Resume</h3>
                    <p className="text-xs text-zinc-400">PDF Document // sdenaveenkumar.pdf</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setResumeDarkMode(prev => !prev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold border border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title={resumeDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {resumeDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                    <span className="text-[11px] font-mono hidden sm:inline">{resumeDarkMode ? 'Light' : 'Dark'}</span>
                  </button>
                  <a
                    href="/resume.pdf"
                    download="sdenaveenkumar.pdf"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Embedded Document Frame */}
              <div className="flex-1 min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#09090c] flex flex-col relative">
                <iframe
                  src="/resume.pdf#view=FitH&toolbar=0"
                  title="Naveen Kumar Resume"
                  style={{
                    filter: resumeDarkMode ? 'invert(0.92) hue-rotate(180deg) contrast(0.95) brightness(0.95)' : 'none',
                    transition: 'filter 0.3s ease-in-out'
                  }}
                  className="w-full h-full min-h-[460px] border-none bg-[#09090c]"
                />
              </div>
            </div>
          )}

          {/* 2. GITHUB PREVIEW */}
          {link.id === 'github' && (
            <div className="flex flex-col gap-5">
              {/* Profile Card Banner */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/projects/RabbitTreeProfile.jpeg"
                    alt="Naveen Kumar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg sm:text-xl text-white">Naveen Kumar</h3>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-zinc-300">@sdenaveenkumar</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Full Stack Software Engineer // Cloud Systems &amp; Modern UI</p>
                  </div>
                </div>

                <a
                  href="https://github.com/sdenaveenkumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Follow on GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Pinned Repositories Grid */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Featured Open Source Repositories</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'Dolphin-AI',
                      desc: 'Full-stack AI assistant with real-time streaming, multimodal context, and responsive audio visualizer.',
                      lang: 'TypeScript',
                      stars: '24',
                      forks: '6'
                    },
                    {
                      name: 'Lofi-CLI',
                      desc: 'Distraction-free desktop terminal audio streamer and focus utility built for software engineers.',
                      lang: 'Go / Shell',
                      stars: '18',
                      forks: '4'
                    },
                    {
                      name: 'Portfolio-3D',
                      desc: 'Interactive 3D companion portfolio built with React 19, Framer Motion, GSAP, and Tailwind CSS.',
                      lang: 'React / Three.js',
                      stars: '32',
                      forks: '9'
                    },
                    {
                      name: 'Cloud-REST-API',
                      desc: 'High-concurrency microservice APIs with Redis caching, PostgreSQL, Docker containerization, and VPS deployment.',
                      lang: 'Node.js / Express',
                      stars: '15',
                      forks: '3'
                    }
                  ].map((repo) => (
                    <a
                      key={repo.name}
                      href={`https://github.com/sdenaveenkumar`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl bg-[#141417] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-blue-400 group-hover:underline flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-zinc-400" />
                            {repo.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">Public</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{repo.desc}</p>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          {repo.lang}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-zinc-500" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-zinc-500" />
                          {repo.forks}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. LINKEDIN PREVIEW */}
          {link.id === 'linkedin' && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#141416] shadow-xl">
                {/* LinkedIn Cover Banner Header */}
                <div className="h-28 sm:h-36 md:h-40 bg-gradient-to-r from-[#00366a] via-[#0a66c2] to-[#001f42] relative p-4 sm:p-5 flex justify-between items-start overflow-hidden">
                  {/* Subtle Grid / Texture Accent */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:16px_16px] pointer-events-none" />
                  
                  {/* Left: LinkedIn Branding Pill */}
                  <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                    <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61 0 .88.72 1.6 1.61 1.6.88 0 1.6-.72 1.6-1.6 0-.89-.72-1.61-1.6-1.61Z" />
                    </svg>
                    <span className="text-[11px] font-bold text-white tracking-wide">LinkedIn</span>
                  </div>

                  {/* Right: Profile Slug Pill */}
                  <span className="relative z-10 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-zinc-200 border border-white/15">
                    in/sdenaveenkumar
                  </span>
                </div>

                {/* Profile Information Block (Clear separation - no overlapping text) */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
                    {/* Avatar with clean negative margin only on image */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3.5 sm:gap-4">
                      <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                        <img
                          src="/projects/RabbitTreeProfile.jpeg"
                          alt="Naveen Kumar"
                          className="w-full h-full rounded-2xl sm:rounded-3xl object-cover border-4 border-[#141416] shadow-2xl bg-zinc-900"
                        />
                        <span 
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-[#141416] rounded-full" 
                          title="Open to Work" 
                        />
                      </div>

                      {/* Name & Headline - comfortably below banner */}
                      <div className="mt-1 sm:mt-0 sm:mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-xl sm:text-2xl text-white tracking-tight">Naveen Kumar</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            1st
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Open to Work
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-1">
                          Full Stack Software Engineer • React, Node.js, Cloud Architectures
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Bengaluru, Karnataka, India • <span className="text-blue-400 font-medium">500+ connections</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0 sm:self-end flex-wrap">
                      <a
                        href="https://www.linkedin.com/in/sdenaveenkumar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Connect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/sdenaveenkumar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>View Profile</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#141417] border border-white/[0.08]">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Core Expertise</span>
                  <p className="font-bold text-sm text-white mt-1">Full-Stack Development</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">React 19, TypeScript, Node.js, Express, Next.js</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141417] border border-white/[0.08]">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Cloud &amp; DevOps</span>
                  <p className="font-bold text-sm text-white mt-1">Infrastructure &amp; CI/CD</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Docker, Linux VPS, Nginx, CI/CD, REST APIs</p>
                </div>
                <div className="p-4 rounded-xl bg-[#141417] border border-white/[0.08] sm:col-span-2 lg:col-span-1">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Location &amp; Work</span>
                  <p className="font-bold text-sm text-white mt-1">Open to Roles</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Global Remote &amp; On-site Opportunities</p>
                </div>
              </div>

              {/* About Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 flex flex-col gap-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 font-mono">About</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Full Stack Engineer specializing in reactive web applications, fluid interactive systems, and resilient cloud architectures. Experienced in building production-grade software with modern frameworks and robust backend services.
                </p>
              </div>
            </div>
          )}

          {/* 4. WHATSAPP INTERACTIVE CHAT PREVIEW */}
          {link.id === 'whatsapp' && (
            <div className="h-full flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b141a] flex flex-col flex-1 min-h-[460px]">
                
                {/* WhatsApp Chat Header */}
                <div className="px-4 py-3 bg-[#1f2c34] flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src="/projects/RabbitTreeProfile.jpeg"
                      alt="Naveen Kumar"
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">Naveen Kumar</h4>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        online (wa.me/sdenaveenkumar)
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/sdenaveenkumar?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#25d366] hover:bg-[#128c7e] text-black text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Open in WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                  </a>
                </div>

                {/* Chat Bubbles Area */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3 justify-end bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                  {/* Incoming greeting bubble */}
                  <div className="self-start max-w-[85%] bg-[#1f2c34] text-zinc-100 p-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-sm border border-white/5 shadow-md">
                    <p>Hi there! 👋 Thanks for visiting RabbitFolio. What project, engineering idea, or opportunity would you like to discuss?</p>
                    <span className="text-[10px] text-zinc-400 float-right mt-1.5">Just now</span>
                  </div>

                  {/* Outgoing preview bubble */}
                  <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-md">
                    <p>{waMessage || "Type a message below..."}</p>
                    <span className="text-[10px] text-emerald-200 float-right mt-1.5">Draft</span>
                  </div>
                </div>

                {/* Interactive Message Input Box */}
                <div className="p-3 bg-[#1f2c34] border-t border-white/5 flex items-center gap-2">
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Type your message to Naveen..."
                    className="flex-1 bg-[#2a3942] text-white text-xs sm:text-sm px-4 py-2.5 rounded-full outline-none placeholder:text-zinc-400 border border-transparent focus:border-emerald-500/50"
                  />
                  <a
                    href={`https://wa.me/sdenaveenkumar?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-[#25d366] hover:bg-[#1da851] text-black transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Send to WhatsApp"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 5. EMAIL COMPOSER PREVIEW */}
          {link.id === 'email' && (
            <div className="h-full flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Direct Dispatch Email</h3>
                    <p className="text-xs text-zinc-400">To: sdenaveenkumar@gmail.com</p>
                  </div>
                  <button
                    onClick={() => handleCopy('sdenaveenkumar@gmail.com')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Message Body</label>
                    <textarea
                      rows={6}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white outline-none focus:border-white/30 resize-none"
                    />
                  </div>

                  <a
                    href={`mailto:sdenaveenkumar@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                    className="self-end px-5 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via Mail Client</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 6. LIVE REST API CONSOLE */}
          {link.id === 'live-api' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5 bg-[#141417] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base sm:text-lg">Live VPS REST API</h3>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE // 200 OK
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">Host: http://140.245.24.219 (Interactive API Endpoints)</p>
              </div>

              {/* Endpoint Runner Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {['/health', '/api/v1/projects', '/api/v1/skills'].map((ep) => (
                  <button
                    key={ep}
                    onClick={() => handleTestApi(ep)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      apiEndpoint === ep
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-zinc-300'
                    }`}
                  >
                    GET {ep}
                  </button>
                ))}
              </div>

              {/* JSON Terminal Response Viewer */}
              <div className="rounded-xl bg-black border border-white/10 p-4 font-mono text-xs overflow-x-auto relative">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-zinc-500 text-[11px]">
                  <span>RESPONSE [JSON]</span>
                  <span>{apiLoading ? 'Fetching...' : 'Status: 200 OK'}</span>
                </div>
                <pre className="text-emerald-400 leading-relaxed">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* 7. PORTFOLIO & PROJECTS SITEMAP */}
          {(link.id === 'portfolio' || link.id === 'projects') && (
            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-[#141417] border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {link.id === 'projects' ? 'Featured Case Studies' : 'Portfolio Interactive Sections'}
                  </h3>
                  <p className="text-xs text-zinc-400">Click any section to smoothly jump directly to it.</p>
                </div>
                <button
                  onClick={() => onNavigate ? onNavigate(link.url) : window.location.href = link.url}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  Jump to {link.title}
                </button>
              </div>

              {/* Interactive Section Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Projects / Case Studies', anchor: '/#projects', desc: 'Dolphin AI, Lofi CLI, Personal API with live demos.' },
                  { name: 'Core Skills', anchor: '/#skills', desc: 'Interactive 3D orbital tech stack with Three.js & Lucide.' },
                  { name: 'Academics & Education', anchor: '/#education', desc: 'Degree credentials, coursework & computer science foundation.' },
                  { name: 'Experience & History', anchor: '/#experience', desc: 'Software engineering roles, architecture & delivery impact.' },
                  { name: 'Call To Action (Idea!)', anchor: '/#cta', desc: 'Zero-gravity floating cards & Rabbit companion interaction.' },
                  { name: 'Contact Dispatch', anchor: '/#contact', desc: 'Direct multi-step inquiry form with dynamic animations.' }
                ].map((sec) => (
                  <div
                    key={sec.anchor}
                    onClick={() => onNavigate ? onNavigate(sec.anchor) : window.location.href = sec.anchor}
                    className="p-4 rounded-xl bg-[#141416] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{sec.name}</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5">{sec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default TabletPreviewFrame;
