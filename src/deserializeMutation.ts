import { Response } from './typings/jsonpatch'
import { normalizeResource } from './normalize'
import { isPlainObject } from './util'

/**
 * Deserializes a response from a JSON API PATCH request
 *
 * @param response
 */
export function deserializeMutation(response: Response) {
  const result = response.map(item => {
    const { data } = item

    if (isPlainObject(data)) {
      return normalizeResource(data)
    } else if (typeof data !== 'undefined') {
      return data
    }

    return item
  })

  // Return truthy values
  return result.filter(item => item)
}
