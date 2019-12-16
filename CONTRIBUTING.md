# Contributing

## Instructions

These steps will guide you through contributing to this project:

- Fork this repository
- Install dependencies by running `$ yarn`
- Implement your changes and tests
- Ensure tests are passing and all changes have 100% coverage by running `$ yarn test`
- Stage your changes and run `$ yarn commit`
- Finally send a [GitHub Pull Request](https://github.com/nerdstep/elide-jsonapi-client/compare?expand=1) with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).

### Scripts

- `yarn start`: Run the build in watch mode
- `yarn run test`: Lint code, run test suite, and generate coverage
- `yarn run test:dev`: Run test suite only
- `yarn run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `yarn run build`: Generate dist bundle, typings, and docs
- `yarn run lint`: Lint code
