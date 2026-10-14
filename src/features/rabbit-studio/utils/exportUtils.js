import { PALETTE } from '../constants';

export function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch {}
  document.body.removeChild(textArea);
  return Promise.resolve();
}

export function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate Hierarchical Markdown representation
 */
export function generateMarkdown(currentMap) {
  const nodes = currentMap.nodes || [];
  const root = nodes.find((n) => n.parentId === null) || nodes[0];
  if (!root) return '';

  const buildTree = (parentId, depth = 0) => {
    const children = nodes.filter((n) => n.parentId === parentId);
    return children
      .map((c) => {
        const indent = '  '.repeat(depth);
        const statusTag = c.status && c.status !== 'none' ? ` [${c.status.toUpperCase()}]` : '';
        const priorityTag = c.priority && c.priority !== 'none' ? ` (${c.priority})` : '';
        const linkTag = c.linkUrl ? ` - [Link](${c.linkUrl})` : '';
        const noteBlock = c.notes ? `\n${indent}    > ${c.notes.replace(/\n/g, `\n${indent}    > `)}` : '';
        const sub = buildTree(c.id, depth + 1);
        return `${indent}- **${c.text || 'Untitled'}**${statusTag}${priorityTag}${linkTag}${noteBlock}${sub ? '\n' + sub : ''}`;
      })
      .join('\n');
  };

  return `# ${currentMap.title || 'MindMap'}\n\n- **${root.text || 'Root'}**\n${buildTree(root.id, 1)}`;
}

/**
 * Generate Mermaid.js flowchart syntax
 */
export function generateMermaid(currentMap) {
  const nodes = currentMap.nodes || [];
  const root = nodes.find((n) => n.parentId === null) || nodes[0];
  if (!root) return '';

  const sanitize = (str) => (str || '').replace(/["[\]()]/g, ' ').trim() || 'Node';

  let lines = ['graph LR'];
  nodes.forEach((n) => {
    if (n.parentId) {
      lines.push(`  ${n.parentId}["${sanitize(nodes.find(p => p.id === n.parentId)?.text)}"] --> ${n.id}["${sanitize(n.text)}"]`);
    }
  });

  // Cross links
  (currentMap.crossLinks || []).forEach((cl) => {
    const label = cl.label ? `|"${sanitize(cl.label)}"|` : '';
    lines.push(`  ${cl.sourceId} -.->${label} ${cl.targetId}`);
  });

  return lines.join('\n');
}

/**
 * Generate OPML (Standard Mindmap / Outliner format)
 */
export function generateOPML(currentMap) {
  const nodes = currentMap.nodes || [];
  const root = nodes.find((n) => n.parentId === null) || nodes[0];
  if (!root) return '';

  const escapeXml = (str) => (str || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  const buildXml = (parentId) => {
    const children = nodes.filter((n) => n.parentId === parentId);
    return children
      .map((c) => {
        const text = escapeXml(c.text || 'Untitled');
        const notes = c.notes ? ` _note="${escapeXml(c.notes)}"` : '';
        const sub = buildXml(c.id);
        if (sub) {
          return `<outline text="${text}"${notes}>${sub}</outline>`;
        }
        return `<outline text="${text}"${notes}/>`;
      })
      .join('');
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(currentMap.title || 'Rabbit Studio Mindmap')}</title>
  </head>
  <body>
    <outline text="${escapeXml(root.text || 'Root')}">
      ${buildXml(root.id)}
    </outline>
  </body>
</opml>`;
}

/**
 * Generate Vector SVG Snapshot
 */
export function generateSVG(currentMap, connections, crossLinkConnections) {
  const nodes = currentMap.nodes || [];
  if (nodes.length === 0) return '';

  // Calculate bounding box with padding
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + 200);
    maxY = Math.max(maxY, n.y + 100);
  });

  const pad = 80;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;
  const width = Math.max(400, maxX - minX);
  const height = Math.max(300, maxY - minY);

  const escapeXml = (str) => (str || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  let pathsSvg = connections.map(conn => 
    `<path d="${conn.path}" fill="none" stroke="${conn.color}" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>`
  ).join('\n    ');

  let crossPathsSvg = (crossLinkConnections || []).map(conn => 
    `<path d="${conn.path}" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>`
  ).join('\n    ');

  let nodesSvg = nodes.map(n => {
    const palette = PALETTE[n.colorIdx % PALETTE.length];
    const isRoot = n.parentId === null;
    const strokeColor = isRoot ? '#4f46e5' : palette.stroke;
    const textEscaped = escapeXml(n.text || 'Idea');
    return `
    <g transform="translate(${n.x}, ${n.y})">
      <rect width="180" height="48" rx="12" fill="#ffffff" stroke="${strokeColor}" stroke-width="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"/>
      <text x="14" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#0f172a">${textEscaped}</text>
    </g>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}" style="background-color: #f8fafc;">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="1.2" fill="#cbd5e1"/>
    </pattern>
  </defs>
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="url(#grid)" />
  <g id="connections">
    ${pathsSvg}
    ${crossPathsSvg}
  </g>
  <g id="nodes">
    ${nodesSvg}
  </g>
</svg>`;
}

/**
 * Export high-resolution PNG snapshot
 */
export function exportPNG(currentMap, connections, crossLinkConnections) {
  const svgString = generateSVG(currentMap, connections, crossLinkConnections);
  if (!svgString) return;

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    const scale = 2; // High-res retina scale
    const canvas = document.createElement('canvas');
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URLObj.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${(currentMap.title || 'mindmap').toLowerCase().replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URLObj.revokeObjectURL(pngUrl);
      URLObj.revokeObjectURL(blobURL);
    }, 'image/png');
  };
  image.src = blobURL;
}
