export interface Spec<T> {
    beforeEach(callback: Spec.Callback<T>): void;
    afterEach(callback: Spec.Callback<T>): void;
    it(description: string, callback: Spec.Callback<T>): void;
}

export namespace Spec {

    export type Callback<T> = (params: T) => Promise<void> | void;

    // Creates a helper object that provides type-safe wrappers of Jasmine BDD functions for a test suite
    export function create<T>(): Spec<T> {
        return {
            beforeEach: (callback: Callback<T>) => beforeEach(inject<T>(callback)),
            afterEach: (callback: Callback<T>) => afterEach(inject<T>(callback)),
            it: (description: string, callback: Callback<T>) => it(description, inject<T>(callback)),
        };
    }

    // Creates a wrapper around Jasmine BDD functions that allows injection of type-safe properties for the test suite
    export function inject<T>(callback: Callback<T>): (doneFn: DoneFn) => void {
        return function(doneFn: DoneFn) {
            let async = callback(this);

            if (async) {
                async.then(doneFn).catch(doneFn);
            }
            else {
                doneFn();
            }
        };
    }
}
