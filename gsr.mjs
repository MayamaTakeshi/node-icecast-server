// This can be used to test freeswitch mod_shout record_session with Google Speech Recognition
// Before using this do: export GOOGLE_APPLICATION_CREDENTIALS=/PATH/TO/YOUR/CREDENTIALS/FILE
// Then start the app: node gsr.mjs
// Then make a call to freeswitch with a dialplan with answer and record_session with url shout://THIS_SERVER:9000/speech_recog?uuid=CHANNELUUID
// When call is answered, say something and you should see the results in the console 


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

    decoder.on('data', data => console.log('MP3 data'))

    mount.stream.pipe(decoder)

    mount.stream.on('data', () => console.log(`${new Date()}: stream data`))

    mount.stream.on('close', () => {
            console.log(`${new Date()}: stream close`)
            decoder.unpipe(recognizeStream)
            recognizeStream.end()
            client.close()
        })

    mount.stream.on('error', () => {
            console.log(`${new Date()}: stream error`)
            decoder.unpipe(recognizeStream)
            recognizeStream.end()
            client.close()
        })

});

icecast.listen(9999);

