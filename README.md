# Chorus One Staking Dashboard

This it the Chorus One Staking Dashboard project. This is a React project is built in TypeScript using [Create React App](https://github.com/facebook/create-react-app).

## Project Overview

This is a React app built in TypeScript, which uses the following libraries, technologies and tools:

- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [BlueprintJS](https://blueprintjs.com/): A React-based UI kit component library.
- [Styled Components](https://www.styled-components.com/): CSS-in-JS component approach to styling.
- [React Router](https://reacttraining.com/react-router/web/guides/quick-start): A declarative routing library built for React.
- [React Context](https://reactjs.org/docs/context.html): For managing and sharing state throughout the application.
- [Apollo](https://www.apollographql.com/docs/react/): For fetching and managing data.
- [GraphQL](https://graphql.org/): A query language for your API.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
- [TSLint](https://palantir.github.io/tslint/): A linter for TypeScript, with extensions for immutability and other tools like Blueprint.
- [Prettier](https://prettier.io/): An opinionated code formatter for JavaScript and related languages.
- [Jest](https://jestjs.io/): The JavaScript test runner.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro): A simple testing library for React.
- [React Hooks Testing Library](https://react-hooks-testing-library.com/): A new library to test custom React Hooks.
- [Cypress](https://www.cypress.io/): An end-to-end testing framework for web applications.
- [GitLab CI](https://about.gitlab.com/product/continuous-integration/): For continuous integration and deployment.
- [DangerJS](https://danger.systems/js/): Automation for common code review tasks.
- [Yarn](https://yarnpkg.com/en/): For dependency management.

## Local Development

In the project directory, you can run:

```sh
yarn install
yarn start
```

This will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

We recommend using the [VS Code editor](https://code.visualstudio.com/) because of it's excellent TypeScript integration. If you use VS Code, the included `.vscode` folder will recommend settings and extensions for your workspace. You can easily install the recommended extensions, if you do not have them. This will include extensions which integrate Prettier and TSLint with your editor, for instance.

## Testing

This project is built in TypeScript to take advantage of static typing and uses other tools like Prettier and TSLint to establish consistent code styling. All of these tools are integrated and configuration in the runnable project scripts and tests. For instance you can run:

```sh
yarn prettier      # runs Prettier
yarn tslint        # runs TSLint
yarn tsc           # runs the TypeScript compiler
yarn test:unit     # runs the project unit tests using Jest
yarn test:watch    # runs the unit tests in Jest watch mode
yarn test          # runs all the above tests
```

You can also run `yarn prettier:fix` or `yarn tslint:fix` to use the auto-fix options for these tools to fix any issues. Normally, any linting/styling issues should be fixed automatically on-save if you are using VS Code with the recommended extensions.

The overall approach to testing for this project follows the idea of the ["testing pyramid"](https://martinfowler.com/articles/practical-test-pyramid.html) and looks like this:

1. Static analysis (TypeScript, TSLint, and Prettier).
2. Unit tests: ideally 100% test coverage of all functions (Jest test runner).
3. Integration tests: entire application or major components can be tested or mocked using React snapshot testing.
4. UI testing/E2E/Acceptance Tests. Use of some framework like Cypress for testing the full application.

Using these approaches, our goal is to have total test coverage for the entire application. These tests will be automated and run continuously against code changes so developers can ship code frequently to production with confidence and get feedback quickly and early whenever their changes introduce bugs or regressions.

## Contributing

We use the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for developing new features. Briefly, this involves pulling the `master` branch, developing your fix or feature on a new branch, and then creating a pull request for your code changes. It is recommended to try to keep pull requests simple and confined to a concise set of changes to make it easy to review and merge code. Pull requests require review and all status checks (continuous integration checks, for instance) to pass before merging is allowed. Continuous integration for the project runs using [GitLab CI](https://docs.gitlab.com/ee/ci/) and is configured in the `.gitlab-ci.yml` file.

When merging code we recommend choosing the "Squash and Merge" option to reduce all your pull request commits to a single commit on the `master` branch. This approach should get the primary git history clear. For example, maybe you have 15 commits on a branch where you develop a new feature but then squash these to a single commit `Implement settings page and components`. If the commit should contain additional context, it can be included in the commit description.

## Deployment

```sh
yarn build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).
