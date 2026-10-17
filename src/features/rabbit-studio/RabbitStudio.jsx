import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useMindmapHistory } from './hooks/useMindmapHistory';
import { useCanvasTransform } from './hooks/useCanvasTransform';
import { useNodeOperations } from './hooks/useNodeOperations';
import WorkspaceSidebar from './components/sidebar/WorkspaceSidebar';
import TopToolbar from './components/toolbar/TopToolbar';
import MindmapCanvas from './components/canvas/MindmapCanvas';
import NodeDetailDrawer from './components/modals/NodeDetailDrawer';
import SpotlightSearchModal from './components/modals/SpotlightSearchModal';
import PresentationMode from './components/modals/PresentationMode';
import { calculateLayout } from './utils/layoutEngine';
import {
  copyText,
  downloadFile,
  generateMarkdown,
  generateMermaid,
  generateOPML,
  generateSVG,
  exportPNG
} from './utils/exportUtils';

export default function RabbitStudio({ onBackToPortfolio, isEmbedded = false }) {
  // Toast notifications
  const [notification, setNotification] = useState(null);
  const showToast = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Workspace & History State
  const {
    folders,
    setFolders,
    activeMapId,
    setActiveMapId,
    currentMap,
    nodes,
    crossLinks,
    layoutMode,
    setNodes,
    updateMapLayout,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFolderOpen,
    createMapInFolder,
    renameMap,
    duplicateMap,
    moveMapToFolder,
    deleteMap,
    importMapJSON,
    resetToDefaults
  } = useMindmapHistory();

  // Canvas Viewport Transform
  const {
    containerRef,
    pan,
    setPan,
    zoom,
    setZoom,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    zoomIn,
    zoomOut,
    resetZoom,
    centerOnNode,
    fitView,
    handleWheel
  } = useCanvasTransform();

  // Node Operations
  const {
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
  } = useNodeOperations({
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
  });

  // UI Panels & Modals State (Responsive default: collapsed on mobile screens < 768px)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (isEmbedded) return false;
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Identify current folder
  const currentFolder = useMemo(() => {
    return (folders || []).find((f) => (f.maps || []).some((m) => m.id === activeMapId)) || (folders?.[0] || null);
  }, [folders, activeMapId]);

  // When active map changes, reset selection to root node of the new map
  const prevMapIdRef = useRef(activeMapId);
  useEffect(() => {
    if (prevMapIdRef.current !== activeMapId) {
      prevMapIdRef.current = activeMapId;
      const rootNode = (currentMap?.nodes || []).find((n) => n.parentId === null);
      const newId = rootNode ? rootNode.id : (currentMap?.nodes?.[0]?.id || 'root');
      setSelectedIds(new Set([newId]));
      setEditingId(null);
    }
  }, [activeMapId, currentMap, setSelectedIds, setEditingId]);

  // Layout alignment action
  const handleApplyLayout = useCallback((mode = layoutMode) => {
    const newPositions = calculateLayout(nodes, mode);
    setNodes((prev) =>
      prev.map((n) =>
        newPositions[n.id] ? { ...n, x: newPositions[n.id].x, y: newPositions[n.id].y } : n
      )
    );
    updateMapLayout(mode);
    showToast(`Applied ${mode} layout!`);
  }, [nodes, layoutMode, setNodes, updateMapLayout, showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Spotlight search (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Undo (Cmd+Z) / Redo (Cmd+Shift+Z or Cmd+Y)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Presentation Mode hotkey (F5)
      if (e.key === 'F5') {
        e.preventDefault();
        setIsPresentationOpen((prev) => !prev);
        return;
      }

      // If in Presentation Mode, defer all navigation to PresentationMode component
      if (isPresentationOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsPresentationOpen(false);
        }
        return;
      }

      // If typing in any input/textarea that is not node editing, ignore canvas shortcuts
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target?.isContentEditable;

      if (isInput && !editingId) {
        return;
      }

      // If editing a node directly
      if (editingId) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          commitEdit();
        } else if (e.key === 'Escape') {
          setEditingId(null);
        }
        return;
      }

      // Mindmap navigation & operations
      if (e.key === 'Tab') {
        e.preventDefault();
        addChildNode(primarySelectedId);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        addSiblingNode();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        deleteSelectedNodes();
      } else if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        handleApplyLayout(layoutMode);
      } else if (e.key.toLowerCase() === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsDetailDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPresentationOpen,
    editingId,
    primarySelectedId,
    commitEdit,
    setEditingId,
    addChildNode,
    addSiblingNode,
    deleteSelectedNodes,
    handleUndo,
    handleRedo,
    handleApplyLayout,
    layoutMode
  ]);

  // Export handlers
  const handleExport = (type) => {
    if (type === 'png') {
      exportPNG(currentMap, [], []);
      showToast('Exported High-Res PNG!');
    } else if (type === 'svg') {
      const svg = generateSVG(currentMap, [], []);
      downloadFile(`${currentMap.title.replace(/\s+/g, '_')}.svg`, svg, 'image/svg+xml');
      showToast('Downloaded SVG vector file!');
    } else if (type === 'mermaid') {
      const mermaidCode = generateMermaid(currentMap);
      copyText(mermaidCode);
      showToast('Copied Mermaid syntax to clipboard!');
    } else if (type === 'opml') {
      const opml = generateOPML(currentMap);
      downloadFile(`${currentMap.title.replace(/\s+/g, '_')}.opml`, opml, 'text/xml');
      showToast('Downloaded OPML outline!');
    } else if (type === 'markdown') {
      const md = generateMarkdown(currentMap);
      downloadFile(`${currentMap.title.replace(/\s+/g, '_')}.md`, md, 'text/markdown');
      showToast('Downloaded Markdown document!');
    } else if (type === 'json') {
      const jsonStr = JSON.stringify(currentMap, null, 2);
      downloadFile(`${currentMap.title.replace(/\s+/g, '_')}.rabbit.json`, jsonStr, 'application/json');
      showToast('Exported Studio JSON file!');
    }
  };

  // Import handler
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const imported = importMapJSON(parsed);
        showToast(`Imported "${imported.title}"!`);
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Open presentation mode cleanly
  const handleOpenPresentation = useCallback(() => {
    setIsPresentationOpen(true);
    setIsDetailDrawerOpen(false);
    setIsSearchOpen(false);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Presentation Mode focus callback with auto-unfolding and active highlight
  const handleFocusPresentationNode = useCallback((node) => {
    if (!node) return;

    // 1. Auto-uncollapse ancestors so this node is guaranteed visible on canvas
    setNodes((prevNodes) => {
      const nMap = Object.fromEntries(prevNodes.map((n) => [n.id, n]));
      const toUncollapse = new Set();
      let curr = node.parentId ? nMap[node.parentId] : null;
      while (curr) {
        if (curr.isCollapsed) {
          toUncollapse.add(curr.id);
        }
        curr = curr.parentId ? nMap[curr.parentId] : null;
      }
      if (toUncollapse.size > 0) {
        return prevNodes.map((n) => (toUncollapse.has(n.id) ? { ...n, isCollapsed: false } : n));
      }
      return prevNodes;
    }, false);

    // 2. Select this node on canvas so it has the active highlight ring
    setSelectedIds(new Set([node.id]));

    // 3. Smoothly center camera with -50px offset so the node is centered above bottom presentation card
    centerOnNode(node.x, node.y, 1.25, -50);
  }, [centerOnNode, setSelectedIds, setNodes]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Top Header Toolbar */}
      {!isFocusMode && (
        <TopToolbar
          onBackToPortfolio={onBackToPortfolio}
          currentFolder={currentFolder}
          currentMap={currentMap}
          layoutMode={layoutMode}
          onChangeLayout={handleApplyLayout}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPresentation={handleOpenPresentation}
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
        />
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Workspace Sidebar (Folders & Maps) */}
        {!isFocusMode && (
          <WorkspaceSidebar
            isOpen={sidebarOpen}
            onToggleOpen={() => setSidebarOpen((prev) => !prev)}
            folders={folders}
            activeMapId={activeMapId}
            onSelectMap={(mapId) => setActiveMapId(mapId)}
            onCreateFolder={(name) => {
              const created = createFolder(name);
              if (created) showToast(`Created folder "${name}"`);
              return created;
            }}
            onRenameFolder={(folderId, newName) => {
              if (renameFolder(folderId, newName)) {
                showToast(`Renamed folder to "${newName}"`);
              }
            }}
            onDeleteFolder={(folderId) => {
              const res = deleteFolder(folderId);
              if (res.success) {
                showToast('Deleted folder');
              } else {
                showToast(res.reason);
              }
            }}
            onToggleFolderOpen={toggleFolderOpen}
            onCreateMapInFolder={(folderId, title) => {
              const map = createMapInFolder(folderId, title);
              if (map) showToast(`Created map "${map.title}"`);
              return map;
            }}
            onRenameMap={(mapId, title) => {
              if (renameMap(mapId, title)) {
                showToast(`Renamed map to "${title}"`);
              }
            }}
            onDuplicateMap={(mapId) => {
              const duplicated = duplicateMap(mapId);
              if (duplicated) showToast(`Duplicated "${duplicated.title}"`);
            }}
            onMoveMapToFolder={(mapId, targetFolderId) => {
              moveMapToFolder(mapId, targetFolderId);
              showToast('Moved mind map to folder');
            }}
            onDeleteMap={(mapId) => {
              const res = deleteMap(mapId);
              if (res.success) {
                showToast('Deleted mind map');
              } else {
                showToast(res.reason);
              }
            }}
            onResetDefaults={() => {
              if (window.confirm('Reset all workspaces to defaults? This will overwrite local changes.')) {
                resetToDefaults();
                showToast('Reset to demo workspaces');
              }
            }}
          />
        )}

        {/* Focus Mode Exit Trigger */}
        {isFocusMode && (
          <button
            onClick={() => setIsFocusMode(false)}
            title="Exit Focus Mode"
            className="absolute top-4 right-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <span>Exit Focus Mode</span>
          </button>
        )}

        {/* Mindmap Interactive Canvas */}
        <MindmapCanvas
          containerRef={containerRef}
          nodes={nodes}
          layoutMode={layoutMode}
          crossLinks={crossLinks}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          primarySelectedId={primarySelectedId}
          selectedNode={selectedNode}
          editingId={editingId}
          setEditingId={setEditingId}
          editText={editText}
          setEditText={setEditText}
          commitEdit={commitEdit}
          addChildNode={addChildNode}
          addSiblingNode={addSiblingNode}
          deleteSelectedNodes={deleteSelectedNodes}
          updateNodeColor={updateNodeColor}
          toggleCollapseNode={toggleCollapseNode}
          reparentNode={reparentNode}
          onApplyLayout={handleApplyLayout}
          isDetailDrawerOpen={isDetailDrawerOpen}
          onToggleDetailDrawer={() => setIsDetailDrawerOpen((prev) => !prev)}
          isPresentationOpen={isPresentationOpen}
          pan={pan}
          setPan={setPan}
          zoom={zoom}
          setZoom={setZoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onFitView={fitView}
          isPanning={isPanning}
          setIsPanning={setIsPanning}
          panStart={panStart}
          setPanStart={setPanStart}
          handleWheel={handleWheel}
          notification={notification}
          showToast={showToast}
          setNodes={setNodes}
        />

        {/* Node Detail Drawer */}
        {isDetailDrawerOpen && (
          <NodeDetailDrawer
            node={selectedNode}
            allNodes={nodes}
            crossLinks={crossLinks}
            onClose={() => setIsDetailDrawerOpen(false)}
            onUpdateNode={updateNodeData}
            onAddCrossLink={addCrossLink}
            onDeleteCrossLink={deleteCrossLink}
          />
        )}
      </div>

      {/* Spotlight Search Modal */}
      <SpotlightSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        folders={folders}
        onSelectNode={(node, mapId) => {
          setActiveMapId(mapId);
          setSelectedIds(new Set([node.id]));
          centerOnNode(node.x, node.y, 1.1);
          setIsSearchOpen(false);
          showToast(`Jumped to "${node.text || 'Idea'}"`);
        }}
      />

      {/* Presentation Mode */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        nodes={nodes}
        currentMap={currentMap}
        onFocusNode={handleFocusPresentationNode}
      />
    </div>
  );
}
