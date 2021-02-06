/// <reference types="node" />
import { EventEmitter } from 'events';
import { PassThrough } from 'stream';
import { Socket } from 'net';
import { IAudioMetadata } from 'music-metadata/lib/type';
export declare class IcecastMount extends EventEmitter {
    readonly id: string;
    readonly stream: Socket;
    readonly headers: any;
    lastMetadata: IAudioMetadata;
    readonly audioStream: PassThrough;
    constructor(id: string, stream: Socket, headers: any);
    getCurrentArtist(): string;
    getCurrentTitle(): string;
    getCurrentAlbum(): string;
    getMimeType(): any;
    getType(): any;
    getAgent(): any;
    isPublic(): any;
    private onEnd;
    private onError;
    private onClose;
    private onMetadata;
    close(): void;
}
