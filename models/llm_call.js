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

function create_message_body(system_content, user_content) {
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

async function llm_call_response(summary){
    if (!summary.success) {
        return [summary.errors, undefined];
    }

    return [undefined, summary.result.response];
}

async function text_to_summary(user_speech) {
    const message_body = create_message_body(system_prompts.journal_entry, user_speech);
    // console.log(message_body);
    const summary = await run_llm(`@${llm_model}`, message_body);

    // console.log(summary)
    return await llm_call_response(summary);
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

/**
 * This function will use 3 prompts from ChatGPT and test how the LLM turns it into a journal entry.
 */
async function test_gpt_prompts(){
    const prompts = [
        "Today was a whirlwind of activity and emotions. I started the morning with a to-do list that seemed never-ending, but by the evening, I managed to check off the major tasks. The highlight was completing the project presentation that had been looming over me all week. The sense of accomplishment is overwhelming, and I can finally exhale. However, there were a couple of things I couldn't get to – an email I meant to send and a chapter I wanted to read for personal development. It's a reminder that there's always room for improvement in time management. Despite the minor setbacks, I'm choosing to focus on the victories and look forward to tackling the remaining tasks tomorrow.",
        "Spent the day balancing work and personal life, and it was both rewarding and challenging. Managed to meet a tight deadline at work, but it meant sacrificing some of my planned self-care time. The compromise left me a bit drained, yet the sense of accomplishment is undeniable. In the evening, I had a heart-to-heart conversation with a friend, sharing our highs and lows. It was therapeutic and a reminder of the importance of human connection. Unfortunately, I didn't get to my daily workout routine, and that's okay. Tomorrow is another opportunity to prioritize physical health. Overall, a day of trade-offs and lessons learned.",
        "Today was filled with unexpected twists and turns. Started the day with a positive mindset, but a sudden change in plans threw me off. Despite the challenges, I embraced the spontaneity and found joy in the unpredictability. Work was a mix of setbacks and achievements – a project meeting went smoothly, but a technical glitch caused some delays. I didn't get around to finishing the research for a personal writing project, and that's disappointing. However, I'm choosing to view it as a chance to dive deeper tomorrow. In the evening, I took a spontaneous walk in the rain, letting go of the day's stressors. Today taught me the importance of flexibility and resilience, and I'm grateful for the opportunities to learn and grow."
    ]

    for (prompt of prompts){
        console.log(`Prompt:\n\t${prompt}`)
        const summary = await handle_async_err(await text_to_summary(prompt));
        console.log(`\nResponse:\n\t${summary}`)
        console.log("\n")
    }
}

// test_full_pipeline();
test_gpt_prompts();
