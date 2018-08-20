import {
  Relationship,
  Request,
  ResourceObject,
  ResourceObjects,
  ResourceObjectOrObjects,
} from 'ts-json-api'
import { isArray, isPlainObject } from 'ts-util-is'
import { Attribute, NormalizedResource } from './types'

export const ID_REQUIRED = 'Resource must have an `id` property'
export const TYPE_REQUIRED = 'Resource must have a `type` property'
export const MISSING_ID_OR_TYPE =
  'Relationships require `id` and `type` properties'

declare type Options = {
  dateAttrs?: string[]
  idRequired?: boolean
  protectedAttrs?: string[]
}

/**
 * Serializes an object into a JSON API structure
 *
 * @param model Resource type
 * @param obj Resource data
 * @param method Request type
 * @returns Serialized data
 */
export function serialize(
  obj: NormalizedResource,
  options: Options = {},
): Request {
  const { id, type } = obj
  const { dateAttrs = [], idRequired, protectedAttrs = [] } = options
  const data = <ResourceObject>{ type }

  if (!isPlainObject(obj)) {
    throw new TypeError(`Expected an object but received \`${typeof obj}\``)
  } else if (idRequired && !id) {
    throw new Error(ID_REQUIRED)
  } else if (!type) {
    throw new Error(TYPE_REQUIRED)
  }

  // Ensure ID is a string
  if (obj.id) {
    data.id = obj.id.toString()
  }

  // Map attributes and relationships
  Object.keys(obj).forEach(key => {
    let value = <ResourceObjectOrObjects>obj[key]

    // Single relationship
    if (isPlainObject(value)) {
      value = <ResourceObject>value

      if (!value.id || !value.type) {
        throw new Error(MISSING_ID_OR_TYPE)
      }

      /* istanbul ignore next */
      if (!data.relationships) data.relationships = {}

      data.relationships[value.type] = <Relationship>{
        data: Object.assign({}, value),
      }

      // Multiple relationships
    } else if (isArray(value)) {
      value = <ResourceObjects>value

      if (!data.relationships) data.relationships = {}

      data.relationships[key] = {
        data: value.map((el: ResourceObject) => {
          if (!el.id || !el.type) {
            throw new Error(MISSING_ID_OR_TYPE)
          }
          return {
            id: el.id,
            type: el.type,
          }
        }),
      }

      // Attribute
    } else if (
      value &&
      key !== 'id' &&
      key !== 'type' &&
      // Do not return protected attributes
      protectedAttrs.indexOf(key) < 0
    ) {
      let attrValue = <Attribute>value

      if (!data.attributes) data.attributes = {}

      // Convert date values into Unix epoch time for Elide
      if (dateAttrs.indexOf(key) > -1) {
        const timestamp = Date.parse(value)

        if (!Number.isNaN(timestamp)) {
          attrValue = timestamp
        }
      }

      data.attributes[key] = attrValue
    }
  })

  return { data }
}
