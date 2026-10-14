import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  FileText,
  Link as LinkIcon,
  CheckSquare,
  AlertCircle,
  Network,
  Trash2,
  ExternalLink,
  Edit3,
  Plus
} from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants';

export default function NodeDetailDrawer({
  node,
  allNodes,
  crossLinks = [],
  onClose,
  onUpdateNode,
  onAddCrossLink,
  onDeleteCrossLink,
  onDeleteNode
}) {
  const [activeTab, setActiveTab] = useState('write');
  const [crossLinkTargetId, setCrossLinkTargetId] = useState('');
  const [crossLinkLabel, setCrossLinkLabel] = useState('depends on');

  if (!node) return null;

  const otherNodes = (allNodes || []).filter(n => n.id !== node.id);
  const nodeCrossLinks = (crossLinks || []).filter(
    cl => cl.sourceId === node.id || cl.targetId === node.id
  );

  const handleCreateCrossLink = (e) => {
    e.preventDefault();
    if (!crossLinkTargetId) return;
    onAddCrossLink(node.id, crossLinkTargetId, crossLinkLabel.trim() || 'relates to');
    setCrossLinkTargetId('');
  };

  return (
    <aside className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col z-40 shadow-2xl shrink-0 overflow-hidden select-text animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 font-bold text-xs">
            {node.parentId === null ? 'ROOT' : 'NODE'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-none">Node Details</h3>
            <span className="text-[10px] text-slate-400 font-mono">ID: {node.id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          title="Close Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Title / Text Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            Title
          </label>
          <input
            type="text"
            value={node.text || ''}
            onChange={(e) => onUpdateNode(node.id, { text: e.target.value })}
            placeholder="Node concept title..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              Status
            </label>
            <select
              value={node.status || 'none'}
              onChange={(e) => onUpdateNode(node.id, { status: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              Priority
            </label>
            <select
              value={node.priority || 'none'}
              onChange={(e) => onUpdateNode(node.id, { priority: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* External Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              Reference Link
            </span>
            {node.linkUrl && (
              <a
                href={node.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </label>
          <input
            type="url"
            value={node.linkUrl || ''}
            onChange={(e) => onUpdateNode(node.id, { linkUrl: e.target.value })}
            placeholder="https://github.com/... or Figma link"
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Markdown Documentation Notes */}
        <div className="flex flex-col gap-1.5 flex-1 min-h-[180px]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Documentation Notes
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  activeTab === 'write' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            <textarea
              value={node.notes || ''}
              onChange={(e) => onUpdateNode(node.id, { notes: e.target.value })}
              placeholder="Add rich markdown notes, architectural decisions, code snippets or specifications here..."
              rows={8}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-indigo-500 focus:bg-white transition resize-none leading-relaxed"
            />
          ) : (
            <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 max-h-[220px] overflow-y-auto prose prose-slate prose-xs leading-relaxed">
              {node.notes ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {node.notes}
                </ReactMarkdown>
              ) : (
                <span className="text-slate-400 italic">No notes added yet. Switch to Write to add documentation.</span>
              )}
            </div>
          )}
        </div>

        {/* Cross-Link Association Connectors */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-indigo-500" />
            Cross-Link Associations
          </label>

          {/* List of active cross-links */}
          {nodeCrossLinks.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {nodeCrossLinks.map((cl) => {
                const isSource = cl.sourceId === node.id;
                const otherId = isSource ? cl.targetId : cl.sourceId;
                const other = allNodes.find(n => n.id === otherId);
                return (
                  <div key={cl.id} className="flex items-center justify-between px-2.5 py-1.5 bg-indigo-50/60 border border-indigo-200/80 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-indigo-950 truncate">{other?.text || otherId}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                        {cl.label || 'linked'}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteCrossLink(cl.id)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                      title="Remove link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new cross link form */}
          {otherNodes.length > 0 && (
            <form onSubmit={handleCreateCrossLink} className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                <select
                  value={crossLinkTargetId}
                  onChange={(e) => setCrossLinkTargetId(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="">Select target node...</option>
                  {otherNodes.map((n) => (
                    <option key={n.id} value={n.id}>{n.text || n.id}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={crossLinkLabel}
                  onChange={(e) => setCrossLinkLabel(e.target.value)}
                  placeholder="Label..."
                  className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!crossLinkTargetId}
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Nodes</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <button
          onClick={() => onDeleteNode(node.id)}
          disabled={node.parentId === null}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-40 text-xs font-semibold border border-rose-200 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          Done
        </button>
      </div>
    </aside>
  );
}
