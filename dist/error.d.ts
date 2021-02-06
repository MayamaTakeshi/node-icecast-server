export declare class HttpError extends Error {
    readonly code: number;
    readonly message: string;
    constructor(code: number, message: string);
}
