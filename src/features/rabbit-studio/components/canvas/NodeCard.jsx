import React from 'react';
import { FileText, Link as LinkIcon, Plus, Minus } from 'lucide-react';
import { PALETTE } from '../../constants';

export default function NodeCard({
  node,
  isSelected,
  isEditing,
  isReparentTarget,
  childrenCount = 0,
  editText,
  setEditText,
  commitEdit,
  onNodeMouseDown,
  onStartEdit,
  onCancelEdit,
  onToggleCollapse,
  onAddChild
}) {
  const palette = PALETTE[node.colorIdx % PALETTE.length];
  const isRoot = node.parentId === null;

  return (
    <div
      onMouseDown={(e) => onNodeMouseDown(e, node)}
      onDoubleClick={onStartEdit}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: '180px'
      }}
      className={`absolute top-0 left-0 pointer-events-auto rounded-xl p-3 cursor-pointer transition-all border-2 select-none ${
        palette.bg
      } ${
        isReparentTarget
          ? 'ring-4 ring-amber-400 border-amber-500 scale-105 shadow-xl'
          : isSelected
          ? 'ring-4 ring-indigo-500/25 border-indigo-600 scale-[1.02] shadow-lg'
          : `${palette.border} hover:border-slate-400 shadow-md`
      }`}
    >
      {/* Root Badge */}
      {isRoot && (
        <span className="absolute -top-2.5 left-3 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
          Root
        </span>
      )}

      {/* Badges: Priority, Status, Notes, Links */}
      <div className="flex items-center gap-1 mb-1">
        {node.status && node.status !== 'none' && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 uppercase">
            {node.status.replace('_', ' ')}
          </span>
        )}
        {node.priority && node.priority !== 'none' && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
              node.priority === 'high'
                ? 'bg-rose-100 text-rose-700'
                : node.priority === 'medium'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {node.priority}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          {node.linkUrl && (
            <a
              href={node.linkUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Open link: ${node.linkUrl}`}
              className="text-indigo-500 hover:text-indigo-700"
            >
              <LinkIcon className="w-3 h-3" />
            </a>
          )}
          {node.notes && (
            <span title="Contains documentation notes" className="text-slate-400">
              <FileText className="w-3 h-3 text-indigo-500" />
            </span>
          )}
        </div>
      </div>

      {/* Editable or Displayed Title */}
      {isEditing ? (
        <input
          autoFocus
          value={editText}
          placeholder="Node concept..."
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitEdit();
            } else if (e.key === 'Tab') {
              e.preventDefault();
              commitEdit();
              setTimeout(() => {
                onAddChild?.(node.id);
              }, 30);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onCancelEdit?.();
            }
          }}
          className="w-full bg-white text-slate-900 text-xs font-semibold p-1 rounded-lg outline-none border border-indigo-400 shadow-inner"
        />
      ) : (
        <div className="flex items-center justify-between gap-1">
          <span className={`text-xs font-semibold ${palette.text} break-words leading-snug`}>
            {node.text || <em className="text-slate-400 font-normal">New Idea...</em>}
          </span>
        </div>
      )}

      {/* Fold / Unfold Branch Button for Nodes with Children */}
      {childrenCount > 0 && (
        <button
          onClick={(e) => onToggleCollapse(node.id, e)}
          title={node.isCollapsed ? `Expand ${childrenCount} hidden nodes` : 'Collapse branch'}
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white border border-slate-300 text-[9px] font-mono font-bold text-slate-600 hover:bg-slate-100 shadow-xs flex items-center gap-0.5 cursor-pointer transition hover:scale-105"
        >
          {node.isCollapsed ? (
            <>
              <Plus className="w-2.5 h-2.5 text-indigo-600" />
              <span>{childrenCount}</span>
            </>
          ) : (
            <>
              <Minus className="w-2.5 h-2.5 text-slate-400" />
              <span>{childrenCount}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
