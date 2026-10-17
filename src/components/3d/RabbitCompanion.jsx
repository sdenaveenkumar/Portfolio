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
const RabbitCompanion = ({ isRabbitTreeOpen = false }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isRoaming, setIsRoaming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [rabbitPos, setRabbitPos] = useState({ x: -999, y: -999 });
  const [isHopping, setIsHopping] = useState(false);
  const [hopDirection, setHopDirection] = useState(1);
  const [hopProgress, setHopProgress] = useState(0);

  const currentPosRef = useRef({ x: -999, y: -999 });
  const isRoamingRef = useRef(false);
  const isHoppingRef = useRef(false);
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



  // 1. Measure Navbar Target Position:
  // - On desktop: Perfectly centered in the circular home dock, or perches atop active section tab.
  // - On mobile bottom tab bar: Sits gracefully right atop the active tab icon on the frosted glass rim.
  const getNavbarTarget = useCallback((sectionKey) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    let navEl = null;

    if (isMobile) {
      navEl = document.querySelector('[data-mobile-tab-bar]');
      if (!navEl) {
        // Fallback: look for a visible nav in the lower half of viewport
        const allNavs = Array.from(document.querySelectorAll('nav'));
        navEl = allNavs.find((n) => {
          const rect = n.getBoundingClientRect();
          return rect.height > 0 && rect.top > (window.innerHeight / 2);
        }) || null;
      }
    } else {
      navEl = document.querySelector('[data-desktop-nav]');
      if (!navEl) {
        const allNavs = Array.from(document.querySelectorAll('nav'));
        navEl = allNavs.find((n) => {
          const rect = n.getBoundingClientRect();
          return rect.height > 0 && rect.top < (window.innerHeight / 2);
        }) || null;
      }
    }

    if (!navEl) return { x: -999, y: -999 };

    const navRect = navEl.getBoundingClientRect();
    if (navRect.height === 0 || navRect.width === 0) return { x: -999, y: -999 };

    const effectiveKey = (sectionKey === 'contact' || sectionKey === 'cta') ? 'experience' : sectionKey;
    const itemEl = navEl.querySelector(`[data-nav-item="${effectiveKey}"]`) ||
      navEl.querySelector('[data-nav-item="home"]') ||
      navEl;

    const navItemRect = itemEl.getBoundingClientRect();
    const isHome = effectiveKey === 'home';

    if (isMobile) {
      const x = navItemRect.width > 0
        ? navItemRect.left + (navItemRect.width - RABBIT_WIDTH) / 2
        : navRect.left + 24;
      // On mobile bottom tab bar, rabbit paws rest gracefully on the upper frosted rim of the bar,
      // completely clear of tab icons and text labels underneath
      const y = navRect.top - RABBIT_HEIGHT + 6;
      return { x, y };
    }

    if (isHome) {
      // At home base: center directly in the circular home dock
      const dockEl = itemEl.querySelector('.rounded-full') || itemEl.querySelector('button') || itemEl;
      const dockRect = dockEl.getBoundingClientRect();
      const x = dockRect.width > 0
        ? dockRect.left + (dockRect.width - RABBIT_WIDTH) / 2
        : navRect.left + 16;
      const y = navRect.top + (navRect.height - RABBIT_HEIGHT) / 2;
      return { x, y };
    }

    // At section name text (skills, projects, education, experience):
    // Perch right atop the active section item with paws resting on the navbar pill rim
    const x = navItemRect.width > 0
      ? navItemRect.left + (navItemRect.width - RABBIT_WIDTH) / 2
      : navRect.left + (navRect.width - RABBIT_WIDTH) / 2;
    const y = Math.max(10, navRect.top - RABBIT_HEIGHT + 18);

    return { x, y };
  }, []);

  // 2. Spawn subtle dust puff particles under rabbit paws on landing
  const spawnLandingPuff = (x, y) => {
    try {
      [-6, 6].forEach((xOffset) => {
        const puff = document.createElement('div');
        puff.className = 'fixed pointer-events-none rounded-full bg-black/15 rabbit-dust-particle z-40';
        puff.style.left = `${x + RABBIT_WIDTH / 2 + xOffset - 6}px`;
        puff.style.top = `${y + RABBIT_HEIGHT - 6}px`;
        puff.style.width = '14px';
        puff.style.height = '6px';
        document.body.appendChild(puff);
        setTimeout(() => puff.remove(), 550);
      });
    } catch { }
  };

  // 2b. Trigger physics-based squash & spring bounce on landed elements
  const triggerElementBounce = (el) => {
    if (!el) return;
    if (el.closest?.('[data-rabbit-tree]') || el.closest?.('[data-rabbit-tree-modal]') || el.closest?.('[data-no-rabbit]')) return;

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
    duration: customDuration,
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
      if (target.x > -100 && target.y > -100) {
        setIsReady(true);
      }
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
    const leapDuration = customDuration || Math.min(580, Math.max(370, 320 + distance * 0.32));
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
      if (curX > -100 && curY > -100) {
        setIsReady(true);
      }

      if (t < 1.0) {
        hopAnimRef.current = requestAnimationFrame(step);
      } else {
        // Touchdown complete
        const finalTarget = !isRoamingRef.current
          ? getNavbarTarget(activeSectionRef.current)
          : target;

        currentPosRef.current = finalTarget;
        setRabbitPos(finalTarget);
        if (finalTarget.x > -100 && finalTarget.y > -100) {
          setIsReady(true);
        }
        setIsHopping(false);
        isHoppingRef.current = false;
        setHopProgress(0);
        hopAnimRef.current = null;

        spawnLandingPuff(finalTarget.x, finalTarget.y);
        if (onLanding) onLanding();
      }
    };

    hopAnimRef.current = requestAnimationFrame(step);
  }, [getNavbarTarget]);

  // Trigger home landing bounce and event, and glide with the home dock as navbar contracts
  const triggerHomeLanding = useCallback((itemEl) => {
    triggerElementBounce(itemEl);
    window.dispatchEvent(new CustomEvent('rabbit-landed-home'));

    // As the navbar contracts from wide (700px) to compact (520px) over 500ms,
    // continuously track the home dock on every frame so the rabbit smoothly glides with it!
    const trackStart = performance.now();
    const trackDockGlide = (now) => {
      if (now - trackStart < 620 && activeSectionRef.current === 'home' && !isRoamingRef.current && !isHoppingRef.current) {
        const target = getNavbarTarget('home');
        if (target.x > 0 && target.y > 0) {
          currentPosRef.current = target;
          setRabbitPos(target);
        }
        requestAnimationFrame(trackDockGlide);
      }
    };
    requestAnimationFrame(trackDockGlide);
  }, [getNavbarTarget]);

  // 4. Return to Navbar Dock
  const returnToNavbar = useCallback((speedy = false) => {
    if (roamStepTimerRef.current) {
      clearTimeout(roamStepTimerRef.current);
      roamStepTimerRef.current = null;
    }

    setIsRoaming(false);
    isRoamingRef.current = false;

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
        if (targetKey === 'home') {
          triggerHomeLanding(navItemEl);
        } else {
          triggerElementBounce(navItemEl);
        }
      },
    });
  }, [getNavbarTarget, leapTo, triggerHomeLanding]);

  // 5. Discover Genuine High-Value UI Landmarks Across Designated Section Targets
  const findScreenTargets = () => {
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    // Strict designated target selectors as requested:
    // 1. Hero: only See my works button
    // 2. Skills: only all tech stack icons
    // 3. Projects: only projects name (h3)
    // 4. Academic: only Distinction Honors
    // 5. Call to action: only Idea! ('I', 'd', 'e', 'a', '!')
    // 6. Contact us: only input section
    const selectors = [
      '[data-rabbit-target="hero-see-works"]',
      '[data-skill-card]',
      '.skill-icon',
      '[data-rabbit-target="skill-tech"]',
      '[data-rabbit-target="project-name"]',
      '[data-rabbit-target="academic-distinction"]',
      '[data-cta-idea-letter]',
      '[data-rabbit-target="contact-input"]'
    ].join(', ');

    const currentSecKey = activeSectionRef.current;
    const currentSecId = currentSecKey === 'home' ? 'hero' : currentSecKey;
    const currentSecEl = document.getElementById(currentSecId) || document.getElementById('hero');

    const candidates = [];
    if (currentSecEl) {
      candidates.push(...Array.from(currentSecEl.querySelectorAll(selectors)));
    }

    // Also check visible designated targets on screen
    candidates.push(...Array.from(document.querySelectorAll(selectors)));

    const validTargets = [];
    const seenPositions = new Set();

    for (const el of candidates) {
      // Skip internal rabbit parts, modals, or navbars
      if (el.closest('[data-rabbit-root]') || el.closest('#resume-modal') || el.closest('nav')) continue;

      // DO NOT INTERACT WITH RABBIT TREE:
      if (
        el.closest('[data-rabbit-tree]') ||
        el.closest('[data-rabbit-tree-modal]') ||
        el.closest('[data-no-rabbit]') ||
        el.closest('[aria-label*="Rabbit Tree"]') ||
        el.closest('[title*="Rabbit Tree"]') ||
        (el.textContent && el.textContent.toLowerCase().includes('rabbit tree'))
      ) {
        continue;
      }

      // Check visibility
      if (el.offsetParent === null) continue;
      const style = window.getComputedStyle(el);
      if (parseFloat(style.opacity || '1') < 0.15) continue;
      const rect = el.getBoundingClientRect();

      // Must be visible within viewport margins
      if (rect.bottom < 50 || rect.top > viewportH - 30) continue;
      if (rect.right < 15 || rect.left > viewportW - 15) continue;

      // Section Target Categorization:
      const isHeroButton = Boolean(el.hasAttribute('data-rabbit-target') && el.getAttribute('data-rabbit-target') === 'hero-see-works') || Boolean(el.closest('[data-rabbit-target="hero-see-works"]'));
      const isSkillCard = Boolean(el.hasAttribute('data-skill-card')) || Boolean(el.closest('[data-skill-card]')) || el.classList?.contains?.('skill-icon') || Boolean(el.closest('.skill-icon'));
      const isProjectName = Boolean(el.hasAttribute('data-rabbit-target') && el.getAttribute('data-rabbit-target') === 'project-name') || Boolean(el.closest('[data-rabbit-target="project-name"]'));
      const isAcademicDistinction = Boolean(el.hasAttribute('data-rabbit-target') && el.getAttribute('data-rabbit-target') === 'academic-distinction') || Boolean(el.closest('[data-rabbit-target="academic-distinction"]'));
      const isIdeaLetter = Boolean(el.hasAttribute('data-cta-idea-letter')) || Boolean(el.closest('[data-cta-idea-letter]'));
      const isContactInput = Boolean(el.hasAttribute('data-rabbit-target') && el.getAttribute('data-rabbit-target') === 'contact-input') || Boolean(el.closest('[data-rabbit-target="contact-input"]'));

      // STRICT USER CONSTRAINT: Discard any element that is NOT one of the 6 section targets
      if (!isHeroButton && !isSkillCard && !isProjectName && !isAcademicDistinction && !isIdeaLetter && !isContactInput) {
        continue;
      }

      let landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
      let landY = rect.top - RABBIT_HEIGHT + 10;
      let skillName = null;
      let letterChar = null;
      let letterIndex = 0;

      if (isHeroButton) {
        // Hero: See my works button
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 10;
      } else if (isSkillCard) {
        // Skills: All tech stack icons
        const skillEl = el.hasAttribute('data-skill-card') ? el : el.closest('[data-skill-card]');
        skillName = skillEl?.getAttribute('data-skill-card') || null;
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 14;
      } else if (isProjectName) {
        // Projects: Project name
        landX = rect.left + Math.min(rect.width / 2, 70) - RABBIT_WIDTH / 2;
        landY = rect.top - RABBIT_HEIGHT + 8;
      } else if (isAcademicDistinction) {
        // Academics: Distinction Honors
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 8;
      } else if (isIdeaLetter) {
        // Call To Action: letters of "Idea!"
        const letterEl = el.hasAttribute('data-cta-idea-letter') ? el : el.closest('[data-cta-idea-letter]');
        letterChar = letterEl?.getAttribute('data-cta-idea-letter') || '!';
        letterIndex = parseInt(letterEl?.getAttribute('data-cta-idea-index') || '0', 10);
        landX = rect.left + (rect.width - RABBIT_WIDTH) / 2;
        landY = rect.top - RABBIT_HEIGHT + 14;
      } else if (isContactInput) {
        // Contact: Input section
        landX = rect.left + Math.min(80, rect.width * 0.25) - RABBIT_WIDTH / 2;
        landY = rect.top - RABBIT_HEIGHT + 8;
      }

      // Constrain inside viewport safe margins
      landX = Math.max(15, Math.min(viewportW - RABBIT_WIDTH - 15, landX));
      landY = Math.max(50, Math.min(viewportH - RABBIT_HEIGHT - 25, landY));

      // Grid deduplication
      const gridKey = isIdeaLetter
        ? `cta_${letterIndex}`
        : `${Math.round(landX / 30)}_${Math.round(landY / 30)}`;
      if (seenPositions.has(gridKey)) continue;
      seenPositions.add(gridKey);

      // 6-sector grid: 3 columns x 2 rows
      const col = landX < viewportW / 3 ? 0 : landX < (2 * viewportW) / 3 ? 1 : 2;
      const row = landY < viewportH / 2 ? 0 : 1;
      const sector = row * 3 + col;

      const inCurrentSection = currentSecEl ? currentSecEl.contains(el) : false;

      validTargets.push({
        el,
        rect,
        landX,
        landY,
        sector,
        isHeroButton,
        isSkillCard,
        isProjectName,
        isAcademicDistinction,
        isIdeaLetter,
        isContactInput,
        skillName,
        letterChar,
        letterIndex,
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
      const isGoodDistance = t.isIdeaLetter ? (dist >= 14 && dist <= 380) : (dist >= 70 && dist <= viewportW * 0.75);

      let score = 0;
      if (t.inCurrentSection) score += 60;
      if (t.isIdeaLetter) score += 50;
      if (t.skillName) score += 45;
      if (t.isHeroButton) score += 50;
      if (t.isProjectName) score += 45;
      if (t.isAcademicDistinction) score += 45;
      if (t.isContactInput) score += 45;
      if (isFreshSector) score += 20;
      if (isGoodDistance) score += 15;

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

    leapTo({ x: chosen.landX, y: chosen.landY }, {
      duration: chosen.isIdeaLetter ? 380 : 460,
      arcHeight: chosen.isIdeaLetter ? 38 : 52,
      onLanding: () => {
        // Physical squash & bounce on target
        triggerElementBounce(chosen.el);

        // If landing on a skill item, pop open its interactive tooltip!
        if (chosen.skillName) {
          window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: chosen.skillName } }));
        }

        // Adaptive perch duration based on element personality
        const perchDelay = chosen.isIdeaLetter
          ? 1800 + Math.random() * 400
          : chosen.skillName
            ? 2200 + Math.random() * 400
            : 2200 + Math.random() * 400;

        if (isRoamingRef.current) {
          roamStepTimerRef.current = setTimeout(performRoamStep, perchDelay);
        }
      }
    });
  }, [leapTo, returnToNavbar]);

  // Immediately dock rabbit safely whenever Rabbit Tree modal is open
  useEffect(() => {
    if (isRabbitTreeOpen) {
      if (isRoamingRef.current) {
        returnToNavbar(true);
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
    }
  }, [isRabbitTreeOpen, returnToNavbar]);

  // 7. Start Roaming Mode when Idle
  const startRoaming = useCallback(() => {
    if (isRoamingRef.current) return;
    // On mobile devices (< 768px), keep rabbit safely docked in navbar/tabs so touch targets are never blocked
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    // Strictly do NOT roam if Rabbit Tree is open or resume modal is open
    if (isRabbitTreeOpen || document.querySelector('[data-rabbit-tree-modal]') || document.getElementById('resume-modal')) {
      return;
    }
    setIsRoaming(true);
    isRoamingRef.current = true;
    roamStartScrollYRef.current = window.scrollY || 0;

    performRoamStep();
  }, [performRoamStep, isRabbitTreeOpen]);

  // 8. Idle Monitor & Intentional Navigation Observer
  // - 15s idle threshold for calm, unobtrusive presence as requested
  // - Mouse movement does NOT spook the rabbit away; it can be approached and petted
  // - Returns to navbar only on genuine user navigation (scroll > 50px, keys, navbar hover)
  useEffect(() => {
    const IDLE_TIME = 15000;

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

        // If click is on Rabbit Tree button or modal, dock rabbit and do not disturb
        if (e.target?.closest?.('[data-rabbit-tree]') || e.target?.closest?.('[data-rabbit-tree-modal]') || e.target?.closest?.('[data-no-rabbit]')) {
          if (isRoamingRef.current) returnToNavbar(true);
          return;
        }

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

    const transitionToSection = (currentSec) => {
      // If user recently clicked a nav item or a smooth scroll navigation is underway, ignore intermediate scroll frames
      if (window.__navTargetLock && performance.now() < window.__navTargetLock.expiryTime) {
        return;
      }
      if (performance.now() < navClickLockRef.current) return;
      if (activeSectionRef.current === currentSec) return;

      activeSectionRef.current = currentSec;
      setActiveSection(currentSec);

      // If returning home, cleanly disengage roaming
      if (currentSec === 'home' && isRoamingRef.current) {
        setIsRoaming(false);
        isRoamingRef.current = false;
        window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));
        if (roamStepTimerRef.current) {
          clearTimeout(roamStepTimerRef.current);
          roamStepTimerRef.current = null;
        }
      }

      if (isRoamingRef.current) {
        if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
        if (roamStepTimerRef.current) clearTimeout(roamStepTimerRef.current);
        scrollDebounceTimer = setTimeout(() => {
          if (isRoamingRef.current) performRoamStep();
        }, 120);
      } else if (currentSec === 'cta') {
        // In Call to Action section: rabbit targets letters of "Idea!"
        const ideaLetters = Array.from(document.querySelectorAll('[data-cta-idea-letter]'));
        const visibleLetter = ideaLetters.find(el => {
          const rect = el.getBoundingClientRect();
          return rect.top > 60 && rect.bottom < window.innerHeight - 30;
        });
        if (visibleLetter) {
          const rect = visibleLetter.getBoundingClientRect();
          const landX = Math.max(10, Math.min(window.innerWidth - RABBIT_WIDTH - 10, rect.left + (rect.width - RABBIT_WIDTH) / 2));
          const landY = Math.max(40, Math.min(window.innerHeight - RABBIT_HEIGHT - 20, rect.top - RABBIT_HEIGHT + 14));
          setIsRoaming(true);
          isRoamingRef.current = true;
          leapTo({ x: landX, y: landY }, {
            duration: 450,
            arcHeight: 46,
            onLanding: () => {
              triggerElementBounce(visibleLetter);
              if (isRoamingRef.current) {
                roamStepTimerRef.current = setTimeout(performRoamStep, 2000);
              }
            }
          });
          return;
        }
        const newTarget = getNavbarTarget(currentSec);
        leapTo(newTarget, {
          duration: 380,
          arcHeight: 26,
          onLanding: () => {
            const effectiveKey = (currentSec === 'contact' || currentSec === 'cta') ? 'experience' : currentSec;
            const navItemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);
            if (currentSec === 'home') {
              triggerHomeLanding(navItemEl);
            } else {
              triggerElementBounce(navItemEl);
            }
          }
        });
      } else {
        // Hop along to the newly active navbar tab!
        const newTarget = getNavbarTarget(currentSec);
        leapTo(newTarget, {
          duration: currentSec === 'home' ? 420 : 380,
          arcHeight: currentSec === 'home' ? 32 : 26,
          onLanding: () => {
            const effectiveKey = (currentSec === 'contact' || currentSec === 'cta') ? 'experience' : currentSec;
            const navItemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);
            if (currentSec === 'home') {
              triggerHomeLanding(navItemEl);
            } else {
              triggerElementBounce(navItemEl);
            }
          }
        });
      }
    };

    const handleNavSectionChange = (e) => {
      const sec = e?.detail?.section;
      if (sec) {
        transitionToSection(sec);
      }
    };

    window.addEventListener('nav-section-change', handleNavSectionChange);

    // Helper to determine initial section on mount based on hash or restored scroll
    const getInitialActiveSection = () => {
      if (typeof window === 'undefined') return 'home';
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && ['home', 'skills', 'projects', 'education', 'experience', 'contact', 'cta'].includes(hash)) {
        return (hash === 'contact' || hash === 'cta') ? 'experience' : hash;
      }
      const scrollY = window.scrollY || 0;
      if (scrollY < 140) return 'home';
      const sections = [
        { id: 'contact', offset: 280 },
        { id: 'cta', offset: 280 },
        { id: 'experience', offset: 280 },
        { id: 'education', offset: 280 },
        { id: 'projects', offset: 280 },
        { id: 'skills', offset: 280 },
      ];
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= sec.offset && rect.bottom > 120) {
            return (sec.id === 'contact' || sec.id === 'cta') ? 'experience' : sec.id;
          }
        }
      }
      return 'home';
    };

    // Initial mount sync: resilient multi-tier positioning guaranteeing the rabbit always appears
    let syncAnimId = null;
    let pollInterval = null;
    let safetyTimeout = null;

    const initSec = getInitialActiveSection();
    activeSectionRef.current = initSec;
    setActiveSection(initSec);

    const trySyncPosition = () => {
      const target = getNavbarTarget(activeSectionRef.current);
      if (target.x > -100 && target.y > -100) {
        currentPosRef.current = target;
        setRabbitPos(target);
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (!trySyncPosition()) {
      const pollFrame = () => {
        if (!trySyncPosition()) {
          syncAnimId = requestAnimationFrame(pollFrame);
        }
      };
      syncAnimId = requestAnimationFrame(pollFrame);

      // Interval fallback ensuring appearance even under mobile rAF background throttle
      pollInterval = setInterval(() => {
        if (trySyncPosition()) {
          if (pollInterval) clearInterval(pollInterval);
        }
      }, 60);

      // Safe fallback timer: computes estimated layout coordinates so rabbit is NEVER hidden
      safetyTimeout = setTimeout(() => {
        if (currentPosRef.current.x < -100) {
          const isMobile = window.innerWidth < 768;
          const fallback = isMobile
            ? { x: Math.max(20, (window.innerWidth - 380) / 2 + 28), y: window.innerHeight - 70 }
            : { x: Math.max(20, (window.innerWidth - 520) / 2 + 28), y: 44 };
          currentPosRef.current = fallback;
          setRabbitPos(fallback);
          setIsReady(true);
        }
      }, 650);
    }

    // ResizeObserver on navbars to stick to them smoothly during layout shifts
    const navEls = document.querySelectorAll('nav');
    let navObserver;
    if (navEls.length > 0) {
      navObserver = new ResizeObserver(() => {
        if (!isRoamingRef.current && !isHoppingRef.current) {
          const target = getNavbarTarget(activeSectionRef.current);
          if (target.x > -100 && target.y > -100) {
            currentPosRef.current = target;
            setRabbitPos(target);
            setIsReady(true);
          }
        }
      });
      navEls.forEach(el => navObserver.observe(el));
    }

    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768 && isRoamingRef.current) {
        returnToNavbar(true);
        return;
      }
      if (!isRoamingRef.current) {
        const target = getNavbarTarget(activeSectionRef.current);
        if (target.x > -100 && target.y > -100) {
          currentPosRef.current = target;
          setRabbitPos(target);
          setIsReady(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('nav-section-change', handleNavSectionChange);
      window.removeEventListener('resize', handleResize);
      if (syncAnimId) cancelAnimationFrame(syncAnimId);
      if (pollInterval) clearInterval(pollInterval);
      if (safetyTimeout) clearTimeout(safetyTimeout);
      if (navObserver) navObserver.disconnect();
    };
  }, [getNavbarTarget, leapTo, performRoamStep, returnToNavbar, triggerHomeLanding]);

  // 10. Nav-Leap Listener: Single, confident aerodynamic leap directly to clicked destination
  useEffect(() => {
    const handleNavLeap = (e) => {
      const navKey = e?.detail?.target;
      if (!navKey) return;

      // Lock section scroll listener for 2000ms so smooth scrolling doesn't cause intermediate hops
      navClickLockRef.current = performance.now() + 2000;

      if (isRoamingRef.current) {
        setIsRoaming(false);
        isRoamingRef.current = false;
        window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));
        if (roamStepTimerRef.current) {
          clearTimeout(roamStepTimerRef.current);
          roamStepTimerRef.current = null;
        }
      }

      activeSectionRef.current = navKey;
      setActiveSection(navKey);

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const targetPos = getNavbarTarget(navKey);
      const effectiveKey = (navKey === 'contact' || navKey === 'cta') ? 'experience' : navKey;
      const itemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);

      const dx = targetPos.x - currentPosRef.current.x;
      const dy = targetPos.y - currentPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      // Tailored organic trajectory:
      // On mobile bottom toolbar, leaps gracefully from one tab to another in a single buoyant parabolic arc
      const duration = isMobile
        ? Math.min(410, Math.max(320, 280 + distance * 0.35))
        : (navKey === 'home' ? 420 : 380);

      const arcHeight = isMobile
        ? Math.min(36, Math.max(26, 22 + distance * 0.05))
        : (navKey === 'home' ? 32 : 30);

      leapTo(targetPos, {
        duration,
        arcHeight,
        onLanding: () => {
          if (navKey === 'home') {
            triggerHomeLanding(itemEl);
          } else {
            triggerElementBounce(itemEl);
          }
        },
      });
    };

    window.addEventListener('rabbit-nav-leap', handleNavLeap);
    return () => {
      window.removeEventListener('rabbit-nav-leap', handleNavLeap);
    };
  }, [getNavbarTarget, leapTo, triggerHomeLanding]);

  // Fallback direct click delegator on nav items (e.g. desktop nav pills)
  useEffect(() => {
    const handleNavClick = (e) => {
      const itemEl = e.target.closest('[data-nav-item]');
      if (!itemEl) return;
      const navKey = itemEl.getAttribute('data-nav-item');
      if (!navKey) return;

      if (!window.__navTargetLock || window.__navTargetLock.target !== navKey) {
        window.__navTargetLock = {
          target: navKey,
          startTime: performance.now(),
          expiryTime: performance.now() + 2000,
        };
        window.dispatchEvent(new CustomEvent('rabbit-nav-leap', { detail: { target: navKey } }));
      }
    };

    const navEls = document.querySelectorAll('nav');
    navEls.forEach(nav => nav.addEventListener('click', handleNavClick));
    return () => {
      navEls.forEach(nav => nav.removeEventListener('click', handleNavClick));
    };
  }, []);

  // 10b. Direct interaction listener for letters of "Idea!" on Call to Action section
  useEffect(() => {
    const handleLeapToLetter = (e) => {
      const { index, char } = e?.detail || {};
      const el = (index !== undefined ? document.getElementById(`cta-idea-letter-${index}`) : null) ||
        (char ? document.querySelector(`[data-cta-idea-letter="${char}"]`) : null) ||
        document.getElementById('cta-idea-letter-0') ||
        document.querySelector('[data-cta-idea-letter]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const landX = Math.max(10, Math.min(window.innerWidth - RABBIT_WIDTH - 10, rect.left + (rect.width - RABBIT_WIDTH) / 2));
      const landY = Math.max(40, Math.min(window.innerHeight - RABBIT_HEIGHT - 20, rect.top - RABBIT_HEIGHT + 14));

      if (roamStepTimerRef.current) {
        clearTimeout(roamStepTimerRef.current);
        roamStepTimerRef.current = null;
      }

      setIsRoaming(true);
      isRoamingRef.current = true;

      leapTo({ x: landX, y: landY }, {
        duration: 440,
        arcHeight: 46,
        onLanding: () => {
          triggerElementBounce(el);
          if (isRoamingRef.current) {
            roamStepTimerRef.current = setTimeout(performRoamStep, 2000);
          }
        }
      });
    };

    window.addEventListener('rabbit-leap-to-letter', handleLeapToLetter);
    window.addEventListener('rabbit-leap-to-i', handleLeapToLetter);
    return () => {
      window.removeEventListener('rabbit-leap-to-letter', handleLeapToLetter);
      window.removeEventListener('rabbit-leap-to-i', handleLeapToLetter);
    };
  }, [leapTo, performRoamStep]);

  // 11. Click on Rabbit: On mobile active tab, playful spring-bounce; else return to Homepage
  const handleRabbitClick = (e) => {
    e?.stopPropagation?.();

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // On mobile bottom toolbar, if rabbit is perched on an active section,
    // play a delightful spring-bounce with dust puff in place instead of unexpectedly resetting scroll to top
    if (isMobile && activeSectionRef.current !== 'home' && !isRoamingRef.current) {
      const curTarget = getNavbarTarget(activeSectionRef.current);
      leapTo(curTarget, {
        duration: 330,
        arcHeight: 28,
        onLanding: () => {
          const effectiveKey = (activeSectionRef.current === 'contact' || activeSectionRef.current === 'cta')
            ? 'experience'
            : activeSectionRef.current;
          const navItemEl = document.querySelector(`[data-nav-item="${effectiveKey}"]`);
          triggerElementBounce(navItemEl);
        },
      });
      return;
    }

    if (roamStepTimerRef.current) {
      clearTimeout(roamStepTimerRef.current);
      roamStepTimerRef.current = null;
    }

    setIsRoaming(false);
    isRoamingRef.current = false;
    window.dispatchEvent(new CustomEvent('rabbit-skill-hover', { detail: { skillName: null } }));

    // Lock scroll tracking for 2000ms during smooth scroll back to home
    window.__navTargetLock = {
      target: 'home',
      startTime: performance.now(),
      expiryTime: performance.now() + 2000,
    };
    navClickLockRef.current = performance.now() + 2000;

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
        triggerHomeLanding(homeDockEl);
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
            ? 'drop-shadow(0 10px 24px rgba(0,0,0,0.25))'
            : activeSection !== 'home'
              ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))'
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
            onClick={handleRabbitClick}
          />
        </div>
      </div>
    </div>
  );
};

export default RabbitCompanion;
