"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = require("path");
const server_1 = require("./server");
const dataPath = path_1.resolve(__dirname, '..', 'data');
const baseEncoder = fluent_ffmpeg_1.default()
    .outputOption('-hls_segment_type mpegts')
    .outputOption('-hls_list_size 3')
    .outputOption('-hls_time 4')
    .audioBitrate('64k')
    .audioChannels(2)
    .audioCodec('aac')
    .format('hls')
    .noVideo();
const icecast = new server_1.IcecastServer();
icecast.on('connection', () => console.log(`Received Connection !`));
icecast.on('head', (head) => console.log(`Received a proper HTTP head `, head));
icecast.on('error', e => console.error('oh no', e));
icecast.on('mount', (mount) => {
    console.log(`Received mount ${mount.id} !`);
    mount.on('metadata', (metadata) => console.log('metadata updated', metadata.common.artist));
    mount.on('end', () => console.log('mount ended !'));
    mount.on('error', () => console.log('mount error'));
    const encoder = baseEncoder.clone()
        .addInput(mount.audioStream) // FFmpeg auto detects audio format
        .addOutput(`${dataPath}/${mount.id}.m3u8`)
        .outputOption(`-hls_segment_filename ${dataPath}/audio_${mount.id}_%03d.ts`);
    encoder
        .on('start', () => console.log('encoding started !'))
        .on('codecData', (data) => console.log(`Input codec is ${data.audio}`))
        .on('progress', (progress) => console.log(`Processing time: ${progress.timemark}`))
        .on('error', (e) => console.log('encoding error', e))
        .on('end', () => console.log('encoding ended'));
    encoder.run();
});
icecast.listen(8466); // Some random port
