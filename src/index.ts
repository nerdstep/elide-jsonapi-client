import axios, { AxiosInstance } from 'axios'
import { error } from './error'
import { deserialize } from './deserialize'
import { deserializeMutation } from './deserializeMutation'
import { serialize } from './serialize'
import { serializeMutation } from './serializeMutation'
import { serializeParams } from './serializeParams'
import { NormalizedResource, Params, SerializeOptions } from './types'
import { OperationType } from './types/jsonpatch'

const JSON_API_CONTENT_TYPE = 'application/vnd.api+json'
const JSON_API_PATCH_CONTENT_TYPE = 'application/vnd.api+json; ext=jsonpatch'

/**
 * @class ApiClient
 */
export default class ApiClient {
  axios: AxiosInstance
  dateAttrs: string[]
  headers: object
  jsonPatchHeaders: object
  protectedAttrs: string[]

  constructor({
    baseURL = '/',
    dateAttrs = [],
    headers = {},
    timeout = 20000, // 20s
    pagignation = {
      size: 10,
      totals: true,
      type: 'offset',
    },
    protectedAttrs = [],
  } = {}) {
    this.dateAttrs = dateAttrs
    this.protectedAttrs = protectedAttrs

    this.headers = Object.assign({}, headers, {
      Accept: JSON_API_CONTENT_TYPE,
      'Content-Type': JSON_API_CONTENT_TYPE,
    })

    this.jsonPatchHeaders = Object.assign({}, headers, {
      Accept: JSON_API_PATCH_CONTENT_TYPE,
      'Content-Type': JSON_API_PATCH_CONTENT_TYPE,
    })

    this.axios = axios.create({
      baseURL,
      paramsSerializer: /* istanbul ignore next */ (o: object) =>
        serializeParams(o, pagignation),
      timeout,
    })
  }

  getHeaders(headers?: object, jsonPatch?: boolean) {
    if (jsonPatch) {
      return Object.assign({}, this.jsonPatchHeaders, headers)
    }

    return Object.assign({}, this.headers, headers)
  }

  serialize(data: NormalizedResource, options?: SerializeOptions) {
    const { dateAttrs, protectedAttrs } = this
    const opts = Object.assign({}, { dateAttrs, protectedAttrs }, options)
    return serialize(data, opts)
  }

  async get(url: string, params: Params = {}, headers?: object) {
    try {
      const { data } = await this.axios.get(url, {
        params,
        headers: this.getHeaders(headers),
      })

      return deserialize(data)
    } catch (err) {
      throw error(err)
    }
  }

  // Alias
  fetch = this.get

  async post(url: string, data: object, headers?: object) {
    try {
      const response = await this.axios.post(url, data, {
        headers: this.getHeaders(headers),
      })

      return response
    } catch (err) {
      /* istanbul ignore next */
      throw error(err)
    }
  }

  async create(url: string, data: NormalizedResource, headers?: object) {
    const response = await this.post(url, this.serialize(data), headers)
    return deserialize(response.data)
  }

  async patch(
    url: string,
    data: object,
    headers?: object,
    jsonPatch?: boolean,
  ) {
    try {
      const response = await this.axios.patch(url, data, {
        headers: this.getHeaders(headers, jsonPatch),
      })

      return response
    } catch (err) {
      /* istanbul ignore next */
      throw error(err)
    }
  }

  /* istanbul ignore next */
  async update(url: string, data: NormalizedResource, headers?: object) {
    const response = await this.patch(
      url,
      this.serialize(data, { idRequired: true }),
      headers,
    )
    return deserialize(response.data)
  }

  async mutate(
    url: string,
    op: OperationType,
    path: string,
    data: NormalizedResource[],
    headers?: object,
  ) {
    const response = await this.patch(
      url,
      serializeMutation(op, path, data),
      headers,
      true,
    )
    return deserializeMutation(response.data)
  }

  async delete(url: string, data?: object, headers?: object) {
    try {
      const response = await this.axios.delete(url, {
        data,
        headers: Object.assign(this.headers, headers),
      })

      return response.data
    } catch (err) {
      throw error(err)
    }
  }

  async remove(type: string, id: string, headers?: object) {
    const response = await this.delete(`${type}/${id}`, undefined, headers)
    return response
  }
}
