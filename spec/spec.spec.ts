import { Spec } from "./../src/spec";

describe("Given a Spec test helper", () => {

    describe("when inject is called", () => {

        beforeEach(function () {
            this.doneFn = jasmine.createSpy("doneFn");
            this.doneFn.fail = jasmine.createSpy("doneFn.fail");
        });

        describe("when using an async callback", () => {

            beforeEach(function () { 
                this.callbackFn = jasmine.createSpy("callbackFn", () => new Promise((resolve, reject) => {
                    this.resolveFn = resolve;
                    this.rejectFn = reject;
                })).and.callThrough();
            });

            beforeEach(function () { 
                this.injectFn = Spec.inject(this.callbackFn);
            });

            it("should return a function", function () {
                expect(this.injectFn).toEqual(jasmine.any(Function));
            });

            describe("when the function is invoked", () => {

                beforeEach(function () { 
                    this.injectFn(this.doneFn);
                });

                it("should invoke the callback function with the Spec's parameters", function () {
                    expect(this.callbackFn).toHaveBeenCalledWith(this);
                });

                it("should NOT call the done function", function () {
                    expect(this.doneFn).not.toHaveBeenCalled();
                });

                describe("when the async callback resolves", function () {

                    beforeEach(function () { 
                        this.resolveFn();
                    });

                    it("should call the done function", function () {
                        setTimeout(() => expect(this.doneFn).toHaveBeenCalled());
                    });
                });

                describe("when the async callback rejects", function () {

                    beforeEach(function () { 
                        this.rejectFn();
                    });

                    it("should call the fail function", function () {
                        setTimeout(() => expect(this.doneFn.fail).toHaveBeenCalled());
                    });
                });
            });
        });

        describe("when NOT using an async callback", () => {

            beforeEach(function () { 
                this.callbackFn = jasmine.createSpy("callbackFn");
            });

            beforeEach(function () { 
                this.injectFn = Spec.inject(this.callbackFn);
            });

            it("should return a function", function () {
                expect(this.injectFn).toEqual(jasmine.any(Function));
            });

            describe("when the function is invoked", () => {

                beforeEach(function () { 
                    this.injectFn(this.doneFn);
                });

                it("should invoke the callback function with the Spec's parameters", function () {
                    expect(this.callbackFn).toHaveBeenCalledWith(this);
                });

                it("should call the done function", function () {
                    expect(this.doneFn).toHaveBeenCalledWith();
                });
            });
        });
    });

    describe("when create is called", () => {
        const SpecObj = Spec.create(); 

        it("should return an object with the expected properties", function () {
            expect(SpecObj).toEqual(jasmine.objectContaining({
                beforeEach: jasmine.any(Function),
                afterEach: jasmine.any(Function),
                it: jasmine.any(Function)
            }));
        });

        describe("when beforeAll is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");

            SpecObj.beforeAll(callbackFn);

            it("should invoke the callback function", function () {
                expect(callbackFn).toHaveBeenCalled();
            });
        });

        describe("when beforeEach is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");

            SpecObj.beforeEach(callbackFn);

            it("should invoke the callback function with the Spec's parameters", function () {
                expect(callbackFn).toHaveBeenCalledWith(this);
            });
        });

        // TODO Figure out how to test this
        xdescribe("when afterAll is called", () => {});

        describe("when afterEach is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");
            let runCount = 0;

            function callbackTest() {
                if (runCount > 0) {
                    it("should invoke the callback function with the Spec's parameters", function () {
                        expect(callbackFn).toHaveBeenCalledWith(this);
                    });
                }
            }

            SpecObj.afterEach(callbackFn);

            afterEach(() => ++runCount);

            callbackTest();
            callbackTest();
        });

        describe("when it is called", () => {
            const callbackFn = jasmine.createSpy("callbackFn");
            let runCount = 0;

            function callbackTest() {
                if (runCount > 0) {
                    it("should invoke the callback function with the Spec's parameters", function () {
                        expect(callbackFn).toHaveBeenCalledWith(this);
                    });
                }
            }

            SpecObj.it("itTest", callbackFn);

            afterEach(() => ++runCount);

            callbackTest();
            callbackTest();
        });
    });
});