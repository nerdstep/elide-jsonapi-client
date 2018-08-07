import axios, { AxiosInstance } from 'axios'
import { error } from './error'
import { deserialize } from './deserialize'

const JSON_API_CONTENT_TYPE = 'application/vnd.api+json'
const JSON_API_PATCH_CONTENT_TYPE = 'application/vnd.api+json; ext=jsonpatch'

/**
 * @class ApiClient
 */
export default class ApiClient {
  axios: AxiosInstance
  headers: object

  constructor({
    baseURL = '',
    headers = {},
    timeout = 20000, // 20s
  } = {}) {
    this.headers = Object.assign({}, headers, {
      Accept: JSON_API_CONTENT_TYPE,
      'Content-Type': JSON_API_CONTENT_TYPE,
    })

    this.axios = axios.create({
      baseURL,
      // @TODO add serializer
      paramsSerializer: (p: object) => '',
      timeout,
    })
  }

  async get(url: string, params = {}, headers = {}) {
    try {
      /* istanbul ignore next */
      const { data } = await this.axios.get(url, {
        params,
        headers: Object.assign(this.headers, headers),
      })

      return deserialize(data)
    } catch (err) {
      throw error(err)
    }
  }
}
