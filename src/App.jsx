import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Experience from './components/Experience';
import CallToAction from './components/CallToAction';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';

const Resume = React.lazy(() => import('./components/Resume'));

function App() {
  const [showResume, setShowResume] = useState(false);

  const toggleResume = () => {
    setShowResume(prev => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-gray-900 font-sans flex flex-col selection:bg-gray-200">
      <Navbar onResumeClick={toggleResume} />
      
      {/* Main content layer that sits on top of the footer and slides up to reveal it */}
      <main className="flex-1 relative w-full bg-white z-10 mb-0 md:mb-[75vh] rounded-b-none md:rounded-b-[40px] md:shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
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
