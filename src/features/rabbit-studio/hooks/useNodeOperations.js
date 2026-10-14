import { useState, useCallback, useMemo } from 'react';
import { PALETTE } from '../constants';

export function useNodeOperations({
  nodes,
  setNodes,
  layoutMode,
  setFolders,
  activeMapId,
  showToast,
  containerRef,
  zoom,
  pan,
  setPan
}) {
  const [selectedIds, setSelectedIds] = useState(new Set(['root']));
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const primarySelectedId = useMemo(() => {
    return Array.from(selectedIds)[0] || 'root';
  }, [selectedIds]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === primarySelectedId);
  }, [nodes, primarySelectedId]);

  // Add child node
  const addChildNode = useCallback((targetId = primarySelectedId) => {
    const parentNode = nodes.find((n) => n.id === targetId);
    if (!parentNode) return;

    const existingChildren = nodes.filter((n) => n.parentId === targetId);
    const newId = 'node_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const nextColor = parentNode.parentId === null
      ? (existingChildren.length + 1) % PALETTE.length
      : parentNode.colorIdx;

    let posX = parentNode.x + 280;
    let posY = parentNode.y;
    if (existingChildren.length > 0) {
      const lastChild = existingChildren[existingChildren.length - 1];
      posY = Math.max(parentNode.y + existingChildren.length * 75, lastChild.y + 75);
    }

    if (layoutMode === 'org-td') {
      posX = parentNode.x + (existingChildren.length * 200 - 100);
      posY = parentNode.y + 160;
    } else if (layoutMode === 'radial') {
      const isLeft = parentNode.x < 600 || (parentNode.parentId === null && existingChildren.length % 2 === 1);
      posX = isLeft ? parentNode.x - 280 : parentNode.x + 280;
    }

    const newNode = {
      id: newId,
      text: '',
      x: posX,
      y: posY,
      parentId: parentNode.id,
      colorIdx: nextColor,
      status: 'none',
      priority: 'none',
      notes: '',
      linkUrl: '',
      isCollapsed: false
    };

    // Atomically expand parent if collapsed and add new node
    setNodes((prev) => {
      const updated = prev.map((n) => (n.id === parentNode.id ? { ...n, isCollapsed: false } : n));
      return [...updated, newNode];
    });

    // Select the new node immediately and focus editing
    setSelectedIds(new Set([newId]));
    setEditingId(newId);
    setEditText('');

    // Smoothly pan camera if new node is outside viewport
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = posX * zoom + pan.x;
      const screenY = posY * zoom + pan.y;
      if (screenX > rect.width - 240 || screenX < 60 || screenY > rect.height - 120 || screenY < 60) {
        const targetPanX = rect.width / 2 - (posX + 90) * zoom;
        const targetPanY = rect.height / 2 - (posY + 24) * zoom;
        setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
      }
    }
  }, [nodes, primarySelectedId, layoutMode, setNodes, containerRef, zoom, pan, setPan]);

  // Add sibling node
  const addSiblingNode = useCallback(() => {
    if (!primarySelectedId) return;
    const current = nodes.find((n) => n.id === primarySelectedId);
    if (!current || !current.parentId) {
      addChildNode('root');
      return;
    }
    addChildNode(current.parentId);
  }, [nodes, primarySelectedId, addChildNode]);

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    const targetIds = Array.from(selectedIds);
    if (targetIds.includes('root') && targetIds.length === 1) {
      showToast?.('Root node cannot be deleted!');
      return;
    }

    const toDelete = new Set(targetIds.filter((id) => id !== 'root'));
    let added = true;
    while (added) {
      added = false;
      for (const n of nodes) {
        if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
          toDelete.add(n.id);
          added = true;
        }
      }
    }

    const currentPrimary = nodes.find((n) => n.id === primarySelectedId);
    const fallbackId = (currentPrimary && currentPrimary.parentId && !toDelete.has(currentPrimary.parentId))
      ? currentPrimary.parentId
      : 'root';

    setNodes((prev) => prev.filter((n) => !toDelete.has(n.id)));
    setSelectedIds(new Set([fallbackId]));
    setEditingId(null);
    showToast?.(`Deleted ${toDelete.size} node${toDelete.size > 1 ? 's' : ''}!`);
  }, [selectedIds, nodes, primarySelectedId, setNodes, showToast]);

  const commitEdit = useCallback(() => {
    if (!editingId) return;
    const currentId = editingId;
    const trimmed = editText.trim();
    setNodes((prev) =>
      prev.map((n) => (n.id === currentId ? { ...n, text: trimmed } : n))
    );

    // If root node was edited, also keep the mind map / file title in sync
    const isRoot = currentId === 'root' || nodes.find((n) => n.id === currentId)?.parentId === null;
    if (isRoot && trimmed && setFolders && activeMapId) {
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          maps: f.maps.map((m) =>
            m.id === activeMapId ? { ...m, title: trimmed } : m
          )
        })),
        false
      );
    }

    setSelectedIds(new Set([currentId]));
    setEditingId(null);
  }, [editingId, editText, setNodes, nodes, setFolders, activeMapId]);

  const updateNodeColor = useCallback((colorIdx) => {
    setNodes((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, colorIdx } : n))
    );
  }, [selectedIds, setNodes]);

  const updateNodeData = useCallback((nodeId, patch) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...patch } : n))
    );
  }, [setNodes]);

  const toggleCollapseNode = useCallback((nodeId, e) => {
    if (e) e.stopPropagation();
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, isCollapsed: !n.isCollapsed } : n)),
      false
    );
  }, [setNodes]);

  const reparentNode = useCallback((draggedId, targetParentId) => {
    if (!draggedId || !targetParentId || draggedId === targetParentId || draggedId === 'root') {
      return false;
    }
    setNodes((prev) =>
      prev.map((n) => (n.id === draggedId ? { ...n, parentId: targetParentId } : n))
    );
    return true;
  }, [setNodes]);

  // Cross link connections
  const addCrossLink = useCallback((sourceId, targetId, label) => {
    const newCrossLink = {
      id: 'cl_' + Date.now(),
      sourceId,
      targetId,
      label
    };
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        maps: f.maps.map((m) =>
          m.id === activeMapId
            ? { ...m, crossLinks: [...(m.crossLinks || []), newCrossLink] }
            : m
        )
      }))
    );
    showToast?.('Added cross-link connection!');
  }, [activeMapId, setFolders, showToast]);

  const deleteCrossLink = useCallback((crossLinkId) => {
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        maps: f.maps.map((m) =>
          m.id === activeMapId
            ? { ...m, crossLinks: (m.crossLinks || []).filter((cl) => cl.id !== crossLinkId) }
            : m
        )
      }))
    );
    showToast?.('Removed cross-link!');
  }, [activeMapId, setFolders, showToast]);

  return {
    selectedIds,
    setSelectedIds,
    editingId,
    setEditingId,
    editText,
    setEditText,
    primarySelectedId,
    selectedNode,
    addChildNode,
    addSiblingNode,
    deleteSelectedNodes,
    commitEdit,
    updateNodeColor,
    updateNodeData,
    toggleCollapseNode,
    reparentNode,
    addCrossLink,
    deleteCrossLink
  };
}
