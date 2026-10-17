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
  ChevronDown,
  Folder,
  MoreVertical,
  Check
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
  onToggleFocusMode,
  onToggleSidebar,
  isSidebarOpen
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const exportRef = useRef(null);
  const mobileMoreRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(e.target)) {
        setShowMobileMore(false);
      }
    };
    if (showExportMenu || showMobileMore) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showExportMenu, showMobileMore]);

  return (
    <header className="h-13 sm:h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-2.5 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none gap-1 sm:gap-2">
      {/* Left: Sidebar Toggle, Back to Portfolio, Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        {/* Workspace Sidebar Toggle Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              isSidebarOpen
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'hover:bg-slate-100 text-slate-700 bg-slate-50 border border-slate-200/60'
            }`}
            title={isSidebarOpen ? "Close Workspaces" : "Open Workspaces & Maps"}
            aria-label="Toggle Workspaces"
          >
            <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <span className="hidden xl:inline text-xs font-semibold">Workspaces</span>
          </button>
        )}

        {/* Back to Portfolio Button */}
        {onBackToPortfolio && (
          <button
            onClick={onBackToPortfolio}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition shrink-0 cursor-pointer"
            title="Return to Portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Portfolio</span>
          </button>
        )}

        {/* Map Title Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs min-w-0 truncate">
          {currentFolder && (
            <span className="hidden lg:inline text-slate-400 font-medium truncate max-w-[100px]">
              {currentFolder.name} /
            </span>
          )}
          <span className="font-bold text-slate-800 truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[200px]">
            {currentMap?.title || 'Mind Map'}
          </span>
          <span className="hidden sm:inline-flex text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-semibold px-2 py-0.5 rounded-full shrink-0">
            {currentMap?.nodes?.length || 0}
          </span>
        </div>
      </div>

      {/* Center: Layout Modes & Undo/Redo */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Layout Switcher (Desktop only) */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
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
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Cmd+Z)"
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Cmd+Shift+Z)"
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Right: Tools & Export */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Spotlight Search Button */}
        <button
          onClick={onOpenSearch}
          title="Spotlight Search across all maps (Cmd+K)"
          className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline text-[9px] bg-white text-slate-500 px-1 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Presentation Mode Button */}
        <button
          onClick={onOpenPresentation}
          title="Start Presentation Mode (F5)"
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition border border-amber-200/80 cursor-pointer active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
          <span className="hidden sm:inline">Present</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-indigo-200" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Visual Exports
              </div>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('png');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
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
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
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
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
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
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-semibold text-slate-800">OPML Outline</div>
                  <div className="text-[10px] text-slate-400">Compatible with MindNode / Outliners</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('markdown');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
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
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
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

        {/* Import JSON button (Desktop) */}
        <button
          onClick={onImportClick}
          title="Import Mind Map JSON file"
          className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle (Desktop) */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode (Hide Sidebars)'}
          className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Mobile Overflow Menu Button (md:hidden) */}
        <div className="relative md:hidden" ref={mobileMoreRef}>
          <button
            onClick={() => setShowMobileMore(!showMobileMore)}
            title="More actions & layouts"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMore && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Layout Engine
              </div>
              {LAYOUT_MODES.map((mode) => {
                const isActive = layoutMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onChangeLayout(mode.id);
                      setShowMobileMore(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}

              <div className="my-1 border-t border-slate-100" />
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tools & Views
              </div>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onOpenPresentation();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-amber-800 font-semibold transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                <span>Presentation Mode</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onImportClick();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import JSON</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  onToggleFocusMode();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Focus Mode</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
