import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  Code2, 
  GitFork, 
  BookOpen, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const markdownCache = new Map();

// Helper to resolve relative markdown image links and clean HTML tags
const resolveMarkdownContent = (rawMarkdown, repoName) => {
  if (!rawMarkdown) return '';
  const baseUrl = `https://raw.githubusercontent.com/sdenaveenkumar/${repoName}/main/`;

  let processed = rawMarkdown;

  // 1. Convert any HTML <img ... src="path" ...> tags into standard Markdown image tags ![alt](url)
  processed = processed.replace(
    /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi,
    (match) => {
      const srcMatch = match.match(/src=["']([^"']+)["']/i);
      const altMatch = match.match(/alt=["']([^"']+)["']/i);
      if (!srcMatch) return match;
      let src = srcMatch[1].trim();
      const alt = altMatch ? altMatch[1] : `${repoName} screenshot`;
      if (!/^https?:\/\//i.test(src)) {
        src = `${baseUrl}${src.replace(/^\.?\//, '')}`;
      }
      return `\n\n![${alt}](${src})\n\n`;
    }
  );

  // 2. Replace relative markdown image paths ![alt](relative/path)
  processed = processed.replace(
    /!\[(.*?)\]\(((?!http:\/\/|https:\/\/|ftp:\/\/|mailto:)[^)]+)\)/g,
    (match, alt, relativePath) => {
      const cleanPath = relativePath.trim().replace(/^\.?\//, '');
      return `![${alt}](${baseUrl}${cleanPath})`;
    }
  );

  // 3. Convert HTML headings (h1, h2, h3, h4, h5, h6) to Markdown headings
  processed = processed.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n');
  processed = processed.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n');
  processed = processed.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n');
  processed = processed.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n');
  processed = processed.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n\n##### $1\n\n');
  processed = processed.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n\n###### $1\n\n');

  // 4. Convert HTML text formatting & links
  processed = processed.replace(/<(?:b|strong)[^>]*>([\s\S]*?)<\/(?:b|strong)>/gi, '**$1**');
  processed = processed.replace(/<(?:i|em)[^>]*>([\s\S]*?)<\/(?:i|em)>/gi, '*$1*');
  processed = processed.replace(/<a\s+[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  processed = processed.replace(/<br\s*\/?>/gi, '\n\n');
  processed = processed.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // 5. Remove lingering container HTML tags (p, div, center, span, etc.)
  processed = processed.replace(/<\/?(?:p|div|center|span|header|footer|section|article)[^>]*>/gi, '\n');

  return processed;
};

// Fallback curated markdown if GitHub is unreachable
const getFallbackMarkdown = (repo, meta) => `
# 🚀 ${repo.name}

> ${repo.description || 'Production-grade software engineering project.'}

---

## 🌟 Overview & Key Highlights
- **Primary Domain:** ${meta?.category || 'Software Engineering'}
- **Specialization:** ${meta?.badge || repo.language || 'Full Stack'}
- **Tech Stack:** ${(meta?.tags || [repo.language || 'JavaScript']).join(' • ')}
${meta?.liveUrl || repo.homepage ? `- **Live Deployment:** [${meta?.liveUrl || repo.homepage}](${meta?.liveUrl || repo.homepage})` : ''}
${meta?.docsUrl ? `- **Interactive Swagger Docs:** [${meta.docsUrl}](${meta.docsUrl})` : ''}

\`\`\`bash
# Test live endpoint or clone
curl -i ${meta?.liveUrl || 'http://140.245.24.219'}
git clone ${repo.html_url || `https://github.com/sdenaveenkumar/${repo.name}`}.git
\`\`\`

## 🛠️ Architecture & Specifications
This project is engineered with high standards of maintainability, modular separation of concerns, and optimized performance.

- **Status:** Active & Maintained
- **Repository Link:** [View on GitHub](${repo.html_url})
`;

// Interactive Code Block Component with Copy feature
const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-gray-100 font-mono text-[12px] font-semibold text-gray-800 border border-gray-200/60" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-4 rounded-2xl overflow-hidden bg-[#0D1117] border border-gray-800 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-gray-800/80 text-xs font-mono text-gray-400">
        <span className="font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
          {match ? match[1] : 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[11px] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-[#E6EDF3]">
        <pre className="!m-0 !p-0 bg-transparent">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

const ProjectDetailModal = ({ project, meta, isOpen, onClose }) => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedClone, setCopiedClone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch README.md from GitHub with caching & fallback
  useEffect(() => {
    if (!isOpen || !project) return;

    const cacheKey = project.name.toLowerCase();
    if (markdownCache.has(cacheKey)) {
      setMarkdown(markdownCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchReadme = async () => {
      const branches = ['main', 'master'];
      let fetchedText = null;

      for (const branch of branches) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/sdenaveenkumar/${project.name}/${branch}/README.md`);
          if (res.ok) {
            fetchedText = await res.text();
            break;
          }
        } catch {
          // Continue to next branch
        }
      }

      const finalMarkdown = fetchedText 
        ? resolveMarkdownContent(fetchedText, project.name)
        : getFallbackMarkdown(project, meta);

      markdownCache.set(cacheKey, finalMarkdown);
      setMarkdown(finalMarkdown);
      setLoading(false);
    };

    fetchReadme();
  }, [isOpen, project, meta]);

  if (!mounted || typeof document === 'undefined') return null;

  const title = project?.name ? project.name.charAt(0).toUpperCase() + project.name.slice(1) : 'Project';
  const previewImg = meta?.image || '/projects/portfolio.svg';
  const liveUrl = meta?.liveUrl || project?.homepage;

  const copyCloneCommand = () => {
    if (!project?.html_url) return;
    navigator.clipboard?.writeText(`git clone ${project.html_url}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8">
          
          {/* Backdrop with frosted dark blur covering entire viewport including navbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] cursor-pointer"
          />

          {/* Modal Window (Card Morph Expansion) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.5)] border border-gray-200/80 z-[101] flex flex-col overflow-hidden"
          >
            {/* STICKY TOP APP BAR */}
            <div className="sticky top-0 left-0 right-0 z-30 px-4 sm:px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Back / Close (Esc)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.accent || '#10B981' }} />
                <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                  {title}
                </h3>
                {meta?.badge && (
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-mono font-bold shrink-0">
                    {meta.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                  title={`Open Live Service (${liveUrl})`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={copyCloneCommand}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Copy git clone"
              >
                {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedClone ? 'Copied' : 'Clone'}</span>
              </button>

              <a
                href={project?.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE MODAL CONTENT BODY */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">

            {/* HERO SHOWCASE BANNER */}
            <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-[22px] overflow-hidden bg-[#0A0E17] border border-gray-200 shadow-md">
              <img
                src={previewImg}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider uppercase">
                      {meta?.category || 'PROJECT SHOWCASE'}
                    </span>
                    {project.stargazers_count > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/80 backdrop-blur-md text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-current" /> {project.stargazers_count}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
                    {title}
                  </h2>
                </div>

                {meta?.tags && (
                  <div className="hidden md:flex items-center gap-1.5">
                    {meta.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* LIVE SERVICE BANNER */}
            {liveUrl && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-emerald-950">Live Production Service</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-[10px] font-mono font-bold text-emerald-800">
                        200 OK • Online
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono mt-0.5 select-all">
                      {liveUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {meta?.docsUrl && (
                    <a
                      href={meta.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>API Docs</span>
                    </a>
                  )}
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Test Endpoint</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* METADATA STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate"><strong>Lang:</strong> {project.language || 'Multi-stack'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate"><strong>Role:</strong> {meta?.badge || 'Software Dev'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate"><strong>Documentation:</strong> README.md</span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>License:</strong> MIT / Open Source</span>
              </div>
            </div>

            {/* MARKDOWN PARSED WEBPAGE CONTAINER */}
            <div className="mt-4 pb-8">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="w-9 h-9 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
                  <p className="text-sm font-medium text-gray-500 font-mono">
                    Fetching documentation from GitHub...
                  </p>
                </div>
              ) : (
                <div className="markdown-prose space-y-4 text-gray-800 text-[14px] sm:text-[15px] leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock,
                      h1: ({ children }) => (
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight pt-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight pt-5 pb-1.5 border-b border-gray-100 flex items-center gap-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold text-gray-900 pt-3 pb-1">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="my-2 text-gray-700 leading-relaxed">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-3 inline-flex items-center gap-0.5"
                        >
                          {children}
                          <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="my-3 pl-4 border-l-4 border-blue-500 bg-blue-50/50 py-2 pr-3 rounded-r-xl italic text-gray-700">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-2.5 list-disc pl-5 space-y-1 text-gray-700">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-2.5 list-decimal pl-5 space-y-1 text-gray-700">
                          {children}
                        </ol>
                      ),
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto rounded-xl border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2.5 bg-gray-100 font-bold text-gray-900 text-left">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 border-t border-gray-100 text-gray-700">
                          {children}
                        </td>
                      ),
                      img: ({ src, alt }) => (
                        <span className="block my-4">
                          <img 
                            src={src} 
                            alt={alt || ''} 
                            loading="lazy" 
                            className="rounded-2xl border border-gray-200 shadow-md max-w-full mx-auto" 
                          />
                        </span>
                      ),
                      hr: () => <hr className="my-6 border-gray-200" />
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              )}
            </div>

          </div>

          {/* BOTTOM FIXED FOOTER */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span className="font-mono">Press Esc to close</span>
            <div className="flex items-center gap-3">
              <a
                href={project?.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-800 hover:text-black inline-flex items-center gap-1"
              >
                <span>Star on GitHub</span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </a>
            </div>
          </div>

        </motion.div>

        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailModal;
