"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IcecastMount = void 0;
const events_1 = require("events");
const stream_1 = require("stream");
const music_metadata_1 = require("music-metadata");
const helpers_1 = require("./helpers");
class IcecastMount extends events_1.EventEmitter {
    constructor(id, stream, headers) {
        super();
        this.id = id;
        this.stream = stream;
        this.headers = headers;
        this.lastMetadata = null;
        this.audioStream = new stream_1.PassThrough();
        this.stream.on('error', e => this.onError(e));
        this.stream.on('close', () => this.onClose());
        this.stream.on('end', () => this.onEnd());
        const metadataPassthough = new stream_1.PassThrough();
        this.stream.pipe(metadataPassthough);
        this.stream.pipe(this.audioStream);
        music_metadata_1.parseStream(metadataPassthough, { mimeType: this.getMimeType() }, { observer: e => this.onMetadata(e) });
    }
    getCurrentArtist() {
        return this.lastMetadata ? this.lastMetadata.common.artist : null;
    }
    getCurrentTitle() {
        return this.lastMetadata ? this.lastMetadata.common.title : null;
    }
    getCurrentAlbum() {
        return this.lastMetadata ? this.lastMetadata.common.title : null;
    }
    getMimeType() {
        return this.headers['content-type'];
    }
    getType() {
        return this.getMimeType()
            .replace('audio/', '')
            .replace('video/', '');
    }
    getAgent() {
        return this.headers['user-agent'];
    }
    isPublic() {
        return this.headers['ice-public'];
    }
    onEnd() {
        // console.log('mount ended !');
        // not sure yet between close and end
    }
    onError(error) {
        this.stream.end(helpers_1.generateHttpHead(500, 'Oh no bye...'));
        this.emit('error', error);
    }
    onClose() {
        // console.log('mount closed !');
        // not sure yet between end and close
    }
    onMetadata(metadata) {
        this.lastMetadata = metadata.metadata;
        this.emit('metadata', this.lastMetadata);
    }
    close() {
        this.stream.end(helpers_1.generateHttpHead(200, 'Thx bye <3'));
        // do stuff ?
    }
}
exports.IcecastMount = IcecastMount;
