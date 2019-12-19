# Elide JSON API Client

[![npm](https://flat.badgen.net/npm/v/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![npm](https://flat.badgen.net/npm/dt/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/elide-jsonapi-client)](https://bundlephobia.com/result?p=elide-jsonapi-client)
[![code coverage](https://flat.badgen.net/coveralls/c/github/nerdstep/elide-jsonapi-client)](https://coveralls.io/github/nerdstep/elide-jsonapi-client)
[![maintainability](https://flat.badgen.net/codeclimate/maintainability/nerdstep/elide-jsonapi-client)](https://codeclimate.com/github/nerdstep/elide-jsonapi-client)
[![build status](https://flat.badgen.net/travis/nerdstep/elide-jsonapi-client)](https://travis-ci.org/nerdstep/elide-jsonapi-client)
[![styled with prettier](https://flat.badgen.net/badge/styled%20with/prettier/pink)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![license](https://flat.badgen.net/github/license/nerdstep/elide-jsonapi-client)](./LICENSE)

> An opinionated [{json:api}](http://jsonapi.org) client for [Elide](http://elide.io) based APIs

There are already a number of client libraries for working with JSON API, however this library is specifically designed for interacting with Elide based APIs, which has a few of it's own unique characteristics.

## Features

- Built with Typescript!
- Built on top of [axios](https://github.com/axios/axios) as a peer dependency
- Supports `Promises` and `async/await`
- JSON API response normalization
  - Flatter structure
  - Merges included relationship data
- Serializes normalized resources back to a JSON API structure
  - Dates are converted to Unix epoch time for Elide
  - Protected fields can be omitted from being sent to the API
- Supports [JSON Patch Extension](https://github.com/json-api/json-api/blob/9c7a03dbc37f80f6ca81b16d444c960e96dd7a57/extensions/jsonpatch/index.md) for bulk writes and complex mutations
- Parameter serialization
  - Fields, filter, include, sort
  - [Pagination](http://elide.io/pages/guide/10-jsonapi.html#pagination): `size` & `number` OR `offset` & `limit`
- Request caching and throttling

## [API Docs](https://nerdstep.github.io/elide-jsonapi-client)

## Basic Usage

```js
import ApiClient from 'elide-jsonapi-client'

// Initialize a new client
const api = new ApiClient({
  baseURL: 'http://localhost/api',
})

// Fetch a resource collection
const res = await api.fetch('articles')

// Create a resource
api.create('articles', {
  type: 'articles',
  title: 'Hello World',
})

// Update a resource
api.update('articles/1', {
  id: '1',
  type: 'articles',
  title: 'Hello World!!!',
})

// Remove a resource
api.remove('articles', 1)
```

### [Documentation](https://github.com/nerdstep/elide-jsonapi-client/wiki)

## Known Issues

Request caching is not working with axios v0.19.0 due to a custom config bug.

- https://github.com/axios/axios/pull/2207
- https://github.com/kuitos/axios-extensions/issues/54

## Changelog

See [CHANGELOG](./CHANGELOG.md)

## To Do

See [TODO](./TODO.md)

## Credits

Bootstrapped with [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)

Inspired by [Kitsu](https://github.com/wopian/kitsu/tree/master/packages/kitsu)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/white3km"><img src="https://avatars1.githubusercontent.com/u/58864197?v=4" width="100px;" alt=""/><br /><sub><b>Ken White</b></sub></a><br /><a href="https://github.com/nerdstep/elide-jsonapi-client/commits?author=white3km" title="Tests">⚠️</a> <a href="https://github.com/nerdstep/elide-jsonapi-client/commits?author=white3km" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome! See [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

## License

[MIT](./LICENSE)
