import React, { useState, useEffect } from 'react';
import Navbar from './features/portfolio/Navbar';
import RabbitCompanion from './components/3d/RabbitCompanion';
import { AnimatePresence } from 'framer-motion';
import Hero from './features/portfolio/Hero';
import Skills from './features/portfolio/Skills';
import Projects from './features/portfolio/Projects';
import Education from './features/portfolio/Education';
import Experience from './features/portfolio/Experience';
import CallToAction from './features/portfolio/CallToAction';
import Contact from './features/portfolio/Contact';
import Footer from './features/portfolio/Footer';
import RabbitTreeModal from './features/rabbit-tree/RabbitTreeModal';
import { Analytics } from '@vercel/analytics/react';
import { ArrowUpRight } from 'lucide-react';
import { updateSeoMeta, SECTION_SEO, scrollToHash, syncUrlHash } from './utils/seoRouter';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger for 120Hz high refresh rate and eliminate mobile resize jank
ScrollTrigger.config({
  limitCallbacks: true,
  syncInterval: 16,
  ignoreMobileResize: true,
});

const Resume = React.lazy(() => import('./features/portfolio/Resume'));
const RabbitStudioView = React.lazy(() => import('./routes/RabbitStudioView'));
const LinkTreeView = React.lazy(() => import('./routes/LinkTreeView'));

const checkCurrentRoute = () => {
  if (typeof window === 'undefined') {
    return { isLinkTree: false, isRabbitStudio: false, path: '' };
  }
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/\/$/, '');

  const isRabbitStudio =
    path === '/tool/rabbit_studio' ||
    path === '/tool/rabbit-studio' ||
    path === 'tool/rabbit_studio' ||
    hash === '#/tool/rabbit_studio' ||
    hash === '#tool/rabbit_studio' ||
    hash === '#/tool/rabbit-studio' ||
    hash === '#tool/rabbit-studio';

  const isLinkTree =
    path === '/link' ||
    path === '/links' ||
    path === '/linktree' ||
    hash === '#/link' ||
    hash === '#link';

  return { isLinkTree, isRabbitStudio, path };
};

