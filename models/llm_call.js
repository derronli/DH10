const fs = require("fs");

require('dotenv').config();

const llm_model = "cf/mistral/mistral-7b-instruct-v0.1";
const text_class_model = "cf/huggingface/distilbert-sst-2-int8";
const speech_2_text_model = "cf/openai/whisper";

const system_prompts = {
    journal_entry: "You are a friendly assistant that helps summarize what you are told like a journal. Put all of your points in bullet points",
    action_items: "You are a friendly assistant that helps me come up with things I need to do. Based on what I tell you about my day, please give me bullet point suggestions on what I should do tomorrow",
    dino_response: "You are a friendly assistant that replies to what you are told like a good friend"
}

function message_body(system_content, user_content) {
    return {
        messages: [
            {
                role: "system",
                content: system_content,
            },
            {
                role: "user",
                content: user_content,
            },
        ],
    }
}

function summary_message_body(user_content) {
    const system_content = "You are a friendly assistant that helps summarize what you are told into bullet points like a journal.";
    return message_body(system_content, user_content);
}

function response_message_body(user_content) {
    const system_content = "You are a friendly assistant that replies to what you are told like a good friend.";
    return message_body(system_content, user_content);
}

/// Functions for querying llms ///
async function run_llm(model, input) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
                'content-type': 'application/json',
            },
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
        audio: [...blob]
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

async function wav_to_text(wav_path) {
    const wav_file = fs.readFileSync(wav_path);
    const converted_text = await run_speech2text(`@${speech_2_text_model}`, wav_file);

    console.log(converted_text);
    if (!converted_text.success) {
        return [converted_text.errors, undefined];
    }

    return [undefined, converted_text.result.text];
}

async function text_to_summary(user_speech) {
    const message_body = summary_message_body(user_speech);
    console.log(message_body);
    const summary = await run_llm(`@${llm_model}`, message_body);

    console.log(summary)
    if (!summary.success) {
        return [summary.errors, undefined];
    }

    return [undefined, summary.response];
}

async function handle_async_err([err, res]) {
    if (err) {
        throw err;
    }

    return res;
}

async function full_pipeline(wav_path) {
    const extracted_text = await handle_async_err(await wav_to_text(wav_path));

    const summary = await handle_async_err(await text_to_summary(extracted_text));

    return summary;
}

// test_speech2text();

async function test_journal_entry() {
    const journal_speech = "My day was full of fun! I went to a hackathon and made the best project ever with my friends! We won first place and got a nintendo switch as a prize.";
    const journal_entry = await text_to_summary(journal_speech);
    console.log(journal_entry);
}

async function test_full_pipeline() {
    const wavFilePath = "./models/testing_inputs/preamble.wav";
    console.log(await full_pipeline(wavFilePath));
}

test_full_pipeline();
