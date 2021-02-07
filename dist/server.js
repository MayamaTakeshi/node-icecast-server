"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IcecastServer = void 0;
const net_1 = require("net");
// @ts-ignore
const http_headers_1 = __importDefault(require("http-headers"));
const events_1 = require("events");
const helpers_1 = require("./helpers");
const mount_1 = require("./mount");
const error_1 = require("./error");
class IcecastServer extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.options = options;
        /**
         * A map of mounts
         */
        this.mounts = new Map();
        /**
         * The authenticator callback
         */
        this.authenticator = () => true;
    }
    get server() { return this._server; }
    /**
     * Replaces authenticator callback
     *
     * @param callback
     */
    setAuthenticator(callback) {
        this.authenticator = callback;
        return this;
    }
    handshake(socket, maybeHeaderData) {
        try {
            const head = http_headers_1.default(maybeHeaderData);
            if (!head)
                throw new error_1.HttpError(400, 'Wtf');
            this.emit('head', head);
            this.handleRequest(head, socket);
        }
        catch (error) {
            this.emit('error', error);
            const payload = error instanceof error_1.HttpError
                ? helpers_1.generateHttpHead(error.code, error.message)
                : helpers_1.generateHttpHead(500, 'Unknown error');
            return socket.end(payload);
        }
    }
    /**
     * Handles an incoming TCP connection
     *
     * @param socket
     */
    handleConnection(socket) {
        socket.once('data', maybeHeaderData => {
            this.handshake(socket, maybeHeaderData);
        });
    }
    /**
     * Handles a (kinda) proper HTTP request
     *
     * @param head
     * @param socket
     */
    handleRequest(head, socket) {
        console.log(`handleRequest ${head.method} ${head.url} ${JSON.stringify(head.headers)}`);
        if (head.method != 'PUT' && head.method != 'SOURCE')
            throw new error_1.HttpError(405, 'Invalid method');
        /*
            if (!head.headers.authorization) {
               const status = generateHttpHead(401, 'Unauthorized', false);
               socket.write(status + '\n');
               socket.once('data', maybeHeaderData => {
                 this.handshake(socket, maybeHeaderData)
               })
               return
            }
        
            const authorization = parseBasicAuthenticationHeader(head.headers.authorization);
            if (!authorization) throw new HttpError(403, 'Authorization failed');
        
            const authenticationIsOk = this.authenticator(authorization.username, authorization.password, head);
            if (!authenticationIsOk) throw new HttpError(403, 'Forbidden');
        */
        const mountId = head.url.substring(1);
        if (!mountId || mountId == '')
            throw new error_1.HttpError(400, 'You cannot mount at root');
        const mount = new mount_1.IcecastMount(mountId, socket, head.headers);
        this.handleMount(mountId, mount);
        if (head.method == 'PUT') {
            const continueStatus = helpers_1.generateHttpHead(100, 'Continue', false);
            socket.write(continueStatus + '\n');
        }
        else {
            const status = helpers_1.generateHttpHead(200, 'OK', false);
            socket.write(status + '\n');
        }
    }
    /**
     * Handles a newly created mount
     *
     * @param id
     * @param mount
     */
    handleMount(id, mount) {
        this.mounts.set(id, mount);
        this.emit('mount', mount);
    }
    /**
     * Gracefully close mounts, then the server.
     *
     * @param callback
     */
    close(callback) {
        // Gracefully close all mounts before closing server
        for (const mount of this.mounts.values())
            mount.close();
        if (this._server)
            this._server.close(callback);
    }
    /**
     * Starts listening to TCP input on specified port (defaults to `8000`)
     *
     * Creates a new TCP Server if needed.
     *
     * @param port
     */
    listen(port = 8000) {
        if (!this._server)
            this._server = new net_1.Server(socket => this.handleConnection(socket));
        this._server.listen(port, () => console.log('listenign'));
    }
}
exports.IcecastServer = IcecastServer;
