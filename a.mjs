import { IcecastServer } from './dist/server.js';

import * as fs from "fs";

const icecast = new IcecastServer();

icecast.on('mount', (mount) => {
	console.log(`${new Date()}: mount`)
	//mount.on('metadata', (metadata) => console.log(`Artist : ${metadata.common.artist}`));

	//console.dir(mount)
	var uuid = mount.id.split("=")[1]
	var writeStream = fs.createWriteStream("./" + uuid + ".mp3");

	mount.audioStream.pipe(writeStream)

        /*
        setTimeout(() => {
	        console.log(`${new Date()}: timeout`)
                mount.stream.destroy()
        }, 2000)
        */

	mount.audioStream.on('data', () => console.log(`${new Date()}: audioStream data`));

	mount.audioStream.on('close', () => console.log(`${new Date()}: audioStream close`));

	mount.audioStream.on('error', () => console.log(`${new Date()}: audioStream error`));
});

icecast.listen(9999);

