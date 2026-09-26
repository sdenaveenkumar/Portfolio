import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';

const questions = [
  { id: 0, title: "What's your name?", placeholder: "John Doe", type: "text", key: "name" },
  { id: 1, title: "What's your email?", placeholder: "john@example.com", type: "email", key: "email" },
  { id: 2, title: "Tell me about your project.", placeholder: "I have this crazy idea...", type: "textarea", key: "message" }
];

const Contact = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Track scroll progress within the sticky Contact container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 20,
    restDelta: 0.001
  });

  // Scroll-driven card emergence, 3D perspective elevation, and ambient activation
  const cardScale = useTransform(smoothProgress, [0, 0.28, 0.85, 1], [0.93, 1, 1, 0.96]);
  const cardY = useTransform(smoothProgress, [0, 0.28, 0.85, 1], [50, 0, 0, -25]);
  const cardOpacity = useTransform(smoothProgress, [0, 0.2, 0.9, 1], [0.85, 1, 1, 0.8]);
  const cardRotateX = useTransform(smoothProgress, [0, 0.28, 0.85, 1], [6, 0, 0, -3]);

  // Ambient Nebula Glow transforms
  const orbScale = useTransform(smoothProgress, [0, 0.45], [0.75, 1.25]);
  const orbOpacity = useTransform(smoothProgress, [0, 0.3], [0.35, 0.75]);

  useEffect(() => {
    // Focus input on step change, but avoid stealing focus on the initial step (step 0)
    // This also avoids issues with React StrictMode running the effect twice on mount.
    if (step > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handlePrev = () => {
    if (step > 0) {
      setError(false);
      setStep(s => s - 1);
    }
  };

  const handleNext = () => {
    const currentKey = questions[step]?.key;
    const currentVal = formData[currentKey]?.trim();
    
    let isValid = true;

    // Basic validation to prevent advancing empty fields
    if (!currentVal && step < questions.length) {
      isValid = false; 
    }

    // Email format validation
    if (questions[step]?.type === 'email' && currentVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentVal)) {
        isValid = false;
      }
    }

    if (!isValid) {
      setError(true);
      setTimeout(() => setError(false), 500); // reset error state after animation
      return;
    }

    if (step < questions.length) {
      setError(false);
      setStep(s => s + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 2 && !e.shiftKey) {
        // Prevent default enter on textarea if not shift, allow submit
        e.preventDefault();
        handleNext();
      } else if (step !== 2) {
        e.preventDefault();
        handleNext();
      }
    }
  };

  const currentQuestion = questions[step];

  return (
    <div 
      id="contact" 
      ref={containerRef} 
      className="relative w-full h-[200vh] bg-transparent text-gray-900"
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center py-6 sm:py-12 px-3 sm:px-6 [perspective:1000px]">
        
        {/* Dynamic Ambient Background Glow */}
        <motion.div 
          style={{ scale: orbScale, opacity: orbOpacity }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          <div className="absolute w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-br from-purple-200/70 via-pink-200/50 to-transparent rounded-full blur-[60px] md:blur-[80px] -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-tl from-cyan-200/70 via-blue-100/50 to-transparent rounded-full blur-[60px] md:blur-[80px] translate-x-1/3 translate-y-1/4" />
        </motion.div>

        {/* Central Interactive Glass Form Card with 3D Elevation */}
        <motion.div 
          style={{ 
            scale: cardScale, 
            y: cardY, 
            opacity: cardOpacity, 
            rotateX: cardRotateX,
            transformStyle: 'preserve-3d'
          }}
          className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16 relative z-10 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[28px] sm:rounded-[36px] md:rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.1)] will-change-transform"
        >
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-500 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
              Get In Touch
            </h2>
          </div>
        
        <AnimatePresence mode="wait">
          {step < questions.length ? (
            <motion.div 
              key={step}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-6 sm:gap-8"
            >
              {/* Progress Indicator */}
              <div className="flex items-center gap-3 sm:gap-4 text-gray-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm">
                <span>0{step + 1}</span>
                <div className="w-10 sm:w-12 h-[2px] bg-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gray-900"
                  />
                </div>
                <span>0{questions.length}</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-tight">
                {currentQuestion.title}
              </h2>

              <motion.div 
                className="relative mt-4 sm:mt-8 md:mt-12"
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {currentQuestion.type === 'textarea' ? (
                  <textarea
                    ref={inputRef}
                    value={formData[currentQuestion.key]}
                    onChange={(e) => {
                      setError(false);
                      setFormData({ ...formData, [currentQuestion.key]: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    rows="3"
                    className={`w-full bg-transparent border-b-2 pb-2 sm:pb-4 text-xl sm:text-3xl md:text-5xl lg:text-6xl focus:outline-none transition-colors resize-none overflow-hidden ${
                      error ? 'border-red-500 text-red-500 placeholder:text-red-300 focus:border-red-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-900'
                    }`}
                  />
                ) : (
                  <input
                    ref={inputRef}
                    type={currentQuestion.type}
                    value={formData[currentQuestion.key]}
                    onChange={(e) => {
                      setError(false);
                      setFormData({ ...formData, [currentQuestion.key]: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className={`w-full bg-transparent border-b-2 pb-2 sm:pb-4 text-xl sm:text-3xl md:text-5xl lg:text-6xl focus:outline-none transition-colors ${
                      error ? 'border-red-500 text-red-500 placeholder:text-red-300 focus:border-red-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-900'
                    }`}
                  />
                )}
              </motion.div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-12">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button 
                    onClick={handleNext}
                    className="px-6 sm:px-10 py-3.5 sm:py-5 bg-[#111111] text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-full hover:bg-black hover:scale-[1.02] transition-all flex items-center gap-2.5 sm:gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] cursor-pointer"
                  >
                    {step === questions.length - 1 ? 'Submit' : 'OK'}
                    {step !== questions.length - 1 && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {step > 0 && (
                    <button
                      onClick={handlePrev}
                      className="px-5 sm:px-6 py-3.5 sm:py-5 bg-transparent border-2 border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                </div>
                
                <div className="hidden sm:flex text-xs sm:text-sm text-gray-400 font-semibold items-center gap-2">
                  <span>press</span> 
                  <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">Enter ↵</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "backOut" }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 sm:mb-8">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[90px] font-black tracking-tight mb-4 sm:mb-8 leading-tight">
                Thanks, {formData.name.split(' ')[0] || 'there'}!
              </h2>
              <p className="text-base sm:text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                I've received your message. I'll be in touch with you shortly at <span className="text-gray-900 font-bold border-b-2 border-gray-900 break-all">{formData.email || 'your email'}</span>.
              </p>
              <button 
                onClick={() => {
                  setStep(0);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="mt-8 sm:mt-16 px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full hover:border-gray-900 transition-colors cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
