import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle
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

  // Flatten nodes in hierarchical order (breadth-first or depth-first)
  const presentationNodes = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    const root = nodes.find((n) => n.parentId === null) || nodes[0];
    const ordered = [];

    const traverse = (parentId) => {
      const children = nodes.filter((n) => n.parentId === parentId);
      children.forEach((c) => {
        ordered.push(c);
        traverse(c.id);
      });
    };

    ordered.push(root);
    traverse(root.id);
    return ordered;
  }, [nodes]);

  const goNext = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < presentationNodes.length - 1) {
        const nextIdx = prev + 1;
        onFocusNode(presentationNodes[nextIdx]);
        return nextIdx;
      }
      return prev;
    });
  }, [presentationNodes, onFocusNode]);

  const goPrev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        const prevIdx = prev - 1;
        onFocusNode(presentationNodes[prevIdx]);
        return prevIdx;
      }
      return prev;
    });
  }, [presentationNodes, onFocusNode]);

  useEffect(() => {
    if (isOpen && presentationNodes[0]) {
      setCurrentIndex(0);
      onFocusNode(presentationNodes[0]);
    }
  }, [isOpen, presentationNodes, onFocusNode]);

  const activeNode = presentationNodes[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen || !activeNode) return null;

  const palette = PALETTE[activeNode.colorIdx % PALETTE.length];

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center pointer-events-none select-none px-4">
      <div className="w-full max-w-2xl bg-[#090a0f]/95 text-white backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-bottom duration-200">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Presentation Mode • {currentMap.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-300 bg-white/10 px-2 py-0.5 rounded-full">
              {currentIndex + 1} / {presentationNodes.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Exit Presentation (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Node Slide Content */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${palette.swatch}`} />
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {activeNode.text || 'Untitled Concept'}
              </h2>
              {activeNode.parentId === null && (
                <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Root
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs">
              {activeNode.status && activeNode.status !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-mono text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {activeNode.status.toUpperCase()}
                </span>
              )}
              {activeNode.priority && activeNode.priority !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[11px] border border-rose-500/30">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  {activeNode.priority}
                </span>
              )}
            </div>

            {/* Markdown notes preview if present */}
            {activeNode.notes && (
              <div className="mt-1 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-xl p-2.5 max-h-24 overflow-y-auto prose prose-invert prose-xs leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeNode.notes}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1.5 self-center shrink-0">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition cursor-pointer"
              title="Previous (Arrow Left)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === presentationNodes.length - 1}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white transition cursor-pointer shadow-lg shadow-indigo-600/30"
              title="Next (Arrow Right / Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Keyboard navigation hint */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-white/5">
          <span>Use <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Space</kbd> or <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">→</kbd> to step forward</span>
          <span>Press <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}
