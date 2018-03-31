import { InputBuilder } from "../src/input-builder";

type Input = { a: number, b: number, c: number };

describe("Given an InputBuilder test helper", () => {

    describe("when the fragment method is called", () => {

        beforeEach(function () {
            this.fragmentDictionaries = [
                { a: 1 },
                { b: 2 },
                { c: 3 }
            ];
        });

        it("then it should add the expected values to the builder's dictionary", function () {
            this.inputBuilder = InputBuilder.fragment(this.fragmentDictionary);

            expect(this.inputBuilder.dictionary).toEqual({
                a: [1],
                b: [2],
                c: [3]
            });
        });

        describe("when a when callback is given", () => {

            beforeEach(function () {

            });
        });
    });

    describe("when the fragmentList method is called", () => {

        beforeEach(function () {
            this.fragmentListDictionary = {
                a: [1, 2, 3],
                b: [1, 2, 3],
                c: [1, 2, 3]
            };

            this.inputBuilder = InputBuilder.fragmentList(this.fragmentListDictionary);
        });

        it("then it should add the expected values to the builder's dictionary", function () {
            expect(this.inputBuilder.dictionary).toEqual({
                a: [1, 2, 3],
                b: [1, 2, 3],
                c: [1, 2, 3]
            });
        });
    });

    describe("when the fragmentBuilder method is called", () => {

        beforeEach(function () {
            this.fragmentDictionary = {
                a: 1,
                b: 2,
                c: 3
            };

            this.fragmentBuilder = InputBuilder.fragment(this.fragmentDictionary);
            this.inputBuilder = InputBuilder.fragmentBuilder("input", this.fragmentBuilder);
        });

        it("then it should add the expected values to the builder's dictionary", function () {
            expect(this.inputBuilder.dictionary).toEqual({
                input: [{
                    a: 1,
                    b: 2,
                    c: 3
                }]
            });
        });
    });

    describe("when the build method is called", () => {

        beforeEach(function () {
            this.inputBuilder = InputBuilder
                .fragmentList<Input>({ a: [1, 2, 3] })
                .fragmentList({ b: [1, 2, 3] })
                .fragmentList({ c: [1, 2, 3] });
        });

        it("then it should build the expected permutations", function () {
            expect(this.inputBuilder.build()).toEqual([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 1, c: 1 },
                { a: 3, b: 1, c: 1 },
                { a: 1, b: 2, c: 1 },
                { a: 2, b: 2, c: 1 },
                { a: 3, b: 2, c: 1 },
                { a: 1, b: 3, c: 1 },
                { a: 2, b: 3, c: 1 },
                { a: 3, b: 3, c: 1 },
                { a: 1, b: 1, c: 2 },
                { a: 2, b: 1, c: 2 },
                { a: 3, b: 1, c: 2 },
                { a: 1, b: 2, c: 2 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 2, c: 2 },
                { a: 1, b: 3, c: 2 },
                { a: 2, b: 3, c: 2 },
                { a: 3, b: 3, c: 2 },
                { a: 1, b: 1, c: 3 },
                { a: 2, b: 1, c: 3 },
                { a: 3, b: 1, c: 3 },
                { a: 1, b: 2, c: 3 },
                { a: 2, b: 2, c: 3 },
                { a: 3, b: 2, c: 3 },
                { a: 1, b: 3, c: 3 },
                { a: 2, b: 3, c: 3 },
                { a: 3, b: 3, c: 3 }
            ]);
        });
    });
});