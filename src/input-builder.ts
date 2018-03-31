export class InputBuilder<T> {
        
    protected _dictionary: InputBuilder.FragmentListDictionary<T> = {};
    protected _whenFnDictionary: InputBuilder.FragmentWhenFnDictionary<T> = {};

    public static fragment<T>(fragmentDictionary: InputBuilder.FragmentDictionary<T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        return new InputBuilder<T>().fragment(fragmentDictionary, when);
    }

    public static fragmentList<T>(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        return new InputBuilder<T>().fragmentList(fragmentListDictionary, when);
    }

    public static fragmentBuilder<T, _T>(key: keyof T, builder: InputBuilder<_T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        return new InputBuilder<T>().fragmentBuilder<_T>(key, builder, when);
    }

    public get dictionary(): Readonly<InputBuilder.FragmentListDictionary<T>> {
        return this._dictionary;
    }

    public build(): T[] {
        // Get all of the keys in the fragment list dictionary
        let dictionaryKeys: Array<keyof T> = Object.getOwnPropertyNames(this._dictionary) as Array<keyof T>;

        // Generate a list of all possible permutations based on the given input fragments
        return dictionaryKeys.reduce((permutations: InputBuilder.Permutation<T>[], key: keyof T) => {
            return this.applyFragmentListToPermutations(key, this._dictionary[key], permutations);
        }, []) as T[];
    }

    public fragment(fragmentDictionary: InputBuilder.FragmentDictionary<T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        for (let key in fragmentDictionary) {
            // Initialize the fragment list if needed
            let builderDictionary = this._dictionary[key] = this._dictionary[key] || [];
            let value = fragmentDictionary[key];

            if (builderDictionary.indexOf(value) === -1) {
                // Add the current fragment value to the list
                builderDictionary.push(value);

                if (when) {
                    this._whenFnDictionary[key] = this._whenFnDictionary[key] || [];
                    this._whenFnDictionary[key].push([value, when]);
                }
            }
        }

        return this;
    }

    public fragmentList(fragmentListDictionary: InputBuilder.FragmentListDictionary<T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        for (let key in fragmentListDictionary) {
            let fragmentDictionaries = fragmentListDictionary[key];

            // Add all of the fragment lists in the dictionary to the builder
            fragmentDictionaries.map(fragmentDictionary => this.fragment(<any>{ [key]: fragmentDictionary }, when));
        }

        return this;
    }

    public fragmentBuilder<_T>(key: keyof T, builder: InputBuilder<_T>, when?: InputBuilder.FragmentWhenFn<T>): InputBuilder<T> {
        // Add all of the permutations generated from the builder as fragments to this builder
        builder.build().map(data => this.fragment(<any>{ [key]: data }, when));

        return this;
    }

    /**
     * @description Applies each fragment value from the fragment list to each input permutation, 
     * resulting in a new list of permutations containing the values from the fragment list.
     * 
     * @return The new list of permutations containing the values from the fragment list.
     */
    private applyFragmentListToPermutations<S extends keyof T>(
        key: S,
        fragmentList: InputBuilder.FragmentList<T, S>,
        permutations: InputBuilder.Permutation<T>[]
    ): InputBuilder.Permutation<T>[] {

        // Function that creates a fragment representing part of a permutation
        const permutationFragment = (value: InputBuilder.Fragment<T, S>): InputBuilder.Permutation<T> => (<any>{ [key]: this.shallowClone(value) });

        // If there are no fragments, just return the current permutations
        if (fragmentList.length === 0) {
            return permutations;
        }

        // If there are no permutations, just create them from the fragment list
        if (permutations.length === 0) {
            return fragmentList.map(value => permutationFragment(value));
        }

        // Merge the fragment list values with the existing permutations
        return fragmentList.reduce((appliedPermutations: InputBuilder.Permutation<T>[], value: T[S]) => {
            // Look up any applicable when function
            let whenFnResult = this._whenFnDictionary[key] ? this._whenFnDictionary[key].find(v => v[0] === value) : null;
            let whenFn = whenFnResult ? whenFnResult[1] : null;

            // Create all permutations for this value
            let mergedPermutations = permutations.reduce((mergedPermutations, mutation) => {
                // If there's a when clause for this key-value pair, make sure it passes before adding the value
                if (!whenFn || whenFn(mutation)) {
                    mergedPermutations.push(Object.assign({}, mutation, permutationFragment(value)));
                }

                return mergedPermutations;
            }, []);

            // Add the permutations to the final list
            return appliedPermutations.concat(mergedPermutations);
        }, []);
    }

    /**
     * @description Creates a shallow clone of the value.
     */
    private shallowClone<T extends any>(value: T): T {
        if (!value || !value.constructor) {
            return value;
        }

        switch (value.constructor.name) {
            case "Object": return Object.assign({}, value);
            case "Array": return value.map((v: any) => v);
            default: return value;
        }
    }
}

export namespace InputBuilder {

    export type Fragment<T, P extends keyof T> = T[P];
    export type FragmentDictionary<T> = { [P in keyof T]?: Fragment<T, P> };
    export type FragmentList<T, P extends keyof T> = Fragment<T, P>[];
    export type FragmentListDictionary<T> = { [P in keyof T]?: FragmentList<T, P> };
    export type Permutation<T> = Partial<T>;

    export type FragmentWhenFn<T> = (input: InputBuilder.Permutation<T>) => boolean;
    export type FragmentWhenFnDictionary<T> = { [P in keyof T]?: [T[P], FragmentWhenFn<T>][] };
}