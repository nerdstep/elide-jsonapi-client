import {
  PrimaryData,
  ResourceObject,
  RelationshipsObject,
} from 'jsonapi-typescript'
import { isArray, isPlainObject } from 'ts-util-is'

interface NormalizedRelationship {
  [key: string]: object
}

function normalizeResource(resource: ResourceObject) {
  const { id, type, attributes } = resource
  const relationships = extractRelationships(resource)

  return { id, type, ...attributes, ...relationships }
}

function extractRelationships(
  resource: ResourceObject,
): NormalizedRelationship | undefined {
  const { relationships } = resource

  if (!relationships) return undefined

  const result: NormalizedRelationship = {}

  Object.keys(relationships).map(type => {
    result[type] = relationships[type]
  })

  return result
}

type result = object[] | object

export function deserialize(data: PrimaryData) {
  let result: result

  console.log(data)

  if (isArray(data)) {
    result = []

    data.forEach(el => {
      const resource = normalizeResource(el)
      console.log(resource)
      result.push(resource)
    })
  }

  return result
}
