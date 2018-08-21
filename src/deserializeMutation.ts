import { Response } from './types/jsonapi'
import { deserialize } from './deserialize'

/**
 * Deserializes a response from a JSON API PATCH request
 *
 * @param response
 */
export function deserializeMutation(response: Response[]) {
  return response.map(item => deserialize(item))
}
