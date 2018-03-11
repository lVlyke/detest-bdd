export function Template<T extends object>(paramNames: Template.Params<T>["paramNames"], callback: Template.CallbackFn, ...paramsList: T[]) {
    const template = Template.create<T>(paramNames, callback);

    return () => template.run(...paramsList);
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
}
