import React, { useState, useMemo, useCallback, useRef } from 'react';
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
  isPresentationOpen = false,
  pan,
  setPan,
  zoom,
  setZoom,
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

  // Mobile Touch Gestures State & Refs
  const touchStartRef = useRef(null);
  const pinchDistRef = useRef(null);
  const pinchStartZoomRef = useRef(1);
  const pinchMidpointRef = useRef({ x: 0, y: 0 });
  const touchDragNodeRef = useRef(null);

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
          const midY = (startY + endY) / 2;
          path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        } else if (isLeftBranch) {
          startX = parent.x;
          startY = parent.y + 24;
          endX = child.x + 180;
          endY = child.y + 24;
          const midX = (startX + endX) / 2;
          path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
        } else {
          startX = parent.x + 180;
          startY = parent.y + 24;
          endX = child.x;
          endY = child.y + 24;
          const midX = (startX + endX) / 2;
          path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
        }

        const color = PALETTE[child.colorIdx % PALETTE.length].stroke;
        return {
          id: `${child.parentId}->${child.id}`,
          path,
          color
        };
      });
  }, [nodes, visibleNodes, layoutMode, collapsedHiddenIds]);

  // Compute Cross-Links (Dashed SVG Paths)
  const crossLinkConnections = useMemo(() => {
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    return (crossLinks || [])
      .filter(
        (cl) =>
          nodeMap[cl.sourceId] &&
          nodeMap[cl.targetId] &&
          !collapsedHiddenIds.has(cl.sourceId) &&
          !collapsedHiddenIds.has(cl.targetId)
      )
      .map((cl) => {
        const src = nodeMap[cl.sourceId];
        const tgt = nodeMap[cl.targetId];

        const startX = src.x + 90;
        const startY = src.y + 24;
        const endX = tgt.x + 90;
        const endY = tgt.y + 24;

        const dx = endX - startX;
        const dy = endY - startY;
        const cx1 = startX + dx * 0.25 - dy * 0.2;
        const cy1 = startY + dy * 0.25 + dx * 0.2;

        return {
          id: cl.id,
          path: `M ${startX} ${startY} Q ${cx1} ${cy1} ${endX} ${endY}`,
          midX: (startX + endX) / 2 - dy * 0.1,
          midY: (startY + endY) / 2 + dx * 0.1,
          label: cl.label
        };
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

  // Mobile Node Touch Start
  const handleNodeTouchStart = (e, node) => {
    e.stopPropagation();
    if (editingId && editingId !== node.id) commitEdit();
    if (!selectedIds.has(node.id)) {
      setSelectedIds(new Set([node.id]));
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const worldX = (touch.clientX - pan.x) / zoom;
      const worldY = (touch.clientY - pan.y) / zoom;
      touchDragNodeRef.current = {
        node,
        startTouchX: touch.clientX,
        startTouchY: touch.clientY,
        startNodeX: node.x,
        startNodeY: node.y,
        offsetWorldX: worldX - node.x,
        offsetWorldY: worldY - node.y,
        isDragging: false
      };
    }
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

  // Mobile Touch Gestures (Pinch to Zoom, 1-finger Pan, Node Touch Drag)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const target = e.target;
      const isCanvasBg = Boolean(
        target.dataset?.canvas ||
        (target.closest('[data-canvas="true"]') && !target.closest('[data-node="true"]'))
      );

      if (isCanvasBg) {
        if (editingId) commitEdit();
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          panX: pan.x,
          panY: pan.y,
          isPanning: true
        };
        setIsPanning(true);
      }
    } else if (e.touches.length === 2) {
      // 2 fingers pinch zoom and pan
      setIsPanning(false);
      touchStartRef.current = null;
      touchDragNodeRef.current = null;
      setDraggingNodeId(null);

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
      pinchMidpointRef.current = {
        midX: (t1.clientX + t2.clientX) / 2,
        midY: (t1.clientY + t2.clientY) / 2,
        panX: pan.x,
        panY: pan.y
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];

      // Node touch drag
      if (touchDragNodeRef.current) {
        const { node, startTouchX, startTouchY, startNodeX, startNodeY } = touchDragNodeRef.current;
        const deltaWorldX = (touch.clientX - startTouchX) / zoom;
        const deltaWorldY = (touch.clientY - startTouchY) / zoom;

        // If moved more than 6px, treat as an intentional drag
        if (Math.hypot(touch.clientX - startTouchX, touch.clientY - startTouchY) > 6) {
          touchDragNodeRef.current.isDragging = true;
          setDraggingNodeId(node.id);

          setNodes((prev) =>
            prev.map((n) =>
              selectedIds.has(n.id)
                ? { ...n, x: Math.round(startNodeX + deltaWorldX), y: Math.round(startNodeY + deltaWorldY) }
                : n
            ),
            false
          );

          const worldX = (touch.clientX - pan.x) / zoom;
          const worldY = (touch.clientY - pan.y) / zoom;
          const dropTarget = visibleNodes.find(
            (n) =>
              !selectedIds.has(n.id) &&
              Math.abs(n.x + 90 - worldX) < 90 &&
              Math.abs(n.y + 24 - worldY) < 40
          );
          setReparentTargetId(dropTarget ? dropTarget.id : null);
        }
        return;
      }

      // Canvas single-finger pan
      if (touchStartRef.current?.isPanning) {
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        setPan({
          x: touchStartRef.current.panX + deltaX,
          y: touchStartRef.current.panY + deltaY
        });
      }
    } else if (e.touches.length === 2 && pinchDistRef.current) {
      // 2 fingers pinch zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = currentDist / pinchDistRef.current;
      const newZoom = Math.min(2.4, Math.max(0.3, +(pinchStartZoomRef.current * ratio).toFixed(2)));

      if (setZoom) {
        setZoom(newZoom);
      }

      // Two finger pan along with zoom
      const currentMidX = (t1.clientX + t2.clientX) / 2;
      const currentMidY = (t1.clientY + t2.clientY) / 2;
      const deltaMidX = currentMidX - pinchMidpointRef.current.midX;
      const deltaMidY = currentMidY - pinchMidpointRef.current.midY;

      setPan({
        x: Math.round(pinchMidpointRef.current.panX + deltaMidX),
        y: Math.round(pinchMidpointRef.current.panY + deltaMidY)
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (touchDragNodeRef.current) {
      if (touchDragNodeRef.current.isDragging && reparentTargetId && touchDragNodeRef.current.node.id !== 'root') {
        reparentNode(touchDragNodeRef.current.node.id, reparentTargetId);
        showToast?.('Reparented node successfully!');
      }
      touchDragNodeRef.current = null;
      setDraggingNodeId(null);
      setReparentTargetId(null);
    }

    if (e.touches.length === 0) {
      setIsPanning(false);
      touchStartRef.current = null;
      pinchDistRef.current = null;
    } else if (e.touches.length === 1) {
      pinchDistRef.current = null;
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y,
        isPanning: true
      };
      setIsPanning(true);
    }
  };

  return (
    <div
      ref={containerRef}
      data-canvas="true"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onWheel={handleWheel}
      className={`flex-1 relative overflow-hidden bg-slate-50/80 touch-none select-none cursor-grab ${
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
        <div className="absolute top-4 sm:top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce max-w-[90vw] truncate">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* Floating Canvas Action Bar (Child, Sibling, Edit, Color, Delete, Zoom) */}
      {!isPresentationOpen && (
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
          onStartEdit={() => {
            if (selectedNode) {
              setEditingId(selectedNode.id);
              setEditText(selectedNode.text || '');
            }
          }}
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onResetZoom={onResetZoom}
          onFitView={() => onFitView(nodes)}
        />
      )}

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
          transformOrigin: '0 0',
          transition: isPanning || draggingNodeId ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
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
              onNodeTouchStart={handleNodeTouchStart}
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
      {!isPresentationOpen && (
        <Minimap
          nodes={nodes}
          pan={pan}
          zoom={zoom}
          viewportWidth={containerRef.current?.clientWidth || 800}
          viewportHeight={containerRef.current?.clientHeight || 600}
          onPanTo={(targetPan) => setPan(targetPan)}
        />
      )}
    </div>
  );
}
