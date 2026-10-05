import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getModelInstance } from '../utils/modelLoader';

/**
 * Animated 3D Rabbit Logo Component.
 * Implements living rabbit anatomy & behavior:
 * - Independent Ear Wiggle & Perk (via GPU vertex shader deformation on front ear strokes)
 * - Tail Wag & Wobble (on rear circle stroke)
 * - Inquisitive Idle: Organic sniffing twitches, breathing, and ear perking toward cursor
 * - Dynamic Hopping: Responds to navbar travel with parabolic arc pitch, squash & stretch, and aerodynamic ear trail
 * - Celebratory Bunny Leap on click
 */
const targetBlackColor = new THREE.Color(0x080808);
const targetWhiteColor = new THREE.Color(0xf8fafc);

const Logo3D = ({
  className = 'w-9 h-9 sm:w-10 sm:h-10',
  isHopping = false,
  hopDirection = 1,
  hopProgress = 0,
  isWhite = false,
  onClick,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Mouse tilt tracking (head-turn curiosity)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false, isNear: false });

  // Rabbit animation state
  const stateRef = useRef({
    // Horizontal facing direction (+1 right, -1 left)
    facing: 1,
    targetFacing: 1,

    // Click jump
    jumpY: 0,
    jumpVelocity: 0,
    
    // Ear rebound spring
    earRebound: 0,
    earReboundVel: 0,

    // Tail wag
    tailWagPhase: 0,

    // Organic idle twitch timer
    nextTwitch: 2.2,
    twitchDuration: 0.35,

    // Hopping cache
    prevIsHopping: false,
  });

  // Track props for animate loop
  const propsRef = useRef({ isHopping, hopDirection, hopProgress, isWhite });
  useEffect(() => {
    propsRef.current = { isHopping, hopDirection, hopProgress, isWhite };
  }, [isHopping, hopDirection, hopProgress, isWhite]);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId;
    let renderer, scene, camera, modelWrapper;
    let isVisible = true;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

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

    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 2.5);

    // Studio Lighting for the Black Rabbit Emblem: balances deep obsidian black with crisp specular rim & highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.1);
    fillLight.position.set(-2.5, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(-2, 3, -2.5);
    scene.add(rimLight);

    // Sizing & Super-Sampling (Min 384px buffer)
    const updateSize = () => {
      if (!container || !renderer || !canvas) return;
      const rect = container.getBoundingClientRect();
      const cssWidth = rect.width || container.offsetWidth || 40;
      const cssHeight = rect.height || container.offsetHeight || 40;

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

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);
    window.addEventListener('resize', updateSize);

    // Global cursor tracking: Rabbit notices when user's cursor is nearby! (Optimized 60ms throttle)
    let lastRectTime = 0;
    let cachedRect = null;

    const handleGlobalPointerMove = (e) => {
      if (!container || mouseRef.current.isHovered) return;
      const now = performance.now();
      if (now - lastRectTime > 60 || !cachedRect) {
        cachedRect = container.getBoundingClientRect();
        lastRectTime = now;
      }
      const cx = cachedRect.left + cachedRect.width / 2;
      const cy = cachedRect.top + cachedRect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < 340) {
        mouseRef.current.targetX = Math.max(-1, Math.min(1, dx / 180));
        mouseRef.current.targetY = Math.max(-1, Math.min(1, dy / 180));
        mouseRef.current.isNear = true;
      } else if (mouseRef.current.isNear) {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
        mouseRef.current.isNear = false;
      }
    };
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });

    // Load Rabbit Logo Model
    getModelInstance('logo')
      .then((wrapper) => {
        if (!isMounted) return;
        modelWrapper = wrapper;
        scene.add(modelWrapper);
        updateSize();
        setLoaded(true);
      })
      .catch((err) => {
        console.warn('Failed to load 3D rabbit logo:', err);
        if (isMounted) setLoadError(true);
      });

    // Animation Loop: Living Rabbit Engine
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !modelWrapper) return;

      const elapsed = (performance.now() - startTime) * 0.001;
      const s = stateRef.current;
      const { isHopping: hopping, hopDirection: direction, hopProgress: progress } = propsRef.current;

      // 1. Mouse Lerp for Head-Turn
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // 2. Ear Rebound & Spring Physics (on landing)
      if (s.prevIsHopping && !hopping) {
        s.earReboundVel = 0.22;
      }
      s.prevIsHopping = hopping;

      const earSpringK = 0.18;
      const earDamping = 0.82;
      const earForce = (0 - s.earRebound) * earSpringK;
      s.earReboundVel = (s.earReboundVel + earForce) * earDamping;
      s.earRebound += s.earReboundVel;

      // 3. Click Jump Physics
      const jumpSpringK = 0.14;
      const jumpDamping = 0.80;
      const jumpForce = (0 - s.jumpY) * jumpSpringK;
      s.jumpVelocity = (s.jumpVelocity + jumpForce) * jumpDamping;
      s.jumpY += s.jumpVelocity;

      // 4. Idle Organic Sniff & Ear Twitch
      let twitchWiggle = 0;
      let twitchDepth = 0;
      if (elapsed > s.nextTwitch && elapsed < s.nextTwitch + s.twitchDuration) {
        const tDiff = elapsed - s.nextTwitch;
        twitchWiggle = Math.sin(tDiff * 36) * 0.08;
        twitchDepth = Math.cos(tDiff * 36) * 0.06;
      } else if (elapsed >= s.nextTwitch + s.twitchDuration) {
        s.nextTwitch = elapsed + 2.4 + Math.random() * 2.6;
      }

      // 5. Breathing and Idle Float
      const breathFloatY = Math.sin(elapsed * 2.6) * 0.018;
      const breathScale = 1.0 + Math.sin(elapsed * 2.6) * 0.012;

      // 6. Natural 3-Phase Biological Jump Mechanics
      let currentEarWiggle = 0;
      let currentEarPerk = 0;
      let currentEarDepth = 0;
      let currentTailWag = 0;

      let hopPitchZ = 0;
      let hopSquashY = 1.0;
      let hopSquashX = 1.0;

      if (hopping) {
        // Direct facing towards leap travel
        s.targetFacing = direction >= 0 ? 1 : -1;

        if (progress < 0.14) {
          // Phase 1: Anticipation Crouch (hind legs compress & store elastic energy)
          const pc = progress / 0.14;
          const crouch = Math.sin(pc * Math.PI);
          hopSquashY = 1.0 - crouch * 0.24; // squash low (0.76)
          hopSquashX = 1.0 + crouch * 0.22; // widen torso (1.22)
          hopPitchZ = -crouch * 0.10;       // coiling back slightly
          currentEarWiggle = -crouch * 0.18; // ears pinned back
          currentEarPerk = -crouch * 0.04;
        } else if (progress <= 0.86) {
          // Phase 2: Explosive Launch & Airborne Glide (apex hang-time)
          const tau = (progress - 0.14) / 0.72;
          const arc = Math.sin(tau * Math.PI);
          hopSquashY = 1.0 + arc * 0.22;    // stretch along leap velocity (1.22)
          hopSquashX = 1.0 - arc * 0.14;    // streamline (0.86)

          // Natural body pitch: nose-up on launch (+0.34), levels at apex (0.0), paws-down on descent (-0.28)
          hopPitchZ = (1.0 - tau * 2.0) * (tau < 0.5 ? 0.34 : 0.28);

          // Aerodynamic ear wind drag: ears stream back into the wind
          currentEarWiggle = -arc * 0.24;
          currentEarPerk = arc * 0.05;
        } else {
          // Phase 3: Impact Cushion & Shock Absorption
          const pl = (progress - 0.86) / 0.14;
          const cushion = Math.sin(pl * Math.PI);
          hopSquashY = 1.0 - cushion * 0.22; // squash to absorb landing (0.78)
          hopSquashX = 1.0 + cushion * 0.20; // widen (1.20)
          hopPitchZ = 0;
          currentEarWiggle = cushion * 0.22;  // inertia whip forward on touchdown!
          currentEarPerk = -cushion * 0.03;
          currentTailWag = Math.sin(pl * Math.PI * 2) * 0.18; // joyful tail wag!
        }
      } else {
        // Idle / Hovering
        const isHovered = mouseRef.current.isHovered;
        const isNear = mouseRef.current.isNear;

        // Turn to look at cursor when nearby
        if (isNear || isHovered) {
          if (mouseRef.current.targetX > 0.2) s.targetFacing = 1;
          else if (mouseRef.current.targetX < -0.2) s.targetFacing = -1;
        }

        const alertPerk = isHovered ? 0.08 : (isNear ? 0.04 : 0.0);
        const breathPerk = Math.sin(elapsed * 2.6) * 0.012;

        currentEarPerk = alertPerk + breathPerk;
        currentEarWiggle = twitchWiggle + s.earRebound;
        currentEarDepth = twitchDepth;

        // Tail wag on hover, click jump, or cursor proximity
        if (isHovered || isNear || Math.abs(s.jumpY) > 0.02) {
          s.tailWagPhase += 0.25;
          currentTailWag = Math.sin(s.tailWagPhase) * 0.10;
        }
      }

      // Smooth facing lerp so rabbit turns around smoothly without snapping
      s.facing += (s.targetFacing - s.facing) * 0.22;

      // Send living features to shader uniforms
      if (modelWrapper.userData.setRabbitFeature) {
        modelWrapper.userData.setRabbitFeature({
          earWiggle: currentEarWiggle,
          earPerk: currentEarPerk,
          earDepthTwitch: currentEarDepth,
          tailWag: currentTailWag,
        });
      }

      // Dynamic Theme Color Morph (Black on light screens, White on dark screens)
      if (modelWrapper.userData.material) {
        const mat = modelWrapper.userData.material;
        const targetColor = propsRef.current.isWhite ? targetWhiteColor : targetBlackColor;
        mat.color.lerp(targetColor, 0.12);
        mat.sheen = THREE.MathUtils.lerp(mat.sheen, propsRef.current.isWhite ? 0.45 : 0.0, 0.12);
        mat.roughness = THREE.MathUtils.lerp(mat.roughness, propsRef.current.isWhite ? 0.12 : 0.18, 0.12);
      }

      // Vertical position (breathing + jump)
      modelWrapper.position.y = breathFloatY + s.jumpY;

      // 3D Rotations (clean Euler angles, no gimbal lock)
      // Z-axis: 2D plane pitch (leaning into hop, landing cushion)
      modelWrapper.rotation.z = s.facing * hopPitchZ + twitchWiggle * 0.4;

      // Y-axis: Inquisitive head turn toward cursor
      modelWrapper.rotation.y = mouseRef.current.x * 0.32;

      // X-axis: Subtle perspective tilt toward cursor
      modelWrapper.rotation.x = -mouseRef.current.y * 0.18;

      // Scale (squash & stretch + horizontal facing flip)
      modelWrapper.scale.set(
        s.facing * hopSquashX * breathScale,
        hopSquashY * breathScale,
        1.0
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      resizeObserver.disconnect();

      if (modelWrapper) {
        scene.remove(modelWrapper);
      }
      renderer.dispose();
    };
  }, []);

  const handlePointerEnter = () => {
    mouseRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.isHovered = false;
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x * 2;
    mouseRef.current.targetY = y * 2;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    stateRef.current.jumpVelocity = 0.22;
    stateRef.current.earReboundVel = 0.25;
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className} cursor-pointer select-none`}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onMouseMove={handlePointerMove}
      onClick={handleClick}
      title="RabbitFolio"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/logo.png" alt="RabbitFolio" className="w-full h-full object-contain" />
        </div>
      )}

      {!loaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Logo3D;
