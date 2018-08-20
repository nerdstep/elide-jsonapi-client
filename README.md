# Elide JSON API Client

[![NPM](https://flat.badgen.net/npm/v/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![NPM](https://flat.badgen.net/npm/dt/elide-jsonapi-client)](https://www.npmjs.com/package/elide-jsonapi-client)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/elide-jsonapi-client)](https://bundlephobia.com/result?p=elide-jsonapi-client)
[![codecov](https://flat.badgen.net/codecov/c/github/nerdstep/elide-jsonapi-client)](https://codecov.io/gh/nerdstep/elide-jsonapi-client)
[![styled with prettier](https://flat.badgen.net/badge/styled%20with/prettier/pink)](https://github.com/prettier/prettier)
[![license](https://flat.badgen.net/github/license/nerdstep/elide-jsonapi-client)](./LICENSE)

> An opinionated [{json:api}](http://jsonapi.org) client for [Elide](http://elide.io) based APIs

There are already a number of client libraries for working with JSON API, however this library is specifically designed for interacting with Elide based APIs, which has a few of it's own unique characteristics.

## Features

- Built with Typescript!
- Built on top of [axios](https://github.com/axios/axios) as a peer dependency
- JSON API response normalization
  - Flatter structure
  - Merges included relationship data
- Serializes normalized resources back to a JSON API structure
  - Dates are converted to Unix epoch time for Elide
  - Protected fields can be omitted from being sent to the API
- Supports [JSON Patch Extension] for bulk writes and complex mutations(https://github.com/json-api/json-api/blob/9c7a03dbc37f80f6ca81b16d444c960e96dd7a57/extensions/jsonpatch/index.md)
- Parameter serialization
  - Fields, filter, include, sort
  - [Pagination](http://elide.io/pages/guide/10-jsonapi.html#pagination): `size` & `number` OR `offset` & `limit`

## Usage

**Coming Soon**

## Development

```bash
git clone https://github.com/nerdstep/elide-jsonapi-client.git
yarn install
```

### Scripts

- `npm t`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code

## To Do List

See [TODO](./TODO.md)

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md)

## Credits

Bootstrapped with [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter).

Inspired by [Kitsu](https://github.com/wopian/kitsu/tree/master/packages/kitsu).

## License

MIT © [Justin M. Williams](https://github.com/nerdstep)
