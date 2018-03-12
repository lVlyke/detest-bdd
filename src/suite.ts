export interface Suite<T> {
    beforeEach(callback: Suite.Callback<T>): void;
    afterEach(callback: Suite.Callback<T>): void;
    it(description: string, callback: Suite.Callback<T>): void;
}

export namespace Suite {

    export type Callback<T> = (params: T) => Promise<void> | void;

    // Creates a helper object that provides type-safe wrappers of BDD functions for a test suite
    export function create<T>(): Suite<T> {
        return {
            beforeEach: (callback: Callback<T>) => beforeEach(inject<T>(callback)),
            afterEach: (callback: Callback<T>) => afterEach(inject<T>(callback)),
            it: (description: string, callback: Callback<T>) => it(description, inject<T>(callback)),
        };
    }

    // Creates a wrapper around BDD functions that allows injection of type-safe properties for the test suite
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
