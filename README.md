<!-- markdownlint-disable MD024 MD031 -->

# Detest BDD

Detest BDD is a type-safe set of utilities that focuses on reducing the amount of test code that you write while maximizing coverage. Compatible with BDD testing frameworks like Jasmine and Mocha.

* [Installation](#installation)
* [Examples](#examples)
* [API](#api)

## Installation

The project can be installed [via **npm**](https://www.npmjs.com/package/detest-bdd) using the following command:

```bash
npm install detest-bdd
```

No further installation is required.

Detest BDD works with any JavaScript testing framework that uses the ```describe``` ```beforeEach``` ```it``` syntax (i.e. Jasmine, Mocha + Chai, etc.).

## Examples

* [Template](#template)
* [Input Builder](#input-builder)
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
                    this.expected = options.round ? Math.round(this.expected) : this.expected;
                    this.expected = options.absolute ? Math.abs(this.expected) : this.expected;
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

### Input Builder

The previous section explained ```Template``` and how it simplifies the amount of test code we have to write, but we can still do better. The input data that is passed to the templated test code often simply ends up being different permutations of the same data. For example, here's the input to the test template we wrote for ```Calculator.divide```:

```ts
[ { options: undefined },
  { options: {}},
  { options: { round: true }},
  { options: { round: false }},
  { options: { absolute: true }},
  { options: { absolute: false }},
  { options: { round: true, absolute: true }},
  { options: { round: false, absolute: true }},
  { options: { round: true, absolute: false }},
  { options: { round: false, absolute: false }} ]
```

As you can see, all of the inputs are just different combinations of values (and lack of values) to test all of the possible scenarios. When we have more than two or three input properties to test, the list of input data can get long quickly. This is where ```InputBuilder``` comes in. ```InputBuilder``` allows you to define values for individual input properties (called _fragments_), and then generates a list of all possible permutations of inputs to your test template based on those fragments.

Let's see what an ```InputBuilder``` would look like for our input data above:

```ts
InputBuilder
    .fragment({ options: undefined })
    .fragment({ options: {} })
    .fragmentBuilder("options", InputBuilder.
        .fragment({ round: true })
        .fragment({ round: false })
        .fragment({ absolute: true })
        .fragment({ absolute: false })
    )
    .build();
```

Each fragment defines a possible permutation of a specific input property that will be used to build the final list. As we can see above, it's also possible to generate fragments from another ```InputBuilder``` using the ```fragmentBuilder``` operator.

There's still some redundancy we can eliminate, however, by using the ```fragmentList``` operator to consolidate our fragment definitions:

```ts
InputBuilder
    .fragmentList({ options: [undefined, {}] })
    .fragmentBuilder("options", InputBuilder.
        .fragmentList({ round: [true, false] })
        .fragmentList({ absolute: [true, false] })
    )
    .build();
```

This generates the following output:

```ts
[ { options: undefined },
  { options: {}},
  { options: { round: true }},
  { options: { round: false }},
  { options: { absolute: true }},
  { options: { absolute: false }},
  { options: { round: true, absolute: true }},
  { options: { round: false, absolute: true }},
  { options: { round: true, absolute: false }},
  { options: { round: false, absolute: false }} ]
```

Now, let's put it all together by modifying the ```Calculator.divide``` unit tests we wrote earlier:

```ts
const DivideTemplateInput = InputBuilder
    .fragmentList({ options: [undefined, {}] })
    .fragmentBuilder("options", InputBuilder.
        .fragmentList({ round: [true, false] })
        .fragmentList({ absolute: [true, false] })
    );

describe("Given a Calculator", () => {

    beforeEach(function () {
        this.calculator = new Calculator();
    });

    beforeEach(function () {
        this.a = Random.number();
        this.b = Random.number();
        this.expected = this.a / this.b;
    });

    describe("when the divide method is called", Template(["options"], DivideTemplateInput, (options: Options) => {

        if (options) {
            describe(`when the round flag is ${options.round} and the absolute flag is ${options.absolute}`, () => {

                beforeEach(function () {
                    this.expected = options.round ? Math.round(this.expected) : this.expected;
                    this.expected = options.absolute ? Math.abs(this.expected) : this.expected;
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
    });
});
```

Output:

```bash
..........

10 specs, 0 failures
Finished in 0.026 seconds
```

For more information, see the [**API reference**](#input-builder-1).

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
import { Spec, Template, Random } from "detest-bdd";

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
                    params.expected = options.round ? Math.round(params.expected) : params.expected;
                    params.expected = options.absolute ? Math.abs(params.expected) : params.expected;
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

Represents a template, which is an object that takes an input and runs a block of test code with that input.

* ```paramNames``` The ordered list of input parameter names that the template callback will use as arguments.
* ```invoke``` A function that can be called to invoke the template once. For more information, see [```Template.InvokeFn```](#templateinvokefn).
* ```run``` A function that can be called to run the template with multiple inputs. For more information, see [```Template.RunFn```](#templaterunfn).

```ts
function Template<T extends object>(paramNames: string[], input: InputBuilder<T>, callback: Template.CallbackFn): () => void;
```

Shorthand method that creates a ```Template``` and returns a function that executes the template callback with the inputs from the given ```InputBuilder``` when called.

* ```paramNames``` The ordered list of input parameter names that the template callback will use as arguments. See [```Template```](#template-1).
* ```input``` The ```InputBuilder``` that will be used to generate the template inputs. For more information, see [```InputBuilder```](#input-builder-1).
* ```callback``` The callback that contains the test code to execute. See [```Template.CallbackFn```](#templatecallbackfn).

Returns a ```Function``` that when called will execute the template with the template callback with the inputs from the given ```InputBuilder```.

#### Template.withInputs

```ts
function Template.withInputs<T extends object>(paramNames: string[], callback: Template.CallbackFn, ...paramsList: T[]): () => void;
```

Shorthand method that creates a ```Template``` and returns a function that executes it with the given ```paramsList``` when called.

* ```paramNames``` The ordered list of input parameter names that the template callback will use as arguments. See [```Template```](#template-1).
* ```callback``` The callback that contains the test code to execute. See [```Template.CallbackFn```](#templatecallbackfn).
* ```paramsList``` The list of input values to pass into the template callback. For more information, see [```Template.RunFn```](#templaterunfn).

Returns a ```Function``` that when called will execute the template with the given ```paramsList```.

#### Template.create

```ts
function Template.create<T extends object>(paramNames: string[], callback: CallbackFn): Template<T>;
```

Creates a new ```Template``` object.

* ```paramNames``` The ordered list of input parameter names that the template callback will use as arguments. See [```Template```](#template-1).
* ```callback``` The callback that contains the test code to execute. See [```Template.CallbackFn```](#templatecallbackfn).

Returns a new ```Template```.

#### Template.CallbackFn

```ts
type Template.CallbackFn = (...paramList: any[]) => void;
```

* ```paramList``` The list of inputs to the template that correspond to [```paramNames```](#templatecreate).

#### Template.InvokeFn

```ts
type Template.InvokeFn<T extends object> = (params: T) => void;
```

* ```params``` An object containing key-value pairs corresponding to [```paramNames```](#templatecreate).

#### Template.RunFn

```ts
type Template.RunFn<T extends object> = (...paramsList: T[]) => void;
```

* ```paramsList``` The list of objects containing key-value pairs corresponding to [```paramNames```](#templatecreate).

### Input Builder

```ts
class InputBuilder<T> {

  public static fragment<T>(...fragmentDictionaries: InputBuilder.FragmentDictionary<T>[]): InputBuilder<T>;

  public static fragmentList<T>(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>): InputBuilder<T>;

  public static fragmentBuilder<T, _T>(key: keyof T, builder: InputBuilder<_T>): InputBuilder<T>;

  public get dictionary(): Readonly<InputBuilder.FragmentListDictionary<T>>;

  public build(): T[];

  public fragment(...fragmentDictionaries: InputBuilder.FragmentDictionary<T>[]): InputBuilder<T>;

  public fragmentList(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>): InputBuilder<T>;

  public fragmentBuilder<_T>(key: keyof T, builder: InputBuilder<_T>): InputBuilder<T>;
}
```

#### InputBuilder.fragment

```ts
public fragment(...fragmentDictionaries: InputBuilder.FragmentDictionary<T>[]): InputBuilder<T>;
```

```ts
public static fragment<T>(...fragmentDictionaries: InputBuilder.FragmentDictionary<T>[]): InputBuilder<T>;
```

Adds all fragment definitions to the builder.

* ```fragmentDictionaries``` The fragment dictionaries to add to the builder. A fragment dictionary is an object where the keys are ```keyof T``` (the input properties) and the values are possible permutations to be generated by the builder. For more information, see [```InputBuilder.FragmentDictionary```](#inputbuilderfragmentdictionary).

#### InputBuilder.fragmentList

```ts
public fragmentList(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>): InputBuilder<T>;
```

```ts
public static fragmentList<T>(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>): InputBuilder<T>;
```

Adds all fragment list definitions to the builder.

* ```fragmentListDictionary``` The fragment list dictionary definitions to add to the builder. A fragment list dictionary is an object where the keys are ```keyof T``` (the input properties) and the values are arrays of the possible permutations to be generated by the builder. For more information, see [```InputBuilder.FragmentListDictionary```](#inputbuilderfragmentlistdictionary).

#### InputBuilder.fragmentBuilder

```ts
public fragmentBuilder<_T>(key: keyof T, builder: InputBuilder<_T>): InputBuilder<T>;
```

```ts
public static fragmentBuilder<T, _T>(key: keyof T, builder: InputBuilder<_T>): InputBuilder<T>;
```

Adds all permutations from another ```InputBuilder``` as input fragments for this builder.

* ```key``` The property key that the fragment values will be added to.
* ```builder``` The ```InputBuilder``` to read the fragment values from.

#### InputBuilder.build

```ts
public build(): T[]
```

Builds a list of all possible permutations for ```T``` using the given input fragments.

Returns an array of all possible permutations for the given input fragments.

#### InputBuilder.Fragment

```ts
type Fragment<T, P extends keyof T> = T[P];
```

A fragment is a possible value for a given property of ```T```.

#### InputBuilder.FragmentDictionary

```ts
type FragmentDictionary<T> = { [P in keyof T]?: Fragment<T, P> };
```

A fragment dictionary is an object where the keys are ```keyof T``` (the input properties) and the values are possible values for those input properties.

#### InputBuilder.FragmentList

```ts
type FragmentList<T, P extends keyof T> = Fragment<T, P>[];
```

A fragment list is an array of possible value for a given property of ```T```.

#### InputBuilder.FragmentListDictionary

```ts
type FragmentListDictionary<T> = { [P in keyof T]?: FragmentList<T, P> };
```

A fragment list dictionary is an object where the keys are ```keyof T``` (the input properties) and the values are arrays of possible values for those input properties.

### Spec

```ts
interface Spec<T> {
    beforeEach(callback: Spec.Callback<T>): void;
    afterEach(callback: Spec.Callback<T>): void;
    it(description: string, callback: Spec.Callback<T>): void;
}
```

An object that provides a simple type-safe wrapper around properties used in a test spec.

* ```beforeEach``` A proxy for ```beforeEach``` that, when invoked, provides a type-safe collection of properties as the first argument to the callback. For more information, see [```Spec.Callback```](#speccallback).
* ```afterEach``` A proxy for ```afterEach``` that, when invoked, provides a type-safe collection of properties as the first argument to the callback. For more information, see [```Spec.Callback```](#speccallback).
* ```it``` A proxy for ```it``` that, when invoked, provides a type-safe collection of properties as the first argument to the callback. For more information, see [```Spec.Callback```](#speccallback).

#### Spec.create

```ts
function Spec.create<T>(): Spec<T>;
```

Creates a new ```Spec``` with the given ```T```.

#### Spec.inject

```ts
function Spec.inject<T>(callback: Spec.Callback<T>): (doneFn: DoneFn) => void;
```

Provides a function that when called injects a type-safe collection of properties as the first argument to the callback. For more information, see [```Spec.Callback```](#speccallback).

* ```callback``` The callback function that will receive the injected properties. For more information, see [```Spec.Callback```](#speccallback).

#### Spec.Callback

```ts
type Spec.Callback<T> = (params: T) => Promise<void> | void;
```

Represents a callback that receives a type-safe collection of test properties as the first argument.

* ```params``` The test properties for the spec.

If the callback doesn't return a value, the test context will complete immediately. If the callback returns a ```Promise```, the test context will wait for the returned ```Promise``` to resolve or reject before completing.

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