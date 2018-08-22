import { NormalizedResource, NormalizedResourceOrResources } from './types'
import { isArray, isPlainObject } from './util'

/**
 * Returns a collection of resources with only ID & Type properties
 *
 * @param data A normalized resource object or collection of resource objects
 */
export function mapResources(data: NormalizedResourceOrResources) {
  let resources = [] as NormalizedResource[]

  if (isArray(data)) {
    resources = data.map(({ id, type }) => ({ id, type }))
  } else if (isPlainObject(data)) {
    const { id, type } = data
    resources.push({ id, type })
  }

  return resources
}
