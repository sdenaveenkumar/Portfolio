import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RabbitCompanion from './components/RabbitCompanion';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Experience from './components/Experience';
import CallToAction from './components/CallToAction';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LinkTree from './components/LinkTree';
import RabbitTreeModal from './components/RabbitTreeModal';
import { Analytics } from '@vercel/analytics/react';
import { ArrowUpRight } from 'lucide-react';
import { updateSeoMeta, SECTION_SEO, scrollToHash } from './utils/seoRouter';

const Resume = React.lazy(() => import('./components/Resume'));

function App() {
  const [showResume, setShowResume] = useState(false);
  const [showRabbitTreeModal, setShowRabbitTreeModal] = useState(false);
  const [isLinkTree, setIsLinkTree] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      return path === '/link' || path === '/links' || path === '/linktree' || hash === '#/link' || hash === '#link';
    }
    return false;
  });

  // Synchronize SEO tags and handle route changes
  useEffect(() => {
    const handleLocationChange = (e) => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      const nextIsLinkTree = path === '/link' || path === '/links' || path === '/linktree' || hash === '#/link' || hash === '#link';
      
      setIsLinkTree(nextIsLinkTree);

      if (nextIsLinkTree) {
        updateSeoMeta(SECTION_SEO.link);
      } else {
        // Unknown path redirect for clean SEO indexing
        if (path && path !== '' && path !== '/') {
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
    if (isLinkTree) {
      updateSeoMeta(SECTION_SEO.link);
    } else {
      updateSeoMeta(SECTION_SEO.home);
      if (window.location.hash) {
        setTimeout(() => {
          scrollToHash(window.location.hash);
        }, 120);
      }
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [isLinkTree]);

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

  // Standalone /link Linktree View
  if (isLinkTree) {
    return (
      <>
        <LinkTree 
          onBackToPortfolio={(targetUrl = '/') => {
            window.history.pushState({}, '', targetUrl);
            setIsLinkTree(false);
            updateSeoMeta(SECTION_SEO.home);
            if (targetUrl.includes('#')) {
              const hashId = targetUrl.split('#')[1];
              setTimeout(() => {
                scrollToHash(hashId);
              }, 150);
            }
          }} 
        />
        <Analytics />
      </>
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
          if (targetUrl.includes('#')) {
            const hashId = targetUrl.split('#')[1];
            setTimeout(() => {
              document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
            }, 200);
          } else if (targetUrl !== '/') {
            window.location.href = targetUrl;
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
