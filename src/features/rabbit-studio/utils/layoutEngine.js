/**
 * Mindmap Layout Engine
 * Supports:
 * 1. Horizontal Left-to-Right ('tree-lr')
 * 2. Radial / Bi-directional ('radial')
 * 3. Top-Down Org Chart ('org-td')
 */

export function calculateLayout(nodes, mode = 'tree-lr') {
  if (!nodes || nodes.length === 0) return {};

  const root = nodes.find((n) => n.parentId === null) || nodes[0];
  if (!root) return {};

  const childrenMap = {};
  nodes.forEach((n) => {
    if (n.parentId) {
      if (!childrenMap[n.parentId]) childrenMap[n.parentId] = [];
      childrenMap[n.parentId].push(n.id);
    }
  });

  const getSubtreeWeight = (id) => {
    const ch = childrenMap[id] || [];
    if (ch.length === 0) return 1;
    return ch.reduce((acc, cId) => acc + getSubtreeWeight(cId), 0);
  };

  const newPositions = {};

  if (mode === 'org-td') {
    // Top-to-Down Org Chart
    const LEVEL_GAP_Y = 160;
    const SIBLING_GAP_X = 220;

    const assignCoordsTopDown = (id, depth, startX) => {
      const ch = childrenMap[id] || [];
      const weight = getSubtreeWeight(id);
      const totalWidth = weight * SIBLING_GAP_X;

      newPositions[id] = {
        x: Math.round(startX + totalWidth / 2 - 100),
        y: Math.round(100 + depth * LEVEL_GAP_Y)
      };

      let currentX = startX;
      ch.forEach((cId) => {
        const cWeight = getSubtreeWeight(cId);
        assignCoordsTopDown(cId, depth + 1, currentX);
        currentX += cWeight * SIBLING_GAP_X;
      });
    };

    const totalWeight = getSubtreeWeight(root.id);
    const initialX = Math.max(100, 600 - (totalWeight * SIBLING_GAP_X) / 2);
    assignCoordsTopDown(root.id, 0, initialX);
    return newPositions;
  }

  if (mode === 'radial') {
    // Bi-directional Mindmap: Root in center, split depth-1 children Left vs Right
    const LEVEL_GAP_X = 300;
    const SIBLING_GAP_Y = 95;
    const rootX = 600;
    const rootY = 360;

    newPositions[root.id] = { x: rootX, y: rootY };

    const directChildren = childrenMap[root.id] || [];
    const rightChildren = directChildren.filter((_, idx) => idx % 2 === 0);
    const leftChildren = directChildren.filter((_, idx) => idx % 2 === 1);

    // Layout Right Subtrees (+X)
    const assignCoordsRight = (id, depth, startY) => {
      const ch = childrenMap[id] || [];
      const weight = getSubtreeWeight(id);
      const totalHeight = weight * SIBLING_GAP_Y;

      newPositions[id] = {
        x: Math.round(rootX + depth * LEVEL_GAP_X),
        y: Math.round(startY + totalHeight / 2)
      };

      let currentY = startY;
      ch.forEach((cId) => {
        const cWeight = getSubtreeWeight(cId);
        assignCoordsRight(cId, depth + 1, currentY);
        currentY += cWeight * SIBLING_GAP_Y;
      });
    };

    // Layout Left Subtrees (-X)
    const assignCoordsLeft = (id, depth, startY) => {
      const ch = childrenMap[id] || [];
      const weight = getSubtreeWeight(id);
      const totalHeight = weight * SIBLING_GAP_Y;

      newPositions[id] = {
        x: Math.round(rootX - depth * LEVEL_GAP_X),
        y: Math.round(startY + totalHeight / 2)
      };

      let currentY = startY;
      ch.forEach((cId) => {
        const cWeight = getSubtreeWeight(cId);
        assignCoordsLeft(cId, depth + 1, currentY);
        currentY += cWeight * SIBLING_GAP_Y;
      });
    };

    const rightWeight = rightChildren.reduce((acc, cId) => acc + getSubtreeWeight(cId), 0);
    let currentRightY = rootY - (rightWeight * SIBLING_GAP_Y) / 2;
    rightChildren.forEach((cId) => {
      const cWeight = getSubtreeWeight(cId);
      assignCoordsRight(cId, 1, currentRightY);
      currentRightY += cWeight * SIBLING_GAP_Y;
    });

    const leftWeight = leftChildren.reduce((acc, cId) => acc + getSubtreeWeight(cId), 0);
    let currentLeftY = rootY - (leftWeight * SIBLING_GAP_Y) / 2;
    leftChildren.forEach((cId) => {
      const cWeight = getSubtreeWeight(cId);
      assignCoordsLeft(cId, 1, currentLeftY);
      currentLeftY += cWeight * SIBLING_GAP_Y;
    });

    return newPositions;
  }

  // Default: 'tree-lr' Horizontal Left-to-Right
  const LEVEL_GAP_X = 290;
  const SIBLING_GAP_Y = 95;

  const assignCoordsLR = (id, depth, startY) => {
    const ch = childrenMap[id] || [];
    const weight = getSubtreeWeight(id);
    const totalHeight = weight * SIBLING_GAP_Y;

    newPositions[id] = {
      x: Math.round(150 + depth * LEVEL_GAP_X),
      y: Math.round(startY + totalHeight / 2),
    };

    let currentY = startY;
    ch.forEach((cId) => {
      const cWeight = getSubtreeWeight(cId);
      assignCoordsLR(cId, depth + 1, currentY);
      currentY += cWeight * SIBLING_GAP_Y;
    });
  };

  const totalWeight = getSubtreeWeight(root.id);
  const initialY = Math.max(80, 350 - (totalWeight * SIBLING_GAP_Y) / 2);
  assignCoordsLR(root.id, 0, initialY);

  return newPositions;
}
