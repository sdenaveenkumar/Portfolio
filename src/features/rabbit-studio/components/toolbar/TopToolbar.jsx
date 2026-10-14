import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Search,
  Play,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  LayoutGrid,
  FileCode,
  FileSpreadsheet,
  Image,
  Layers,
  ChevronDown
} from 'lucide-react';
import { LAYOUT_MODES } from '../../constants';

export default function TopToolbar({
  onBackToPortfolio,
  currentFolder,
  currentMap,
  layoutMode,
  onChangeLayout,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenSearch,
  onOpenPresentation,
  onExport,
  onImportClick,
  isFocusMode,
  onToggleFocusMode
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showExportMenu]);

  return (
    <header className="h-14 border-b border-slate-200/90 bg-white/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Breadcrumbs & Back */}
      <div className="flex items-center gap-3">
        {onBackToPortfolio && (
          <button
            onClick={onBackToPortfolio}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
            title="Return to Portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>
        )}

        <div className="flex items-center gap-2 text-xs">
          {currentFolder && (
            <>
              <span className="text-slate-400 font-medium truncate max-w-[120px]">
                {currentFolder.name}
              </span>
              <span className="text-slate-300">/</span>
            </>
          )}
          <span className="font-bold text-slate-800 truncate max-w-[200px]">
            {currentMap.title}
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-semibold px-2 py-0.5 rounded-full">
            {currentMap.nodes?.length || 0} nodes
          </span>
        </div>
      </div>

      {/* Center: Layout Modes & Undo/Redo */}
      <div className="flex items-center gap-2">
        {/* Layout Switcher */}
        <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          {LAYOUT_MODES.map((mode) => {
            const isActive = layoutMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeLayout(mode.id)}
                title={mode.desc}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Cmd+Z)"
            className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Cmd+Shift+Z)"
            className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Tools & Export */}
      <div className="flex items-center gap-2">
        {/* Spotlight Search Button */}
        <button
          onClick={onOpenSearch}
          title="Spotlight Search across all maps (Cmd+K)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline text-[9px] bg-white text-slate-500 px-1 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Presentation Mode Button */}
        <button
          onClick={onOpenPresentation}
          title="Start Presentation Mode"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition border border-amber-200/80 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
          <span className="hidden sm:inline">Present</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-indigo-200" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Visual Exports
              </div>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('png');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <Image className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-800">High-Res PNG</div>
                  <div className="text-[10px] text-slate-400">Crisp raster image with palette</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('svg');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="font-semibold text-slate-800">Vector SVG</div>
                  <div className="text-[10px] text-slate-400">Lossless resolution for illustrator</div>
                </div>
              </button>

              <div className="my-1 border-t border-slate-100" />
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Code & Structure
              </div>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('mermaid');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <FileCode className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-semibold text-slate-800">Mermaid Diagram</div>
                  <div className="text-[10px] text-slate-400">Copy to clipboard for GitHub docs</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('opml');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-semibold text-slate-800">OPML Outline</div>
                  <div className="text-[10px] text-slate-400">Compatible with OmniOutliner/MindNode</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('markdown');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <FileCode className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-slate-800">Markdown Hierarchy</div>
                  <div className="text-[10px] text-slate-400">Indented bullet points for notes</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('json');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition"
              >
                <FileCode className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="font-semibold text-slate-800">Studio JSON</div>
                  <div className="text-[10px] text-slate-400">Full backup with cross-links & notes</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Import JSON button */}
        <button
          onClick={onImportClick}
          title="Import Mind Map JSON file"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode (Hide Sidebars)'}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
