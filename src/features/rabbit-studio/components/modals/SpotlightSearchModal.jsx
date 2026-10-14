import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Folder, Hash } from 'lucide-react';

export default function SpotlightSearchModal({ isOpen, onClose, folders, onSelectNode }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate all nodes across all maps in all folders
  const allNodes = React.useMemo(() => {
    const list = [];
    folders.forEach((folder) => {
      folder.maps.forEach((map) => {
        (map.nodes || []).forEach((node) => {
          list.push({
            node,
            mapId: map.id,
            mapTitle: map.title,
            folderName: folder.name
          });
        });
      });
    });
    return list;
  }, [folders]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return allNodes.slice(0, 8);
    const q = query.toLowerCase();
    return allNodes.filter((item) => {
      const matchText = (item.node.text || '').toLowerCase().includes(q);
      const matchNotes = (item.node.notes || '').toLowerCase().includes(q);
      const matchMap = item.mapTitle.toLowerCase().includes(q);
      const matchStatus = (item.node.status || '').toLowerCase().includes(q);
      const matchPriority = (item.node.priority || '').toLowerCase().includes(q);
      return matchText || matchNotes || matchMap || matchStatus || matchPriority;
    }).slice(0, 15);
  }, [allNodes, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        const item = filtered[selectedIndex];
        onSelectNode(item.mapId, item.node.id, item.node.x, item.node.y);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search ideas, notes, tasks, or maps across all workspaces..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300/80">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-slate-300" />
              <span>No nodes found matching &ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.mapId}-${item.node.id}`}
                  onClick={() => {
                    onSelectNode(item.mapId, item.node.id, item.node.x, item.node.y);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-indigo-50 border border-indigo-200 text-indigo-950' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-1 truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate">
                        {item.node.text || 'Untitled Node'}
                      </span>
                      {item.node.status && item.node.status !== 'none' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
                          {item.node.status}
                        </span>
                      )}
                      {item.node.priority && item.node.priority !== 'none' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          {item.node.priority}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {item.folderName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Hash className="w-3 h-3" />
                        {item.mapTitle}
                      </span>
                    </div>

                    {item.node.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        {item.node.notes}
                      </p>
                    )}
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">Enter</kbd> to jump</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
