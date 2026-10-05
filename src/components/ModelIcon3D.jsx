import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getModelInstance, MODEL_HOLO_CONFIG } from '../utils/modelLoader';

/**
 * Crystal-Clear 3D Icon Component with Layer "Explode" / Disassembly Depth.
 * Features:
 * - Spatial Layer Disassembly: Foreground letters/emblems levitate forward on hover with elastic spring physics.
 * - Magnetic Parallax: Cursor tracking creates true 3D spatial depth between foreground and background.
 * - Super-Sampled Anti-Aliasing (SSAA) for razor-sharp rendering on any zoom level.
 * - Precision Studio Three-Point Lighting with pure color reproduction.
 */
const ModelIcon3D = ({
  modelKey,
  className = 'w-full h-full',
  fallbackIcon,
  interactive = true,
  autoRotateSpeed = 0.8,
  glowColor,
  enableHoloRim = true,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Mouse tilt target and current lerp values
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const spinRef = useRef({ angle: 0, targetAngle: 0 });

  // Layer Explode Spring Physics state
  const explodeRef = useRef({ current: 0, target: 0, velocity: 0 });

  const holoConfig = MODEL_HOLO_CONFIG[modelKey] || MODEL_HOLO_CONFIG.logo;
  const activeGlow = glowColor || holoConfig.accentGlow;

  useEffect(() => {
    let isMounted = true;
    let animationFrameId;
    let renderer, scene, camera, modelWrapper;
    let holoRimLight;
    let isVisible = true;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability with high-performance antialiased context
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
      });
    } catch {
      setLoadError(true);
      return;
    }

    // 100% Pure, Vibrant Colors: Disable tone mapping curves that wash out and muddy colors
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene
    scene = new THREE.Scene();

    // Camera (Narrow FOV for clean isometric/badge perspective with ample frustum buffer)
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0, 2.55);

    // Precision Studio Lighting
    // 1. Clean ambient illumination preserving 100% pure saturation
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    // 2. Sharp Key Directional Light for laser-crisp specular glints
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    // 3. Cool fill light for lower shadow clarity
    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.0);
    fillLight.position.set(-2.5, -2, 2.5);
    scene.add(fillLight);

    // 4. Razor-sharp silhouette rim light
    if (enableHoloRim) {
      holoRimLight = new THREE.DirectionalLight(holoConfig.rimColor, 2.2);
      holoRimLight.position.set(-2, 3, -2);
      scene.add(holoRimLight);
    }

    // High-Resolution Super-Sampled Buffer Sizing
    const updateSize = () => {
      if (!container || !renderer || !canvas) return;
      const rect = container.getBoundingClientRect();
      const cssWidth = rect.width || container.offsetWidth || 100;
      const cssHeight = rect.height || container.offsetHeight || 100;

      const currentDpr = Math.max(window.devicePixelRatio || 1, 2);
      
      const renderWidth = Math.max(Math.round(cssWidth * currentDpr), 384);
      const renderHeight = Math.max(Math.round(cssHeight * currentDpr), 384);

      camera.aspect = cssWidth / cssHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(renderWidth, renderHeight, false);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
    };

    updateSize();

    // Listen to container resizing & window zooming
    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);
    window.addEventListener('resize', updateSize);

    // Intersection observer to pause render loop when off-screen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Load Model
    getModelInstance(modelKey)
      .then((wrapper) => {
        if (!isMounted) return;
        modelWrapper = wrapper;
        scene.add(modelWrapper);
        setLoaded(true);
      })
      .catch((err) => {
        console.warn(`Failed to load 3D model "${modelKey}":`, err);
        if (isMounted) setLoadError(true);
      });

    // Animation loop
    const baseRotationY = Math.PI / 2;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !modelWrapper) return;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerp with spring feel
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // Spin lerp
      spinRef.current.angle += (spinRef.current.targetAngle - spinRef.current.angle) * 0.08;

      // Layer Explode Spring Physics (Hooke's Law + Damping)
      const springK = 0.16;
      const damping = 0.82;
      const force = (explodeRef.current.target - explodeRef.current.current) * springK;
      explodeRef.current.velocity = (explodeRef.current.velocity + force) * damping;
      explodeRef.current.current += explodeRef.current.velocity;

      // Update 3D layer explosion separation
      if (modelWrapper.userData?.setExplode) {
        modelWrapper.userData.setExplode(explodeRef.current.current);
      }

      // Subtle ambient idle breathing
      const idleFloatY = Math.sin(elapsed * 2.2) * 0.035;
      const idleTiltZ = Math.sin(elapsed * 1.5) * 0.035;

      modelWrapper.position.y = idleFloatY;

      if (interactive) {
        // Cursor tilt + spin + ambient tilt
        modelWrapper.rotation.y = baseRotationY + mouseRef.current.x * 0.36 + spinRef.current.angle;
        modelWrapper.rotation.x = -mouseRef.current.y * 0.28;
        modelWrapper.rotation.z = idleTiltZ - mouseRef.current.x * 0.08;
      } else {
        // Continuous slow auto-rotation
        modelWrapper.rotation.y = baseRotationY + elapsed * autoRotateSpeed + spinRef.current.angle;
      }

      // Dynamic holographic rim light tracking
      if (holoRimLight) {
        holoRimLight.position.x = -2 + mouseRef.current.x * 2.5;
        holoRimLight.position.y = 3 - mouseRef.current.y * 2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (modelWrapper) {
        scene.remove(modelWrapper);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      if (renderer) renderer.dispose();
    };
  }, [modelKey, interactive, autoRotateSpeed, enableHoloRim, holoConfig.rimColor]);

  // Mouse interaction handlers with Layer Explode triggers
  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
    mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
  };

  const handleMouseEnter = () => {
    mouseRef.current.isHovered = true;
    // Trigger layer disassembly / explode
    explodeRef.current.target = 1.0;
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovered = false;
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    // Snap layers back together
    explodeRef.current.target = 0.0;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // 360-degree spin + spring pop burst on click
    spinRef.current.targetAngle += Math.PI * 2;
    explodeRef.current.velocity += 0.9;
  };

  if (loadError) {
    return fallbackIcon ? (
      <img src={fallbackIcon} alt={modelKey} className={className} />
    ) : null;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Holographic Ambient Glow Aura */}
      {activeGlow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-25 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: activeGlow }}
        />
      )}

      {/* 2D Fallback during load */}
      {!loaded && fallbackIcon && (
        <img
          src={fallbackIcon}
          alt={modelKey}
          className="w-full h-full object-contain transition-opacity duration-300"
        />
      )}

      {/* WebGL 3D Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
};

export default ModelIcon3D;
