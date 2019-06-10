import {
  NormalizedRelationship,
  NormalizedResource,
  SerializeOptions,
} from './typings'
import {
  Attribute,
  Relationship,
  Request,
  ResourceObject,
} from './typings/jsonapi'
import { isArray, isDefined, isPlainObject, parseDate } from './util'
import { validateRelationship, validateResource } from './validation'

/**
 * Serializes an object into a JSON API structure
 *
 * @param obj A normalized resource object
 * @param options Serialization options
 * @returns A JSON API compliant resource object
 */
export function serialize(
  obj: NormalizedResource,
  options: SerializeOptions = {},
): Request {
  const { type } = obj
  const { dateAttrs = [], idRequired, protectedAttrs = [] } = options
  const data = { type } as ResourceObject

  validateResource(obj, idRequired)

  // Ensure ID is a string
  if (obj.id) {
    data.id = obj.id.toString()
  }

  // Map attributes and relationships
  Object.keys(obj).forEach(key => {
    const isProtected = protectedAttrs.indexOf(key) > -1
    let value = obj[key] as NormalizedRelationship | NormalizedRelationship[]

    // Single relationship
    if (isPlainObject(value) && !isProtected) {
      value = value as NormalizedRelationship

      validateRelationship(value)

      /* istanbul ignore next */
      if (!data.relationships) data.relationships = {}

      data.relationships[value.type] = {
        data: {
          id: value.id,
          type: value.type,
        },
      } as Relationship

      // Multiple relationships
    } else if (isArray(value) && !isProtected) {
      value = value as NormalizedRelationship[]

      if (!data.relationships) data.relationships = {}

      data.relationships[key] = {
        data: value.map((el: NormalizedRelationship) => {
          validateRelationship(el)
          return {
            id: el.id,
            type: el.type,
          }
        }),
      }

      // Attribute
    } else if (
      isDefined(value) &&
      key !== 'id' &&
      key !== 'type' &&
      !isProtected
    ) {
      let attrValue = value as Attribute

      if (!data.attributes) data.attributes = {}

      // Convert date values into Unix epoch time for Elide
      if (typeof value === 'string' && dateAttrs.indexOf(key) > -1) {
        attrValue = parseDate(value)
      }

      data.attributes[key] = attrValue
    }
  })

  return { data }
}
