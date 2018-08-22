import { Response } from './typings/jsonapi'
import { NormalizedResponse } from './typings'
import { isArray, isPlainObject } from './util'
import { normalizeCollection, normalizeResource } from './normalize'

/**
 * Deserializes a JSON API response into a normalized structure
 *
 * @param response A resource object or collection of object
 * @returns A normalized resource object or collection of objects
 */
export function deserialize(response: Response) {
  // Unexpected falsey value or no-content response
  if (!response) return response

  const { data, included, meta } = response
  const result = {} as NormalizedResponse

  if (meta) result.meta = meta

  if (isArray(data)) {
    result.data = normalizeCollection(data, included)
  } else if (isPlainObject(data)) {
    result.data = normalizeResource(data, included)
  } else {
    return response
  }

  return result
}
