import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, Battery, ExternalLink } from 'lucide-react';
import LinkTree from './LinkTree';
import TabletPreviewFrame from './TabletPreviewFrame';

/**
 * RABBIT TREE MODAL (Smartphone Chassis Drawer + Tablet Preview Box)
 * 
 * Renders an ultra-premium realistic mobile device frame sliding in from
 * the right corner of the viewport, with a companion tablet preview frame
 * that opens immediately to its left when any link is clicked.
 */
const RabbitTreeModal = ({ isOpen, onClose, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [activePreviewLink, setActivePreviewLink] = useState(null);

  // Keep phone time synced to local time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reset preview when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setActivePreviewLink(null);
    }
  }, [isOpen]);

  const handleCloseAll = () => {
    setActivePreviewLink(null);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activePreviewLink) {
          setActivePreviewLink(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activePreviewLink]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isOpen]);

  const handleLinkNavigation = (targetUrl) => {
    onClose();
    if (onNavigate) {
      onNavigate(targetUrl);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-rabbit-tree-modal="true"
          data-rabbit-tree="true"
          data-no-rabbit="true"
          data-lenis-prevent="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => {
            if (e.target.closest('[data-device-chassis]')) return;
            handleCloseAll();
          }}
          className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden cursor-pointer"
        >

          {/* Frosted Backdrop Overlay with Smooth Progressive Blur */}
          <motion.div
            initial={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)'
            }}
            animate={{
              opacity: 1,
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)'
            }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)'
            }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={handleCloseAll}
            className="fixed inset-0 bg-black/60 cursor-pointer will-change-[backdrop-filter,opacity]"
            aria-label="Close Rabbit Tree"
          />

          {/* Floating Dual Device Stage Container: Tablet on Left + Phone on Right */}
          <div
            data-device-stage="true"
            data-lenis-prevent="true"
            onClick={(e) => {
              if (e.target.closest('[data-device-chassis]')) return;
              handleCloseAll();
            }}
            className="relative z-10 w-full h-full flex items-center justify-center md:justify-end px-2 sm:px-5 md:px-8 py-2 sm:py-6 cursor-pointer gap-2 sm:gap-4 lg:gap-6 overflow-hidden"
          >

            {/* ─────────────────────────────────────────────────────────────
                TABLET PREVIEW BOX (Opens to the left of the mobile box)
               ───────────────────────────────────────────────────────────── */}
            <AnimatePresence>
              {isOpen && activePreviewLink && (
                <TabletPreviewFrame
                  link={activePreviewLink}
                  onClose={() => setActivePreviewLink(null)}
                  onNavigate={handleLinkNavigation}
                />
              )}
            </AnimatePresence>

            {/* External Quick Action Bar (Close & Expand) */}
            <motion.div
              data-device-chassis="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 40,
                transition: {
                  x: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.42, delay: 0.18, ease: 'easeInOut' }
                }
              }}
              transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden xl:flex flex-col gap-2.5 mr-1 pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseAll}
                className="w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/15 shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Open in Fullscreen Link */}
              <a
                href="/link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/15 shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Open standalone page in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────────
                SMARTPHONE CHASSIS (Rabbit Tree List)
               ───────────────────────────────────────────────────────────── */}
            <motion.div
              data-device-chassis="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: typeof window !== 'undefined' ? Math.max(window.innerWidth * 0.5, 500) : 500, opacity: 0, scale: 0.96 }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: 'spring',
                  damping: 30,
                  stiffness: 170,
                  mass: 0.9
                }
              }}
              exit={{
                x: typeof window !== 'undefined' ? Math.max(window.innerWidth * 0.5, 500) : 500,
                opacity: 0,
                scale: 0.98,
                transition: {
                  x: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.42, delay: 0.18, ease: 'easeInOut' }
                }
              }}
              data-lenis-prevent="true"
              className={`pointer-events-auto relative w-[calc(100vw-16px)] sm:w-[480px] md:w-[390px] max-w-[calc(100vw-16px)] md:max-w-[390px] h-[94vh] max-h-[820px] rounded-[38px] sm:rounded-[48px] md:rounded-[54px] p-[10px] sm:p-[12px] bg-gradient-to-b from-[#38383a] via-[#1a1a1c] to-[#2c2c2e] shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_2px_rgba(255,255,255,0.25)] flex flex-col select-none shrink-0 cursor-default ${activePreviewLink ? 'hidden lg:flex' : 'flex'
                }`}
            >

              {/* Physical Edge Details: Side Buttons */}
              <div className="absolute -left-[3px] top-[105px] w-[3px] h-9 bg-zinc-700/80 rounded-l-sm" /> {/* Volume Up */}
              <div className="absolute -left-[3px] top-[152px] w-[3px] h-9 bg-zinc-700/80 rounded-l-sm" /> {/* Volume Down */}
              <div className="absolute -right-[3px] top-[125px] w-[3px] h-14 bg-zinc-700/80 rounded-r-sm" /> {/* Power Button */}

              {/* Screen Bezel Frame */}
              <div data-lenis-prevent="true" className="relative w-full h-full rounded-[28px] sm:rounded-[38px] md:rounded-[44px] overflow-hidden bg-black border border-white/[0.08] shadow-inner flex flex-col">

                {/* ─────────────────────────────────────────────────────────────
                    TOP: Dynamic Island & iOS Status Bar
                   ───────────────────────────────────────────────────────────── */}
                <div className="relative z-30 w-full pt-3 px-5 sm:px-6 pb-2 bg-black flex items-center justify-between text-white shrink-0 select-none">
                  {/* Left: Clock */}
                  <span className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-zinc-200">
                    {currentTime}
                  </span>

                  {/* Center: Interactive Dynamic Island */}
                  <div className="w-[100px] sm:w-[110px] h-[26px] bg-black border border-white/[0.12] rounded-full flex items-center justify-between px-2.5 shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-wider font-bold text-zinc-300 uppercase">Rabbit</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                  </div>

                  {/* Right: Signal, Wifi, Battery & Mobile Close */}
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
                    <Battery className="w-4 h-4 stroke-[2.2]" />
                    {/* Mobile Close Button */}
                    <button
                      onClick={handleCloseAll}
                      className="md:hidden ml-1 p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Close"
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    MIDDLE: Scrollable Rabbit Tree Content
                   ───────────────────────────────────────────────────────────── */}
                <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <LinkTree
                    isEmbedded={true}
                    onBackToPortfolio={handleLinkNavigation}
                    onSelectLink={(link) => setActivePreviewLink(link)}
                    activeLinkId={activePreviewLink?.id}
                  />
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    BOTTOM: iOS Home Indicator Pill
                   ───────────────────────────────────────────────────────────── */}
                <div
                  onClick={handleCloseAll}
                  className="w-full py-2 bg-black flex justify-center items-center shrink-0 cursor-pointer group"
                  title="Click to dismiss"
                >
                  <div className="w-28 sm:w-32 h-1 bg-white/35 group-hover:bg-white/60 rounded-full transition-colors" />
                </div>

              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RabbitTreeModal;
