import { Template } from "../src/template";

describe("Given a Template test helper", () => {
    const paramNames = ["a", "b", "c"];
    const runParams = [1, 2, 3].map(() => paramNames.reduce((invokeParams: any, name: string, index: number) => {
        invokeParams[name] = index;
        return invokeParams;
    }, {}));
    const invokeParams = paramNames.reduce((invokeParams: any, name: string, index: number) => {
        invokeParams[name] = index;
        return invokeParams;
    }, {});

    describe("when it is called", () => {

        it("should return a function", function () {
            const callbackFn = jasmine.createSpy("callbackFn");
            const fn = Template(paramNames, callbackFn, ...runParams);

            expect(fn).toEqual(jasmine.any(Function));
        });

        describe("when the function is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");
            const fn = Template(paramNames, callbackFn, ...runParams);

            fn();

            it("should run the template with the given parameters", function () {
                expect(callbackFn.calls.count()).toEqual(runParams.length);

                for (let i = 0; i < runParams.length; ++i) {
                    expect(callbackFn.calls.argsFor(i)).toEqual(paramNames.map((paramName: string) => invokeParams[paramName]));
                }
            });
        });
    });

    describe("when create is called", () => {

        it("should return a template with the expected properties", function () {
            const callbackFn = jasmine.createSpy("callbackFn");
            const template = Template.create(paramNames, callbackFn);

            expect(template).toEqual(jasmine.objectContaining({
                paramNames: paramNames,
                invoke: jasmine.any(Function),
                run: jasmine.any(Function)
            }));
        });

        describe("when invoke is called", () => {

            it("should call the callback function with the expected parameters", function () {
                const callbackFn = jasmine.createSpy("callbackFn");
                const template = Template.create(paramNames, callbackFn);

                template.invoke(invokeParams);

                expect(callbackFn).toHaveBeenCalledWith(...paramNames.map((paramName: string) => invokeParams[paramName]));
            });
        });

        describe("when run is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");
            const template = Template.create(paramNames, callbackFn);

            template.run(...runParams);

            it("should call the callback function with the expected parameters", function () {
                expect(callbackFn.calls.count()).toEqual(runParams.length);

                for (let i = 0; i < runParams.length; ++i) {
                    expect(callbackFn.calls.argsFor(i)).toEqual(paramNames.map((paramName: string) => invokeParams[paramName]));
                }
            });
        });
    });
});