import { isArray, isPlainObject } from 'ts-util-is'

interface Params {
  fields?: string | object
  filter?: string | object
  include?: string | string[]
  page?: number
  pageSize?: number
  sort?: string | string[]
}

interface Options {
  prefix?: boolean
  size?: number
  totals?: boolean
  type?: string
}

interface PageParams {
  limit?: number
  number?: number
  offset?: number
  size?: number
  totals?: boolean
}

interface ParamsObject {
  fields?: string | object
  filter?: string | object
  include?: string
  page?: PageParams
  sort?: string
  [k: string]: string | object | PageParams | undefined
}

function serializeObject(obj: object, param?: string) {
  let str = ''

  Object.keys(obj).forEach(key => {
    const value = obj[key]

    if (param) str += `&${param}`

    if (isPlainObject(value)) {
      str += `[${key}]${serializeObject(value)}`
    } else {
      str += `[${key}]=${value}`
    }
  })

  return str
}

/**
 * Constructs a URL query string for JSON:API parameters
 *
 * @param params Parameters to parse
 * @param prefix Prefix returned string with `?` (default `false`)
 * @returns URL query string
 */
function toQueryString(params: ParamsObject, prefix = false) {
  let str = ''

  Object.keys(params).forEach(key => {
    const value = params[key]

    if (isPlainObject(value)) {
      str += serializeObject(value, key)
    } else if (value) {
      str += `&${key}=${value}`
    }
  })

  str = encodeURI(str.slice(1))

  return str.length > 0 ? (prefix ? `?${str}` : str) : ''
}

export function serializeParams(params: Params = {}, options: Options = {}) {
  const { prefix, size = 10, totals = false, type = undefined } = options
  const { fields, filter, include, page = 1, pageSize = size, sort } = params
  const obj: ParamsObject = {}
  const pp: PageParams = {}

  if (fields) obj.fields = fields

  if (filter) obj.filter = filter

  if (include) {
    obj.include = isArray(include) ? include.join(',') : include
  }

  if (sort) {
    obj.sort = isArray(sort) ? sort.join(',') : sort
  }

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
