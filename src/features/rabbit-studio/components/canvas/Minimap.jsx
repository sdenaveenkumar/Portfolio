import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PALETTE } from '../../constants';

export default function Minimap({
  nodes = [],
  pan = { x: 0, y: 0 },
  zoom = 1,
  viewportWidth = 800,
  viewportHeight = 600,
  onPanTo
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  if (nodes.length === 0) return null;

  const mapWidth = 160;
  const mapHeight = 100;
  const pad = 120;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + 180);
    maxY = Math.max(maxY, n.y + 60);
  });

  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  const boundW = Math.max(300, maxX - minX);
  const boundH = Math.max(200, maxY - minY);

  const scale = Math.min(mapWidth / boundW, mapHeight / boundH);

  // Viewport box in canvas coordinates
  const viewX = (-pan.x) / zoom;
  const viewY = (-pan.y) / zoom;
  const viewW = viewportWidth / zoom;
  const viewH = viewportHeight / zoom;

  // Viewport rectangle coordinates in minimap space
  const rectX = Math.max(0, (viewX - minX) * scale);
  const rectY = Math.max(0, (viewY - minY) * scale);
  const rectW = Math.min(mapWidth, viewW * scale);
  const rectH = Math.min(mapHeight, viewH * scale);

  const handleMinimapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click in minimap space to world coordinates
    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    // Center viewport on clicked point
    const newPanX = viewportWidth / 2 - targetWorldX * zoom;
    const newPanY = viewportHeight / 2 - targetWorldY * zoom;

    if (onPanTo) {
      onPanTo({ x: Math.round(newPanX), y: Math.round(newPanY) });
    }
  };

  return (
    <div className="hidden sm:flex absolute bottom-20 md:bottom-16 right-3 sm:right-4 z-20 select-none flex-col items-end gap-1 pointer-events-auto">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md bg-white/95 border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm transition cursor-pointer"
          title={collapsed ? "Show Minimap" : "Hide Minimap"}
        >
          {collapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div
          onClick={handleMinimapClick}
          style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
          className="relative rounded-xl overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-200/60 cursor-crosshair transition-all"
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[#f8fafc] opacity-60" />

          {/* Node rects */}
          {nodes.map((n) => {
            const nx = (n.x - minX) * scale;
            const ny = (n.y - minY) * scale;
            const color = PALETTE[n.colorIdx % PALETTE.length].hex;
            return (
              <div
                key={n.id}
                style={{
                  left: `${nx}px`,
                  top: `${ny}px`,
                  width: `${Math.max(4, 180 * scale)}px`,
                  height: `${Math.max(2.5, 48 * scale)}px`,
                  backgroundColor: color
                }}
                className="absolute rounded-xs opacity-75"
              />
            );
          })}

          {/* Viewport Box Indicator */}
          <div
            style={{
              left: `${rectX}px`,
              top: `${rectY}px`,
              width: `${Math.max(12, rectW)}px`,
              height: `${Math.max(8, rectH)}px`
            }}
            className="absolute border-1.5 border-indigo-600 bg-indigo-500/15 rounded-xs pointer-events-none shadow-xs"
          />
        </div>
      )}
    </div>
  );
}
