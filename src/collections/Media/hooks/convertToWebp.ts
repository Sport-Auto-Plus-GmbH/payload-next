import sharp from 'sharp'
import type { CollectionBeforeOperationHook } from 'payload'

// Raster formats we convert. SVG is deliberately excluded — it's already vector,
// converting it to WebP would rasterize it and throw away its scalability, which
// is the opposite of the point (and matters for the logo specifically).
const CONVERTIBLE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/bmp',
])

/**
 * Converts every uploaded raster image to WebP before it's stored, so the
 * frontend only ever serves WebP. See .ai/cms/COLLECTIONS.md.
 */
export const convertToWebp: CollectionBeforeOperationHook<'media'> = async ({
  req,
  args,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') {
    return args
  }

  const file = req.file
  if (!file || !CONVERTIBLE_MIME_TYPES.has(file.mimetype)) {
    return args
  }

  const webpBuffer = await sharp(file.data).webp({ quality: 85 }).toBuffer()

  req.file = {
    ...file,
    data: webpBuffer,
    mimetype: 'image/webp',
    name: file.name.replace(/\.[^.]+$/, '.webp'),
    size: webpBuffer.length,
  }

  return args
}
