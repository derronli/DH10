const fs = require("fs");

// Import and configure dotenv
require('dotenv').config();

// const llm_model = "cf/meta/llama-2-7b-chat-int8";
// const llm_model = "cf/meta/llama-2-7b-chat-fp16";
const llm_model = "cf/mistral/mistral-7b-instruct-v0.1";
const text_class_model = "cf/huggingface/distilbert-sst-2-int8";
const speech_2_text_model = "cf/openai/whisper";

function create_journal_summary_message_body(user_text){
    return {
        messages: [
            {
            role: "system",
            content: "You are a friendly assistant that helps summarize what you are told like a journal. Put all of your points in bullet points",
            },
            {
            role: "user",
            content: user_text,
            },
        ],
        }
}

/// Functions for querying llms ///
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

async function run_speech2text(model, wavFile) {
    const blob = new Uint8Array(wavFile.buffer);
    const input = {
        audio : [...blob]
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`,
        {
        headers: { 
            Authorization: `Bearer ${process.env.API_TOKEN}`,
            'content-type': 'application/json' 
        },
        method: "POST",
        body: JSON.stringify(input),
        }
    );
    const result = await response.json();
    return result;
}
  
/// Functions for testing querying ///
async function test_speech2text(){
    const wavFilePath = "./models/testing_inputs/preamble.wav";
    const wavFile = fs.readFileSync(wavFilePath);
    
    run_speech2text(`@${speech_2_text_model}`, wavFile).then((response) => {
        console.log(JSON.stringify(response));
    });
}

async function test_text_class(){
    run_llm(`@${text_class_model}`, { text: 'I want to eat, I have been hungry for the past 5 days!' }).then((response) => {
        console.log(JSON.stringify(response));
    });
}

async function test_llm(){
    run_llm(`@${llm_model}`, {
        messages: [
            {
            role: "system",
            content: "You are a friendly assistant that helps write stories",
            },
            {
            role: "user",
            content:
                "Write a short story about a llama that goes on a journey to find an orange cloud",
            },
        ],
        }).then((response) => {
        console.log(JSON.stringify(response));
    }); 
}

/// Functions for prompting ///
async function text_classification(text){
    const response = run_llm(`@${text_class_model}`, { text: text });
    
    // if (!response["success"]);
}

async function create_journal_entry(user_speech){
    const msgBody = create_journal_summary_message_body(user_speech);
    const resp = await run_llm(`@${llm_model}`, msgBody);
    return resp;
}

async function full_pipeline(audio_file_path){
    const wavFile = fs.readFileSync(audio_file_path);
    
    const converted_text = await run_speech2text(`@${speech_2_text_model}`, wavFile);
    const extracted_text = converted_text.result.text;
    console.log("We got the speech")
    console.log(converted_text)
    console.log(extracted_text)
    const journal_entry = await create_journal_entry(extracted_text);
    return journal_entry;
}

// test_speech2text();

async function test_journal_entry(){
    const journal_speech = "My day was full of fun! I went to a hackathon and made the best project ever with my friends! We won first place and got a nintendo switch as a prize.";
    const journal_entry = await create_journal_entry(journal_speech);
    console.log(journal_entry);
}

async function test_full_pipeline(){
    const wavFilePath = "./models/testing_inputs/preamble.wav";
    console.log(await full_pipeline(wavFilePath));
}

test_full_pipeline();
