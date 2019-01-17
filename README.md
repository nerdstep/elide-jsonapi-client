# Elide JSON API Client

[![npm](https://flat.badgen.net/npm/v/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![npm](https://flat.badgen.net/npm/dt/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/elide-jsonapi-client)](https://bundlephobia.com/result?p=elide-jsonapi-client)
[![code coverage](https://flat.badgen.net/coveralls/c/github/nerdstep/elide-jsonapi-client)](https://coveralls.io/github/nerdstep/elide-jsonapi-client)
[![maintainability](https://flat.badgen.net/codeclimate/maintainability/nerdstep/elide-jsonapi-client)](https://codeclimate.com/github/nerdstep/elide-jsonapi-client)
[![build status](https://flat.badgen.net/travis/nerdstep/elide-jsonapi-client)](https://travis-ci.org/nerdstep/elide-jsonapi-client)
[![styled with prettier](https://flat.badgen.net/badge/styled%20with/prettier/pink)](https://github.com/prettier/prettier)
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

## Development

```bash
git clone https://github.com/nerdstep/elide-jsonapi-client.git
cd elide-jsonapi-client
yarn install
```

### Scripts

- `npm t`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code

## Changelog

See [CHANGELOG](./CHANGELOG.md)

## To Do

See [TODO](./TODO.md)

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md)

## Credits

Bootstrapped with [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)

Inspired by [Kitsu](https://github.com/wopian/kitsu/tree/master/packages/kitsu)

## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
