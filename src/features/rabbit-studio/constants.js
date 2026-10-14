// Day-Mode Color Palette for Nodes
export const PALETTE = [
  { name: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-950', swatch: 'bg-indigo-500', stroke: '#6366f1', hex: '#6366f1' },
  { name: 'Emerald', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-950', swatch: 'bg-emerald-500', stroke: '#10b981', hex: '#10b981' },
  { name: 'Rose', bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-950', swatch: 'bg-rose-500', stroke: '#f43f5e', hex: '#f43f5e' },
  { name: 'Amber', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-950', swatch: 'bg-amber-500', stroke: '#f59e0b', hex: '#f59e0b' },
  { name: 'Cyan', bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-950', swatch: 'bg-cyan-500', stroke: '#06b6d4', hex: '#06b6d4' },
  { name: 'Purple', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-950', swatch: 'bg-purple-500', stroke: '#a855f7', hex: '#a855f7' },
  { name: 'Slate', bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-900', swatch: 'bg-slate-600', stroke: '#64748b', hex: '#64748b' },
];

export const STATUS_OPTIONS = [
  { id: 'none', label: 'No Status', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { id: 'todo', label: 'To Do', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  { id: 'done', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
];

export const PRIORITY_OPTIONS = [
  { id: 'none', label: 'No Priority', color: 'text-slate-400' },
  { id: 'P0', label: 'P0 Urgent', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'P1', label: 'P1 High', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'P2', label: 'P2 Normal', color: 'bg-blue-100 text-blue-700 border-blue-300' },
];

export const LAYOUT_MODES = [
  { id: 'tree-lr', label: 'Tree (Left → Right)' },
  { id: 'radial', label: 'Radial (Bi-Directional)' },
  { id: 'org-td', label: 'Org Chart (Top → Down)' },
];

export const INITIAL_WORKSPACES = [
  {
    id: 'folder_engineering',
    name: 'Engineering',
    isOpen: true,
    maps: [
      {
        id: 'map_arch',
        title: 'System Architecture',
        layoutMode: 'tree-lr',
        crossLinks: [
          { id: 'cl_1', sourceId: 'n1', targetId: 'n2', label: 'REST / GraphQL' }
        ],
        nodes: [
          {
            id: 'root',
            text: 'System Architecture',
            x: 150,
            y: 300,
            parentId: null,
            colorIdx: 0,
            status: 'in_progress',
            priority: 'P0',
            notes: 'High-level cloud topology and service communication boundaries.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'n1',
            text: 'Frontend (React & Vite)',
            x: 480,
            y: 160,
            parentId: 'root',
            colorIdx: 4,
            status: 'done',
            priority: 'P1',
            notes: 'Client SPA with Three.js graphics and responsive layout.',
            linkUrl: 'https://github.com/sdenaveenkumar/Portfolio',
            isCollapsed: false
          },
          {
            id: 'n2',
            text: 'Backend (Node & Express)',
            x: 480,
            y: 300,
            parentId: 'root',
            colorIdx: 1,
            status: 'in_progress',
            priority: 'P0',
            notes: 'High-throughput microservices deployed on VPS with auto-scaling.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'n3',
            text: 'Database (PostgreSQL & Redis)',
            x: 480,
            y: 440,
            parentId: 'root',
            colorIdx: 3,
            status: 'todo',
            priority: 'P1',
            notes: 'Primary persistence layer with Redis in-memory cache.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'n4',
            text: 'State Management (Zustand)',
            x: 800,
            y: 110,
            parentId: 'n1',
            colorIdx: 4,
            status: 'done',
            priority: 'P2',
            notes: '',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'n5',
            text: 'Canvas & Animation (GSAP)',
            x: 800,
            y: 210,
            parentId: 'n1',
            colorIdx: 4,
            status: 'done',
            priority: 'P1',
            notes: '',
            linkUrl: '',
            isCollapsed: false
          }
        ]
      }
    ]
  },
  {
    id: 'folder_ideas',
    name: 'Product Ideas',
    isOpen: true,
    maps: [
      {
        id: 'map_saas',
        title: 'AI SaaS Launch',
        layoutMode: 'radial',
        crossLinks: [],
        nodes: [
          {
            id: 'root',
            text: 'AI SaaS Product',
            x: 500,
            y: 350,
            parentId: null,
            colorIdx: 1,
            status: 'in_progress',
            priority: 'P0',
            notes: 'B2B Workflow Automation platform powered by open source LLMs.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'i1',
            text: 'Target Audience',
            x: 820,
            y: 240,
            parentId: 'root',
            colorIdx: 2,
            status: 'done',
            priority: 'P1',
            notes: 'Tech founders, agencies, and full-stack developers.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'i2',
            text: 'Pricing & Monetization',
            x: 820,
            y: 460,
            parentId: 'root',
            colorIdx: 3,
            status: 'todo',
            priority: 'P0',
            notes: 'Freemium tier + $29/mo Pro tier with usage limits.',
            linkUrl: '',
            isCollapsed: false
          },
          {
            id: 'i3',
            text: 'Core Differentiators',
            x: 180,
            y: 350,
            parentId: 'root',
            colorIdx: 0,
            status: 'in_progress',
            priority: 'P1',
            notes: 'Self-hostable, zero vendor lock-in, and local offline execution.',
            linkUrl: '',
            isCollapsed: false
          }
        ]
      }
    ]
  }
];
