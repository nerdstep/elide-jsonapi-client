import axios, { AxiosInstance } from 'axios'
import { deserialize } from './deserialize'
import { deserializeMutation } from './deserializeMutation'
import { error } from './error'
import { mapResources } from './mapResources'
import { serialize } from './serialize'
import { serializeMutation } from './serializeMutation'
import { serializeParams } from './serializeParams'
import {
  NormalizedResource,
  NormalizedResourceOrResources,
  Params,
  SerializeOptions,
} from './typings'
import { OperationType } from './typings/jsonpatch'
import { concatUnique } from './util'

const JSON_API_CONTENT_TYPE = 'application/vnd.api+json'
const JSON_API_PATCH_CONTENT_TYPE = 'application/vnd.api+json; ext=jsonpatch'

/**
 * @class ApiClient
 *
 * Client for Elide based JSON APIs
 */
export default class ApiClient {
  axios: AxiosInstance
  dateAttrs: string[]
  headers: object
  jsonPatchHeaders: object
  protectedAttrs: string[]

  constructor({
    baseURL = '/',
    dateAttrs = [] as string[],
    headers = {},
    timeout = 20000, // 20s
    pagignation = {
      size: 10,
      totals: true,
      type: 'offset',
    },
    protectedAttrs = [] as string[],
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

  /**
   * Merges provided header properties with the class instance properties
   *
   * @param headers
   * @param jsonPatch
   */
  getHeaders(headers?: object, jsonPatch?: boolean) {
    if (jsonPatch) {
      return Object.assign({}, this.jsonPatchHeaders, headers)
    }

    return Object.assign({}, this.headers, headers)
  }

  /**
   * Merges provided options with the class instance options
   *
   * @param {Object} options
   * @property {string[]} dateAttrs
   * @property {bool} idRequired
   * @property {string[]} protectedAttrs
   */
  getOptions(
    {
      dateAttrs = [],
      idRequired = false,
      protectedAttrs = [],
    } = {} as SerializeOptions,
  ) {
    const uniqDateAttrs = concatUnique(this.dateAttrs, dateAttrs)
    const uniqProtectedAttrs = concatUnique(this.protectedAttrs, protectedAttrs)

    return {
      dateAttrs: uniqDateAttrs,
      idRequired,
      protectedAttrs: uniqProtectedAttrs,
    }
  }

  /**
   * Serializes a normalized resource object into a JSON API structure
   *
   * @param data
   * @param options
   */
  serialize(data: NormalizedResource, options?: SerializeOptions) {
    return serialize(data, this.getOptions(options))
  }

  /******************************************************************
   * FETCH
   *****************************************************************/

  /**
   * Fetch an API resource
   *
   * @param url
   * @param params
   * @param headers
   */
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

  /******************************************************************
   * CREATE
   *****************************************************************/

  /**
   * Create a new resource
   *
   * Does not serialize the request data or deserialize the response
   *
   * @param url
   * @param data
   * @param headers
   */
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

  /**
   * Create a new resource
   *
   * Serializes the request data and deserializes the response
   *
   * @param url
   * @param data
   * @param options
   * @param headers
   */
  async create(
    url: string,
    data: NormalizedResource,
    options?: SerializeOptions,
    headers?: object,
  ) {
    const response = await this.post(
      url,
      this.serialize(data, options),
      headers,
    )

    return deserialize(response.data)
  }

  /******************************************************************
   * UPDATE
   *****************************************************************/

  /**
   * Update a resource
   *
   * Does not serialize the request data or deserialize the response
   *
   * @param url
   * @param data
   * @param headers
   * @param jsonPatch
   */
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

  /**
   * Update a resource
   *
   * Serializes the request data and deserializes the response
   *
   * @param url
   * @param data
   * @param options
   * @param headers
   */
  async update(
    url: string,
    data: NormalizedResource,
    options?: SerializeOptions,
    headers?: object,
  ) {
    const opts = Object.assign({}, options, { idRequired: true })
    const response = await this.patch(url, this.serialize(data, opts), headers)

    return deserialize(response.data)
  }

  /**
   * JSON Patch Extension mutation
   *
   * @param url
   * @param op
   * @param path
   * @param data
   * @param headers
   */
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

  /******************************************************************
   * DELETE
   *****************************************************************/

  /**
   * Delete a resource
   *
   * Can accept a resource object or collection of resources to delete
   *
   * @param url
   * @param data
   * @param headers
   */
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

  /**
   * Delete a resource by ID
   *
   * @param type
   * @param id
   * @param headers
   */
  async remove(type: string, id: string | number, headers?: object) {
    const response = await this.delete(`${type}/${id}`, undefined, headers)
    return response
  }

  /******************************************************************
   * RELATIONSHIPS
   *****************************************************************/

  /**
   * Creates a relationship between a parent resource
   * and the provided resource(s)
   *
   * @param type The parent resource Type
   * @param id  The parent resource ID
   * @param relationshipType The relationship resource Type
   * @param data The related resource or collection of related resources
   * @param headers Request headers
   */
  async createRelationship(
    type: string,
    id: string,
    relationshipType: string,
    data: NormalizedResourceOrResources,
    headers?: object,
  ) {
    const resources = mapResources(data)

    const response = await this.post(
      `${type}/${id}/relationships/${relationshipType}`,
      resources,
      headers,
    )

    return response
  }

  /**
   * Removes a relationship between a parent resource
   * and the provided resource(s)
   *
   * @param type The parent resource Type
   * @param id  The parent resource ID
   * @param relationshipType The relationship resource Type
   * @param data The related resource or collection of related resources
   * @param headers Request headers
   */
  /* istanbul ignore next // virtually the same as createRelationship */
  async removeRelationship(
    type: string,
    id: string,
    relationshipType: string,
    data: NormalizedResourceOrResources,
    headers?: object,
  ) {
    const resources = mapResources(data)

    const response = await this.delete(
      `${type}/${id}/relationships/${relationshipType}`,
      resources,
      headers,
    )

    return response
  }
}
