import React, { useState, useMemo, useCallback } from 'react';
import { Check } from 'lucide-react';
import { PALETTE } from '../../constants';
import NodeCard from './NodeCard';
import CanvasActionBar from './CanvasActionBar';
import Minimap from './Minimap';

export default function MindmapCanvas({
  containerRef,
  nodes = [],
  layoutMode = 'tree-lr',
  crossLinks = [],
  selectedIds,
  setSelectedIds,
  primarySelectedId,
  selectedNode,
  editingId,
  setEditingId,
  editText,
  setEditText,
  commitEdit,
  addChildNode,
  addSiblingNode,
  deleteSelectedNodes,
  updateNodeColor,
  toggleCollapseNode,
  reparentNode,
  onApplyLayout,
  isDetailDrawerOpen,
  onToggleDetailDrawer,
  pan,
  setPan,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitView,
  isPanning,
  setIsPanning,
  panStart,
  setPanStart,
  handleWheel,
  notification,
  showToast,
  setNodes
}) {
  // Dragging & Marquee Selection state
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [reparentTargetId, setReparentTargetId] = useState(null);
  const [marqueeBox, setMarqueeBox] = useState(null);

  // Compute hidden nodes due to collapsed ancestors
  const collapsedHiddenIds = useMemo(() => {
    const hidden = new Set();
    const childrenMap = {};
    nodes.forEach((n) => {
      if (n.parentId) {
        if (!childrenMap[n.parentId]) childrenMap[n.parentId] = [];
        childrenMap[n.parentId].push(n.id);
      }
    });

    const hideDescendants = (parentId) => {
      const children = childrenMap[parentId] || [];
      children.forEach((cId) => {
        hidden.add(cId);
        hideDescendants(cId);
      });
    };

    nodes.forEach((n) => {
      if (n.isCollapsed) {
        hideDescendants(n.id);
      }
    });

    return hidden;
  }, [nodes]);

  // Visible nodes (not hidden by folded parent)
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => !collapsedHiddenIds.has(n.id));
  }, [nodes, collapsedHiddenIds]);

  // Compute Hierarchical Connections (SVG Bezier Paths)
  const connections = useMemo(() => {
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    return visibleNodes
      .filter((n) => n.parentId && nodeMap[n.parentId] && !collapsedHiddenIds.has(n.parentId))
      .map((child) => {
        const parent = nodeMap[child.parentId];
        const isOrg = layoutMode === 'org-td';
        const isLeftBranch = child.x < parent.x;

        let startX, startY, endX, endY, path;

        if (isOrg) {
          startX = parent.x + 90;
          startY = parent.y + 48;
          endX = child.x + 90;
          endY = child.y;
          const dy = Math.abs(endY - startY) * 0.55;
          path = `M ${startX} ${startY} C ${startX} ${startY + dy}, ${endX} ${endY - dy}, ${endX} ${endY}`;
        } else if (isLeftBranch) {
          startX = parent.x;
          startY = parent.y + 24;
          endX = child.x + 180;
          endY = child.y + 24;
          const dx = Math.abs(endX - startX) * 0.55;
          path = `M ${startX} ${startY} C ${startX - dx} ${startY}, ${endX + dx} ${endY}, ${endX} ${endY}`;
        } else {
          startX = parent.x + 180;
          startY = parent.y + 24;
          endX = child.x;
          endY = child.y + 24;
          const dx = Math.abs(endX - startX) * 0.55;
          path = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
        }

        const color = PALETTE[child.colorIdx % PALETTE.length].stroke;
        return { id: `${parent.id}-${child.id}`, path, color };
      });
  }, [visibleNodes, nodes, layoutMode, collapsedHiddenIds]);

  // Compute Cross-Link Connections
  const crossLinkConnections = useMemo(() => {
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    return crossLinks
      .filter(
        (cl) =>
          nodeMap[cl.sourceId] &&
          nodeMap[cl.targetId] &&
          !collapsedHiddenIds.has(cl.sourceId) &&
          !collapsedHiddenIds.has(cl.targetId)
      )
      .map((cl) => {
        const s = nodeMap[cl.sourceId];
        const t = nodeMap[cl.targetId];
        const startX = s.x + 90;
        const startY = s.y + 24;
        const endX = t.x + 90;
        const endY = t.y + 24;
        const dx = (endX - startX) * 0.3;
        const dy = (endY - startY) * 0.3;
        const path = `M ${startX} ${startY} Q ${startX + dx} ${startY + dy - 40}, ${endX} ${endY}`;
        return { ...cl, path, midX: startX + dx, midY: startY + dy - 40 };
      });
  }, [crossLinks, nodes, collapsedHiddenIds]);

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e) => {
    if (e.target.dataset.canvas) {
      if (editingId) commitEdit();

      if (e.shiftKey) {
        const rect = containerRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        setMarqueeBox({ startX, startY, currentX: startX, currentY: startY });
      } else {
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        setSelectedIds(new Set(['root']));
      }
    }
  };

  // Node Mouse Down
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (editingId && editingId !== node.id) commitEdit();

    if (e.shiftKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    } else {
      if (!selectedIds.has(node.id)) {
        setSelectedIds(new Set([node.id]));
      }
    }

    setDraggingNodeId(node.id);
    const worldX = (e.clientX - pan.x) / zoom;
    const worldY = (e.clientY - pan.y) / zoom;
    setDragOffset({ x: worldX - node.x, y: worldY - node.y });
  };

  // Mouse Move
  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (marqueeBox && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setMarqueeBox((prev) => ({ ...prev, currentX, currentY }));

      const boxLeft = Math.min(marqueeBox.startX, currentX);
      const boxRight = Math.max(marqueeBox.startX, currentX);
      const boxTop = Math.min(marqueeBox.startY, currentY);
      const boxBottom = Math.max(marqueeBox.startY, currentY);

      const worldBoxLeft = (boxLeft - pan.x) / zoom;
      const worldBoxRight = (boxRight - pan.x) / zoom;
      const worldBoxTop = (boxTop - pan.y) / zoom;
      const worldBoxBottom = (boxBottom - pan.y) / zoom;

      const enclosed = new Set();
      visibleNodes.forEach((n) => {
        if (
          n.x + 180 >= worldBoxLeft &&
          n.x <= worldBoxRight &&
          n.y + 48 >= worldBoxTop &&
          n.y <= worldBoxBottom
        ) {
          enclosed.add(n.id);
        }
      });
      setSelectedIds(enclosed.size > 0 ? enclosed : new Set(['root']));
    } else if (draggingNodeId) {
      const worldX = (e.clientX - pan.x) / zoom;
      const worldY = (e.clientY - pan.y) / zoom;
      const targetNode = nodes.find((n) => n.id === draggingNodeId);
      if (!targetNode) return;

      const deltaX = Math.round(worldX - dragOffset.x - targetNode.x);
      const deltaY = Math.round(worldY - dragOffset.y - targetNode.y);

      // Move all currently selected nodes together
      setNodes((prev) =>
        prev.map((n) =>
          selectedIds.has(n.id)
            ? { ...n, x: n.x + deltaX, y: n.y + deltaY }
            : n
        ),
        false
      );

      // Check for reparenting drop target
      const dropTarget = visibleNodes.find(
        (n) =>
          !selectedIds.has(n.id) &&
          Math.abs(n.x + 90 - (worldX - dragOffset.x + 90)) < 90 &&
          Math.abs(n.y + 24 - (worldY - dragOffset.y + 24)) < 40
      );
      setReparentTargetId(dropTarget ? dropTarget.id : null);
    }
  }, [
    isPanning,
    marqueeBox,
    draggingNodeId,
    panStart,
    pan,
    zoom,
    dragOffset,
    nodes,
    selectedIds,
    visibleNodes,
    containerRef,
    setPan,
    setSelectedIds,
    setNodes
  ]);

  // Mouse Up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setMarqueeBox(null);

    if (draggingNodeId && reparentTargetId && draggingNodeId !== 'root') {
      reparentNode(draggingNodeId, reparentTargetId);
      showToast?.('Reparented node successfully!');
    }

    setDraggingNodeId(null);
    setReparentTargetId(null);
  }, [draggingNodeId, reparentTargetId, reparentNode, showToast, setIsPanning]);

  return (
    <div
      ref={containerRef}
      data-canvas="true"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`flex-1 relative overflow-hidden bg-slate-50/80 cursor-grab ${
        isPanning ? 'cursor-grabbing' : ''
      }`}
      style={{
        backgroundImage: `radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)`,
        backgroundSize: '24px 24px',
        backgroundPosition: `${pan.x % 24}px ${pan.y % 24}px`
      }}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Canvas Action Bar (Child, Sibling, Color, Delete, Zoom) */}
      <CanvasActionBar
        onAddChild={() => addChildNode(primarySelectedId)}
        onAddSibling={addSiblingNode}
        onApplyLayout={onApplyLayout}
        selectedNode={selectedNode}
        selectedIds={selectedIds}
        onUpdateColor={updateNodeColor}
        isDetailDrawerOpen={isDetailDrawerOpen}
        onToggleDetailDrawer={onToggleDetailDrawer}
        onDeleteSelected={deleteSelectedNodes}
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        onFitView={() => onFitView(nodes)}
      />

      {/* Marquee Selection Rectangle */}
      {marqueeBox && (
        <div
          style={{
            left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
            top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
            width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
            height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`
          }}
          className="absolute border border-indigo-500 bg-indigo-500/15 pointer-events-none z-20 rounded-xs"
        />
      )}

      {/* Scaled & Panned Canvas Viewport */}
      <div
        data-canvas="true"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="w-full h-full relative pointer-events-none"
      >
        {/* SVG Connections Layer */}
        <svg className="overflow-visible absolute inset-0 w-full h-full pointer-events-none">
          {/* Hierarchical Tree Connections */}
          {connections.map((conn) => (
            <path
              key={conn.id}
              d={conn.path}
              fill="none"
              stroke={conn.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-85 transition-all duration-75"
            />
          ))}

          {/* Cross-Link Association Connections */}
          {crossLinkConnections.map((cl) => (
            <g key={cl.id}>
              <path
                d={cl.path}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="opacity-70"
              />
              {cl.label && (
                <text
                  x={cl.midX}
                  y={cl.midY}
                  fill="#4f46e5"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="bg-white px-1 font-mono select-none"
                >
                  {cl.label}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Nodes Layer */}
        {visibleNodes.map((node) => {
          const isSelected = selectedIds.has(node.id);
          const isEditing = node.id === editingId;
          const isReparentTarget = reparentTargetId === node.id;
          const childrenCount = nodes.filter((n) => n.parentId === node.id).length;

          return (
            <NodeCard
              key={node.id}
              node={node}
              isSelected={isSelected}
              isEditing={isEditing}
              isReparentTarget={isReparentTarget}
              childrenCount={childrenCount}
              editText={editText}
              setEditText={setEditText}
              commitEdit={commitEdit}
              onNodeMouseDown={handleNodeMouseDown}
              onStartEdit={() => {
                setEditingId(node.id);
                setEditText(node.text || '');
              }}
              onCancelEdit={() => setEditingId(null)}
              onToggleCollapse={toggleCollapseNode}
              onAddChild={addChildNode}
            />
          );
        })}
      </div>

      {/* Minimap in Bottom Right */}
      <Minimap
        nodes={nodes}
        pan={pan}
        zoom={zoom}
        viewportWidth={containerRef.current?.clientWidth || 800}
        viewportHeight={containerRef.current?.clientHeight || 600}
        onPanTo={(targetPan) => setPan(targetPan)}
      />
    </div>
  );
}
