import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  List
} from 'lucide-react';
import { PALETTE } from '../../constants';

export default function PresentationMode({
  isOpen,
  onClose,
  nodes = [],
  currentMap,
  onFocusNode
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSlideList, setShowSlideList] = useState(false);
  const prevIsOpenRef = useRef(false);
  const touchStartRef = useRef(null);

  // Map nodes by id for quick lookup
  const nodeMap = useMemo(() => {
    return Object.fromEntries(nodes.map((n) => [n.id, n]));
  }, [nodes]);

  // Flatten nodes in hierarchical order (breadth-first or depth-first)
  const presentationNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    const root = nodes.find((n) => n.parentId === null) || nodes[0];
    const ordered = [];
    const visited = new Set();

    const traverse = (parentId) => {
      const children = nodes.filter((n) => n.parentId === parentId);
      children.forEach((c) => {
        if (!visited.has(c.id)) {
          visited.add(c.id);
          ordered.push(c);
          traverse(c.id);
        }
      });
    };

    if (root) {
      visited.add(root.id);
      ordered.push(root);
      traverse(root.id);
    }

    // Append any unvisited or orphaned nodes so nothing is missed
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        visited.add(n.id);
        ordered.push(n);
      }
    });

    return ordered;
  }, [nodes]);

  // Stable jump to slide
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < presentationNodes.length) {
      setCurrentIndex(index);
      const targetNode = presentationNodes[index];
      if (targetNode) {
        onFocusNode?.(targetNode);
      }
    }
  }, [presentationNodes, onFocusNode]);

  // Next / Prev slide handlers
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < presentationNodes.length - 1) {
        const nextIdx = prev + 1;
        const targetNode = presentationNodes[nextIdx];
        if (targetNode) {
          onFocusNode?.(targetNode);
        }
        return nextIdx;
      }
      return prev;
    });
  }, [presentationNodes, onFocusNode]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        const prevIdx = prev - 1;
        const targetNode = presentationNodes[prevIdx];
        if (targetNode) {
          onFocusNode?.(targetNode);
        }
        return prevIdx;
      }
      return prev;
    });
  }, [presentationNodes, onFocusNode]);

  // Initialize on open ONLY (strictly prevent resetting on re-renders)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setCurrentIndex(0);
      setShowSlideList(false);
      if (presentationNodes[0]) {
        onFocusNode?.(presentationNodes[0]);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, presentationNodes, onFocusNode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(presentationNodes.length - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, goToSlide, onClose, presentationNodes.length]);

  // Touch Swipe navigation for mobile
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Detect horizontal swipe if deltaX is dominant
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  if (!isOpen || presentationNodes.length === 0) return null;

  const activeNode = presentationNodes[currentIndex] || presentationNodes[0];
  const palette = PALETTE[activeNode.colorIdx % PALETTE.length];
  const progressPercent = Math.round(((currentIndex + 1) / presentationNodes.length) * 100);

  // Compute breadcrumbs path
  const breadcrumbs = [];
  let curr = activeNode.parentId ? nodeMap[activeNode.parentId] : null;
  while (curr) {
    breadcrumbs.unshift(curr.text || 'Idea');
    curr = curr.parentId ? nodeMap[curr.parentId] : null;
  }

  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-6 z-50 flex flex-col items-center pointer-events-none select-none px-2 sm:px-6">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-2xl bg-[#090a0f]/95 text-white backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 pointer-events-auto animate-in slide-in-from-bottom duration-200"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300 min-w-0 truncate">
              <span className="uppercase tracking-wider text-indigo-400 shrink-0">Presenting</span>
              <span className="text-zinc-500">•</span>
              <span className="truncate text-zinc-300">{currentMap?.title || 'Mind Map'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Slide Overview Dropdown Button */}
            <button
              onClick={() => setShowSlideList((prev) => !prev)}
              className={`p-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                showSlideList ? 'bg-indigo-600 text-white' : 'bg-white/10 text-zinc-300 hover:bg-white/15'
              }`}
              title="Overview of all slides"
            >
              <List className="w-3.5 h-3.5" />
              <span>
                {currentIndex + 1} / {presentationNodes.length}
              </span>
            </button>

            {/* Exit Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Exit Presentation (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Slide List Drawer Popover */}
        {showSlideList && (
          <div className="max-h-48 overflow-y-auto bg-black/90 border border-white/10 rounded-xl p-2 flex flex-col gap-1 text-xs animate-in fade-in duration-150">
            <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Jump to Slide
            </div>
            {presentationNodes.map((pNode, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={pNode.id}
                  onClick={() => {
                    goToSlide(idx);
                    setShowSlideList(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-white/10 text-zinc-300'
                  }`}
                >
                  <span className="truncate max-w-[80%]">
                    {idx + 1}. {pNode.text || 'Untitled Idea'}
                  </span>
                  {pNode.parentId === null && (
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                      Root
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Node Slide Content */}
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 min-w-0">
            {/* Breadcrumb path */}
            {breadcrumbs.length > 0 && (
              <div className="text-[10px] font-mono text-zinc-400 truncate flex items-center gap-1">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    <span>{crumb}</span>
                    <span className="text-zinc-600">/</span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Title & Tag */}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full shrink-0 ${palette.swatch}`} />
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight break-words line-clamp-2">
                {activeNode.text || 'Untitled Concept'}
              </h2>
              {activeNode.parentId === null && (
                <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                  Root
                </span>
              )}
            </div>

            {/* Badges: Status, Priority, Link */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs mt-0.5">
              {activeNode.status && activeNode.status !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-mono text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {activeNode.status.toUpperCase()}
                </span>
              )}

              {activeNode.priority && activeNode.priority !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px] sm:text-[11px] border border-rose-500/30">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  {activeNode.priority.toUpperCase()}
                </span>
              )}

              {activeNode.linkUrl && (
                <a
                  href={activeNode.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-mono text-[10px] sm:text-[11px] border border-indigo-500/30 transition cursor-pointer"
                  title={activeNode.linkUrl}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Link</span>
                </a>
              )}
            </div>

            {/* Markdown notes preview if present */}
            {activeNode.notes && (
              <div className="mt-1 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-xl p-2.5 max-h-24 sm:max-h-32 overflow-y-auto prose prose-invert prose-xs leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeNode.notes}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-center shrink-0">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-20 text-white transition cursor-pointer"
              title="Previous (Left Arrow / Swipe Right)"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === presentationNodes.length - 1}
              className="p-2 sm:p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-20 text-white transition cursor-pointer shadow-lg shadow-indigo-600/30"
              title="Next (Right Arrow / Space / Swipe Left)"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 pt-1 border-t border-white/5">
          <span className="hidden sm:inline">
            Use <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Space</kbd> or <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">→</kbd> to step forward
          </span>
          <span className="sm:hidden text-zinc-400">
            Swipe left / right or tap arrows
          </span>
          <span>
            Press <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">ESC</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
}
