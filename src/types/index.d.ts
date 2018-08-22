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

export declare type Relationship = {
  id: string
  type: string
}

export interface RelationshipWithData {
  id: string
  type: string
  [index: string]: Attribute
}

export interface NormalizedRelationships {
  [index: string]: Relationship | Relationship[]
}

export interface NormalizedResponse {
  data: NormalizedResourceOrResources
  meta?: Meta
}

/**
 * Parameters
 */

export declare type Params = {
  fields?: Attributes
  filter?: Attributes
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
  fields?: Attributes
  filter?: Attributes
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
