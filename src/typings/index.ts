import { Attribute, Attributes, Error, Meta, ResourceObject } from './jsonapi'
import { AxiosError } from 'axios'

/**
 * Errors
 */

export declare type ElideError = {
  error: string
  message: string
  path: string
  status: number
  timestamp: string
}

export interface ApiError extends AxiosError {
  errors?: [Error] | string[]
}

/**
 * Resources
 */

export interface NormalizedResource {
  id?: string
  type: string
  [index: string]: Attribute
}

export declare type NormalizedResourceOrResources =
  | NormalizedResource
  | NormalizedResource[]

export interface NormalizedResponse {
  data: NormalizedResourceOrResources
  meta?: Meta
}

/**
 * Relationships
 */

export declare type RelationshipRef = {
  id: string
  type: string
}

export interface NormalizedRelationship extends RelationshipRef {
  [index: string]: Attribute
}

export interface NormalizedRelationships {
  [index: string]: NormalizedRelationship | NormalizedRelationship[]
}

/**
 * Parameters
 */

export declare type Params = {
  fields?: string | Attributes
  filter?: string | Attributes
  include?: string | string[]
  page?: number
  pageSize?: number
  sort?: string | string[]
}

export declare type PageParams = {
  limit?: number
  number?: number
  offset?: number
  size?: number
  totals?: boolean
}

export interface ParamsObject {
  fields?: string | Attributes
  filter?: string | Attributes
  include?: string
  page?: PageParams
  sort?: string
  [index: string]: string | object | PageParams | undefined
}

/**
 * Options
 */

export declare type SerializeOptions = {
  dateAttrs?: string[]
  idRequired?: boolean
  protectedAttrs?: string[]
}

export declare type SerializeParamsOptions = {
  prefix?: boolean
  size?: number
  totals?: boolean
  type?: string
}
