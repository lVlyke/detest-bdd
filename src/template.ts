import { InputBuilder } from "./input-builder";

export function Template<T extends object>(
    paramNames: Template.Params<T>["paramNames"],
    input: InputBuilder<T> | InputBuilder<T>[],
    callback: Template.CallbackFn
): () => void {
    let paramsList: T[];

    if (Array.isArray(input)) {
        paramsList = input.reduce((paramsList, _input) => paramsList.concat(_input.build()), []);
    } else {
        paramsList = input.build();
    }

    return Template.withInputs<T>(paramNames, callback, ...paramsList);
}

export interface Template<T extends object> {
    paramNames: Array<string | number | symbol>;
    invoke: Template.InvokeFn<T>;
    run: Template.RunFn<T>;
}

export namespace Template {

    export interface Params<T> {
        paramNames: (keyof T)[];
    }

    export type CallbackFn = (...paramList: any[]) => void;
    export type InvokeFn<T extends object> = (params: T) => void;
    export type RunFn<T extends object> = (...paramsList: T[]) => void;

    export function create<T extends object>(paramNames: Params<T>["paramNames"], callback: CallbackFn): Template<T> {
        const invoke = (params: T) => callback(...paramNames.map(paramName => params[paramName]));
        const run = (...paramsList: T[]) => paramsList.forEach(params => describe("should behave such that", () => invoke(params)));

        return { paramNames, invoke, run };
    }

    export function withInputs<T extends object>(paramNames: Template.Params<T>["paramNames"], callback: Template.CallbackFn, ...paramsList: T[]): () => void {
        const template = create<T>(paramNames, callback);

        return () => template.run(...paramsList);
    }
}
