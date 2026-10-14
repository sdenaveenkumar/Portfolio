/**
 * SEO & Routing Utilities
 * 
 * Provides:
 * 1. Dynamic document title & meta tag synchronization (SEO / SERP optimization)
 * 2. Canonical URL management
 * 3. Deep-link anchor scrolling with retry cushions for GSAP / dynamic layouts
 * 4. Browser History state coordination for modals (Back button closes modals)
 */

export const SECTION_SEO = {
  home: {
    title: 'Naveen Kumar | Fullstack Software Engineer & Portfolio',
    description: 'Official portfolio of Naveen Kumar, a Fullstack Software Engineer specializing in React, Node.js, distributed backend systems, and interactive UI engineering.',
    canonical: 'https://www.rabbitfolio.me/'
  },
  skills: {
    title: 'Skills & Tech Stack | Naveen Kumar — Fullstack Software Engineer',
    description: 'Core technical proficiencies of Naveen Kumar: React, Node.js, TypeScript, Next.js, Python, PostgreSQL, Three.js, GSAP, and scalable cloud systems.',
    canonical: 'https://www.rabbitfolio.me/#skills'
  },
  projects: {
    title: 'Featured Projects & Open Source | Naveen Kumar',
    description: 'Discover featured projects by Naveen Kumar, including Dolphin AI local LLM, Lofi Radio VS Code extension, and fullstack cloud applications.',
    canonical: 'https://www.rabbitfolio.me/#projects'
  },
  education: {
    title: 'Education & Academic Background | Naveen Kumar',
    description: 'Academic background and computer science foundations of Naveen Kumar, Fullstack Software Engineer.',
    canonical: 'https://www.rabbitfolio.me/#education'
  },
  experience: {
    title: 'Experience & Engineering Journey | Naveen Kumar',
    description: 'Professional experience, development milestones, and engineering journey of Naveen Kumar.',
    canonical: 'https://www.rabbitfolio.me/#experience'
  },
  contact: {
    title: 'Contact & Inquiries | Naveen Kumar — Fullstack Software Engineer',
    description: 'Connect with Naveen Kumar for fullstack software engineering roles, technical inquiries, or open-source collaborations.',
    canonical: 'https://www.rabbitfolio.me/#contact'
  },
  link: {
    title: 'Rabbit Tree | Official Links & Profiles — Naveen Kumar',
    description: 'All official developer links, GitHub repositories, LinkedIn, live REST APIs, and direct contacts for Naveen Kumar.',
    canonical: 'https://www.rabbitfolio.me/link'
  },
  rabbitStudio: {
    title: 'Rabbit Studio — Interactive Mindmap & Visual Ideation | Naveen Kumar',
    description: 'Rabbit Studio: Interactive mindmapping, system architecture diagramming, and visual ideation workspace by Naveen Kumar.',
    canonical: 'https://www.rabbitfolio.me/tool/rabbit_studio'
  }
};

/**
 * Update document title and OpenGraph / Meta tags dynamically for SEO
 */
export function updateSeoMeta({ title, description, canonical, ogImage }) {
  if (typeof document === 'undefined') return;

  if (title) {
    document.title = title;
  }

  // Helper to set or create meta tags
  const setMeta = (nameAttr, attrValue, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  if (description) {
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
  }

  if (title) {
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
  }

  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
    setMeta('property', 'og:url', canonical);
  }

  if (ogImage) {
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:image', ogImage);
  }
}

/**
 * Smoothly scroll to an element by ID with retry attempts for asynchronous/GSAP DOM mounts
 */
export function scrollToHash(hashId, { behavior = 'smooth', retries = 3, interval = 150 } = {}) {
  if (typeof window === 'undefined' || !hashId) return;

  const targetId = hashId.replace(/^#/, '');
  if (!targetId || targetId === 'home') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const attemptScroll = (attemptsLeft) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior });
    } else if (attemptsLeft > 0) {
      setTimeout(() => attemptScroll(attemptsLeft - 1), interval);
    }
  };

  attemptScroll(retries);
}

/**
 * Safely push section hash without triggering abrupt native page jumping
 */
export function syncUrlHash(hashId, replace = false) {
  if (typeof window === 'undefined') return;
  const targetPath = hashId && hashId !== 'home' ? `#${hashId}` : window.location.pathname;
  const currentHash = window.location.hash;

  if (currentHash === targetPath || (!hashId && !currentHash)) return;

  try {
    if (replace) {
      window.history.replaceState(window.history.state, '', targetPath);
    } else {
      window.history.pushState(window.history.state, '', targetPath);
    }
  } catch {
    // Ignore restricted contexts
  }
}
