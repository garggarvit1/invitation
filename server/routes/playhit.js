// server.js or playht.js (your Node backend)
const  axios= require('axios');
const fs=require('fs');

const PLAYHT_USER_ID = 'bNHv8PrwE3Zb13BAQzzBPd7AK7c2';
const PLAYHT_API_KEY = 'ak-7bcc8f2f0d4f44028b9889931869de0e';

async function getPlayHTAudio(text) {
    try{
        const headers = {
            'Authorization': `Bearer ${PLAYHT_API_KEY}`,
            'X-User-ID': `${PLAYHT_USER_ID}`,
            'Content-Type': 'application/json',
        };

        const body = {
            text,
            voice: 's3://voice-cloning-zero-shot/qkxHaGSnelVHe1Dx-ZzjU/garvit/manifest.json', // or another voice
            output_format: 'mp3',
        };

        const response = await axios.post('https://play.ht/api/v2/tts', body, { headers });
        console.log(response+"    "+response.data.audioUrl);
        return response.data.audioUrl; // this is a hosted MP3 file
    }catch (err) {
        console.error('🔴 Error from PlayHT:', err.response?.data || err.message);
        return null; // don't throw
    }
}

module.exports={getPlayHTAudio};