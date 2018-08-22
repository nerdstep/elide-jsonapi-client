import { ResourceObject } from './typings/jsonapi'
import {
  NormalizedRelationships,
  NormalizedResource,
  Relationship,
  RelationshipWithData,
} from './typings'
import { isArray, isPlainObject } from './util'

function extractRelationships(
  resource: ResourceObject,
): NormalizedRelationships | undefined {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationships = {}

  Object.keys(relationships).map(type => {
    result[type] = relationships[type].data as Relationship
  })

  return result
}

function filterIncluded(
  included: ResourceObject[],
  { id, type }: Relationship,
) {
  const filtered = included.filter(item => item.id === id && item.type === type)
  const obj = filtered[0] || { id, type }
  return normalizeResource(obj)
}

function linkRelationships(
  relationships: NormalizedRelationships,
  included: ResourceObject[],
) {
  Object.keys(relationships).forEach(key => {
    const values = relationships[key]

    if (isArray(values)) {
      const result = [] as RelationshipWithData[]

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
