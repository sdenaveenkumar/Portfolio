import React from 'react';
import {
  FileText,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw
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
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitView
}) {
  const isRootOnlySelected = selectedIds.has('root') && selectedIds.size === 1;

  return (
    <>
      {/* Action Toolbar (Top Center / Linked to Selected Nodes) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-xl shadow-md pointer-events-auto">
        <button
          onClick={onAddChild}
          title="Add Child Node (Tab)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
        >
          <span>+ Child</span>
          <kbd className="text-[9px] bg-indigo-700/80 text-indigo-100 px-1 py-0.5 rounded">Tab</kbd>
        </button>

        <button
          onClick={onAddSibling}
          title="Add Sibling Node (Enter)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 cursor-pointer"
        >
          <span>+ Sibling</span>
          <kbd className="text-[9px] bg-white text-slate-500 px-1 py-0.5 rounded border border-slate-200">Enter</kbd>
        </button>

        <button
          onClick={onApplyLayout}
          title="Auto-Align Mindmap Layout (Ctrl+Space)"
          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 cursor-pointer"
        >
          Align
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-1 px-0.5">
          {PALETTE.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => onUpdateColor(idx)}
              title={`Color: ${c.name}`}
              className={`w-3.5 h-3.5 rounded-full ${c.swatch} border border-black/10 cursor-pointer ${
                selectedNode?.colorIdx === idx
                  ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                  : 'opacity-75 hover:opacity-100'
              } transition`}
            />
          ))}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Node Notes / Details Drawer Toggle */}
        <button
          onClick={onToggleDetailDrawer}
          className={`p-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
            isDetailDrawerOpen
              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Open Node Details & Notes (Cmd+I)"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>

        {/* Delete button */}
        <button
          onClick={onDeleteSelected}
          title={isRootOnlySelected ? "Root node cannot be deleted" : "Delete Selected (Del / Backspace)"}
          className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer flex items-center gap-1 ${
            isRootOnlySelected
              ? 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
          }`}
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>
      </div>

      {/* Floating Canvas Zoom & Navigation Controls (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-xl shadow-md pointer-events-auto text-slate-700">
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
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
          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
        <button
          onClick={onFitView}
          title="Fit View"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 text-xs font-medium"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          title="Reset View (100%)"
          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}
