import { ResourceObject, Response } from 'ts-json-api'
import { isArray, isPlainObject } from 'ts-util-is'
import { Attribute } from './types'

export const BAD_RESPONSE = 'Received bad JSON-API response'

interface NormalizedRelationsip {
  id: string
  type: string
  [index: string]: Attribute
}

interface NormalizedRelationships {
  [index: string]: object | object[]
}

function extractRelationships(
  resource: ResourceObject,
): NormalizedRelationships | undefined {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationships = {}

  Object.keys(relationships).map(type => {
    result[type] = <NormalizedRelationsip>relationships[type].data
  })

  return result
}

function linkRelationships(
  type: string,
  relationships: NormalizedRelationships,
  included: ResourceObject[],
) {
  const filtered = included.filter(item => item.type === type)

  /*if (!relationships[type]) relationships[type] = <ResourceObject[]>[]

  filtered.forEach(resource => {
    
    relationships[type].push(resource)
  })*/

  return relationships
}

function normalizeResource(
  resource: ResourceObject,
  included: ResourceObject[] = [],
) {
  const { id, type, attributes } = resource
  let relationships = extractRelationships(resource)

  if (isPlainObject(relationships)) {
    relationships = linkRelationships(type, relationships, included)
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

  throw new Error(BAD_RESPONSE)
}
