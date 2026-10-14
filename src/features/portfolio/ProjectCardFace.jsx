import React from 'react';

const formatTitle = (name = '') => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const ProjectCardFace = ({ repo, meta, className = '' }) => {
  if (!repo) return null;

  const categoryTag = meta?.category || 'SOFTWARE ENGINEERING';
  const badgeLabel = meta?.badge || repo.language || 'Code';
  const previewImg = meta?.image || '/projects/portfolio.svg';
  const formattedTitle = formatTitle(repo.name);
  const liveUrl = meta?.liveUrl || repo.homepage;

  return (
    <div
      className={`w-full h-full bg-white rounded-[22px] sm:rounded-[26px] md:rounded-[30px] border border-black/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] p-3 sm:p-3.5 md:p-5 flex flex-col justify-between relative overflow-hidden select-none ${className}`}
    >
      {/* TOP: IMAGE SHOWCASE VIEWPORT */}
      <div className="relative w-full aspect-[16/10] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-[#0F172A] border border-black/5 shadow-inner shrink-0">
        {/* Visual Image */}
        <img
          src={previewImg}
          alt={`${formattedTitle} — ${categoryTag || 'Engineering Project'} by Naveen Kumar`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-300 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Floating Category Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/20 shadow-xs z-10">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: meta?.accent || '#10B981' }}
          />
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-white uppercase truncate max-w-[130px] sm:max-w-[170px]">
            {categoryTag}
          </span>
        </div>

        {/* Live Badge if liveUrl exists */}
        {liveUrl && (
          <div
            className="absolute top-2.5 right-11 sm:right-12 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/85 border border-emerald-400/40 shadow-xs z-10"
            title={`Live Service: ${liveUrl}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-300">
              LIVE
            </span>
          </div>
        )}

        {/* External Link Action Arrow */}
        <div
          className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/75 border border-white/25 shadow-xs flex items-center justify-center text-white z-10"
          title={liveUrl ? "Open Live Deployment" : "View on GitHub"}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>

        {/* Inset Bottom Gradient for Contrast */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Badge in Bottom Right of Image */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/80 border border-white/15 text-[9px] font-mono font-bold text-white/90">
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* MIDDLE: PROJECT DETAILS */}
      <div className="my-auto py-2 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-base sm:text-lg md:text-[22px] font-black tracking-tight text-[#111827] group-hover:text-black transition-colors line-clamp-1">
            {formattedTitle}
          </h3>
          {repo.stargazers_count > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold text-amber-700 flex items-center gap-1 shrink-0">
              ★ {repo.stargazers_count}
            </span>
          )}
        </div>

        <p className="text-[11px] sm:text-xs md:text-[13px] text-gray-600 font-medium line-clamp-2 md:line-clamp-3 leading-relaxed">
          {repo.description || "Production-grade, extensible codebase with modular architecture and rigorous standards."}
        </p>

        {/* Mini snippet status row */}
        {meta?.snippet && (
          <div className="mt-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/70 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta?.accent || '#10B981' }} />
            <span className="font-mono text-[10px] sm:text-[11px] font-medium truncate">
              {meta.snippet}
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM: TECH PILLS & EXPLORE CTA */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {meta?.tags ? (
            meta.tags.slice(0, 3).map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-lg bg-gray-100/90 text-[10px] font-semibold text-gray-700">
                {t}
              </span>
            ))
          ) : (
            repo.language && (
              <span className="px-2 py-0.5 rounded-lg bg-gray-100/90 text-[10px] font-semibold text-gray-700">
                {repo.language}
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold text-gray-900 group-hover:text-black group-hover:translate-x-1 transition-all duration-200 shrink-0">
          <span>VIEW PROJECT</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardFace;
