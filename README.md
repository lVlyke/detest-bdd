<!-- markdownlint-disable MD024 MD031 -->

# BDD Test Helpers

A set of utilities for BDD testing frameworks like Jasmine and Mocha, Chai that make tests more type-safe and more concise.

* [Installation](#installation)
* [Examples](#examples)
* [API](#api)

## Installation

The project can be installed [via **npm**](https://www.npmjs.com/package/bdd-test-helpers) using the following command:

```bash
npm install bdd-test-helpers
```

No further installation is required.

BDD Test Helpers works with any JavaScript testing framework that uses the ```describe``` ```beforeEach``` ```it``` syntax (i.e. Jasmine, Mocha + Chai, etc.).

## Examples

* [Suite](#suite)
* [Template](#template)
* [Random](#random)

(For more information, see the full [**API reference**](#api))

### Suite

The ```Suite``` namespace contains a helper object that enables more type-safe testing by exposing a type for all test suite parameters. ```Suite``` proxies the built-in testing functions (```beforeEach```, ```afterEach```, and ```it```) and provides the test suite's parameters as a type-safe argument to the callback.

```ts
import { Suite } from "bdd-test-helpers";

interface FooServiceTest {
    fooParams: any;
    fooResult: FooResult;
}

const suite = Suite.create<FooServiceTest>();

describe("Given a FooService", () => {

    describe("when getResult is called", () => {

        suite.beforeEach((params: FooServiceTest) => {
            params.fooParams = {
                input: "foobar"
            };

            params.fooResult = FooService.getResult(params.fooParams);
        });

        spec.it("should return the expected result", (params: FooServiceTest) => {
            expect(params.fooResult.output).toEqual("foobaz");
        });
    });
});
```

```Suite``` also replaces the traditional injection of the ```doneFn``` for asynchronous tests in favor of returning a Promise from the callback when waiting for an asynchronous task.

```ts
declare var FooService: {
    getResult: Promise<FooResult>;
};

describe("Given a FooService", () => {

    describe("when getResult is called", () => {

        suite.beforeEach((params: FooServiceTest): Promise<any> => {
            params.fooParams = {
                input: "foobar"
            };

            return FooService.getResult(params.fooParams).then(result => params.fooResult = result);
        });

        spec.it("should return the expected result", (params: FooServiceTest) => {
            expect(params.fooResult.output).toEqual("foobaz");
        });
    });
});
```

### Template

TODO

### Random

TODO

## API

### Suite

TODO


### Template

TODO

### Random

TODO