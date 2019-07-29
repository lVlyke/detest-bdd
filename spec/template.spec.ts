import { Template } from "../src/template";
import { InputBuilder } from "../src/input-builder";

describe("Given a Template test helper", () => {
    type Input = { a: number, b: number, c: number };
    const paramNames: (keyof Input)[] = ["a", "b", "c"];
    const inputBuilder: InputBuilder<Input> = InputBuilder.fragment<Input>({ a: 1, b: 2, c: 3 });
    const runParams: Input[] = inputBuilder.build();
    const invokeParams: Input = runParams[0];

    describe("when it is called", () => {

        it("should return a function", function () {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template(paramNames, inputBuilder, callbackFn);

            expect(fn).toEqual(jasmine.any(Function));
        });

        describe("when the function is called", () => {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template(paramNames, inputBuilder, callbackFn);

            fn();

            it("should run the template with the given inputs", function () {
                expect(callbackFnSpy.calls.count()).toEqual(runParams.length);

                for (let i = 0; i < runParams.length; ++i) {
                    expect(callbackFnSpy.calls.argsFor(i)).toEqual(paramNames.map((paramName: keyof Input) => invokeParams[paramName]));
                }
            });
        });
    });

    describe("when it is called with multiple input builders", () => {

        it("should return a function", function () {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template(paramNames, [inputBuilder, inputBuilder], callbackFn);

            expect(fn).toEqual(jasmine.any(Function));
        });

        describe("when the function is called", () => {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template(paramNames, [inputBuilder, inputBuilder], callbackFn);

            fn();

            it("should run the template with the given inputs", function () {
                let invokedParams = runParams.concat(runParams);
                
                expect(callbackFnSpy.calls.count()).toEqual(invokedParams.length);

                for (let i = 0; i < invokedParams.length; ++i) {
                    expect(callbackFnSpy.calls.argsFor(i)).toEqual(paramNames.map((paramName: keyof Input) => invokeParams[paramName]));
                }
            });
        });
    });

    describe("when withInputs is called", () => {

        it("should return a function", function () {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template.withInputs<Input>(paramNames, callbackFn, ...runParams);

            expect(fn).toEqual(jasmine.any(Function));
        });

        describe("when the function is called", () => {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const fn = Template.withInputs(paramNames, callbackFn, ...runParams);

            fn();

            it("should run the template with the given parameters", function () {
                expect(callbackFnSpy.calls.count()).toEqual(runParams.length);

                for (let i = 0; i < runParams.length; ++i) {
                    expect(callbackFnSpy.calls.argsFor(i)).toEqual(paramNames.map((paramName: keyof Input) => invokeParams[paramName]));
                }
            });
        });
    });

    describe("when create is called", () => {

        it("should return a template with the expected properties", function () {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const template = Template.create(paramNames, callbackFn);

            expect(template).toEqual(jasmine.objectContaining({
                paramNames: paramNames,
                invoke: jasmine.any(Function),
                run: jasmine.any(Function)
            }));
        });

        describe("when invoke is called", () => {

            it("should call the callback function with the expected parameters", function () {
                const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
                const template = Template.create(paramNames, callbackFn);

                template.invoke(invokeParams);

                expect(callbackFnSpy).toHaveBeenCalledWith(...paramNames.map((paramName: keyof Input) => invokeParams[paramName]));
            });
        });

        describe("when run is called", () => {
            const callbackFnSpy = jasmine.createSpy("callbackFn");
            const callbackFn = (...params: any[]) => callbackFnSpy(...params);
            const template = Template.create(paramNames, callbackFn);

            template.run(...runParams);

            it("should call the callback function with the expected parameters", function () {
                expect(callbackFnSpy.calls.count()).toEqual(runParams.length);

                for (let i = 0; i < runParams.length; ++i) {
                    expect(callbackFnSpy.calls.argsFor(i)).toEqual(paramNames.map((paramName: keyof Input) => invokeParams[paramName]));
                }
            });
        });
    });
});