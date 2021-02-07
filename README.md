Node Icecast Server
===

This package provides you with a set of class and functions to handle HTTP/Icecast from a TCP server or stream.    
It acts as an actual Icecast server, takes input from a source, keeps
connections alive, parses metadata and emits events so you can plug
anything anywhere.

The server has no audio backend tho, and will let you handle the raw
mounts audio streams as you wish. 

Metadata parsing is done using the wonderful `music-metadata` library.

## Usage

```sh
yarn add @timlebrun/icecast-server
```

```ts
import { IcecastServer, IcecastMount, IMetadata } from '@timlebrun/icecast-server';

const icecast = new IcecastServer();

icecast.on('mount', (mount: IcecastMount) => {
  mount.on('metadata', (metadata: IMetadata) => console.log(`Artist : ${metadata.common.artist}`);
  mount.audioStream.pipe(toSomeStream);
});

icecast.listen(78543); // Some random port
```

## Roadmap

- [x] Push on NPM
- [x] Add examples
- [ ] Add documentation

## License

Even though this package is under MIT license, I'd rather be notified before any commercial use.


## Note from MayamaTakeshi

This fork includes some changes to allow this to be used with freeswitch mod_shout record_session command.

### Overview

The gsr.mjs script can be used for tests.

The gsr.mjs is a simple node.js app showing how to use freeswitch/mod_shout record_session to convert speech to text using Google Speech Recognition.

This is a simple shoutcast server application that will send the audio received to Google Speech Recogntion service and print the result to the shell.

### Configuration

In your freeswitch dialplan, you will need an extension with actions like these (adjust SHOUT_TO_GSR_IP_ADDRESS)
```
  <action application='set' data='enable_file_write_buffering=false'/>
  <action application='answer'/>
  <action application='record_session' data='shout://user:pass@SHOUT_TO_GSR_IP_ADDRESS:9999/speech_recog?uuid=${uuid}'/>
  <action application='park'/>
```

You will also need to obtain a Google application credentials file with Speech Recognition (Speech-To-Text) support enabled.

### Testing

Start the server:

```
npm install
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/credentials_file.json
node gsr.mjs
```

Then make a call (or several simultaneous calls) to reach the above dialplan and whatever you say will be converted to text and output to the shell.

### Issues

  - for some reason, the app stops recognition after about 15 seconds. This happens because the mount.[audioS]stream.on('data') callback stopps being called. I don't know the cause yet but it seems to be a problem with src/mount.ts because if I comment the code related to PassThrough and metadata parsing in it, the problem doesn't happen.
    Meanwhile if you are interested in an alternative, you can try this one: https://github.com/MayamaTakeshi/shout_to_gsr



