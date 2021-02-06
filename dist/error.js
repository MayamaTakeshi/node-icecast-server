"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }
}
exports.HttpError = HttpError;
