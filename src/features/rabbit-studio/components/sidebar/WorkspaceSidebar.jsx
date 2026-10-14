import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  Plus,
  Trash2,
  Edit2,
  Map as MapIcon,
  ChevronRight,
  ChevronDown,
  Copy,
  MoveRight,
  RotateCcw,
  Search,
  X,
  Check,
  FolderOpen
} from 'lucide-react';

export default function WorkspaceSidebar({
  isOpen,
  onToggleOpen,
  folders = [],
  activeMapId,
  onSelectMap,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onToggleFolderOpen,
  onCreateMapInFolder,
  onRenameMap,
  onDuplicateMap,
  onMoveMapToFolder,
  onDeleteMap,
  onResetDefaults
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingMapId, setEditingMapId] = useState(null);
  const [editingMapTitle, setEditingMapTitle] = useState('');
  const [movingMapId, setMovingMapId] = useState(null);

  const moveMenuRef = useRef(null);

  // Close moving menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (moveMenuRef.current && !moveMenuRef.current.contains(e.target)) {
        setMovingMapId(null);
      }
    };
    if (movingMapId) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [movingMapId]);

  const handleStartRenameFolder = (folder, e) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleSaveRenameFolder = (folderId, e) => {
    e.stopPropagation();
    if (editingFolderName.trim()) {
      onRenameFolder(folderId, editingFolderName.trim());
    }
    setEditingFolderId(null);
  };

  const handleStartRenameMap = (map, e) => {
    e.stopPropagation();
    setEditingMapId(map.id);
    setEditingMapTitle(map.title);
  };

  const handleSaveRenameMap = (mapId, e) => {
    e.stopPropagation();
    if (editingMapTitle.trim()) {
      onRenameMap(mapId, editingMapTitle.trim());
    }
    setEditingMapId(null);
  };

  const handleDeleteFolderClick = (folder, e) => {
    e.stopPropagation();
    if (folders.length <= 1) {
      return;
    }
    onDeleteFolder(folder.id);
  };

  const handleAddMap = (folderId, e) => {
    if (e) e.stopPropagation();
    const newMap = onCreateMapInFolder(folderId, 'New Mindmap');
    if (newMap) {
      setEditingMapId(newMap.id);
      setEditingMapTitle(newMap.title);
    }
  };

  const handleCreateFolder = () => {
    const newFolder = onCreateFolder('New Folder');
    if (newFolder) {
      setEditingFolderId(newFolder.id);
      setEditingFolderName(newFolder.name);
    }
  };

  // Filtered folders by search query
  const filteredFolders = folders.map((folder) => {
    if (!searchQuery.trim()) return folder;
    const query = searchQuery.toLowerCase();
    const folderMatches = folder.name.toLowerCase().includes(query);
    const matchingMaps = folder.maps.filter((m) =>
      m.title.toLowerCase().includes(query)
    );
    if (folderMatches) return folder;
    if (matchingMaps.length > 0) {
      return { ...folder, isOpen: true, maps: matchingMaps };
    }
    return null;
  }).filter(Boolean);

  const totalMapsCount = folders.reduce((acc, f) => acc + f.maps.length, 0);

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        title="Open Workspace Sidebar"
        className="absolute left-3 top-3 z-30 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md hover:bg-slate-50 text-slate-700 transition"
      >
        <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
      </button>
    );
  }

  return (
    <aside className="w-72 bg-white/95 backdrop-blur-md border-r border-slate-200/90 flex flex-col h-full shadow-lg z-20 shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center">
            <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Workspaces</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {folders.length} {folders.length === 1 ? 'folder' : 'folders'} • {totalMapsCount} maps
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateFolder}
            title="Create New Folder"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-semibold"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleOpen}
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2 border-b border-slate-100">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-700 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Folders & Maps List */}
      <div className="p-2 flex-1 overflow-y-auto flex flex-col gap-2">
        {filteredFolders.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No matching workspaces found
          </div>
        ) : (
          filteredFolders.map((folder) => {
            const isEditingFolder = editingFolderId === folder.id;
            return (
              <div key={folder.id} className="flex flex-col gap-1">
                {/* Folder Row */}
                <div
                  onClick={() => onToggleFolderOpen(folder.id)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/90 cursor-pointer text-xs font-semibold text-slate-700 group transition"
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFolderOpen(folder.id);
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
                    >
                      {folder.isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {folder.isOpen ? (
                      <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500/20" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500/20" />
                    )}

                    {isEditingFolder ? (
                      <div
                        className="flex items-center gap-1 flex-1 min-w-0"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          autoFocus
                          value={editingFolderName}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onBlur={(e) => handleSaveRenameFolder(folder.id, e)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Enter') handleSaveRenameFolder(folder.id, e);
                            if (e.key === 'Escape') {
                              e.stopPropagation();
                              setEditingFolderId(null);
                            }
                          }}
                          className="px-1.5 py-0.5 text-xs bg-white border border-indigo-400 rounded outline-none w-full text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleSaveRenameFolder(folder.id, e)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(null);
                          }}
                          className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                  </div>

                  {/* Folder Actions */}
                  {!isEditingFolder && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <span className="text-[10px] text-slate-400 px-1 font-mono">
                        {folder.maps.length}
                      </span>
                      <button
                        onClick={(e) => handleAddMap(folder.id, e)}
                        title="Add Mind Map here"
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleStartRenameFolder(folder, e)}
                        title="Rename Folder"
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {folders.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteFolderClick(folder, e)}
                          title="Delete Folder"
                          className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-items (Mind Maps inside folder) */}
                {folder.isOpen && (
                  <div className="pl-4 pr-1 flex flex-col gap-1 border-l-2 border-slate-200/80 ml-3.5 my-0.5">
                    {folder.maps.length === 0 ? (
                      /* Empty folder state */
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center my-1">
                        <p className="text-[11px] text-slate-400 mb-1.5 font-medium">No mind maps yet</p>
                        <button
                          onClick={() => handleAddMap(folder.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition flex items-center justify-center gap-1 mx-auto"
                        >
                          <Plus className="w-3 h-3" />
                          New Mind Map
                        </button>
                      </div>
                    ) : (
                      folder.maps.map((map) => {
                        const isActive = map.id === activeMapId;
                        const isEditingMap = editingMapId === map.id;
                        const isMoving = movingMapId === map.id;

                        return (
                          <div
                            key={map.id}
                            onClick={() => onSelectMap(map.id)}
                            className={`group relative flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                              <MapIcon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isActive ? 'text-indigo-200' : 'text-slate-400'
                                }`}
                              />
                              {isEditingMap ? (
                                <div
                                  className="flex items-center gap-1 flex-1 min-w-0"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editingMapTitle}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setEditingMapTitle(e.target.value)}
                                    onBlur={(e) => handleSaveRenameMap(map.id, e)}
                                    onKeyDown={(e) => {
                                      e.stopPropagation();
                                      if (e.key === 'Enter') handleSaveRenameMap(map.id, e);
                                      if (e.key === 'Escape') {
                                        e.stopPropagation();
                                        setEditingMapId(null);
                                      }
                                    }}
                                    className="px-1.5 py-0.5 text-xs bg-white text-slate-800 border border-indigo-400 rounded outline-none w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => handleSaveRenameMap(map.id, e)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingMapId(null);
                                    }}
                                    className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <span className="truncate">{map.title}</span>
                              )}
                            </div>

                            {/* Map Actions */}
                            {!isEditingMap && (
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  onClick={(e) => handleStartRenameMap(map, e)}
                                  title="Rename Mind Map"
                                  className={`p-1 rounded ${
                                    isActive
                                      ? 'hover:bg-indigo-700 text-indigo-100'
                                      : 'hover:bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicateMap(map.id);
                                  }}
                                  title="Duplicate Mind Map"
                                  className={`p-1 rounded ${
                                    isActive
                                      ? 'hover:bg-indigo-700 text-indigo-100'
                                      : 'hover:bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                {folders.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMovingMapId(isMoving ? null : map.id);
                                    }}
                                    title="Move to another folder"
                                    className={`p-1 rounded ${
                                      isActive
                                        ? 'hover:bg-indigo-700 text-indigo-100'
                                        : 'hover:bg-slate-200 text-slate-500'
                                    }`}
                                  >
                                    <MoveRight className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteMap(map.id);
                                  }}
                                  title="Delete Mind Map"
                                  className={`p-1 rounded ${
                                    isActive
                                      ? 'hover:bg-rose-500 text-rose-100'
                                      : 'hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                                  }`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {/* Move to folder popover */}
                            {isMoving && (
                              <div
                                ref={moveMenuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 z-40 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-100"
                              >
                                <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Move to folder:
                                </p>
                                <div className="flex flex-col gap-0.5">
                                  {folders
                                    .filter((f) => f.id !== folder.id)
                                    .map((targetF) => (
                                      <button
                                        key={targetF.id}
                                        onClick={() => {
                                          onMoveMapToFolder(map.id, targetF.id);
                                          setMovingMapId(null);
                                        }}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-indigo-50 hover:text-indigo-600 text-left text-xs transition"
                                      >
                                        <Folder className="w-3 h-3 text-amber-500 shrink-0" />
                                        <span className="truncate">{targetF.name}</span>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
        <button
          onClick={onResetDefaults}
          title="Reset to default demo workspaces"
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
        <span className="text-[10px] text-slate-400 font-mono">Rabbit Studio</span>
      </div>
    </aside>
  );
}
