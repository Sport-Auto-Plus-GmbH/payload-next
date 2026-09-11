import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import type { Media } from '@/payload-types'

/**
 * A YouTube medium has no binary upload, while a regular upload must always have one.
 * Payload's `filesRequiredOnCreate` cannot express that conditional requirement.
 */
export const requireUploadFile: CollectionBeforeValidateHook<Media> = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const sourceType = data?.sourceType ?? originalDoc?.sourceType ?? 'upload'

  const isSwitchingToUpload = originalDoc?.sourceType !== 'upload'
  const needsFile = operation === 'create' || isSwitchingToUpload

  if (sourceType === 'upload' && needsFile && !req.file) {
    throw new ValidationError({
      collection: 'media',
      errors: [{ message: 'Für Datei-Uploads muss eine Datei ausgewählt werden.', path: 'file' }],
    })
  }

  return data
}
