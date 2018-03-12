import { Random } from "../src";

const NUM_TEST_ITERACTIONS = 1000;

describe("Given a Random test helper", () => {

    describe("when number is called", () => {

        describe("when min is given", () => {

            beforeEach(function () {
                this.min = Math.random() * 100;
            });

            describe("when max is given", () => {

                beforeEach(function () {
                    this.max = Math.random() * (100 - this.min) + this.min;
                });

                it("should return a number between the given min and max (inclusive)", function () {
                    for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                        const number = Random.number(this.min, this.max);

                        expect(number).toBeGreaterThanOrEqual(this.min);
                        expect(number).toBeLessThanOrEqual(this.max);
                    }
                });
            });

            describe("when max is NOT given", () => {

                it("should return a number between the given min and MAX_VALUE (inclusive)", function () {
                    for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                        const number = Random.number(this.min);

                        expect(number).toBeGreaterThanOrEqual(this.min);
                        expect(number).toBeLessThanOrEqual(Number.MAX_VALUE);
                    }
                });
            });
        });

        describe("when min is NOT given", () => {

            it("should return a number between 0 and MAX_VALUE (inclusive)", function () {
                for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                    const number = Random.number();

                    expect(number).toBeGreaterThanOrEqual(0);
                    expect(number).toBeLessThanOrEqual(Number.MAX_VALUE);
                }
            });
        });
    });

    describe("when integer is called", () => {

        describe("when min is given", () => {

            beforeEach(function () {
                this.min = Math.round(Math.random() * 100);
            });

            describe("when max is given", () => {

                beforeEach(function () {
                    this.max = Math.round(Math.random() * (100 - this.min) + this.min);
                });

                it("should return an integer between the given min and max (inclusive)", function () {
                    for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                        const number = Random.integer(this.min, this.max);

                        expect(Number.isInteger(number)).toBeTruthy();
                        expect(number).toBeGreaterThanOrEqual(this.min);
                        expect(number).toBeLessThanOrEqual(this.max);
                    }
                });
            });

            describe("when max is NOT given", () => {

                it("should return an integer between the given min and MAX_SAFE_INTEGER (inclusive)", function () {
                    for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                        const number = Random.integer(this.min);

                        expect(Number.isInteger(number)).toBeTruthy();
                        expect(number).toBeGreaterThanOrEqual(this.min);
                        expect(number).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
                    }
                });
            });
        });

        describe("when min is NOT given", () => {

            it("should return an integer between 0 and MAX_SAFE_INTEGER (inclusive)", function () {
                for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                    const number = Random.integer();

                    expect(Number.isInteger(number)).toBeTruthy();
                    expect(number).toBeGreaterThanOrEqual(0);
                    expect(number).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
                }
            });
        });
    });

    describe("when boolean is called", () => {

        it("should return a boolean", function () {
            for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                expect(Random.boolean()).toEqual(jasmine.any(Boolean));
            }
        });
    });

    describe("when string is called", () => {

        describe("when minLength is given", () => {

            beforeEach(function () {
                this.minLength = Math.round(Math.random() * 10);
            });

            describe("when maxLength is given", () => {

                beforeEach(function () {
                    this.maxLength = Math.round(Math.random() * (100 - this.minLength) + this.minLength);
                });

                describe("when options are given", () => {

                    describe("when alpha is true and numeric is false", () => {

                        beforeEach(function () {
                            this.options = {
                                alpha: true,
                                numeric: false
                            };
                        });

                        it("should return a string between the given min and max length (inclusive) containing only letters", function () {
                            for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                                const str = Random.string(this.minLength, this.maxLength, this.options);
        
                                expect(str.length).toBeGreaterThanOrEqual(this.minLength);
                                expect(str.length).toBeLessThanOrEqual(this.maxLength);

                                for (let j = 0; j < str.length; ++j) {
                                    expect(str.charAt(j).match(/[a-z]/i)).toBeTruthy();
                                }
                            }
                        });
                    });

                    describe("when alpha is true and numeric is true", () => {

                        beforeEach(function () {
                            this.options = {
                                alpha: true,
                                numeric: true
                            };
                        });

                        it("should return a string between the given min and max length (inclusive) containing only letters", function () {
                            for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                                const str = Random.string(this.minLength, this.maxLength, this.options);
        
                                expect(str.length).toBeGreaterThanOrEqual(this.minLength);
                                expect(str.length).toBeLessThanOrEqual(this.maxLength);

                                for (let j = 0; j < str.length; ++j) {
                                    expect(str.charAt(j).match(/[a-z0-9]/i)).toBeTruthy();
                                }
                            }
                        });
                    });

                    describe("when alpha is false and numeric is true", () => {

                        beforeEach(function () {
                            this.options = {
                                alpha: false,
                                numeric: true
                            };
                        });

                        it("should return a string between the given min and max length (inclusive) containing only letters", function () {
                            for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                                const str = Random.string(this.minLength, this.maxLength, this.options);
        
                                expect(str.length).toBeGreaterThanOrEqual(this.minLength);
                                expect(str.length).toBeLessThanOrEqual(this.maxLength);

                                for (let j = 0; j < str.length; ++j) {
                                    expect(str.charAt(j).match(/[0-9]/i)).toBeTruthy();
                                }
                            }
                        });
                    });

                    describe("when alpha is false and numeric is false", () => {

                        beforeEach(function () {
                            this.options = {
                                alpha: false,
                                numeric: false
                            };
                        });

                        it("should throw an error", function () {
                            for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                                expect(() => Random.string(this.minLength, this.maxLength, this.options)).toThrow();
                            }
                        });
                    });
                });

                describe("when options are NOT given", () => {

                    it("should return a string between the given min and max length (inclusive)", function () {
                        for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                            const str = Random.string(this.minLength, this.maxLength);
    
                            expect(str.length).toBeGreaterThanOrEqual(this.minLength);
                            expect(str.length).toBeLessThanOrEqual(this.maxLength);
                        }
                    });
                });
            });

            describe("when maxLength is NOT given", () => {

                it("should return a string between the given min and 20 (inclusive)", function () {
                    for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                        const str = Random.string(this.minLength);

                        expect(str.length).toBeGreaterThanOrEqual(this.minLength);
                        expect(str.length).toBeLessThanOrEqual(20);
                    }
                });
            });
        });

        describe("when minLength is NOT given", () => {

            it("should return a string between 0 and 20 (inclusive)", function () {
                for (let i = 0; i < NUM_TEST_ITERACTIONS; ++i) {
                    const str = Random.string();

                    expect(str.length).toBeGreaterThanOrEqual(0);
                    expect(str.length).toBeLessThanOrEqual(20);
                }
            });
        });
    });
})