/// <reference types="node" />
import { Socket, Server as TcpServer } from 'net';
import { EventEmitter } from 'events';
import { IAuthenticator } from './interfaces';
import { IcecastMount } from './mount';
export declare class IcecastServer extends EventEmitter {
    readonly options: any;
    /**
     * Underlying TCP server instance
     */
    private _server?;
    get server(): TcpServer;
    /**
     * A map of mounts
     */
    readonly mounts: Map<string, IcecastMount>;
    /**
     * The authenticator callback
     */
    private authenticator;
    constructor(options?: any);
    /**
     * Replaces authenticator callback
     *
     * @param callback
     */
    setAuthenticator(callback: IAuthenticator): this;
    handshake(socket: Socket, maybeHeaderData: Buffer): void;
    /**
     * Handles an incoming TCP connection
     *
     * @param socket
     */
    handleConnection(socket: Socket): void;
    /**
     * Handles a (kinda) proper HTTP request
     *
     * @param head
     * @param socket
     */
    handleRequest(head: any, socket: Socket): void;
    /**
     * Handles a newly created mount
     *
     * @param id
     * @param mount
     */
    private handleMount;
    /**
     * Gracefully close mounts, then the server.
     *
     * @param callback
     */
    close(callback: () => void): void;
    /**
     * Starts listening to TCP input on specified port (defaults to `8000`)
     *
     * Creates a new TCP Server if needed.
     *
     * @param port
     */
    listen(port?: number): void;
}
