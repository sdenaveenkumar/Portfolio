import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { INITIAL_WORKSPACES, PALETTE } from '../constants';

const STORAGE_KEY = 'rabbit_studio_folders_v2';

export function useMindmapHistory() {
  const [folders, setFoldersState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
    } catch {
      return INITIAL_WORKSPACES;
    }
  });

  const [activeMapId, setActiveMapId] = useState(() => {
    return folders[0]?.maps[0]?.id || 'map_arch';
  });

  // Undo / Redo History Stack
  const historyRef = useRef([folders]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const setFolders = useCallback((updater, recordHistory = true) => {
    setFoldersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (recordHistory) {
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(next);
        if (newHistory.length > 35) newHistory.shift();
        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;
        updateHistoryState();
      }
      return next;
    });
  }, [updateHistoryState]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      setFoldersState(prev);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      setFoldersState(next);
      updateHistoryState();
    }
  }, [updateHistoryState]);

  // Persist folders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
    } catch {
      // Ignore storage errors
    }
  }, [folders]);

  // Current active map object
  const currentMap = useMemo(() => {
    for (const f of folders) {
      const m = f.maps.find((map) => map.id === activeMapId);
      if (m) return m;
    }
    // Fallback to first available map
    for (const f of folders) {
      if (f.maps.length > 0) return f.maps[0];
    }
    return {
      id: 'default',
      title: 'Default Map',
      nodes: [
        {
          id: 'root',
          text: 'Central Idea',
          x: 400,
          y: 300,
          parentId: null,
          colorIdx: 0,
          status: 'none',
          priority: 'none',
          notes: '',
          linkUrl: '',
          isCollapsed: false
        }
      ],
      layoutMode: 'tree-lr',
      crossLinks: []
    };
  }, [folders, activeMapId]);

  const nodes = useMemo(() => currentMap.nodes || [], [currentMap]);
  const crossLinks = useMemo(() => currentMap.crossLinks || [], [currentMap]);
  const layoutMode = currentMap.layoutMode || 'tree-lr';

  // Update nodes of active map
  const setNodes = useCallback((updater, recordHistory = true) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        maps: folder.maps.map((map) => {
          if (map.id === activeMapId) {
            const nextNodes = typeof updater === 'function' ? updater(map.nodes || []) : updater;
            return { ...map, nodes: nextNodes };
          }
          return map;
        })
      })),
      recordHistory
    );
  }, [activeMapId, setFolders]);

  // Update map layout mode
  const updateMapLayout = useCallback((layout) => {
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        maps: f.maps.map((m) => (m.id === activeMapId ? { ...m, layoutMode: layout } : m))
      })),
      false
    );
  }, [activeMapId, setFolders]);

  // --- Folder Management Operations ---

  const createFolder = useCallback((name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    const newFolder = {
      id: 'folder_' + Date.now(),
      name: trimmed,
      isOpen: true,
      maps: []
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  }, [setFolders]);

  const renameFolder = useCallback((folderId, newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed) return false;
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: trimmed } : f))
    );
    return true;
  }, [setFolders]);

  const deleteFolder = useCallback((folderId) => {
    if (folders.length <= 1) {
      return { success: false, reason: 'Cannot delete the only remaining folder.' };
    }

    const folderToDelete = folders.find((f) => f.id === folderId);
    if (!folderToDelete) return { success: false, reason: 'Folder not found.' };

    const remainingFolders = folders.filter((f) => f.id !== folderId);
    
    // Check if the active map was in the deleted folder
    let nextMapId = activeMapId;
    const deletedMapIds = new Set(folderToDelete.maps.map((m) => m.id));
    if (deletedMapIds.has(activeMapId)) {
      // Pick first map from remaining folders
      const fallbackMap = remainingFolders.find((f) => f.maps.length > 0)?.maps[0];
      if (fallbackMap) {
        nextMapId = fallbackMap.id;
      }
    }

    setFolders(remainingFolders);
    if (nextMapId !== activeMapId) {
      setActiveMapId(nextMapId);
    }
    return { success: true };
  }, [folders, activeMapId, setFolders]);

  const toggleFolderOpen = useCallback((folderId) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, isOpen: !f.isOpen } : f)),
      false
    );
  }, [setFolders]);

  // --- Mind Map Management Operations ---

  const createMapInFolder = useCallback((folderId, title) => {
    const trimmed = (title || 'New Mindmap').trim();
    const newMap = {
      id: 'map_' + Date.now(),
      title: trimmed,
      layoutMode: 'tree-lr',
      crossLinks: [],
      nodes: [
        {
          id: 'root',
          text: trimmed,
          x: 300,
          y: 250,
          parentId: null,
          colorIdx: Math.floor(Math.random() * PALETTE.length),
          status: 'none',
          priority: 'none',
          notes: '',
          linkUrl: '',
          isCollapsed: false
        }
      ]
    };
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, isOpen: true, maps: [...f.maps, newMap] }
          : f
      )
    );
    setActiveMapId(newMap.id);
    return newMap;
  }, [setFolders]);

  const renameMap = useCallback((mapId, newTitle) => {
    const trimmed = (newTitle || '').trim();
    if (!trimmed) return false;
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        maps: f.maps.map((m) => {
          if (m.id !== mapId) return m;
          const updatedNodes = (m.nodes || []).map((node) =>
            node.parentId === null ? { ...node, text: trimmed } : node
          );
          return { ...m, title: trimmed, nodes: updatedNodes };
        })
      }))
    );
    return true;
  }, [setFolders]);

  const duplicateMap = useCallback((mapId) => {
    let duplicated = null;
    setFolders((prev) =>
      prev.map((folder) => {
        const found = folder.maps.find((m) => m.id === mapId);
        if (!found) return folder;

        const newId = 'map_' + Date.now();
        duplicated = {
          ...JSON.parse(JSON.stringify(found)),
          id: newId,
          title: `${found.title} (Copy)`
        };

        return {
          ...folder,
          maps: [...folder.maps, duplicated]
        };
      })
    );

    if (duplicated) {
      setActiveMapId(duplicated.id);
      return duplicated;
    }
    return null;
  }, [setFolders]);

  const moveMapToFolder = useCallback((mapId, targetFolderId) => {
    setFolders((prev) => {
      let mapToMove = null;
      // Remove from current folder
      const cleaned = prev.map((f) => {
        const m = f.maps.find((map) => map.id === mapId);
        if (m) mapToMove = m;
        return {
          ...f,
          maps: f.maps.filter((map) => map.id !== mapId)
        };
      });

      if (!mapToMove) return prev;

      // Add to target folder
      return cleaned.map((f) =>
        f.id === targetFolderId
          ? { ...f, isOpen: true, maps: [...f.maps, mapToMove] }
          : f
      );
    });
  }, [setFolders]);

  const deleteMap = useCallback((mapId) => {
    const totalMaps = folders.reduce((acc, f) => acc + f.maps.length, 0);
    if (totalMaps <= 1) {
      return { success: false, reason: 'Cannot delete the last remaining mind map.' };
    }

    let nextMapId = activeMapId;
    const remainingFolders = folders.map((f) => {
      const filtered = f.maps.filter((m) => m.id !== mapId);
      if (filtered.length !== f.maps.length && activeMapId === mapId) {
        const sibling = filtered[0] || folders.flatMap((pf) => pf.maps).find((m) => m.id !== mapId);
        if (sibling) nextMapId = sibling.id;
      }
      return { ...f, maps: filtered };
    });

    setFolders(remainingFolders);
    setActiveMapId(nextMapId);
    return { success: true };
  }, [folders, activeMapId, setFolders]);

  const importMapJSON = useCallback((importedData) => {
    if (!importedData.nodes || !Array.isArray(importedData.nodes)) {
      throw new Error('Invalid mind map JSON: missing nodes array.');
    }
    const newMapId = 'map_' + Date.now();
    const newMap = {
      id: newMapId,
      title: importedData.title || 'Imported Mind Map',
      layoutMode: importedData.layoutMode || 'tree-lr',
      crossLinks: importedData.crossLinks || [],
      nodes: importedData.nodes
    };
    setFolders((prev) => {
      const targetFolderId = prev[0]?.id;
      return prev.map((f) =>
        f.id === targetFolderId ? { ...f, isOpen: true, maps: [...f.maps, newMap] } : f
      );
    });
    setActiveMapId(newMapId);
    return newMap;
  }, [setFolders]);

  const resetToDefaults = useCallback(() => {
    setFolders(INITIAL_WORKSPACES);
    setActiveMapId(INITIAL_WORKSPACES[0].maps[0].id);
  }, [setFolders]);

  return {
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
  };
}
