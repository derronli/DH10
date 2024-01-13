const fs = require("fs");

// Import and configure dotenv
require('dotenv').config();

async function run_llm(model, input) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`,
        {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(input),
        }
    );
    const result = await response.json();
    return result;
}

async function run_text_2_speech(model, wavFile) {
    // const blob = await wavFile.arrayBuffer();
    const blob = new Uint8Array(wavFile.buffer);
    console.log(blob);
    const input = {
        audio : [...blob]
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`,
        {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(input),
        }
    );
    const result = await response.json();
    return result;
}
  
  
var llm_model = "cf/meta/llama-2-7b-chat-int8";
var speech_2_text_model = "cf/openai/whisper";
const wavFilePath = "./models/testing_inputs/preamble.wav";
var wavFile = fs.readFileSync(wavFilePath);
// console.log(typeof wavFile)
// console.log(new Uint8Array(wavFile.buffer))

run_text_2_speech(`@${speech_2_text_model}`, wavFile).then((response) => {
    console.log(JSON.stringify(response));
});

// run_llm(`@${llm_model}`, {
//     messages: [
//         {
//         role: "system",
//         content: "You are a friendly assistant that helps write stories",
//         },
//         {
//         role: "user",
//         content:
//             "Write a short story about a llama that goes on a journey to find an orange cloud",
//         },
//     ],
//     }).then((response) => {
//     console.log(JSON.stringify(response));
// });