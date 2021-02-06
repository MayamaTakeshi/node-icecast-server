import { IcecastServer } from './dist/server.js';
import * as fs from "fs";

const icecast = new IcecastServer();

icecast.on('mount', (mount) => {
	console.log(`${new Date()}: mount`)
	//mount.on('metadata', (metadata) => console.log(`Artist : ${metadata.common.artist}`));

	//console.dir(mount)
	var uuid = mount.id.split("=")[1]
	var writeStream = fs.createWriteStream("./" + uuid + ".wav");
	//mount.audioStream.on('data', () => console.log('audioStream data'));
	mount.audioStream.pipe(writeStream)

        setTimeout(() => {
	        console.log(`${new Date()}: timeout`)
                mount.stream.destroy()
        }, 2000)

	mount.audioStream.on('close', () => console.log('audioStream close'));
});

icecast.listen(9999);

