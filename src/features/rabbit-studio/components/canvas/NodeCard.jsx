import React from 'react';
import { FileText, Link as LinkIcon, Plus, Minus, Edit2, Check } from 'lucide-react';
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
  onNodeTouchStart,
  onStartEdit,
  onCancelEdit,
  onToggleCollapse,
  onAddChild
}) {
  const palette = PALETTE[node.colorIdx % PALETTE.length];
  const isRoot = node.parentId === null;

  return (
    <div
      data-node="true"
      onMouseDown={(e) => onNodeMouseDown?.(e, node)}
      onTouchStart={(e) => onNodeTouchStart?.(e, node)}
      onDoubleClick={onStartEdit}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: '180px'
      }}
      className={`absolute top-0 left-0 pointer-events-auto rounded-xl p-3 cursor-pointer transition-all border-2 select-none touch-manipulation ${
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

      {/* Badges: Priority, Status, Notes, Links, Mobile Edit */}
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
          {/* Quick Edit Icon Button when selected */}
          {isSelected && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit?.();
              }}
              title="Edit / Rename node"
              className="p-1 rounded-md bg-white/80 hover:bg-white text-indigo-600 shadow-2xs border border-indigo-200 transition cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
            </button>
          )}

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
        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={editText}
            placeholder="Node concept..."
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
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
            className="flex-1 bg-white text-slate-900 text-base sm:text-xs font-semibold p-1 rounded-lg outline-none border border-indigo-400 shadow-inner"
          />
          {/* Touch-Friendly Commit Checkmark Button */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              commitEdit();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              commitEdit();
            }}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shrink-0 cursor-pointer transition active:scale-95"
            title="Save (Enter)"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
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
          onTouchStart={(e) => {
            e.stopPropagation();
            onToggleCollapse(node.id, e);
          }}
          title={node.isCollapsed ? `Expand ${childrenCount} hidden nodes` : 'Collapse branch'}
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white border border-slate-300 text-[9px] font-mono font-bold text-slate-600 hover:bg-slate-100 shadow-xs flex items-center justify-center gap-0.5 cursor-pointer transition active:scale-110 min-w-[28px]"
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
