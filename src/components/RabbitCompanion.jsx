import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo3D from './Logo3D';

/**
 * RabbitCompanion Component.
 * The living companion of RabbitFolio:
 * - Docked at Navbar: Sits at home or travels along navbar pills while active.
 * - Screen Roamer: When user does nothing for ~3.2s, explores all across the current screen.
 * - Interactive Jumping: Only jumps on real UI elements (text, container borders, images, icons, 3D icons, components).
 * - Impact Bounce: Whichever element the rabbit lands on physically squashes and spring-bounces!
 * - Never Repeats: Memory of last 10 visited elements + quadrant distribution prevents looping between 2-3 spots.
 * - No Vacant Space Jumps: Only leaps to concrete elements.
 * - Alert Return: Instantly leaps back to navbar when user moves mouse, scrolls, or taps.
 */
const RabbitCompanion = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isRoaming, setIsRoaming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [rabbitPos, setRabbitPos] = useState({ x: -999, y: -999 });
  const [isHopping, setIsHopping] = useState(false);
  const [hopDirection, setHopDirection] = useState(1);
  const [hopProgress, setHopProgress] = useState(0);
  const [isTrickActive, setIsTrickActive] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  const currentPosRef = useRef({ x: -999, y: -999 });
  const isRoamingRef = useRef(false);
  const isHoppingRef = useRef(false);
  const isDarkBgRef = useRef(false);
  const hopAnimRef = useRef(null);
  const idleTimerRef = useRef(null);
  const roamStepTimerRef = useRef(null);
  const activeSectionRef = useRef('home');

  // Visited memory to prevent jumping back and forth between 2-3 places
  const visitedHistoryRef = useRef([]);

  const RABBIT_WIDTH = 42;
  const RABBIT_HEIGHT = 42;

  // Detect whether an element or coordinate is situated over a black / dark background
  const checkIsDarkBackground = useCallback((el, x, y) => {
    if (el) {
      if (el.closest('footer') || el.closest('#footer')) return true;
      if (el.closest('#contact') && (el.classList?.contains?.('bg-black') || el.classList?.contains?.('bg-[#111111]'))) return true;
    }

    let cur = el;
    if (!cur && x !== undefined && y !== undefined) {
      try {
        cur = document.elementFromPoint(x + RABBIT_WIDTH / 2, y + RABBIT_HEIGHT - 4);
      } catch {}
    }

    while (cur && cur !== document.documentElement && cur !== document.body) {
      const classList = cur.className || '';
      if (typeof classList === 'string' && (
        classList.includes('bg-black') ||
        classList.includes('bg-[#111111]') ||
        classList.includes('bg-[#0a0a0a]') ||
        classList.includes('bg-[#050505]') ||
        classList.includes('bg-gray-900') ||
        classList.includes('bg-slate-900') ||
        classList.includes('bg-zinc-900') ||
        classList.includes('bg-zinc-950')
      )) {
        return true;
      }

      if (cur.tagName === 'FOOTER') return true;

      try {
        const bg = window.getComputedStyle(cur).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const r = parseInt(match[1], 10);
          const g = parseInt(match[2], 10);
          const b = parseInt(match[3], 10);
          const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
          if (a > 0.45) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum < 95; // Dark surface detected
          }
        }
      } catch {}

      cur = cur.parentElement;
    }

    return false;
  }, []);

  // 1. Measure Navbar Target Position: Perches right ON TOP of section name text, or in home dock
  const getNavbarTarget = useCallback((sectionKey) => {
    const navEl = document.querySelector('nav');
    if (!navEl) return { x: -999, y: -999 };

    const itemEl = document.querySelector(`[data-nav-item="${sectionKey}"]`) ||
                   document.querySelector('[data-nav-item="home"]') ||
                   navEl;

    const navRect = navEl.getBoundingClientRect();
    const isHome = sectionKey === 'home';

    if (isHome) {
      // At home base: center directly in the circular home dock
      const dockEl = itemEl.querySelector('.rounded-full') || itemEl.querySelector('button') || itemEl;
      const dockRect = dockEl.getBoundingClientRect();
      const x = dockRect.left + (dockRect.width - RABBIT_WIDTH) / 2;
      const y = navRect.top + (navRect.height - RABBIT_HEIGHT) / 2;
      return { x, y };
    }

    // At section name text (skills, projects, education, experience):
    // Perch right ON TOP of the section text label!
    const textSpan = itemEl.querySelector('span') || itemEl;
    const textRect = textSpan.getBoundingClientRect();

    const x = textRect.left + (textRect.width - RABBIT_WIDTH) / 2;
    // Perched directly on top of the text with paws resting on top edge
    const y = Math.max(3, textRect.top - RABBIT_HEIGHT + 7);

    return { x, y };
  }, []);

  // 2. Spawn subtle dust puff particle under rabbit paws on landing (matches surface tone)
  const spawnLandingPuff = (x, y, isWhite = false) => {
    try {
      const puff = document.createElement('div');
      puff.className = `fixed pointer-events-none rounded-full ${isWhite ? 'bg-white/40' : 'bg-black/15'} rabbit-dust-particle z-40`;
      puff.style.left = `${x + RABBIT_WIDTH / 2 - 8}px`;
      puff.style.top = `${y + RABBIT_HEIGHT - 6}px`;
      puff.style.width = '16px';
      puff.style.height = '7px';
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 550);
    } catch {
      // Ignore if document not ready
    }
  };

  // 2b. Trigger subtle, physics-based text bounce on rabbit touchdown (Zero-Reflow Engine)
  const triggerElementBounce = (el) => {
    if (!el) return;
    // Prefer bouncing the inner text span if present, otherwise bounce the element itself
    const inlineSpans = el.querySelectorAll('.inline-block');
    const targets = inlineSpans.length > 0 ? Array.from(inlineSpans).slice(0, 3) : [el];

    targets.forEach((node) => {
      node.classList.remove('rabbit-bounce-active');
      requestAnimationFrame(() => {
        node.classList.add('rabbit-bounce-active');
      });
    });
    setTimeout(() => {
      targets.forEach((node) => node.classList.remove('rabbit-bounce-active'));
    }, 500);
  };

  // Track sectors visited recently to ensure rabbit roams across different regions
  const visitedSectorsRef = useRef([]);

  // 3. Natural 3-Phase Biological Jump Engine
  const leapTo = useCallback((target, {
    duration = 460,
    arcHeight = 50,
    onLanding,
  } = {}) => {
    if (hopAnimRef.current) {
      cancelAnimationFrame(hopAnimRef.current);
    }

    const start = { ...currentPosRef.current };
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 5) {
      currentPosRef.current = target;
      setRabbitPos(target);
      setIsHopping(false);
      isHoppingRef.current = false;
      if (onLanding) onLanding();
      return;
    }

    const direction = dx >= 0 ? 1 : -1;
    setHopDirection(direction);
    setIsHopping(true);
    isHoppingRef.current = true;

    // Dynamic biological timing: short hops are brisk (~400ms), long leaps have floaty hang-time (~640ms)
    const leapDuration = Math.min(640, Math.max(390, 340 + distance * 0.40));
    const leapArc = Math.min(125, Math.max(arcHeight, 32 + distance * 0.15));

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / leapDuration);

      setHopProgress(t);

      let curX, curY;

      if (t < 0.14) {
        // Phase 1: Anticipation Crouch (hind legs compression, loading jump)
        const pc = t / 0.14;
        curX = start.x;
        curY = start.y + Math.sin(pc * Math.PI) * 4;
      } else if (t <= 0.86) {
        // Phase 2: Kinetic Airborne Leap (apex hang-time)
        const tau = (t - 0.14) / 0.72;
        // Sinusoidal ease for horizontal travel
        const easeX = 0.5 - Math.cos(tau * Math.PI) * 0.5;
        curX = start.x + dx * easeX;

        // Parabolic vertical trajectory with apex hang-time
        const hangFactor = 1.0 + 0.18 * Math.sin(tau * Math.PI);
        curY = start.y + dy * tau - Math.sin(tau * Math.PI) * hangFactor * leapArc;
      } else {
        // Phase 3: Impact Cushion (paws touch down, torso absorbs impact)
        const pl = (t - 0.86) / 0.14;
        curX = target.x;
        curY = target.y + Math.sin(pl * Math.PI) * 4;
      }

      currentPosRef.current = { x: curX, y: curY };
      setRabbitPos({ x: curX, y: curY });

      if (t < 1.0) {
        hopAnimRef.current = requestAnimationFrame(step);
      } else {
        // Touchdown complete: if docked at navbar, snap to latest measured target to avoid layout transition mismatch
        const finalTarget = !isRoamingRef.current
          ? getNavbarTarget(activeSectionRef.current)
          : target;

        currentPosRef.current = finalTarget;
        setRabbitPos(finalTarget);
        setIsHopping(false);
        isHoppingRef.current = false;
        setHopProgress(0);
        hopAnimRef.current = null;

        spawnLandingPuff(finalTarget.x, finalTarget.y, isDarkBgRef.current);
        if (onLanding) onLanding();
      }
    };

    hopAnimRef.current = requestAnimationFrame(step);
  }, [getNavbarTarget]);

  // 4. Return to Navbar Dock
  const returnToNavbar = useCallback((speedy = false) => {
    if (roamStepTimerRef.current) {
      clearTimeout(roamStepTimerRef.current);
      roamStepTimerRef.current = null;
    }

    setIsRoaming(false);
    isRoamingRef.current = false;
    setIsDarkBg(false);
    isDarkBgRef.current = false;

    const targetKey = activeSectionRef.current;
    const dockTarget = getNavbarTarget(targetKey);
    leapTo(dockTarget, {
      duration: speedy ? 320 : 440,
      arcHeight: 55,
      onLanding: () => {
        const navItemEl = document.querySelector(`[data-nav-item="${targetKey}"]`);
        triggerElementBounce(navItemEl);
      },
    });
  }, [getNavbarTarget, leapTo]);

  // 5. Discover All Real UI Elements Inside Current Section & Screen (High-Performance Query)
  // Prioritizes elements in the user's ACTIVE SECTION: headings, badges, 3D icons, cards, borders, buttons
  const findScreenTargets = () => {
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    const selectors = [
      // Container Borders & Cards (perch on top border edge)
      'article', '[class*="card"]', '[class*="border"]',
      '[class*="rounded-xl"]', '[class*="rounded-2xl"]', '[class*="rounded-3xl"]',
      // Real Interactive Components, Badges, Tech Pills & 3D Icons
      'button', 'a', '[data-model-icon]', '[class*="badge"]', '[class*="pill"]', '[class*="tag"]',
      // Images & Graphics
      'img', 'canvas',
      // Block Text Elements
      'h1', 'h2', 'h3', 'h4', 'h5', 'p'
    ].join(', ');

    // 1. Identify active section container
    const currentSecKey = activeSectionRef.current;
    const currentSecId = currentSecKey === 'home' ? 'hero' : currentSecKey;
    const currentSecEl = document.getElementById(currentSecId) || document.getElementById('hero');

    // Collect elements from current section first, plus navbar items
    let candidates = currentSecEl ? Array.from(currentSecEl.querySelectorAll(selectors)) : [];

    // Always include navbar items as natural stepping stones
    const navItems = Array.from(document.querySelectorAll('[data-nav-item]'));
    candidates.push(...navItems);

    // If current section has few targets visible right now, augment with document targets
    if (candidates.length < 5) {
      candidates.push(...Array.from(document.querySelectorAll(selectors)));
    }

    const validTargets = [];
    const seenPositions = new Set();

    for (const el of candidates) {
      const isNavItem = el.hasAttribute('data-nav-item') || el.closest('[data-nav-item]');

      // Fast rejection: rabbit itself or modals
      if (el.closest('[data-rabbit-root]') || el.closest('#resume-modal')) continue;
      if (el.closest('nav') && !isNavItem) continue;

      // Filter out tiny single-character motion spans or empty text nodes
      if (el.tagName === 'SPAN' && el.textContent.trim().length <= 2 && !isNavItem) continue;
      if ((el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'P') && el.textContent.trim().length === 0) continue;

      // Fast hidden element filter without expensive getComputedStyle calls
      if (!isNavItem && el.offsetParent === null) continue;

      const rect = el.getBoundingClientRect();

      // Must be visible within current viewport
      if (rect.bottom < 50 || rect.top > viewportH - 45) continue;
      if (rect.right < 18 || rect.left > viewportW - 18) continue;

      // Discard giant full-screen wrappers
      if (rect.width > viewportW * 0.88 && rect.height > viewportH * 0.75) continue;

      // Discard invisible or zero-size elements
      if (rect.width < 18 || rect.height < 14) continue;

      // Determine if element is a navbar item vs container border vs text/icon
      const isContainer = el.tagName === 'ARTICLE' ||
                          el.className?.includes?.('card') ||
                          (el.className?.includes?.('border') && rect.width > 90);

      let landX, landY;
      if (isNavItem) {
        const navParent = el.closest('nav');
        const navRect = navParent ? navParent.getBoundingClientRect() : rect;
        const navKey = el.getAttribute('data-nav-item') || el.closest('[data-nav-item]')?.getAttribute('data-nav-item');
        const isHome = navKey === 'home';

        if (isHome) {
          const dockEl = el.querySelector('.rounded-full') || el;
          const itemRect = dockEl.getBoundingClientRect();
          landX = itemRect.left + (itemRect.width - RABBIT_WIDTH) / 2;
          landY = navRect.top + (navRect.height - RABBIT_HEIGHT) / 2;
        } else {
          // Perch directly on top of the section text label!
          const textSpan = el.querySelector('span') || el;
          const textRect = textSpan.getBoundingClientRect();
          landX = textRect.left + (textRect.width - RABBIT_WIDTH) / 2;
          landY = Math.max(3, textRect.top - RABBIT_HEIGHT + 7);
        }
      } else if (isContainer) {
        // Perch directly on the top border edge of the container / card!
        const offsetPercent = 0.20 + ((validTargets.length % 3) * 0.30);
        landX = rect.left + rect.width * offsetPercent - RABBIT_WIDTH / 2;
        landY = rect.top - RABBIT_HEIGHT + 7;
      } else {
        // Perch centered on text, icon, image, button, badge
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 7;
      }

      // Constrain inside viewport safe margins
      landX = Math.max(16, Math.min(viewportW - RABBIT_WIDTH - 16, landX));
      landY = Math.max(16, Math.min(viewportH - RABBIT_HEIGHT - 25, landY));

      // Grid deduplication (avoid multiple child nodes targeting the exact same spot)
      const gridKey = `${Math.round(landX / 42)}_${Math.round(landY / 42)}`;
      if (seenPositions.has(gridKey)) continue;
      seenPositions.add(gridKey);

      // Determine 6-sector grid: 3 columns x 2 rows
      const col = landX < viewportW / 3 ? 0 : landX < (2 * viewportW) / 3 ? 1 : 2;
      const row = landY < viewportH / 2 ? 0 : 1;
      const sector = row * 3 + col; // 0 to 5

      // Note if element is located inside the user's active section
      const inCurrentSection = currentSecEl ? currentSecEl.contains(el) : true;
      const isInteractive = isNavItem || el.tagName === 'BUTTON' || el.tagName === 'A' || el.hasAttribute('data-model-icon');

      validTargets.push({
        el: isNavItem ? (el.hasAttribute('data-nav-item') ? el : el.closest('[data-nav-item]')) : el,
        rect,
        landX,
        landY,
        sector,
        isContainer,
        isInteractive,
        inCurrentSection,
      });
    }

    return validTargets;
  };

  // 6. Perform Next Roaming Step Across Current Section (Never loops in 2-3 spots)
  const performRoamStep = useCallback(() => {
    if (!isRoamingRef.current) return;

    const allTargets = findScreenTargets();

    // If no real UI targets on screen, stay at navbar dock (do NOT jump on vacant space)
    if (allTargets.length === 0) {
      returnToNavbar();
      return;
    }

    const curX = currentPosRef.current.x;
    const curY = currentPosRef.current.y;
    const viewportW = window.innerWidth;

    // Filter out recently visited elements (memory of last 14 places)
    let candidates = allTargets.filter(t => !visitedHistoryRef.current.includes(t.el));

    // If exhausted, keep only the last 3 visited to open up fresh destinations
    if (candidates.length === 0) {
      visitedHistoryRef.current = visitedHistoryRef.current.slice(-3);
      candidates = allTargets.filter(t => !visitedHistoryRef.current.includes(t.el));
      if (candidates.length === 0) candidates = allTargets;
    }

    // Score candidates: strongly prioritize elements inside the CURRENT SECTION!
    const scored = candidates.map(t => {
      const dist = Math.hypot(t.landX - curX, t.landY - curY);
      const isFreshSector = !visitedSectorsRef.current.slice(-2).includes(t.sector);
      const isGoodDistance = dist >= 90 && dist <= viewportW * 0.90;

      let score = 0;
      if (t.inCurrentSection) score += 50; // Priority 1: Current section elements!
      if (isFreshSector) score += 25;       // Priority 2: Disperse across different sectors
      if (isGoodDistance) score += 20;      // Priority 3: Natural leap distance

      return {
        target: t,
        dist,
        score,
        isFreshSector,
        isGoodDistance,
      };
    });

    // Sort by score descending and take from top-scoring candidates for organic variety
    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, Math.min(4, scored.length));
    const chosenEntry = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    const chosen = chosenEntry.target;

    // Update memory of visited elements and sectors
    visitedHistoryRef.current.push(chosen.el);
    if (visitedHistoryRef.current.length > 14) {
      visitedHistoryRef.current.shift();
    }

    visitedSectorsRef.current.push(chosen.sector);
    if (visitedSectorsRef.current.length > 4) {
      visitedSectorsRef.current.shift();
    }

    // Dynamic color morph: detects if target is black / dark surface so rabbit turns white!
    const isTargetDark = checkIsDarkBackground(chosen.el, chosen.landX, chosen.landY);
    setIsDarkBg(isTargetDark);
    isDarkBgRef.current = isTargetDark;

    leapTo({ x: chosen.landX, y: chosen.landY }, {
      duration: 480,
      arcHeight: 55,
      onLanding: () => {
        // 💥 MAKE THE TOUCHED ELEMENT & ITS TEXT BOUNCE WITH DAMPED SPRING!
        triggerElementBounce(chosen.el);

        // Highlight element interactivity (temporary subtle illumination)
        try {
          chosen.el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          setTimeout(() => {
            chosen.el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          }, 650);
        } catch {
          // Safe fallback
        }

        // Adaptive perch duration based on element personality:
        // - Interactive buttons & 3D icons: snappy, curious (1.7s)
        // - Container border lookouts: relaxed (2.1s)
        // - Text & headings: proud rest (2.3s)
        const perchDelay = chosen.isInteractive
          ? 1700 + Math.random() * 400
          : chosen.isContainer
          ? 2100 + Math.random() * 450
          : 2300 + Math.random() * 550;

        if (isRoamingRef.current) {
          roamStepTimerRef.current = setTimeout(performRoamStep, perchDelay);
        }
      }
    });
  }, [leapTo, returnToNavbar]);

  // 7. Start Roaming Mode when Idle
  const startRoaming = useCallback(() => {
    if (isRoamingRef.current) return;
    setIsRoaming(true);
    isRoamingRef.current = true;

    // Launch first leap into the current section
    performRoamStep();
  }, [performRoamStep]);

  // 8. Inactivity / Idle Monitor: Smart Throttled Observer
  // Triggers lively exploration of current section after 2.2s of inactivity
  useEffect(() => {
    const IDLE_TIME = 2200;
    let lastUserAction = performance.now();
    let lastMousePos = { x: 0, y: 0 };

    const handleUserActivity = (e) => {
      const now = performance.now();

      // For mousemove, ignore micro-jitters (< 35px) so the rabbit can watch the cursor without getting spooked
      if (e.type === 'mousemove') {
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        if (Math.hypot(dx, dy) < 35 && now - lastUserAction < 400) {
          return;
        }
        lastMousePos = { x: e.clientX, y: e.clientY };
      }

      lastUserAction = now;

      // If rabbit was roaming, return gracefully on intentional user activity
      if (isRoamingRef.current) {
        returnToNavbar(true);
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        startRoaming();
      }, IDLE_TIME);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    idleTimerRef.current = setTimeout(() => {
      startRoaming();
    }, IDLE_TIME);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
      if (hopAnimRef.current) cancelAnimationFrame(hopAnimRef.current);
    };
  }, [returnToNavbar, startRoaming]);

  // 9. Scroll Section Tracking (tracks current section and keeps rabbit synced)
  useEffect(() => {
    let scrollDebounceTimer = null;

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const sections = [
        { id: 'contact', offset: 260 },
        { id: 'experience', offset: 260 },
        { id: 'education', offset: 260 },
        { id: 'projects', offset: 260 },
        { id: 'skills', offset: 260 },
      ];

      let currentSec = 'home';
      if (scrollY >= 180) {
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= sec.offset && rect.bottom > 100) {
              currentSec = sec.id;
              break;
            }
          }
        }
        if (currentSec === 'home') currentSec = 'skills';
      }

      if (activeSectionRef.current !== currentSec) {
        activeSectionRef.current = currentSec;
        setActiveSection(currentSec);

        if (isRoamingRef.current) {
          // Debounce slightly during fast scrolling so rabbit leaps when section settles
          if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
          if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
          scrollDebounceTimer = setTimeout(() => {
            if (isRoamingRef.current) performRoamStep();
          }, 120);
        } else {
          // If docked at navbar, hop along to the new active navbar pill!
          const newTarget = getNavbarTarget(currentSec);
          leapTo(newTarget, {
            duration: 380,
            arcHeight: 28,
            onLanding: () => {
              const navItemEl = document.querySelector(`[data-nav-item="${currentSec}"]`);
              triggerElementBounce(navItemEl);
            }
          });
        }
      } else if (!isRoamingRef.current && !isHoppingRef.current) {
        // While docked at navbar, dynamically track navbar width/position changes
        const currentTarget = getNavbarTarget(currentSec);
        if (currentTarget.x > 0 && (Math.abs(currentTarget.x - currentPosRef.current.x) > 0.5 || Math.abs(currentTarget.y - currentPosRef.current.y) > 0.5)) {
          currentPosRef.current = currentTarget;
          setRabbitPos(currentTarget);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial position mount sync (polls until navbar is measured)
    let syncAnimId;
    const syncInitialHome = () => {
      const initTarget = getNavbarTarget('home');
      if (initTarget.x > 0 && initTarget.y > 0) {
        currentPosRef.current = initTarget;
        setRabbitPos(initTarget);
        setIsReady(true);
      } else {
        syncAnimId = requestAnimationFrame(syncInitialHome);
      }
    };
    syncInitialHome();

    // ResizeObserver on navbar to continuously stick to it when it resizes
    const navEl = document.querySelector('nav');
    let navObserver;
    if (navEl) {
      navObserver = new ResizeObserver(() => {
        if (!isRoamingRef.current && !isHoppingRef.current) {
          const target = getNavbarTarget(activeSectionRef.current);
          if (target.x > 0 && target.y > 0) {
            currentPosRef.current = target;
            setRabbitPos(target);
          }
        }
      });
      navObserver.observe(navEl);
    }

    const handleResize = () => {
      if (!isRoamingRef.current) {
        const target = getNavbarTarget(activeSectionRef.current);
        if (target.x > 0 && target.y > 0) {
          currentPosRef.current = target;
          setRabbitPos(target);
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (syncAnimId) cancelAnimationFrame(syncAnimId);
      if (navObserver) navObserver.disconnect();
    };
  }, [getNavbarTarget, leapTo, performRoamStep]);

  // 9b. Click on navbar items triggers rabbit jump & text bounce immediately
  useEffect(() => {
    const handleNavClick = (e) => {
      const itemEl = e.target.closest('[data-nav-item]');
      if (!itemEl) return;
      const navKey = itemEl.getAttribute('data-nav-item');
      if (!navKey) return;

      activeSectionRef.current = navKey;
      setActiveSection(navKey);

      if (isRoamingRef.current) {
        setIsRoaming(false);
        isRoamingRef.current = false;
        if (roamStepTimerRef.current) {
          clearTimeout(roamStepTimerRef.current);
          roamStepTimerRef.current = null;
        }
      }

      const targetPos = getNavbarTarget(navKey);
      leapTo(targetPos, {
        duration: 380,
        arcHeight: 32,
        onLanding: () => {
          triggerElementBounce(itemEl);
        },
      });
    };

    const nav = document.querySelector('nav');
    if (nav) {
      nav.addEventListener('click', handleNavClick);
    }
    return () => {
      if (nav) nav.removeEventListener('click', handleNavClick);
    };
  }, [getNavbarTarget, leapTo]);

  // 10. Playful Click Interaction on Rabbit: 360° Somersault & Acrobatic Hop!
  const handleRabbitClick = (e) => {
    e?.stopPropagation?.();
    if (isTrickActive) return;

    setIsTrickActive(true);
    spawnLandingPuff(currentPosRef.current.x, currentPosRef.current.y, isDarkBg);

    setTimeout(() => {
      setIsTrickActive(false);
    }, 620);

    if (isRoamingRef.current) {
      // Playful reaction when roaming: immediately leap to next element with excitement!
      if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
      roamStepTimerRef.current = setTimeout(performRoamStep, 250);
    } else {
      // When perched at navbar: celebrate with a somersault and gentle pill bounce
      const navItemEl = document.querySelector(`[data-nav-item="${activeSectionRef.current}"]`);
      triggerElementBounce(navItemEl);
    }
  };

  return (
    <div data-rabbit-root className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 🐰 Living 3D Rabbit Companion (Outer Positioner) */}
      <div
        className="absolute pointer-events-auto cursor-pointer transition-none select-none"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${rabbitPos.x}px, ${rabbitPos.y}px, 0px)`,
          opacity: isReady ? 1 : 0,
          transition: isReady ? 'opacity 0.3s ease-out' : 'none',
          filter: isRoaming
            ? isDarkBg
              ? 'drop-shadow(0 6px 16px rgba(255,255,255,0.42)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))'
              : 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))'
            : activeSection !== 'home'
            ? isDarkBg
              ? 'drop-shadow(0 4px 14px rgba(255,255,255,0.36))'
              : 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))'
            : 'none',
        }}
      >
        {/* Inner container performs trick acrobatics without overriding translate3d positioning */}
        <div className={`w-full h-full flex items-center justify-center ${isTrickActive ? 'rabbit-trick-active' : ''}`}>
          <Logo3D
            className="w-10 h-10 sm:w-11 sm:h-11"
            isHopping={isHopping}
            hopDirection={hopDirection}
            hopProgress={hopProgress}
            isWhite={isDarkBg}
            onClick={handleRabbitClick}
          />
        </div>
      </div>
    </div>
  );
};

export default RabbitCompanion;

