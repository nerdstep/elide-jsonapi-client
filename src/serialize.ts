import {
  Attribute,
  Relationship,
  Request,
  ResourceObject,
  ResourceObjectOrObjects,
  ResourceObjects,
} from './types/jsonapi'
import { NormalizedResource, SerializeOptions } from './types'
import { isArray, isPlainObject } from './util'

export const ID_REQUIRED = 'Resource must have an `id` property'
export const TYPE_REQUIRED = 'Resource must have a `type` property'
export const MISSING_ID_OR_TYPE =
  'Relationships require `id` and `type` properties'

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
  options: SerializeOptions = {},
): Request {
  const { id, type } = obj
  const { dateAttrs = [], idRequired, protectedAttrs = [] } = options
  const data = { type } as ResourceObject

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
    let value = obj[key] as ResourceObjectOrObjects

    // Single relationship
    if (isPlainObject(value)) {
      value = value as ResourceObject

      if (!value.id || !value.type) {
        throw new Error(MISSING_ID_OR_TYPE)
      }

      /* istanbul ignore next */
      if (!data.relationships) data.relationships = {}

      data.relationships[value.type] = {
        data: Object.assign({}, value),
      } as Relationship

      // Multiple relationships
    } else if (isArray(value)) {
      value = value as ResourceObjects

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
      let attrValue = value as Attribute

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
