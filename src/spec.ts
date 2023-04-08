export interface Spec<T> {
    beforeEach(callback: Spec.Callback<T>): void;
    afterEach(callback: Spec.Callback<T>): void;
    it(description: string, callback: Spec.Callback<T>): void;

    beforeAll?(callback: Spec.StatelessCallback): void;
    before?(callback: Spec.StatelessCallback): void;
    afterAll?(callback: Spec.StatelessCallback): void;
    after?(callback: Spec.StatelessCallback): void;

    xit?(description: string, callback: Spec.Callback<T>): void;
    fit?(description: string, callback: Spec.Callback<T>): void;
}

export namespace Spec {

    export type DoneFn = (() => void) & { fail: () => void };
    export type RawCallback = (doneFn: DoneFn) => void;
    export type StatelessCallback = () => Promise<unknown> | void;
    export type Callback<T> = (params: T) => Promise<unknown> | void;
    
    // Creates a helper object that provides type-safe wrappers of BDD functions for a test spec
    export function create<T>(): Spec<T> {
        return Object.assign({
            beforeEach: (callback: Callback<T>) => beforeEach(inject<T>(callback)),
            afterEach: (callback: Callback<T>) => afterEach(inject<T>(callback)),
            it: (description: string, callback: Callback<T>) => it(description, inject<T>(callback))
        }, typeof beforeAll !== "undefined" && beforeAll ? { beforeAll: (callback: StatelessCallback) => beforeAll(inject(callback)) } : {},
           typeof before !== "undefined" && before ? { before: (callback: StatelessCallback) => before(inject(callback)) } : {},
           typeof afterAll !== "undefined" && afterAll ? { afterAll: (callback: StatelessCallback) => afterAll(inject(callback)) } : {},
           typeof after !== "undefined" && after ? { after: (callback: StatelessCallback) => after(inject(callback)) } : {},
           typeof fit !== "undefined" && fit ? { fit: (description: string, callback: Callback<T>) => fit(description, inject<T>(callback)) } : {},
           typeof xit !== "undefined" && xit ? { xit: (description: string, callback: Callback<T>) => xit(description, inject<T>(callback)) } : {});
    }

    // Creates a wrapper around BDD functions that allows injection of type-safe properties for the test spec
    export function inject<T>(callback: Callback<T>): RawCallback {
        return function (doneFn: DoneFn) {
            const async = callback(this);

            if (async && async instanceof Promise) {
                async.then(() => doneFn()).catch(() => doneFn.fail ? doneFn.fail() : doneFn());
            }
            else {
                doneFn();
            }
        };
    }
}
