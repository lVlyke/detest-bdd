import { InputBuilder } from "./input-builder";

export function Template<T extends object>(paramNames: Template.Params<T>["paramNames"], callback: Template.CallbackFn, ...paramsList: T[]): () => void;
export function Template<T extends object>(paramNames: Template.Params<T>["paramNames"], input: InputBuilder<T>, callback: Template.CallbackFn): () => void;

export function Template<T extends object>(...args: any[]): () => void {
    const [paramNames, callbackOrInput, ...callbackOrParamsListArgs]: [
        Template.Params<T>["paramNames"],
        Template.CallbackFn | InputBuilder<T>,
        any
    ] = <any>args;

    if (callbackOrInput instanceof Function) {
        return Template.withInputs<T>(paramNames, callbackOrInput, ...callbackOrParamsListArgs);
    }
    else if (callbackOrParamsListArgs.length === 1 && callbackOrParamsListArgs[0] instanceof Function && callbackOrInput instanceof InputBuilder) {
        return Template.withInputs<T>(paramNames, callbackOrParamsListArgs[0], ...callbackOrInput.build());
    }
    else {
        throw new Error("Unexpected input to Template.");
    }
}
export interface Template<T extends object> {
    paramNames: string[];
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
