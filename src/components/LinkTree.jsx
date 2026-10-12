import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';

/**
 * LINK TREE COMPONENT (/link)
 * 
 * Faithfully matches the user's reference design:
 * 1. Top Card: Rounded cinematic portrait (amber/warm rim-lighting aesthetic).
 * 2. Profile Card: Dark container (#141416) with "Embedded Content" badge, massive uppercase name, and subtitle.
 * 3. Links Stack: High-contrast white rounded cards with black bold text and distinctive black rounded-square arrow badges (↗).
 * 4. Mobile-first: Ultra-responsive, smooth touch targets, fast load, and native share/copy support.
 */

const LinkTree = ({ onBackToPortfolio, isEmbedded = false, onSelectLink, activeLinkId }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Link Items List
  const links = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Interactive 3D Portfolio & Creative Engineering',
      url: '/',
      isInternal: true,
      badge: 'MAIN'
    },
    {
      id: 'resume',
      title: 'Resume',
      subtitle: 'Full Stack Software Engineer Credentials (PDF)',
      url: '/resume.pdf',
      download: 'sdenaveenkumar.pdf',
      isExternal: true,
      badge: 'PDF'
    },
    {
      id: 'github',
      title: 'GitHub',
      subtitle: 'github.com/sdenaveenkumar // Open Source Repositories',
      url: 'https://github.com/sdenaveenkumar',
      isExternal: true
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      subtitle: 'linkedin.com/in/sdenaveenkumar // Professional Network',
      url: 'https://www.linkedin.com/in/sdenaveenkumar',
      isExternal: true
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'sdenaveenkumar@gmail.com // Direct Dispatch',
      url: 'mailto:sdenaveenkumar@gmail.com',
      isExternal: true
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'wa.me/sdenaveenkumar // Direct Message',
      url: 'https://wa.me/sdenaveenkumar',
      isExternal: true,
      badge: 'CHAT'
    },
    {
      id: 'projects',
      title: 'Featured Projects',
      subtitle: 'Dolphin AI, Lofi CLI, Personal API & Case Studies',
      url: '/#projects',
      isInternal: true
    },
    {
      id: 'live-api',
      title: 'Live REST API',
      subtitle: '140.245.24.219 // Interactive API Docs & Specs',
      url: 'http://140.245.24.219',
      isExternal: true,
      badge: 'LIVE'
    }
  ];

  const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/link`;

    if (navigator.share) {
      try {
        await navigator.share({
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share cancelled or unavailable
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      // Ignore
    }
  };

  const handleLinkClick = (e, link) => {
    if (isEmbedded && onSelectLink) {
      e.preventDefault();
      onSelectLink(link);
      return;
    }
    if (link.isInternal && onBackToPortfolio) {
      e.preventDefault();
      onBackToPortfolio(link.url);
    }
  };

  return (
    <div className={`${isEmbedded ? 'min-h-full px-2.5 sm:px-3 py-2' : 'min-h-screen px-3.5 sm:px-4 py-4 sm:py-6'} w-full bg-black text-white font-sans antialiased flex flex-col justify-between selection:bg-zinc-800 selection:text-white`}>

      {/* Centered Mobile Container (max-w-[440px] matching standard mobile screen proportions) */}
      <main className="w-full max-w-[430px] mx-auto flex flex-col gap-3 sm:gap-3.5">

        {/* ─────────────────────────────────────────────────────────────
            0. TOP UTILITY BAR (Back to Portfolio & Share)
           ───────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-1 py-1 text-xs text-zinc-400">
          <button
            onClick={() => onBackToPortfolio ? onBackToPortfolio('/') : window.location.href = '/'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-all active:scale-95 cursor-pointer"
            title={isEmbedded ? "Close Drawer" : "Return to Main Portfolio"}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">{isEmbedded ? "Close" : "Portfolio"}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share / Copy Link Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-all active:scale-95 cursor-pointer relative"
              title="Share Rabbit Tree"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-[11px] text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider">Share</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            1. TOP MEDIA CARD (Portrait with Warm Amber Lighting)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full aspect-[4/3] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gradient-to-tr from-[#7c2d12] via-[#ea580c] to-[#f97316] shadow-2xl border border-white/[0.08] group"
        >
          <img
            src={imgError ? "/reference-portrait.png" : "/projects/RabbitTreeProfile.webp"}
            alt="Naveen Kumar — Fullstack Software Engineer Portrait (Rabbit Tree Profile)"
            decoding="async"
            className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[1.0] select-none transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

          {/* Subtle Studio Glow Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            2. MIDDLE PROFILE CARD (Dark Charcoal Monolith)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="relative w-full rounded-[28px] sm:rounded-[32px] bg-[#141416] border border-white/[0.08] p-6 sm:p-7 shadow-xl flex flex-col justify-between overflow-hidden"
        >
          {/* Top Right "Rabbit Tree" Badge (Matches Reference Image) */}
          <div className="self-end mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-300 uppercase shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Rabbit Tree
            </span>
          </div>

          {/* Massive Name (Bold Sans-Serif Capitalization) */}
          <div className="mt-1">
            <h1 className="text-[34px] sm:text-[40px] font-black tracking-tight text-white leading-[0.98] uppercase">
              NAVEEN<br />KUMAR
            </h1>

            {/* Professional Subtitle */}
            <p className="text-[11px] sm:text-[12px] font-bold text-zinc-400 tracking-widest uppercase mt-3.5">
              FULL STACK SOFTWARE ENGINEER
            </p>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            3. LINK BUTTONS STACK (High-Contrast White Rounded Pills)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-col gap-2.5 sm:gap-3"
        >
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              download={link.download}
              onClick={(e) => handleLinkClick(e, link)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 + idx * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative w-full bg-white hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 rounded-[20px] sm:rounded-[24px] px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between text-black shadow-md cursor-pointer select-none ${activeLinkId === link.id ? 'ring-2 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]' : ''
                }`}
            >
              {/* Left Column: Title & Subtitle */}
              <div className="flex flex-col min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] sm:text-[16px] tracking-tight text-black group-hover:text-zinc-900">
                    {link.title}
                  </span>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-black text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                      {link.badge}
                    </span>
                  )}
                </div>
                {link.subtitle && (
                  <span className="text-[11px] sm:text-[12px] font-medium text-zinc-500 truncate mt-0.5 group-hover:text-zinc-600">
                    {link.subtitle}
                  </span>
                )}
              </div>

              {/* Right Column: Distinctive Black Rounded-Square Arrow Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-zinc-900 transition-all duration-200 shadow-sm">
                <ArrowUpRight className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            4. MOBILE WATERMARK FOOTER
           ───────────────────────────────────────────────────────────── */}
        <footer className="mt-4 pb-6 flex flex-col items-center justify-center gap-2 text-center text-zinc-500 text-[11px] font-mono">
          <div className="flex items-center gap-3">
            <span>© 2026 NAVEEN KUMAR</span>
            <span>•</span>
            <button
              onClick={() => onBackToPortfolio ? onBackToPortfolio('/') : window.location.href = '/'}
              className="text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              VISIT FULL PORTFOLIO
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default LinkTree;
