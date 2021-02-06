//import { IcecastServer } from '@MayamaTakeshi/icecast-server/dist/server.js';
import { IcecastServer } from './dist/server.js';

const icecast = new IcecastServer();

import speech from '@google-cloud/speech'

import lame from 'lame'

icecast.on('mount', (mount) => {
	console.log(`${new Date()}: mount`)

	//console.dir(mount)
	var uuid = mount.id.split("=")[1]

        // Creates a client
        const client = new speech.SpeechClient();

        const encoding = 'LINEAR16';
        const sampleRateHertz = 8000;
        const languageCode = 'en-US';

        const request = {
                config: {
                        encoding: encoding,
                        sampleRateHertz: sampleRateHertz,
                        languageCode: languageCode,
                },
                interimResults: true, // If you want interim results, set this to true
        };

        // Stream the audio to the Google Cloud Speech API
        var recognizeStream = client
        .streamingRecognize(request)
        .on('error', error => {
                console.log(`recognizeStream error ${error}`)
        })
        .on('data', data => {
                console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`)
        })
        .on('close', () => {
                console.log("recognizeStream close")
        })
        
        var decoder = new lame.Decoder();

        decoder.on('format', (format) => {
                console.log('MP3 format: %j', format)

                decoder.pipe(recognizeStream)
        })

        decoder.on('data', data => {
                console.log('MP3 data')
        })

        mount.audioStream.pipe(decoder)

	mount.audioStream.on('data', () => console.log(`${new Date()}: audioStream data`))

	mount.audioStream.on('close', () => {
                console.log(`${new Date()}: audioStream close`)
                decoder.unpipe(recognizeStream)
                recognizeStream.end()
                client.close()
        })

	mount.audioStream.on('error', () => {
                console.log(`${new Date()}: audioStream error`)
                decoder.unpipe(recognizeStream)
                recognizeStream.end()
                client.close()
        })

});

icecast.listen(9999);

