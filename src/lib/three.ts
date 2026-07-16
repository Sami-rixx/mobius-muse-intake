/**
 * This file ensures Three.js is included in the build.
 * React Three Fiber uses Three.js as a peer dependency,
 * but Vite might tree-shake it out if it's not directly imported.
 * Importing it here ensures it's available in production.
 */

import * as THREE from 'three';

// Export THREE for use in other files if needed
export { THREE };

// This ensures Three.js is included in the build
declare global {
  interface Window {
    THREE: typeof THREE;
  }
}

// Optionally expose THREE globally for debugging
if (typeof window !== 'undefined') {
  window.THREE = THREE;
}
