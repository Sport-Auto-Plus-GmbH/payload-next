import type { UploadFieldSingleValidation } from 'payload'

type UploadValidationOptions = Parameters<UploadFieldSingleValidation>[1]

async function findMedia(value: unknown, req: UploadValidationOptions['req']) {
  const relationId = value && typeof value === 'object' && 'id' in value ? value.id : value
  const id = typeof relationId === 'number' || typeof relationId === 'string' ? relationId : null

  if (id === null || id === undefined) {
    return null
  }

  try {
    return await req.payload.findByID({ collection: 'media', id, depth: 0 })
  } catch {
    return null
  }
}

export const validateTeaserImage: UploadFieldSingleValidation = async (value, { req }) => {
  const media = await findMedia(value, req)
  return media?.mimeType?.startsWith('image/')
    ? true
    : 'Bitte ein gültiges Bild aus der Mediathek auswählen.'
}

export const validateVideoSource: UploadFieldSingleValidation = async (value, { req }) => {
  const media = await findMedia(value, req)
  return media?.sourceType === 'youtube' || media?.mimeType?.startsWith('video/')
    ? true
    : 'Bitte einen gültigen Video-Upload oder einen YouTube-Link aus der Mediathek auswählen.'
}
