import React, { useState, useEffect, useRef, useCallback } from 'react';
import Logo3D from './Logo3D';

/**
 * RabbitCompanion Component.
 * The living companion of RabbitFolio:
 *
 * Inside the Navbar:
 * - Docked at Home: Centered snugly inside the circular home dock.
 * - Nav Tab Riding: Perches gracefully atop the active section pill (Skills, Projects, Academics, Experience).
 * - Smooth Arc Travel: Performs a clean, aerodynamic leap between tabs on scroll or click.
 * - No-Jitter Scroll Lock: Click-navigation locks section jitter during smooth page scrolling.
 * - Morph Tracking: Sticks dynamically to the active pill during navbar size changes.
 *
 * Outside the Navbar (Roaming):
 * - Gentle Idle Wake: Begins curious exploration after 3.8s of quiet inactivity.
 * - Un-Spooked & Approachable: Casual mouse movements do NOT scare the rabbit back; instead,
 *   it notices the cursor and looks curiously toward it, allowing users to pet and click it.
 * - Intentional Return: Gracefully returns to the navbar on scroll (>50px), keypress, or navbar hover.
 * - Smart Landmark Discovery: Leaps ONLY to genuine UI landmarks (tech badges, cards, 3D icons, headings).
 * - Kinetic Landing Cushion: Real spring squash & bounce on landed elements with surface-adaptive dust/sparkles.
 * - Dynamic 3D Color Morph: Adapts between obsidian black and radiant white based on surface luminance.
 * - Home Navigation on Click: Clicking the rabbit from anywhere immediately returns to the homepage.
 */
