/**
 * ImageKit URL Utility
 *
 * Rewrites image URLs (UploadThing + Supabase Storage) to go through ImageKit CDN.
 * ImageKit caches and serves images from its global edge network,
 * dramatically reducing egress from your origin storage.
 *
 * ImageKit must be configured with origins for:
 *   1. UploadThing (new CDN) → Base URL: https://ufs.sh
 *   2. UploadThing (legacy)  → Base URL: https://utfs.io
 *   3. Supabase              → Base URL: https://qwmnhuqeyqmryzigvaup.supabase.co
 *
 * See: https://imagekit.io/docs/integration/configure-origin
 */

const IMAGEKIT_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_URL

/**
 * ImageKit transformation options.
 * Maps to ImageKit's `tr` URL parameter.
 *
 * @see https://imagekit.io/docs/image-transformations
 */
export interface IKTransformOptions {
  /** Target width in pixels */
  width?: number
  /** Target height in pixels */
  height?: number
  /** Output quality (1–100). Defaults to 75 for product images */
  quality?: number
  /** Output format override. Defaults to 'webp' */
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto'
  /** Crop mode. 'maintain_ratio' = smart crop keeping aspect ratio */
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max' | 'pad_resize'
  /** Focus area for smart crop */
  focus?: 'auto' | 'face' | 'center'
}

/**
 * Converts any image URL to an ImageKit-optimized URL.
 *
 * - If the URL is a UploadThing URL (ufs.sh or legacy utfs.io), rewrites it through ImageKit.
 * - If NEXT_PUBLIC_IMAGEKIT_URL is not set, falls back to the original URL
 *   so the app works even before ImageKit is configured.
 * - Appends transformation parameters as `?tr=...`
 *
 * @example
 * // Converts: https://ufs.sh/f/abc123.webp
 * // To:       https://ik.imagekit.io/yourID/f/abc123.webp?tr=w-400,q-75,f-webp
 *
 * getImageKitUrl('https://ufs.sh/f/abc.webp', { width: 400, quality: 75 })
 */
export function getImageKitUrl(
  src: string | null | undefined,
  options: IKTransformOptions = {}
): string {
  if (!src) return ''

  // Fall back gracefully if env var is not configured yet
  if (!IMAGEKIT_BASE) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[ImageKit] NEXT_PUBLIC_IMAGEKIT_URL is not set. ' +
        'Images will be served from the origin. ' +
        'Add it to .env to enable CDN delivery.'
      )
    }
    return src
  }

  // Rewrite URLs from known storage origins:
  //   UploadThing (new): https://ufs.sh/f/abc123
  //   UploadThing (old): https://utfs.io/f/abc123
  //   Supabase:          https://qwmnhuqeyqmryzigvaup.supabase.co/storage/v1/object/public/...
  const isUploadThingUrl = src.includes('ufs.sh') || src.includes('utfs.io')
  const isSupabaseUrl = src.includes('supabase.co/storage')

  if (!isUploadThingUrl && !isSupabaseUrl) return src

  // Build the path portion after the origin
  // e.g. https://utfs.io/f/abc123 → /f/abc123
  let path: string
  try {
    const url = new URL(src)
    path = url.pathname + url.search
  } catch {
    // Not a valid URL — return as-is
    return src
  }

  // Assemble ImageKit URL
  const base = IMAGEKIT_BASE.replace(/\/$/, '') // strip trailing slash
  const imagekitUrl = `${base}${path}`

  // Build transformation string
  const transforms: string[] = []
  if (options.width) transforms.push(`w-${options.width}`)
  if (options.height) transforms.push(`h-${options.height}`)
  if (options.quality !== undefined) transforms.push(`q-${options.quality}`)
  if (options.format) transforms.push(`f-${options.format}`)
  if (options.crop) transforms.push(`c-${options.crop}`)
  if (options.focus) transforms.push(`fo-${options.focus}`)

  if (transforms.length === 0) return imagekitUrl

  return `${imagekitUrl}?tr=${transforms.join(',')}`
}

// ---------------------------------------------------------------------------
// Pre-built presets — use these throughout the app for consistent quality
// ---------------------------------------------------------------------------

/**
 * Product card thumbnail (grid view).
 * Serves a 400px-wide WebP at 75% quality — good balance of size/quality.
 */
export function getProductCardUrl(src: string): string {
  return getImageKitUrl(src, { width: 400, quality: 75, format: 'webp' })
}

/**
 * Product detail page — main large image.
 * 900px wide, 80% quality for sharp zoom-in experience.
 */
export function getProductDetailUrl(src: string): string {
  return getImageKitUrl(src, { width: 900, quality: 80, format: 'webp' })
}

/**
 * Thumbnail strip (gallery row under the main image).
 * 150px wide, 70% quality — small previews.
 */
export function getProductThumbnailUrl(src: string): string {
  return getImageKitUrl(src, { width: 150, quality: 70, format: 'webp' })
}

/**
 * Category card image.
 * 400px wide, 75% quality.
 */
export function getCategoryCardUrl(src: string): string {
  return getImageKitUrl(src, { width: 400, quality: 75, format: 'webp' })
}

/**
 * Admin preview thumbnail (e.g. file-upload.tsx previews).
 * Tiny 200px, 60% quality — just for visual confirmation.
 */
export function getAdminPreviewUrl(src: string): string {
  return getImageKitUrl(src, { width: 200, quality: 60, format: 'webp' })
}
