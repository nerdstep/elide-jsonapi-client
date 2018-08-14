/*import {
  Document,
  DocWithData,
  DocWithMeta,
  PrimaryData,
  ResourceObject,
  RelationshipsObject,
} from './types'*/
import {
  Relationship,
  ResourceObject,
  Response,
  ResponseWithData,
} from 'ts-json-api'
import { isArray, isPlainObject } from 'ts-util-is'

interface NormalizedRelationship {
  [key: string]: object
}

type DeserializedResult = object[] | object

function extractRelationships(
  resource: ResourceObject,
): NormalizedRelationship | undefined {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationship = {}

  Object.keys(relationships).map(type => {
    result[type] = relationships[type].data
  })

  return result
}

function normalizeResource(resource: ResourceObject) {
  const { id, type, attributes } = resource
  const relationships = extractRelationships(resource)

  return { id, type, ...attributes, ...relationships }
}

function normalizeCollection(resources: ResourceObject[]) {
  const result: object[] = []

  resources.forEach((resource: ResourceObject) => {
    const normalized = normalizeResource(resource)
    result.push(normalized)
  })

  return result
}

export function deserialize(response: Response) {
  const { data } = response

  if (isArray(data)) {
    return normalizeCollection(data)
  } else if (isPlainObject(data)) {
    return normalizeResource(data)
  }

  throw new TypeError('Invalid JSON API response')
}
