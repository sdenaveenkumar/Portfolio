import React from 'react';
import {
  FileText,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Edit3,
  Plus
} from 'lucide-react';
import { PALETTE } from '../../constants';

export default function CanvasActionBar({
  onAddChild,
  onAddSibling,
  onApplyLayout,
  selectedNode,
  selectedIds,
  onUpdateColor,
  isDetailDrawerOpen,
  onToggleDetailDrawer,
  onDeleteSelected,
  onStartEdit,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitView
}) {
  const isRootOnlySelected = selectedIds.has('root') && selectedIds.size === 1;

  return (
    <>
      {/* Action Toolbar (Responsive: Bottom-anchored on mobile for thumbs, top-anchored on desktop) */}
      <div className="fixed md:absolute bottom-3 md:top-3 md:bottom-auto left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-2xl md:rounded-xl shadow-xl md:shadow-md pointer-events-auto max-w-[calc(100vw-16px)] sm:max-w-none">
        
        {/* Add Child Button */}
        <button
          onClick={onAddChild}
          title="Add Child Node (Tab)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 md:hidden" />
          <span>+ Child</span>
          <kbd className="hidden sm:inline-block text-[9px] bg-indigo-700/80 text-indigo-100 px-1 py-0.5 rounded">Tab</kbd>
        </button>

        {/* Add Sibling Button */}
        <button
          onClick={onAddSibling}
          title="Add Sibling Node (Enter)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 cursor-pointer active:scale-95"
        >
          <span>+ Sibling</span>
          <kbd className="hidden sm:inline-block text-[9px] bg-white text-slate-500 px-1 py-0.5 rounded border border-slate-200">Enter</kbd>
        </button>

        {/* Edit / Rename Node Button (Especially vital for mobile touch) */}
        {onStartEdit && (
          <button
            onClick={onStartEdit}
            title="Edit / Rename Node (Double click or tap)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 cursor-pointer active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden xs:inline">Edit</span>
          </button>
        )}

        {/* Align Layout Button */}
        <button
          onClick={onApplyLayout}
          title="Auto-Align Mindmap Layout (Ctrl+Space)"
          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 cursor-pointer active:scale-95"
        >
          Align
        </button>

        <div className="hidden xs:block h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Color Palette Swatches */}
        <div className="flex items-center gap-1 px-1 overflow-x-auto max-w-[140px] sm:max-w-none py-0.5 [scrollbar-width:none]">
          {PALETTE.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => onUpdateColor(idx)}
              title={`Color: ${c.name}`}
              className={`w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 rounded-full ${c.swatch} border border-black/10 cursor-pointer ${
                selectedNode?.colorIdx === idx
                  ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                  : 'opacity-75 hover:opacity-100'
              } transition active:scale-125`}
            />
          ))}
        </div>

        <div className="hidden xs:block h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Node Notes / Details Drawer Toggle */}
        <button
          onClick={onToggleDetailDrawer}
          className={`p-1.5 sm:px-2 rounded-lg text-xs font-semibold transition border cursor-pointer flex items-center gap-1 active:scale-95 ${
            isDetailDrawerOpen
              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Open Node Details & Notes (Cmd+I)"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Notes</span>
        </button>

        {/* Delete button */}
        <button
          onClick={onDeleteSelected}
          disabled={isRootOnlySelected}
          title={isRootOnlySelected ? "Root node cannot be deleted" : "Delete Selected (Del / Backspace)"}
          className={`p-1.5 sm:px-2 rounded-lg text-xs font-semibold transition border cursor-pointer flex items-center gap-1 active:scale-95 ${
            isRootOnlySelected
              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        {/* Mobile Fit View Quick Icon */}
        <button
          onClick={onFitView}
          title="Fit Mindmap to Screen"
          className="md:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition border border-slate-200 cursor-pointer active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Canvas Zoom & Navigation Controls (Desktop Left Corner / Tablet) */}
      <div className="hidden sm:flex absolute bottom-5 left-5 z-20 items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-xl shadow-md pointer-events-auto text-slate-700">
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span
          onClick={onResetZoom}
          title="Click to reset zoom"
          className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-slate-100 text-slate-600 min-w-[45px] text-center"
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
        <button
          onClick={onFitView}
          title="Fit View"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          title="Reset View (100%)"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
}