function App() {
  const [showResume, setShowResume] = useState(false);
  const [showRabbitTreeModal, setShowRabbitTreeModal] = useState(false);
  const [routeState, setRouteState] = useState(() => checkCurrentRoute());

  // Synchronize SEO tags and handle route changes
  useEffect(() => {
    const handleLocationChange = (e) => {
      const nextRoute = checkCurrentRoute();
      setRouteState(nextRoute);

      if (nextRoute.isRabbitStudio) {
        updateSeoMeta(SECTION_SEO.rabbitStudio);
      } else if (nextRoute.isLinkTree) {
        updateSeoMeta(SECTION_SEO.link);
      } else {
        // Unknown path redirect for clean SEO indexing
        if (nextRoute.path && nextRoute.path !== '' && nextRoute.path !== '/') {
          window.history.replaceState(null, '', `/${window.location.hash}`);
        }
        updateSeoMeta(SECTION_SEO.home);
      }

      // Handle Back Button closing modals
      if (e?.state) {
        if (e.state.modal !== 'resume') setShowResume(false);
        if (e.state.modal !== 'rabbit-tree') setShowRabbitTreeModal(false);
      } else {
        setShowResume(false);
        setShowRabbitTreeModal(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial SEO update & Deep-link anchor auto-scroll
    const initialRoute = checkCurrentRoute();
    if (initialRoute.isRabbitStudio) {
      updateSeoMeta(SECTION_SEO.rabbitStudio);
    } else if (initialRoute.isLinkTree) {
      updateSeoMeta(SECTION_SEO.link);
    } else {
      updateSeoMeta(SECTION_SEO.home);
      if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#home' && window.location.hash !== '#hero') {
        setTimeout(() => {
          scrollToHash(window.location.hash);
        }, 120);
      } else {
        setTimeout(() => {
          scrollToHash('home');
        }, 50);
      }
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Initialize Lenis 120 FPS Smooth Scroller for main page
  useEffect(() => {
    if (routeState.isRabbitStudio || routeState.isLinkTree) return;

    const isHome =
      !window.location.hash ||
      window.location.hash === '#home' ||
      window.location.hash === '#' ||
      window.location.hash === '#hero';

    if (isHome) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      infinite: false,
      prevent: (node) => {
        return (
          node.hasAttribute?.('data-lenis-prevent') ||
          Boolean(node.closest?.('[data-lenis-prevent="true"]')) ||
          Boolean(node.closest?.('[data-rabbit-tree-modal="true"]')) ||
          Boolean(node.closest?.('[data-project-modal="true"]')) ||
          Boolean(node.closest?.('[data-resume-modal="true"]')) ||
          Boolean(node.closest?.('.lenis-prevent'))
        );
      },
    });

    if (isHome) {
      lenis.scrollTo(0, { immediate: true });
    }

    window.__lenis = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis with GSAP's 120 FPS internal ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 16);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [routeState.isRabbitStudio, routeState.isLinkTree]);

  // Pause Lenis when modal drawers are open
  useEffect(() => {
    if (showResume || showRabbitTreeModal) {
      window.__lenis?.stop();
    } else {
      window.__lenis?.start();
    }
  }, [showResume, showRabbitTreeModal]);

  const toggleResume = () => {
    setShowResume(prev => {
      const next = !prev;
      if (next) {
        window.history.pushState({ modal: 'resume' }, '', window.location.hash || window.location.pathname);
      } else if (window.history.state?.modal === 'resume') {
        window.history.back();
      }
      return next;
    });
  };

  const toggleRabbitTreeModal = (e) => {
    if (e) e.preventDefault();
    setShowRabbitTreeModal(prev => {
      const next = !prev;
      if (next) {
        window.history.pushState({ modal: 'rabbit-tree' }, '', window.location.hash || window.location.pathname);
      } else if (window.history.state?.modal === 'rabbit-tree') {
        window.history.back();
      }
      return next;
    });
  };

  // Dedicated Rabbit Studio Tool View (/tool/rabbit_studio)
  if (routeState.isRabbitStudio) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-white font-mono text-xs">Loading Rabbit Studio...</div>}>
        <RabbitStudioView
          onBackToPortfolio={(targetUrl = '/') => {
            const cleanTarget = targetUrl || '/';
            const isGoingHome =
              cleanTarget === '/' ||
              cleanTarget === '/#home' ||
              cleanTarget === '#home' ||
              cleanTarget === '/#hero' ||
              cleanTarget === '#hero';

            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            window.history.pushState({}, '', isGoingHome ? '/' : cleanTarget);
            setRouteState(checkCurrentRoute());
            updateSeoMeta(SECTION_SEO.home);

            if (isGoingHome) {
              syncUrlHash('home', false);
              window.dispatchEvent(new CustomEvent('rabbit-nav-leap', { detail: { target: 'home' } }));
              scrollToHash('home', { immediate: true });
              setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                scrollToHash('home', { immediate: true });
              }, 40);
              setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                scrollToHash('home', { immediate: true });
              }, 120);
            } else if (cleanTarget.includes('#')) {
              const hashId = cleanTarget.split('#')[1];
              setTimeout(() => {
                scrollToHash(hashId);
              }, 120);
            }
          }}
        />
        <Analytics />
      </React.Suspense>
    );
  }

  // Standalone /link Linktree View
  if (routeState.isLinkTree) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs">Loading Rabbit Tree...</div>}>
        <LinkTreeView 
          onBackToPortfolio={(targetUrl = '/') => {
            const cleanTarget = targetUrl || '/';
            const isGoingHome =
              cleanTarget === '/' ||
              cleanTarget === '/#home' ||
              cleanTarget === '#home' ||
              cleanTarget === '/#hero' ||
              cleanTarget === '#hero';

            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            window.history.pushState({}, '', isGoingHome ? '/' : cleanTarget);
            setRouteState(checkCurrentRoute());
            updateSeoMeta(SECTION_SEO.home);

            if (isGoingHome) {
              syncUrlHash('home', false);
              window.dispatchEvent(new CustomEvent('rabbit-nav-leap', { detail: { target: 'home' } }));
              scrollToHash('home', { immediate: true });
              setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                scrollToHash('home', { immediate: true });
              }, 40);
              setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                scrollToHash('home', { immediate: true });
              }, 120);
            } else if (cleanTarget.includes('#')) {
              const hashId = cleanTarget.split('#')[1];
              setTimeout(() => {
                scrollToHash(hashId);
              }, 120);
            }
          }} 
        />
        <Analytics />
      </React.Suspense>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-gray-900 font-sans flex flex-col selection:bg-gray-200">
      
      {/* Top Right Corner Floating Button: Rabbit Tree */}
      <button
        data-rabbit-tree="true"
        data-no-rabbit="true"
        onClick={toggleRabbitTreeModal}
        className={`fixed top-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:top-6 md:top-7 right-3 sm:right-6 md:right-8 z-40 pointer-events-auto group flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full ${
          showRabbitTreeModal 
            ? 'bg-black text-white border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)]' 
            : 'bg-white/85 hover:bg-white text-gray-900 border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)]'
        } backdrop-blur-xl border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none`}
        title="Open Rabbit Tree Mobile Frame"
        aria-label="Open Rabbit Tree"
      >
        <span className={`font-bold text-xs sm:text-sm tracking-tight ${showRabbitTreeModal ? 'text-white' : 'text-black'}`}>
          Rabbit Tree
        </span>
        <ArrowUpRight className={`w-3.5 h-3.5 ${showRabbitTreeModal ? 'text-white rotate-45' : 'text-gray-400 group-hover:text-black'} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
      </button>

      {/* Interactive Mobile Device Frame for Rabbit Tree */}
      <RabbitTreeModal
        isOpen={showRabbitTreeModal}
        onClose={() => setShowRabbitTreeModal(false)}
        onNavigate={(targetUrl) => {
          setShowRabbitTreeModal(false);
          const cleanTarget = targetUrl || '/';
          if (cleanTarget === '/' || cleanTarget === '/#home' || cleanTarget === '#home' || cleanTarget === '/#hero' || cleanTarget === '#hero') {
            window.history.pushState({}, '', '/');
            updateSeoMeta(SECTION_SEO.home);
            syncUrlHash('home', false);
            window.dispatchEvent(new CustomEvent('rabbit-nav-leap', { detail: { target: 'home' } }));
            setTimeout(() => {
              scrollToHash('home');
            }, 80);
          } else if (cleanTarget.includes('#')) {
            const hashId = cleanTarget.split('#')[1];
            setTimeout(() => {
              scrollToHash(hashId);
            }, 120);
          } else if (cleanTarget === '/tool/rabbit_studio' || cleanTarget === '/link') {
            window.history.pushState({}, '', cleanTarget);
            const nextRoute = checkCurrentRoute();
            setRouteState(nextRoute);
            if (nextRoute.isRabbitStudio) {
              updateSeoMeta(SECTION_SEO.rabbitStudio);
            } else if (nextRoute.isLinkTree) {
              updateSeoMeta(SECTION_SEO.link);
            }
          } else {
            window.location.href = cleanTarget;
          }
        }}
      />

      <Navbar onResumeClick={toggleResume} />
      <RabbitCompanion isRabbitTreeOpen={showRabbitTreeModal} />
      
      {/* Main content layer that sits on top of the footer and slides up to reveal it */}
      <main className="flex-1 relative w-full bg-[#fafafc] z-10 mb-0 md:mb-[80vh] rounded-b-[36px] sm:rounded-b-[48px] md:rounded-b-[60px] md:shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
          <Hero />
          <Skills />
          <Projects />
          <Education />
          <Experience />
          <CallToAction />
          <Contact />
      </main>

      {/* The sticky footer sitting underneath */}
      <Footer />

      {/* Slide-in Resume Drawer */}
      <AnimatePresence>
        {showResume && (
          <React.Suspense fallback={null}>
            <Resume onClose={() => setShowResume(false)} />
          </React.Suspense>
        )}
      </AnimatePresence>
      
      <Analytics />
    </div>
  );
}

export default App;
