import { Attributes } from './typings/jsonapi'
import {
  PageParams,
  Params,
  ParamsObject,
  SerializeParamsOptions,
} from './typings'
import { isArray, isDefined, isPlainObject } from './util'

/**
 * Recursively stringifies nested objects
 *
 * @param obj An object
 * @param param The current query parameter
 * @returns A URI component
 */
function serializeObject(obj: Attributes, param?: string) {
  let str = ''

  Object.keys(obj).forEach(key => {
    const value = obj[key] as Attributes

    if (param) str += `&${param}`

    if (isPlainObject(value)) {
      str += `[${key}]${serializeObject(value)}`
    } else if (isDefined(value)) {
      str += `[${key}]=${value}`
    }
  })

  return str
}

/**
 * Constructs a URL query string for JSON API parameters
 *
 * @param params Parameters to parse
 * @param prefix Prefix returned string with `?` (default `false`)
 * @returns A URL query string
 */
function toQueryString(params: ParamsObject, prefix = false) {
  let str = ''

  Object.keys(params).forEach(key => {
    const value = params[key] as Attributes

    if (isPlainObject(value)) {
      str += serializeObject(value, key)
    } else if (isDefined(value)) {
      str += `&${key}=${value}`
    }
  })

  str = encodeURI(str.slice(1))

  return str.length > 0 ? (prefix ? `?${str}` : str) : ''
}

/**
 * Serializes a parameter object into a URL query string
 *
 * @param params Query parameters
 * @param options Serialization options
 * @returns A URL query string
 */
export function serializeParams(
  params: Params = {},
  options: SerializeParamsOptions = {},
) {
  const { prefix, size = 10, totals = false, type = undefined } = options
  const { fields, filter, include, page = 1, pageSize = size, sort } = params
  const obj: ParamsObject = { fields, filter }
  const pp: PageParams = {}

  obj.include = isArray(include) ? include.join(',') : include
  obj.sort = isArray(sort) ? sort.join(',') : sort

  if (totals) pp.totals = totals

  if (type === 'offset') {
    const p = page > 0 ? page : 1
    pp.offset = (p - 1) * pageSize
    pp.limit = pageSize
  } else if (type) {
    pp.number = page
    pp.size = pageSize
  }

  if (Object.keys(pp).length > 0) obj.page = pp

  return toQueryString(obj, prefix)
}
