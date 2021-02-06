"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBasicAuthenticationHeader = exports.generateHttpHead = void 0;
function generateHttpHead(statusCode, statusMessage, end = true) {
    return `HTTP/1.1 ${statusCode} ${statusMessage}\n${end ? '\n' : ''}`;
}
exports.generateHttpHead = generateHttpHead;
function parseBasicAuthenticationHeader(data) {
    // @todo maybe add checks ?
    const payload = data.replace('Basic ', '');
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    return { username, password };
}
exports.parseBasicAuthenticationHeader = parseBasicAuthenticationHeader;