const RabbitCompanion = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isRoaming, setIsRoaming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [rabbitPos, setRabbitPos] = useState({ x: -999, y: -999 });
  const [isHopping, setIsHopping] = useState(false);
  const [hopDirection, setHopDirection] = useState(1);
  const [hopProgress, setHopProgress] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(false);

  const currentPosRef = useRef({ x: -999, y: -999 });
  const isRoamingRef = useRef(false);
  const isHoppingRef = useRef(false);
  const isDarkBgRef = useRef(false);
  const hopAnimRef = useRef(null);
  const idleTimerRef = useRef(null);
  const roamStepTimerRef = useRef(null);
  const activeSectionRef = useRef('home');
  const navClickLockRef = useRef(0);
  const roamStartScrollYRef = useRef(0);

  // Visited memory to prevent jumping back and forth between 2-3 places
  const visitedHistoryRef = useRef([]);
  const visitedSectorsRef = useRef([]);

  const RABBIT_WIDTH = 40;
  const RABBIT_HEIGHT = 40;

  // Detect whether an element or coordinate is situated over a dark background
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

  // 1. Measure Navbar Target Position:
  // - At home: Perfectly centered in the circular home dock.
  // - At section tabs: Perches gracefully atop the active section pill with paws on the glass rim.
  const getNavbarTarget = useCallback((sectionKey) => {
    const navEl = document.querySelector('nav');
    if (!navEl) return { x: -999, y: -999 };

    const effectiveKey = (sectionKey === 'contact' || sectionKey === 'cta') ? 'experience' : sectionKey;
    const itemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`) ||
                   document.querySelector('[data-nav-item="home"]') ||
                   navEl;

    const navRect = navEl.getBoundingClientRect();
    const isHome = effectiveKey === 'home';

    if (isHome) {
      // At home base: center directly in the circular home dock
      const dockEl = itemEl.querySelector('.rounded-full') || itemEl.querySelector('button') || itemEl;
      const dockRect = dockEl.getBoundingClientRect();
      const x = dockRect.left + (dockRect.width - RABBIT_WIDTH) / 2;
      const y = navRect.top + (navRect.height - RABBIT_HEIGHT) / 2;
      return { x, y };
    }

    // At section name text (skills, projects, education, experience):
    // Perch right atop the active section item with paws resting on the navbar pill rim
    const itemRect = itemEl.getBoundingClientRect();
    const x = itemRect.left + (itemRect.width - RABBIT_WIDTH) / 2;
    // Paws rest naturally on the top edge of the navbar pill; clamp with safe top-screen margin
    const y = Math.max(10, navRect.top - RABBIT_HEIGHT + 18);

    return { x, y };
  }, []);

  // 2. Spawn subtle dust puff particles under rabbit paws on landing
  const spawnLandingPuff = (x, y, isWhite = false) => {
    try {
      [-6, 6].forEach((xOffset) => {
        const puff = document.createElement('div');
        puff.className = `fixed pointer-events-none rounded-full ${isWhite ? 'bg-white/45' : 'bg-black/15'} rabbit-dust-particle z-40`;
        puff.style.left = `${x + RABBIT_WIDTH / 2 + xOffset - 6}px`;
        puff.style.top = `${y + RABBIT_HEIGHT - 6}px`;
        puff.style.width = '14px';
        puff.style.height = '6px';
        document.body.appendChild(puff);
        setTimeout(() => puff.remove(), 550);
      });
    } catch {}
  };

  // 2b. Trigger physics-based squash & spring bounce on landed elements
  const triggerElementBounce = (el) => {
    if (!el) return;

    // Target the dedicated bounce layer if present (avoids conflicts with GSAP positioning)
    const bounceNode = el.querySelector?.('[data-skill-bounce]') ||
                       (el.hasAttribute?.('data-skill-bounce') ? el : null);

    if (bounceNode) {
      bounceNode.classList.remove('rabbit-bounce-active');
      void bounceNode.offsetWidth; // Force synchronous reflow to reliably restart animation
      bounceNode.classList.add('rabbit-bounce-active');
      setTimeout(() => {
        bounceNode.classList.remove('rabbit-bounce-active');
      }, 620);
      return;
    }

    const inlineSpans = el.querySelectorAll?.('.inline-block') || [];
    const targets = inlineSpans.length > 0 ? Array.from(inlineSpans).slice(0, 3) : [el];

    targets.forEach((node) => {
      node.classList.remove('rabbit-bounce-active');
      void node.offsetWidth; // Force synchronous reflow
      node.classList.add('rabbit-bounce-active');
      setTimeout(() => {
        node.classList.remove('rabbit-bounce-active');
      }, 620);
    });
  };

  // 3. Natural Biological Leap Engine with Smooth Airborne Flight
  const leapTo = useCallback((target, {
    duration = 440,
    arcHeight = 48,
    onLanding,
  } = {}) => {
    // Clean Departure: Immediately glide shut any active skill tooltip the instant a leap takes off!
    window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));

    if (hopAnimRef.current) {
      cancelAnimationFrame(hopAnimRef.current);
    }

    const start = { ...currentPosRef.current };
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 4) {
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

    // Organic timing: short hops are brisk (~380ms), long leaps have floaty hang-time (~580ms)
    const leapDuration = Math.min(580, Math.max(370, 320 + distance * 0.32));
    const leapArc = Math.min(110, Math.max(arcHeight, 28 + distance * 0.12));

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / leapDuration);

      setHopProgress(t);

      let curX, curY;

      if (t < 0.10) {
        // Phase 1: Anticipation Crouch (hind legs compression)
        const pc = t / 0.10;
        curX = start.x;
        curY = start.y + Math.sin(pc * Math.PI) * 2.5;
      } else if (t <= 0.90) {
        // Phase 2: Kinetic Airborne Leap (continuous smooth cosine travel)
        const tau = (t - 0.10) / 0.80;
        // Sinusoidal ease for horizontal travel
        const easeX = 0.5 - Math.cos(tau * Math.PI) * 0.5;
        curX = start.x + dx * easeX;

        // Parabolic vertical trajectory with apex hang-time
        const hangFactor = 1.0 + 0.14 * Math.sin(tau * Math.PI);
        curY = start.y + dy * tau - Math.sin(tau * Math.PI) * hangFactor * leapArc;
      } else {
        // Phase 3: Impact Cushion (paws absorb touchdown)
        const pl = (t - 0.90) / 0.10;
        curX = target.x;
        curY = target.y + Math.sin(pl * Math.PI) * 2.5;
      }

      currentPosRef.current = { x: curX, y: curY };
      setRabbitPos({ x: curX, y: curY });

      if (t < 1.0) {
        hopAnimRef.current = requestAnimationFrame(step);
      } else {
        // Touchdown complete
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

    // Clear any active skill tooltip
    window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));

    const targetKey = activeSectionRef.current;
    const dockTarget = getNavbarTarget(targetKey);
    leapTo(dockTarget, {
      duration: speedy ? 340 : 420,
      arcHeight: 50,
      onLanding: () => {
        const effectiveKey = (targetKey === 'contact' || targetKey === 'cta') ? 'experience' : targetKey;
        const navItemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);
        triggerElementBounce(navItemEl);
      },
    });
  }, [getNavbarTarget, leapTo]);

  // 5. Discover Genuine High-Value UI Landmarks Across Current Section & Skills
  const findScreenTargets = () => {
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    // Focused selectors: ALL skill items, CTA cards, badges, headings, cards, and interactive landmarks
    const selectors = [
      // Skill Section specific targets
      '[data-skill-card]', '[data-skill-target]', '.skill-icon',
      // CTA Section specific targets
      '[data-cta-landmark]', '[data-cta-badge]', '[data-cta-button]',
      // Tech stack badges, skill pills & 3D model icons
      '[data-model-icon]', 'button', 'a[href]',
      '[class*="badge"]', '[class*="tag"]', '[class*="pill"]',
      // Section headings, stack items & cards
      'h2', 'h3', 'article'
    ].join(', ');

    const currentSecKey = activeSectionRef.current;
    const currentSecId = currentSecKey === 'home' ? 'hero' : currentSecKey;
    const currentSecEl = document.getElementById(currentSecId) || document.getElementById('hero');

    let candidates = currentSecEl ? Array.from(currentSecEl.querySelectorAll(selectors)) : [];

    // Always include navbar items as natural stepping stones
    const navItems = Array.from(document.querySelectorAll('[data-nav-item]'));
    candidates.push(...navItems);

    if (candidates.length < 4) {
      candidates.push(...Array.from(document.querySelectorAll(selectors)));
    }

    const validTargets = [];
    const seenPositions = new Set();

    for (const el of candidates) {
      const isNavItem = el.hasAttribute('data-nav-item') || el.closest('[data-nav-item]');

      // Skip internal rabbit parts or modals
      if (el.closest('[data-rabbit-root]') || el.closest('#resume-modal')) continue;
      if (el.closest('nav') && !isNavItem) continue;

      // Discard invisible or zero-size elements
      if (!isNavItem && el.offsetParent === null) continue;

      // Check skill cards specifically
      const skillCardEl = el.hasAttribute('data-skill-card') ? el : el.closest('[data-skill-card]');
      if (skillCardEl) {
        const style = window.getComputedStyle(skillCardEl);
        if (parseFloat(style.opacity || '1') < 0.15) continue;
        const rect = skillCardEl.getBoundingClientRect();
        if (rect.bottom < 80 || rect.top > viewportH - 60) continue;
        if (rect.right < 24 || rect.left > viewportW - 24) continue;
        if (rect.width < 16 || rect.height < 14) continue;

        const skillName = skillCardEl.getAttribute('data-skill-card');
        const gridKey = `skill_${skillName}`;
        if (seenPositions.has(gridKey)) continue;
        seenPositions.add(gridKey);

        let landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        let landY = rect.top - RABBIT_HEIGHT + 14;

        landX = Math.max(20, Math.min(viewportW - RABBIT_WIDTH - 20, landX));
        landY = Math.max(64, Math.min(viewportH - RABBIT_HEIGHT - 30, landY));

        const col = landX < viewportW / 3 ? 0 : landX < (2 * viewportW) / 3 ? 1 : 2;
        const row = landY < viewportH / 2 ? 0 : 1;
        const sector = row * 3 + col;

        validTargets.push({
          el: skillCardEl,
          rect,
          landX,
          landY,
          sector,
          isCard: false,
          isInteractive: true,
          inCurrentSection: true,
          skillName,
        });
        continue;
      }

      // Check skill landmarks (category pill, main title, text stack lines)
      const skillTargetEl = el.hasAttribute('data-skill-target') ? el : el.closest('[data-skill-target]');
      if (skillTargetEl) {
        const style = window.getComputedStyle(skillTargetEl);
        if (parseFloat(style.opacity || '1') < 0.15) continue;
        const rect = skillTargetEl.getBoundingClientRect();
        if (rect.bottom < 80 || rect.top > viewportH - 60) continue;
        if (rect.right < 24 || rect.left > viewportW - 24) continue;
        if (rect.width < 16 || rect.height < 14) continue;

        const targetType = skillTargetEl.getAttribute('data-skill-target');
        const gridKey = `target_${targetType}`;
        if (seenPositions.has(gridKey)) continue;
        seenPositions.add(gridKey);

        let landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        let landY = rect.top - RABBIT_HEIGHT + 10;

        landX = Math.max(20, Math.min(viewportW - RABBIT_WIDTH - 20, landX));
        landY = Math.max(64, Math.min(viewportH - RABBIT_HEIGHT - 30, landY));

        const col = landX < viewportW / 3 ? 0 : landX < (2 * viewportW) / 3 ? 1 : 2;
        const row = landY < viewportH / 2 ? 0 : 1;
        const sector = row * 3 + col;

        validTargets.push({
          el: skillTargetEl,
          rect,
          landX,
          landY,
          sector,
          isCard: false,
          isInteractive: true,
          inCurrentSection: true,
        });
        continue;
      }

      const rect = el.getBoundingClientRect();

      // Must be visible within current viewport with safe margins
      if (rect.bottom < 80 || rect.top > viewportH - 60) continue;
      if (rect.right < 24 || rect.left > viewportW - 24) continue;

      // Discard giant containers or tiny fragments
      if (rect.width > viewportW * 0.85 && rect.height > viewportH * 0.7) continue;
      if (rect.width < 16 || rect.height < 14) continue;

      const isCard = el.tagName === 'ARTICLE' || el.className?.includes?.('card');

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
          const itemRect = el.getBoundingClientRect();
          landX = itemRect.left + (itemRect.width - RABBIT_WIDTH) / 2;
          landY = Math.max(10, navRect.top - RABBIT_HEIGHT + 18);
        }
      } else if (isCard) {
        // Perch cleanly on the top-left edge of the card
        landX = rect.left + Math.min(60, rect.width * 0.25) - RABBIT_WIDTH / 2;
        landY = rect.top - RABBIT_HEIGHT + 12;
      } else {
        // Perch centered atop badge, button, icon, or heading
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 10;
      }

      // Constrain inside viewport safe margins
      landX = Math.max(20, Math.min(viewportW - RABBIT_WIDTH - 20, landX));
      landY = Math.max(64, Math.min(viewportH - RABBIT_HEIGHT - 30, landY));

      // Grid deduplication
      const gridKey = `${Math.round(landX / 36)}_${Math.round(landY / 36)}`;
      if (seenPositions.has(gridKey)) continue;
      seenPositions.add(gridKey);

      // 6-sector grid: 3 columns x 2 rows
      const col = landX < viewportW / 3 ? 0 : landX < (2 * viewportW) / 3 ? 1 : 2;
      const row = landY < viewportH / 2 ? 0 : 1;
      const sector = row * 3 + col;

      const inCurrentSection = currentSecEl ? currentSecEl.contains(el) : true;
      const isInteractive = isNavItem || el.tagName === 'BUTTON' || el.tagName === 'A' || el.hasAttribute('data-model-icon');

      validTargets.push({
        el: isNavItem ? (el.hasAttribute('data-nav-item') ? el : el.closest('[data-nav-item]')) : el,
        rect,
        landX,
        landY,
        sector,
        isCard,
        isInteractive,
        inCurrentSection,
      });
    }

    return validTargets;
  };

  // 6. Perform Next Roaming Step Across Landmarks
  const performRoamStep = useCallback(() => {
    if (!isRoamingRef.current) return;

    const allTargets = findScreenTargets();

    if (allTargets.length === 0) {
      returnToNavbar();
      return;
    }

    // Clear previous skill tooltip before launching into new leap
    window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));

    const curX = currentPosRef.current.x;
    const curY = currentPosRef.current.y;
    const viewportW = window.innerWidth;

    // Filter out recently visited elements
    let candidates = allTargets.filter(t => !visitedHistoryRef.current.includes(t.el));

    if (candidates.length === 0) {
      visitedHistoryRef.current = visitedHistoryRef.current.slice(-2);
      candidates = allTargets.filter(t => !visitedHistoryRef.current.includes(t.el));
      if (candidates.length === 0) candidates = allTargets;
    }

    // Score candidates: strongly prioritize active section and organic distance
    const scored = candidates.map(t => {
      const dist = Math.hypot(t.landX - curX, t.landY - curY);
      const isFreshSector = !visitedSectorsRef.current.slice(-2).includes(t.sector);
      const isGoodDistance = dist >= 70 && dist <= viewportW * 0.75;

      let score = 0;
      if (t.inCurrentSection) score += 50;
      if (t.skillName) score += 20; // Extra priority for skill icons!
      if (isFreshSector) score += 25;
      if (isGoodDistance) score += 20;

      return { target: t, dist, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, Math.min(3, scored.length));
    const chosenEntry = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    const chosen = chosenEntry.target;

    visitedHistoryRef.current.push(chosen.el);
    if (visitedHistoryRef.current.length > 12) {
      visitedHistoryRef.current.shift();
    }

    visitedSectorsRef.current.push(chosen.sector);
    if (visitedSectorsRef.current.length > 3) {
      visitedSectorsRef.current.shift();
    }

    // Dynamic color morph based on target background
    const isTargetDark = checkIsDarkBackground(chosen.el, chosen.landX, chosen.landY);
    setIsDarkBg(isTargetDark);
    isDarkBgRef.current = isTargetDark;

    leapTo({ x: chosen.landX, y: chosen.landY }, {
      duration: 460,
      arcHeight: 52,
      onLanding: () => {
        // Physical squash & bounce on target
        triggerElementBounce(chosen.el);

        // If landing on a skill item, pop open its interactive tooltip!
        if (chosen.skillName) {
          window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: chosen.skillName } }));
        }

        // Adaptive perch duration based on element personality
        const perchDelay = chosen.skillName
          ? 2200 + Math.random() * 400
          : chosen.isInteractive
          ? 1800 + Math.random() * 400
          : chosen.isCard
          ? 2400 + Math.random() * 500
          : 2100 + Math.random() * 450;

        if (isRoamingRef.current) {
          roamStepTimerRef.current = setTimeout(performRoamStep, perchDelay);
        }
      }
    });
  }, [leapTo, returnToNavbar, checkIsDarkBackground]);

  // 7. Start Roaming Mode when Idle
  const startRoaming = useCallback(() => {
    if (isRoamingRef.current) return;
    setIsRoaming(true);
    isRoamingRef.current = true;
    roamStartScrollYRef.current = window.scrollY || 0;

    performRoamStep();
  }, [performRoamStep]);

  // 8. Idle Monitor & Intentional Navigation Observer
  // - 3.8s idle threshold for calm, unobtrusive presence
  // - Mouse movement does NOT spook the rabbit away; it can be approached and petted
  // - Returns to navbar only on genuine user navigation (scroll > 50px, keys, navbar hover)
  useEffect(() => {
    const IDLE_TIME = 3800;

    const handleUserActivity = (e) => {
      // 1. Mouse movements: Check if user is hovering the navbar or interacting
      if (e.type === 'mousemove') {
        // If cursor moves into navbar region (top 75px), user wants navigation -> return gracefully
        if (isRoamingRef.current && e.clientY < 75) {
          returnToNavbar(true);
          return;
        }

        // Reset idle timer without scaring the rabbit away
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (!isRoamingRef.current) {
          idleTimerRef.current = setTimeout(startRoaming, IDLE_TIME);
        }
        return;
      }

      // 2. Page scroll: If scrolling significantly while roaming, return to navbar
      if (e.type === 'scroll') {
        if (isRoamingRef.current) {
          const currentScroll = window.scrollY || 0;
          if (Math.abs(currentScroll - roamStartScrollYRef.current) > 50) {
            returnToNavbar(true);
          }
        }
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(startRoaming, IDLE_TIME);
        return;
      }

      // 3. Deliberate user clicks on other interactive elements or keydowns
      if (e.type === 'keydown') {
        if (isRoamingRef.current) returnToNavbar(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(startRoaming, IDLE_TIME);
        return;
      }

      if (e.type === 'pointerdown') {
        // If click is on rabbit itself, do NOT return to navbar
        if (e.target?.closest?.('[data-rabbit-root]')) return;

        // If click was on another interactive element, return to navbar
        if (isRoamingRef.current && (e.target?.closest?.('button') || e.target?.closest?.('a'))) {
          returnToNavbar(true);
        }
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(startRoaming, IDLE_TIME);
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'pointerdown'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    idleTimerRef.current = setTimeout(startRoaming, IDLE_TIME);

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
      // If user recently clicked a nav item, lock out intermediate scroll section updates
      if (performance.now() < navClickLockRef.current) return;

      const scrollY = window.scrollY || 0;
      const sections = [
        { id: 'contact', offset: 260 },
        { id: 'cta', offset: 260 },
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
          if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
          if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
          scrollDebounceTimer = setTimeout(() => {
            if (isRoamingRef.current) performRoamStep();
          }, 120);
        } else {
          // Hop along to the newly active navbar tab!
          const newTarget = getNavbarTarget(currentSec);
          leapTo(newTarget, {
            duration: 380,
            arcHeight: 26,
            onLanding: () => {
              const effectiveKey = (currentSec === 'contact' || currentSec === 'cta') ? 'experience' : currentSec;
              const navItemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);
              triggerElementBounce(navItemEl);
            }
          });
        }
      } else if (!isRoamingRef.current && !isHoppingRef.current) {
        // Dynamically track navbar width and position changes
        const currentTarget = getNavbarTarget(currentSec);
        if (currentTarget.x > 0 && (Math.abs(currentTarget.x - currentPosRef.current.x) > 0.5 || Math.abs(currentTarget.y - currentPosRef.current.y) > 0.5)) {
          currentPosRef.current = currentTarget;
          setRabbitPos(currentTarget);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial mount sync (polls until navbar is measured)
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

    // ResizeObserver on navbar to stick to it smoothly during layout shifts
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

  // 10. Nav-Click Lock: Single, confident leap directly to clicked destination
  useEffect(() => {
    const handleNavClick = (e) => {
      const itemEl = e.target.closest('[data-nav-item]');
      if (!itemEl) return;
      const navKey = itemEl.getAttribute('data-nav-item');
      if (!navKey) return;

      // Lock section scroll listener for 750ms so smooth scrolling doesn't cause stutter hops
      navClickLockRef.current = performance.now() + 750;

      activeSectionRef.current = navKey;
      setActiveSection(navKey);

      if (isRoamingRef.current) {
        setIsRoaming(false);
        isRoamingRef.current = false;
        window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));
        if (roamStepTimerRef.current) {
          clearTimeout(roamStepTimerRef.current);
          roamStepTimerRef.current = null;
        }
      }

      const targetPos = getNavbarTarget(navKey);
      leapTo(targetPos, {
        duration: 380,
        arcHeight: 30,
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

  // 11. Click on Rabbit: Instantly return to Homepage from anywhere
  const handleRabbitClick = (e) => {
    e?.stopPropagation?.();

    if (roamStepTimerRef.current) {
      clearTimeout(roamStepTimerRef.current);
      roamStepTimerRef.current = null;
    }

    setIsRoaming(false);
    isRoamingRef.current = false;
    setIsDarkBg(false);
    isDarkBgRef.current = false;
    window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));

    // Lock scroll tracking for 850ms during smooth scroll back to home
    navClickLockRef.current = performance.now() + 850;

    activeSectionRef.current = 'home';
    setActiveSection('home');

    // Smooth scroll the viewport back to the top of homepage
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Leap directly to the circular home dock inside the navbar
    const homeTarget = getNavbarTarget('home');
    leapTo(homeTarget, {
      duration: 400,
      arcHeight: 50,
      onLanding: () => {
        const homeDockEl = document.querySelector('[data-nav-item="home"]');
        triggerElementBounce(homeDockEl);
      },
    });
  };

  return (
    <div data-rabbit-root className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 🐰 Living 3D Rabbit Companion */}
      <div
        className="absolute pointer-events-auto cursor-pointer select-none transition-none"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${rabbitPos.x}px, ${rabbitPos.y}px, 0px)`,
          opacity: isReady ? 1 : 0,
          transition: isReady ? 'opacity 0.3s ease-out' : 'none',
          filter: isRoaming
            ? isDarkBg
              ? 'drop-shadow(0 8px 24px rgba(255,255,255,0.5)) drop-shadow(0 3px 8px rgba(0,0,0,0.65))'
              : 'drop-shadow(0 10px 24px rgba(0,0,0,0.25))'
            : activeSection !== 'home'
            ? isDarkBg
              ? 'drop-shadow(0 4px 14px rgba(255,255,255,0.36))'
              : 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))'
            : 'none',
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: isRoaming ? 'scale(1.38)' : 'scale(1)',
            transformOrigin: 'bottom center',
          }}
        >
          <Logo3D
            className="w-10 h-10 sm:w-10 sm:h-10"
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
