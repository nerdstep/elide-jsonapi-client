import axios, { AxiosInstance } from 'axios'
import { Attributes } from 'ts-json-api'
import { error } from './error'
import { deserialize } from './deserialize'
import { serialize } from './serialize'
import { serializeParams } from './serializeParams'

const JSON_API_CONTENT_TYPE = 'application/vnd.api+json'
const JSON_API_PATCH_CONTENT_TYPE = 'application/vnd.api+json; ext=jsonpatch'

/**
 * @class ApiClient
 */
export default class ApiClient {
  axios: AxiosInstance
  headers: object
  jsonPatchHeaders: object

  constructor({
    baseURL = '',
    headers = {},
    timeout = 20000, // 20s
    pagignation = {
      size: 10,
      totals: true,
      type: 'offset',
    },
  } = {}) {
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
      /* istanbul ignore next */
      paramsSerializer: (o: object) => serializeParams(o, pagignation),
      timeout,
    })
  }

  getHeaders(headers = {}, jsonPatch?: boolean) {
    if (jsonPatch) {
      return Object.assign({}, this.jsonPatchHeaders, headers)
    }

    return Object.assign({}, this.headers, headers)
  }

  async get(url: string, params = {}, headers = {}) {
    try {
      // istanbul ignore next */
      const { data } = await this.axios.get(url, {
        params,
        headers: this.getHeaders(headers),
      })

      return deserialize(data)
    } catch (err) {
      throw error(err)
    }
  }

  async post(url: string, data: object, headers = {}) {
    try {
      const response = await this.axios.post(url, data, {
        headers: this.getHeaders(headers),
      })

      return response.data
    } catch (err) {
      throw error(err)
    }
  }

  async create(type: string, data: Attributes, headers = {}) {
    const response = await this.post(type, serialize(data))
    return response
  }

  async update(url: string, data: object, headers = {}, jsonPatch?: boolean) {
    try {
      //const serialData = await serialise.apply(this, [ model, body, 'PATCH' ])
      const response = await this.axios.patch(url, data, {
        headers: this.getHeaders(headers, jsonPatch),
      })

      return response.data
    } catch (err) {
      throw error(err)
    }
  }

  async remove(url: string, data: object, headers = {}) {
    try {
      const response = await this.axios.delete(url, {
        //data: serialize.apply(this, [ model, { id }, 'DELETE' ]),
        data,
        headers: Object.assign(this.headers, headers),
      })

      return response.data
    } catch (err) {
      throw error(err)
    }
  }
}
