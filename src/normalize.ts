import { ResourceObject } from './typings/jsonapi'
import {
  NormalizedRelationship,
  NormalizedRelationships,
  NormalizedResource,
  RelationshipRef,
} from './typings'
import { isArray, isPlainObject } from './util'

/**
 * Hoists reltionship objects from the `data` property to a root level property
 *
 * @param resource A resource object
 * @returns A flattened relationship object
 */
function extractRelationships(resource: ResourceObject) {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationships = {}

  Object.keys(relationships).map(type => {
    result[type] = relationships[type].data as RelationshipRef
  })

  return result
}

/**
 * Returns included relationship resources
 * that match the provided relationship reference object
 *
 * @param included A collection of resource objects
 * @param obj A relationship object
 * @returns A normalized resource object
 */
function filterIncluded(
  included: ResourceObject[],
  { id, type }: RelationshipRef,
) {
  const filtered = included.filter(item => item.id === id && item.type === type)
  const obj = filtered[0] || { id, type }
  return normalizeResource(obj)
}

/**
 * Merges included relationship data with resource object relationships
 *
 * @param relationships A normalized object of relationship resources
 * @param included The included relationship resources
 * @returns A merged relationship object
 */
function linkRelationships(
  relationships: NormalizedRelationships,
  included: ResourceObject[],
) {
  Object.keys(relationships).forEach(key => {
    const values = relationships[key]

    if (isArray(values)) {
      const result = [] as NormalizedRelationship[]

      values.forEach(item => {
        result.push(filterIncluded(included, item))
      })

      relationships[key] = result
    } else {
      relationships[key] = filterIncluded(included, values)
    }
  })

  return relationships
}

/**
 * Normalizes a resource by hoisting the attributes and linking relationships
 *
 * @param resource A resource object
 * @param included Included relationship resources
 * @returns A normalized resource object
 */
export function normalizeResource(
  resource: ResourceObject,
  included: ResourceObject[] = [],
) {
  const { id, type, attributes } = resource
  let relationships = extractRelationships(resource)

  if (isPlainObject(relationships) && included.length > 0) {
    relationships = linkRelationships(relationships, included)
  }

  return { id, type, ...attributes, ...relationships }
}

/**
 * Normalizes a collection of resource objects
 *
 * @param resources The collection of resources
 * @param included Included relationship resources
 * @returns A collection of normalized resource objects
 */
export function normalizeCollection(
  resources: ResourceObject[],
  included: ResourceObject[] = [],
) {
  const result = [] as NormalizedResource[]

  resources.forEach((resource: ResourceObject) => {
    const normalized = normalizeResource(resource, included)
    result.push(normalized)
  })

  return result
}
