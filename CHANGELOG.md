<a name="1.0.2"></a>

### 1.0.2 (2019-12-19)

#### Summary

- bump version to re-publish to npm; this time with the `dist` files!

<a name="1.0.1"></a>

### 1.0.1 (2019-12-19)

#### Bug Fixes

- **normalize.ts:** avoid circular relationships in included ([d991daf4](https://github.com/nerdstep/elide-jsonapi-client.git/commit/d991daf4))

<a name="1.0.0"></a>

## 1.0.0 (2019-12-16)

#### Features

- populate included relationships ([c3803b62](https://github.com/nerdstep/elide-jsonapi-client.git/commit/c3803b62))

## 0.9.0 (2019-08-13)

### Summary

- Added support for request caching and throttling via `axios-extensions`

### Added

- Added `useCache` & `useThrottle` options to `ApiClient`

### Changed

- Reverted `axios` peerDependency to version `0.18.x` as there is currently a bug in `0.19.x` that breaks custom caching.
- Updated devDependencies

## 0.8.0 (2019-06-26)

### Changed

- Changed `axios` peerDependency to `^0.19.0`
- Updated devDependencies

## 0.7.0 (2019-06-10)

### Changed

- Check if relationship attribute is protected in serialization.

## 0.6.2 (2019-01-17)

### Changed

- Fix wiki link in README
- Improve JS Doc comments for better implicit TypeScript checks
- Fix `deploy-docs` script for Travis CI and create new script for local use

## 0.6.1 (2019-01-17)

### Changed

- Improve JS Doc comments for better implicit TypeScript checks

## 0.6.0 (2019-01-15)

### Added

- [BREAKING CHANGE] New `options` object as the third argument for the `create` and `update` methods. This breaks the function signature as the `headers` object becomes the fourth argument.
- Additional test coverage
- This CHANGELOG file

### Changed

- Update dev dependencies
