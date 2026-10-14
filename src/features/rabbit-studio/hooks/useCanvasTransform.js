import { useState, useRef, useCallback } from 'react';

export function useCanvasTransform() {
  const containerRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(2.4, +(z + 0.15).toFixed(2)));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.3, +(z - 0.15).toFixed(2)));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const centerOnNode = useCallback((x, y, targetZoom = 1.05) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPanX = rect.width / 2 - (x + 90) * targetZoom;
    const newPanY = rect.height / 2 - (y + 24) * targetZoom;
    setZoom(targetZoom);
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  }, []);

  const fitView = useCallback((nodes = []) => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + 180);
      maxY = Math.max(maxY, n.y + 48);
    });

    const contentWidth = maxX - minX + 160;
    const contentHeight = maxY - minY + 160;
    const scaleX = rect.width / contentWidth;
    const scaleY = rect.height / contentHeight;
    const fitScale = Math.min(1.4, Math.max(0.4, Math.min(scaleX, scaleY)));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const newPanX = rect.width / 2 - centerX * fitScale;
    const newPanY = rect.height / 2 - centerY * fitScale;

    setZoom(+fitScale.toFixed(2));
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.min(2.4, Math.max(0.3, +(z + delta).toFixed(2))));
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  return {
    containerRef,
    pan,
    setPan,
    zoom,
    setZoom,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    zoomIn,
    zoomOut,
    resetZoom,
    centerOnNode,
    fitView,
    handleWheel
  };
}
