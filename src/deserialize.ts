import { ResourceObject, Response } from 'ts-json-api'
import { isArray, isPlainObject } from 'ts-util-is'
import {
  Relationship,
  RelationshipWithData,
  NormalizedRelationships,
} from './types'

export const BAD_RESPONSE = 'Received bad JSON API response'

function extractRelationships(
  resource: ResourceObject,
): NormalizedRelationships | undefined {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationships = {}

  Object.keys(relationships).map(type => {
    result[type] = <Relationship>relationships[type].data
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
      const result = <RelationshipWithData[]>[]

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

function normalizeResource(
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

function normalizeCollection(
  resources: ResourceObject[],
  included: ResourceObject[] = [],
) {
  const result: object[] = []

  resources.forEach((resource: ResourceObject) => {
    const normalized = normalizeResource(resource, included)
    result.push(normalized)
  })

  return result
}

export function deserialize(response: Response) {
  if (!response) throw new Error(BAD_RESPONSE)

  const { data, included } = response

  if (isArray(data)) {
    return normalizeCollection(data, included)
  } else if (isPlainObject(data)) {
    return normalizeResource(data, included)
  }

  return response
}
