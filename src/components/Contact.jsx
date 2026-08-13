import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
    <div id="contact" className="relative w-full min-h-screen bg-transparent text-gray-900 overflow-hidden flex flex-col justify-center items-center py-24">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] md:w-[800px] md:h-[800px] bg-gradient-to-br from-purple-200 via-pink-200 to-transparent rounded-full blur-[80px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[100vw] h-[100vw] md:w-[600px] md:h-[600px] bg-gradient-to-tl from-cyan-200 to-transparent rounded-full blur-[80px] md:blur-[120px] opacity-50 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-8 md:px-16 py-12 md:py-20 relative z-10 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
        <div className="mb-12">
          <h2 className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-[0.3em]">
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
              className="flex flex-col gap-8"
            >
              {/* Progress Indicator */}
              <div className="flex items-center gap-4 text-gray-400 font-bold tracking-[0.2em] uppercase text-sm">
                <span>0{step + 1}</span>
                <div className="w-12 h-[2px] bg-gray-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gray-900"
                  />
                </div>
                <span>0{questions.length}</span>
              </div>
              
              <h2 className="text-3xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 leading-none">
                {currentQuestion.title}
              </h2>

              <motion.div 
                className="relative mt-8 md:mt-12"
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
                    className={`w-full bg-transparent border-b-2 pb-4 text-3xl md:text-5xl lg:text-6xl focus:outline-none transition-colors resize-none overflow-hidden ${
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
                    className={`w-full bg-transparent border-b-2 pb-4 text-3xl md:text-5xl lg:text-6xl focus:outline-none transition-colors ${
                      error ? 'border-red-500 text-red-500 placeholder:text-red-300 focus:border-red-500' : 'border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-900'
                    }`}
                  />
                )}
              </motion.div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-8 md:mt-12">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleNext}
                    className="px-10 py-5 bg-[#111111] text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-black hover:scale-[1.02] transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] cursor-pointer"
                  >
                    {step === questions.length - 1 ? 'Submit' : 'OK'}
                    {step !== questions.length - 1 && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {step > 0 && (
                    <button
                      onClick={handlePrev}
                      className="px-6 py-5 bg-transparent border-2 border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-sm rounded-full hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                </div>
                
                <div className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                  <span>press</span> 
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">Enter ↵</span>
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
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-8xl lg:text-[100px] font-black tracking-tighter mb-8 leading-none">
                Thanks, {formData.name.split(' ')[0] || 'there'}!
              </h2>
              <p className="text-2xl md:text-3xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                I've received your message. I'll be in touch with you shortly at <span className="text-gray-900 font-bold border-b-2 border-gray-900">{formData.email || 'your email'}</span>.
              </p>
              <button 
                onClick={() => {
                  setStep(0);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="mt-16 px-8 py-4 bg-transparent border-2 border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-sm rounded-full hover:border-gray-900 transition-colors"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contact;
