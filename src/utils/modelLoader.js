import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

let loadPromise = null;

export const MODEL_INDICES = {
  logo: 0,
  express: 1,
  docker: 2,
  typescript: 3,
  nodejs: 4,
};

// Precise accent colors for each model
export const MODEL_HOLO_CONFIG = {
  logo: {
    sheenColor: 0x000000,
    rimColor: 0x334155,
    accentGlow: 'rgba(0, 0, 0, 0.25)',
    title: 'RabbitFolio Emblem',
    category: 'Brand Identity',
  },
  express: {
    sheenColor: 0xffffff,
    rimColor: 0xe2e8f0,
    accentGlow: 'rgba(148, 163, 184, 0.35)',
    title: 'Express.js',
    category: 'API Engine & Routing',
  },
  docker: {
    sheenColor: 0x38bdf8,
    rimColor: 0x60a5fa,
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    title: 'Docker',
    category: 'Virtualization & Cloud',
  },
  typescript: {
    sheenColor: 0x93c5fd,
    rimColor: 0x60a5fa,
    accentGlow: 'rgba(96, 165, 250, 0.4)',
    title: 'TypeScript',
    category: 'Strict Typing & Safety',
  },
  nodejs: {
    sheenColor: 0x86efac,
    rimColor: 0x4ade80,
    accentGlow: 'rgba(74, 222, 128, 0.4)',
    title: 'Node.js',
    category: 'Async Runtime & V8',
  },
};

/**
 * Loads and caches the icon pack GLTF scene once.
 * Segregates each model into Base Plate and Foreground Emblem layers to enable
 * true 3D spatial layer disassembly / explode depth animations on hover.
 */
