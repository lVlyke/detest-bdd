export namespace Random {

    export interface StringOptions {
        alpha?: boolean;
        numeric?: boolean;
    }

    export function number(min: number = 0, max: number = Number.MAX_VALUE): number {
        return Math.random() * (max - min) + min;
    }

    export function integer(min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return Math.round(number(min, max));
    }

    export function boolean(): boolean {
        return !!integer(0, 1);
    }

    export function string(minLength: number = 0, maxLength: number = 20, options: StringOptions = { alpha: true, numeric: true }): string {
        let str = "";
        let length = integer(minLength, maxLength);

        if (!options.alpha && !options.numeric) {
            throw new Error("String must be either alpha, numeric, or both.");
        }

        for (let i = 0; i < length; ++i) {
            let alphaCode = boolean() ? integer(65, 90) : integer(97, 122);
            let numericCode = integer(48, 57);
            let code = ((options.alpha && boolean()) || !options.numeric) ? alphaCode : numericCode;
            str += String.fromCharCode(code);
        }

        return str;
    }
}