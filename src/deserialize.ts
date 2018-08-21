import { Response } from './types/jsonapi'
import { NormalizedResponse } from './types'
import { isArray, isPlainObject } from './util'
import { normalizeCollection, normalizeResource } from './normalize'

export const BAD_RESPONSE = 'Received bad JSON API response'

export function deserialize(response: Response) {
  if (!response) throw new Error(BAD_RESPONSE)

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