export async function getModelInstance(modelKey) {
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        '/models/icon-pack.glb',
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });
  }

  const gltf = await loadPromise;
  const index = MODEL_INDICES[modelKey];
  if (index === undefined || !gltf.scene.children[index]) {
    throw new Error(`Model key "${modelKey}" not found in icon pack.`);
  }

  const sourceGroup = gltf.scene.children[index];
  const clone = sourceGroup.clone(true);
  const holoConfig = MODEL_HOLO_CONFIG[modelKey] || MODEL_HOLO_CONFIG.logo;

  // Find primary mesh in clone
  let primaryMesh = null;
  let secondaryMesh = null;
  clone.traverse((child) => {
    if (child.isMesh) {
      if (!primaryMesh) primaryMesh = child;
      else if (!secondaryMesh) secondaryMesh = child;
    }
  });

  if (!primaryMesh) {
    return clone;
  }

  // Apply creased normals to primary geometry (produces non-indexed geometry with split normals)
  let geom = primaryMesh.geometry;
  try {
    geom = toCreasedNormals(geom, THREE.MathUtils.degToRad(38));
  } catch {
    geom = geom.clone();
    geom.computeVertexNormals();
  }

    // Crystal clear physical material for standard tech icons
    const mat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.08,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      sheen: 0.35,
      sheenColor: new THREE.Color(holoConfig.sheenColor),
      sheenRoughness: 0.15,
      side: THREE.DoubleSide,
    });

  // Specialized unified handling for Rabbit Logo Emblem
  if (modelKey === 'logo') {
    const rabbitGeom = primaryMesh.geometry.clone();
    rabbitGeom.computeVertexNormals();
    rabbitGeom.computeBoundingBox();
    const size = rabbitGeom.boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
    const scaleFactor = 1.0 / maxDim;

    // Center directly at origin, scale to 1.0, and rotate so front profile faces +Z camera
    rabbitGeom.center();
    rabbitGeom.scale(scaleFactor, scaleFactor, scaleFactor);
    rabbitGeom.rotateY(Math.PI / 2);

    const pos = rabbitGeom.attributes.position;
    const count = pos.count;
    const origPos = new Float32Array(pos.array); // Cache base positions

    const earIdxList = [];
    const earWeightList = [];
    const tailIdxList = [];
    const tailWeightList = [];

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Ears: front upright strokes (x > 0.05, y > 0.0)
      if (x > 0.05 && y > 0.0) {
        const ew = Math.pow(Math.min(1.0, Math.max(0.0, y / 0.42)), 1.3);
        earIdxList.push(i);
        earWeightList.push(ew);
      }
      // Tail: round rear circle (x < -0.25)
      if (x < -0.25) {
        const tw = Math.min(1.0, Math.max(0.0, (-0.25 - x) / 0.22));
        tailIdxList.push(i);
        tailWeightList.push(tw);
      }
    }

    const earIndices = new Int32Array(earIdxList);
    const earWeights = new Float32Array(earWeightList);
    const tailIndices = new Int32Array(tailIdxList);
    const tailWeights = new Float32Array(tailWeightList);

    const rabbitMat = new THREE.MeshPhysicalMaterial({
      color: 0x080808, // Rich jet black
      roughness: 0.18, // Sleek satin-gloss obsidian finish
      metalness: 0.20, // Subtle metallic definition
      clearcoat: 1.0,  // Deep glossy lacquer coat
      clearcoatRoughness: 0.05,
      sheen: 0.0,      // Pure black, no white sheen haze
      side: THREE.DoubleSide,
    });

    const rabbitMesh = new THREE.Mesh(rabbitGeom, rabbitMat);
    rabbitMesh.name = 'logo_rabbit';

    const wrapper = new THREE.Group();
    wrapper.name = 'logo_wrapper';
    wrapper.add(rabbitMesh);
    wrapper.rotation.set(0, 0, 0);

    let lastWiggle = 0;
    let lastPerk = 0;
    let lastDepth = 0;
    let lastTail = 0;

    wrapper.userData = {
      material: rabbitMat,
      setRabbitFeature: ({ earWiggle = 0, earPerk = 0, earDepthTwitch = 0, tailWag = 0 } = {}) => {
        // Skip if change is negligible
        if (
          Math.abs(earWiggle - lastWiggle) < 0.0005 &&
          Math.abs(earPerk - lastPerk) < 0.0005 &&
          Math.abs(earDepthTwitch - lastDepth) < 0.0005 &&
          Math.abs(tailWag - lastTail) < 0.0005
        ) {
          return;
        }

        lastWiggle = earWiggle;
        lastPerk = earPerk;
        lastDepth = earDepthTwitch;
        lastTail = tailWag;

        const arr = rabbitGeom.attributes.position.array;

        // Animate ear vertices
        const earLen = earIndices.length;
        for (let k = 0; k < earLen; k++) {
          const i3 = earIndices[k] * 3;
          const w = earWeights[k];
          arr[i3]     = origPos[i3]     + earWiggle * w;
          arr[i3 + 1] = origPos[i3 + 1] + earPerk * w;
          arr[i3 + 2] = origPos[i3 + 2] + earDepthTwitch * w;
        }

        // Animate tail vertices
        const tailLen = tailIndices.length;
        for (let k = 0; k < tailLen; k++) {
          const i3 = tailIndices[k] * 3;
          const w = tailWeights[k];
          arr[i3 + 1] = origPos[i3 + 1] + tailWag * w;
          arr[i3 + 2] = origPos[i3 + 2] + Math.sin(tailWag * 10.0) * 0.03 * w;
        }

        rabbitGeom.attributes.position.needsUpdate = true;
      },
      setExplode: () => {},
    };

    return wrapper;
  }

  // Separate non-indexed triangle triplets into Base Plate and Foreground Emblem
  const posAttr = geom.attributes.position;
  const colAttr = geom.attributes.color;
  const normAttr = geom.attributes.normal;

  const basePos = [], baseCol = [], baseNorm = [];
  const fgPos = [], fgCol = [], fgNorm = [];

  for (let i = 0; i < posAttr.count; i += 3) {
    const r = colAttr.getX(i);
    const g = colAttr.getY(i);
    const x = posAttr.getX(i);

    let isFg = false;
    if (modelKey === 'typescript' || modelKey === 'docker') {
      // White TS letters and white containers are foreground (r > 0.8)
      isFg = r > 0.8;
    } else if (modelKey === 'express') {
      // White "ex" letters are foreground (r > 0.8)
      isFg = r > 0.8;
    } else if (modelKey === 'nodejs') {
      // Green emblem is foreground (g > 0.3)
      isFg = g > 0.3;
    }

    const targetPos = isFg ? fgPos : basePos;
    const targetCol = isFg ? fgCol : baseCol;
    const targetNorm = isFg ? fgNorm : baseNorm;

    for (let j = 0; j < 3; j++) {
      const idx = i + j;
      targetPos.push(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
      targetCol.push(colAttr.getX(idx), colAttr.getY(idx), colAttr.getZ(idx), colAttr.getW(idx));
      if (normAttr) {
        targetNorm.push(normAttr.getX(idx), normAttr.getY(idx), normAttr.getZ(idx));
      }
    }
  }

  // Build Base Mesh
  const baseGeom = new THREE.BufferGeometry();
  baseGeom.setAttribute('position', new THREE.Float32BufferAttribute(basePos, 3));
  baseGeom.setAttribute('color', new THREE.Float32BufferAttribute(baseCol, 4));
  if (baseNorm.length > 0) {
    baseGeom.setAttribute('normal', new THREE.Float32BufferAttribute(baseNorm, 3));
  }
  const baseMesh = new THREE.Mesh(baseGeom, mat);
  baseMesh.name = `${modelKey}_base`;

  // Build Layer Group
  const layerGroup = new THREE.Group();
  layerGroup.name = `${modelKey}_layers`;
  layerGroup.add(baseMesh);

  // Build Foreground Mesh
  let fgMesh = null;
  if (fgPos.length > 0) {
    const fgGeom = new THREE.BufferGeometry();
    fgGeom.setAttribute('position', new THREE.Float32BufferAttribute(fgPos, 3));
    fgGeom.setAttribute('color', new THREE.Float32BufferAttribute(fgCol, 4));
    if (fgNorm.length > 0) {
      fgGeom.setAttribute('normal', new THREE.Float32BufferAttribute(fgNorm, 3));
    }
    fgMesh = new THREE.Mesh(fgGeom, mat.clone());
    fgMesh.name = `${modelKey}_fg`;
    layerGroup.add(fgMesh);
  }

  if (secondaryMesh) {
    const secGeom = secondaryMesh.geometry.clone();
    secGeom.computeVertexNormals();
    const secMat = mat.clone();
    secMat.transparent = true;
    secMat.opacity = 0.92;
    const secMesh = new THREE.Mesh(secGeom, secMat);
    if (fgMesh) fgMesh.add(secMesh);
    else layerGroup.add(secMesh);
  }

  // Calculate bounding box and center at (0, 0, 0)
  const box = new THREE.Box3().setFromObject(layerGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  layerGroup.position.sub(center);

  // Normalize scale so largest dimension is 1.0
  const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
  const scaleFactor = 1.0 / maxDim;
  layerGroup.scale.multiplyScalar(scaleFactor);
  layerGroup.position.multiplyScalar(scaleFactor);

  // Parent wrapper group
  const wrapper = new THREE.Group();
  wrapper.name = `${modelKey}_wrapper`;
  wrapper.add(layerGroup);

  // Orientation: rotate +90 degrees on Y so front faces camera (+Z)
  wrapper.rotation.y = Math.PI / 2;

  // Layer explode controller
  wrapper.userData = {
    baseMesh,
    fgMesh,
    setExplode: (progress) => {
      // progress: 0 (settled) to 1 (fully exploded)
      if (fgMesh) {
        // In local coordinates before Y-rotation, -X points toward camera (+Z)
        // Calibrated to 0.12 so front stays 100% inside camera frustum with zero clipping
        fgMesh.position.x = -progress * 0.12;
        fgMesh.scale.setScalar(1.0 + progress * 0.02);
      }
      if (baseMesh) {
        baseMesh.position.x = progress * 0.04;
      }
    },
  };

  return wrapper;
}
