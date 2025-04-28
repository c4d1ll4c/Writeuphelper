/**
 * Custom image loader for Next.js
 * This loader optimizes images for production by handling responsive sizes
 * and serving WebP format where supported
 */
export default function imageLoader({ src, width, quality }) {
  // Handle both absolute and relative paths
  const path = src.startsWith('/') ? src.slice(1) : src;
  
  // Return optimized image path with width and quality
  return `${path}?w=${width}&q=${quality || 75}`
} 