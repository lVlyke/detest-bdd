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

* [Template](#template)
* [Spec](#spec)
* [Random](#random)

(For more information, see the full [**API reference**](#api))

### Template

When writing unit tests, it's easy to write redundant test code repeatedly with only minor variations. This leads to code that's not only tedious to write, but hard to read and refactor in the future. Test templates solve this issue by allowing you to write parts of your test code in a container that allow you to pass input values and modify the shape of the test code based on those inputs.

#### Example

First, let's look at an example of a unit test without ```Template```.

Given this piece of code:

```ts
export interface Options {
    round?: boolean;
    absolute?: boolean;
}

export class Calculator {

    public divide(a: number, b: number, options?: Options): number {
        options = options || {};
        let result = a / b;

        result = options.round ? Math.round(result) : result;
        return options.absolute ? Math.abs(result) : result;
    }
}
```

And the associated unit tests:

```ts
describe("Given a Calculator", () => {

    beforeEach(function () {
        this.calculator = new Calculator();
    });

    beforeEach(function () {
        this.a = Random.number();
        this.b = Random.number();
    });

    describe("when the divide method is called", () => {

        describe("when options are passed", () => {

            describe("when options.round is true", () => {

                describe("when options.absolute is true", () => {

                    it("then it should return the expected value", function () {
                        this.expected = Math.abs(Math.round(this.a / this.b));

                        expect(this.calculator.divide(this.a, this.b, {
                            round: true,
                            absolute: true
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is false", () => {

                    it("then it should return the expected value", function () {
                        this.expected = Math.round(this.a / this.b);

                        expect(this.calculator.divide(this.a, this.b, {
                            round: true,
                            absolute: false
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is undefined", () => {

                    it("then it should return the expected value", function () {
                        this.expected = Math.round(this.a / this.b);

                        expect(this.calculator.divide(this.a, this.b, {
                            round: true
                        })).toEqual(this.expected);
                    });
                });
            });

            describe("when options.round is false", () => {

                describe("when options.absolute is true", () => {

                    it("then it should return the expected value", function () {
                        this.expected = Math.abs(this.a / this.b);

                        expect(this.calculator.divide(this.a, this.b, {
                            round: false,
                            absolute: true
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is false", () => {

                    it("then it should return the expected value", function () {
                        this.expected = this.a / this.b;

                        expect(this.calculator.divide(this.a, this.b, {
                            round: false,
                            absolute: false
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is undefined", () => {

                    it("then it should return the expected value", function () {
                        this.expected = this.a / this.b;

                        expect(this.calculator.divide(this.a, this.b, {
                            round: false
                        })).toEqual(this.expected);
                    });
                });
            });

            describe("when options.round is not specified", () => {

                describe("when options.absolute is true", () => {

                    it("then it should return the expected value", function () {
                        this.expected = Math.abs(this.a / this.b);

                        expect(this.calculator.divide(this.a, this.b, {
                            absolute: true
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is false", () => {

                    it("then it should return the expected value", function () {
                        this.expected = this.a / this.b;

                        expect(this.calculator.divide(this.a, this.b, {
                            absolute: false
                        })).toEqual(this.expected);
                    });
                });

                describe("when options.absolute is undefined", () => {

                    it("then it should return the expected value", function () {
                        this.expected = this.a / this.b;

                        expect(this.calculator.divide(this.a, this.b, {})).toEqual(this.expected);
                    });
                });
            });
        });

        describe("when options are NOT passed", () => {

            it("then it should return the expected value", function () {
                this.expected = this.a / this.b;

                expect(this.calculator.divide(this.a, this.b)).toEqual(this.expected);
            });
        });
    });
});
```

Output:

```bash
..........

10 specs, 0 failures
Finished in 0.026 seconds
```

The first thing you'll probably notice about each of the tests is that they all basically do the same thing. There are minor changes, such as a call to ```Math.abs``` or ```Math.round``` depending on the flags passed to ```divide```, but otherwise it is just redundant code. If we want to add new flags for ```divide``` in the future, we'll have to go through the same process, and add more redundant test code to cover all cases.

Using ```Template``` however, we can abstract this code redundancy out to a set of inputs. Like a for loop allows us to express logic only once for a series of many inputs, ```Template``` allows us to write out test code logic once, and run it on multiple inputs.

Here are the unit tests from the previous example, but rewritten with ```Template```:

```ts
describe("Given a Calculator", () => {

    beforeEach(function () {
        this.calculator = new Calculator();
    });

    beforeEach(function () {
        this.a = Random.number();
        this.b = Random.number();
        this.expected = this.a / this.b;
    });

    describe("when the divide method is called", Template(["options"], (options: Options) => {

        if (options) {
            describe(`when the round flag is ${options.round} and the absolute flag is ${options.absolute}`, () => {

                beforeEach(function () {
                    if (options) {
                        this.expected = options.round ? Math.round(this.expected) : this.expected;
                        this.expected = options.absolute ? Math.abs(this.expected) : this.expected;
                    }
                });

                it("then it should return the expected value", function () {
                    expect(this.calculator.divide(this.a, this.b, options)).toEqual(this.expected);
                });
            });
        }
        else {
            it("then it should return the expected value", function () {
                expect(this.calculator.divide(this.a, this.b)).toEqual(this.expected);
            });
        }
    }, { options: undefined },
       { options: {}},
       { options: { round: true }},
       { options: { round: false }},
       { options: { absolute: true }},
       { options: { absolute: false }},
       { options: { round: true, absolute: true }},
       { options: { round: false, absolute: true }},
       { options: { round: true, absolute: false }},
       { options: { round: false, absolute: false }}
    ));
});
```

Output:

```bash
..........

10 specs, 0 failures
Finished in 0.026 seconds
```

Without losing any test coverage at all, we've gone from having to write **10** unit tests to only **2**.

For more information, see the [**API reference**](#template-1).

### Random

Random is a namespace for providing basic random values for tests.

#### Example

```ts
describe("Given a Calculator", () => {

    spec.beforeEach((params: CalculatorTest) => {
        params.calculator = new Calculator();
    });

    spec.beforeEach((params: CalculatorTest) => {
        params.a = Random.number();
        params.b = Random.number();
        params.expected = params.a / params.b;
    });

    ...
```

Random supports ```number```, ```integer```, ```boolean```, and ```string```.

For more information, see the [**API reference**](#random-1).

### Spec

The ```Spec``` namespace contains a helper object that enables more type-safe testing by exposing a type for all test spec parameters. ```Spec``` proxies the built-in testing functions (```beforeEach```, ```afterEach```, and ```it```) and provides the test spec's parameters as a type-safe argument to the callback.

#### Example

```ts
import { Spec, Template, Random } from "bdd-test-helpers";

interface CalculatorTest {
    calculator: Calculator;
    a: number;
    b: number;
    expected: number;
}

const spec = Spec.create<CalculatorTest>();

describe("Given a Calculator", () => {

    spec.beforeEach((params: CalculatorTest) => {
        params.calculator = new Calculator();
    });

    spec.beforeEach((params: CalculatorTest) => {
        params.a = Random.number();
        params.b = Random.number();
        params.expected = params.a / params.b;
    });

    describe("when the divide method is called", Template(["options"], (options: Options) => {

        if (options) {
            describe(`when the round flag is ${options.round} and the absolute flag is ${options.absolute}`, () => {

                spec.beforeEach((params: CalculatorTest) => {
                    if (options) {
                        params.expected = options.round ? Math.round(params.expected) : params.expected;
                        params.expected = options.absolute ? Math.abs(params.expected) : params.expected;
                    }
                });

                spec.it("then it should return the expected value", (params: CalculatorTest) => {
                    expect(params.calculator.divide(params.a, params.b, options)).toEqual(params.expected);
                });
            });
        }
        else {
            spec.it("then it should return the expected value", (params: CalculatorTest) => {
                expect(params.calculator.divide(params.a, params.b)).toEqual(params.expected);
            });
        }
    }, { options: undefined },
       { options: {}},
       { options: { round: true }},
       { options: { round: false }},
       { options: { absolute: true }},
       { options: { absolute: false }},
       { options: { round: true, absolute: true }},
       { options: { round: false, absolute: true }},
       { options: { round: true, absolute: false }},
       { options: { round: false, absolute: false }}
    ));
});
```

```Spec``` also replaces the traditional injection of the ```doneFn``` for asynchronous tests in favor of returning a Promise from the callback when waiting for an asynchronous task.

#### Example

```ts
declare var FooService: {
    getResult: Promise<FooResult>;
};

describe("Given a FooService", () => {

    describe("when getResult is called", () => {

        spec.beforeEach((params: FooServiceTest): Promise<any> => {
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

For more information, see the [**API reference**](#spec-1).

## API

### Template

```ts
interface Template<T extends object> {
    paramNames: string[];
    invoke: Template.InvokeFn<T>;
    run: Template.RunFn<T>;
}
```

TODO

```ts
function Template<T extends object>(paramNames: string[], callback: Template.CallbackFn, ...paramsList: T[]): () => void;
```

TODO

#### Template.create

```ts
function Template.create<T extends object>(paramNames: string[], callback: CallbackFn): Template<T>;
```

TODO

### Spec

```ts
interface Spec<T> {
    beforeEach(callback: Spec.Callback<T>): void;
    afterEach(callback: Spec.Callback<T>): void;
    it(description: string, callback: Spec.Callback<T>): void;
}
```

TODO

#### Spec.create

```ts
function Spec.create<T>(): Spec<T>;
```

TODO

#### Spec.inject

```ts
function Spec.inject<T>(callback: Spec.Callback<T>): (doneFn: DoneFn) => void;
```

TODO

### Random

#### Random.number

```ts
function Random.number(min?: number, max?: number): number;
```

Returns a random number between ```min``` and ```max```. ```min``` defaults to 0 and ```max``` defaults to ```MAX_VALUE```.

#### Random.integer

```ts
function Random.integer(min?: number, max?: number): number;
```

Returns a random integer between ```min``` and ```max```. ```min``` defaults to 0 and ```max``` defaults to ```MAX_SAFE_INTEGER```.

#### Random.boolean

```ts
function Random.boolean(): boolean;
```

Returns a random boolean value.

#### Random.string

```ts
function Random.string(minLength?: number, maxLength?: number, options?: StringOptions): string;
```

Returns a random string between ```minLength``` and ```maxLength```. ```minLength``` defaults to 0 and ```maxLength``` defaults to ```20```.

If ```options.alpha``` is true, the string will contain letters. This is true by default.

If ```options.numeric``` is true, the string will contain letters. This is true by default.

If both ```options.alpha``` and ```options.numeric``` are false, an error will be thrown.