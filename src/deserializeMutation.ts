import { normalizeResource } from './normalize'
import { Response } from './typings/jsonpatch'
import { isArray, isPlainObject } from './util'

/**
 * Deserializes a response from a JSON API PATCH request
 *
 * @param response A collection or response objects
 * @returns A collection of normalized values
 */
export function deserializeMutation(response: Response) {
  const result = response.map(item => {
    const { data, errors } = item

    if (isPlainObject(data)) {
      return normalizeResource(data)
    } else if (isArray(errors)) {
      return { errors }
    }

    return null
  })

  // Return truthy values
  return result.filter(item => item)
}
