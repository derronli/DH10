<<<<<<< HEAD:models/llm_call.js
require('dotenv').config();
=======
// const fs = require("fs");
import * as FileSystem from 'expo-file-system';

// require('dotenv').config();
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx

const llm_model = "cf/mistral/mistral-7b-instruct-v0.1";
const text_class_model = "cf/huggingface/distilbert-sst-2-int8";

const system_prompts = {
    journal_entry: "You are a friendly assistant that helps summarize what you are told like a journal. Put all of your points in bullet points",
    action_items: "You are a friendly assistant that helps me come up with things I need to do. Based on what I tell you about my day, please give me bullet point suggestions on what I should do tomorrow",
    dino_response: "You are a friendly assistant that replies to what you are told like a good friend",
    stress_help: "You are a friendly assistant that helps me cope with my stress described by what I gave you",
}

function create_message_body(system_content: string, user_content: string) {
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
async function run_llm(model: string, input: any) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.EXPO_PUBLIC_ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: {
<<<<<<< HEAD:models/llm_call.js
                Authorization: `Bearer ${process.env.API_TOKEN}`,
                //'content-type': 'application/json',
=======
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
                'content-type': 'application/json',
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
            },
            method: "POST",
            body: JSON.stringify(input),
        }
    );

    const result = await response.json();
    return result;
}

<<<<<<< HEAD:models/llm_call.js
async function query_llm(system_content, user_content) {
    const message_body = create_message_body(system_content, user_content);
    const response = await run_llm(`@${llm_model}`, message_body);

    if (!response.success) {
        return undefined;
    }

    return response.result.response.trim();
}

async function classify_text(text) {
    const classified_result = await run_llm(`@${text_class_model}`, { text: text });
=======
async function run_speech2text(model: string, wavFile: string) {
    // const blob = new Uint8Array(wavFile.buffer);
    // const input = {
    //     audio: [...blob]
    // }
    const input = wavFile;
    console.log("Inside the function, this is the wav file:", input);

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.EXPO_PUBLIC_ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
                'content-type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(input), 
        }
    );

    const result = await response.json();
    return result;
}

async function wav_to_text(wav_file: string) {
    // const wav_file = fs.readFileSync(audio);
    const converted_text = await run_speech2text(`@${speech_2_text_model}`, wav_file);
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx

    if (!classified_result) {
        return undefined;
    }

<<<<<<< HEAD:models/llm_call.js
=======
    return [undefined, converted_text.result.text];
}

async function llm_call_response(summary: any){
    if (!summary.success) {
        return [summary.errors, undefined];
    }

    return [undefined, summary.result.response];
}

async function query_llm(system_prompt: string, user_speech: string) {
    const message_body = create_message_body(system_prompt, user_speech);
    // console.log(message_body);
    const summary = await run_llm(`@${llm_model}`, message_body);

    // console.log(summary)
    return await llm_call_response(summary);
}

async function classify_text(text: string){
    const classified_result = await run_llm(`@${text_class_model}`, { text: text});

>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
    const results = classified_result.result;
    const pos = (results[0].label === 'POSITIVE') ? results[0].score : results[1].score;

<<<<<<< HEAD:models/llm_call.js
    if (pos <= 0.3) {
        return 1;
    } else if (pos <= 0.5) {
        return 2;
    } else if (pos <= 0.7) {
        return 3;
    } else if (pos <= 0.85) {
        return 4;
    } else {
        return 5;
=======
    const dayRating = new Map([
        [0.3, "Bad..."],
        [0.5, "So-so."],
        [0.7, "Good."],
        [0.85, "Great!"],
        [1.0, "Excellent!"]
      ]);

    let dayEmotion = "";
    for (const key of dayRating.keys()){
        if (pos <= key){
            dayEmotion = dayRating.get(key) as string;
            break;
        }
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
    }
}

<<<<<<< HEAD:models/llm_call.js
async function get_summary(text) {
    const summary = await query_llm(system_prompts.journal_entry, text);
    return summary;
}

async function get_actions(text) {
    const actions = await query_llm(system_prompts.action_items, text);
    return actions;
}
=======

async function handle_async_err([err, res]: any) {
    if (err) {
        return err;
    }

    return res;
}

export async function pipeline_summary(wav_path: string) {
    const extracted_text = await handle_async_err(await wav_to_text(wav_path));
    console.log(extracted_text);
    return await handle_async_err(await query_llm(system_prompts.journal_entry, extracted_text));
}

export async function full_pipeline(wav_path: any) {
    const extracted_text = await handle_async_err(await wav_to_text(wav_path));
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx

async function get_response(text) {
    const response = await query_llm(system_prompts.dino_response, text);
    return response;
}

async function get_help(text) {
    const help = await query_llm(system_prompts.stress_help, text);
    return help;
}

async function get_mood(text) {
    const mood = await classify_text(text);
    return mood;
}

/// Testing functions ///

async function test_journal_entry() {
    const journal_speech = "My day was full of fun! I went to a hackathon and made the best project ever with my friends! We won first place and got a nintendo switch as a prize.";
    const journal_summary = await get_summary(journal_speech);
    console.log(journal_summary);
}

async function test_gpt_prompts() {
    const prompts = [
        "Today was a whirlwind of activity and emotions. I started the morning with a to-do list that seemed never-ending, but by the evening, I managed to check off the major tasks. The highlight was completing the project presentation that had been looming over me all week. The sense of accomplishment is overwhelming, and I can finally exhale. However, there were a couple of things I couldn't get to – an email I meant to send and a chapter I wanted to read for personal development. It's a reminder that there's always room for improvement in time management. Despite the minor setbacks, I'm choosing to focus on the victories and look forward to tackling the remaining tasks tomorrow.",
        "Spent the day balancing work and personal life, and it was both rewarding and challenging. Managed to meet a tight deadline at work, but it meant sacrificing some of my planned self-care time. The compromise left me a bit drained, yet the sense of accomplishment is undeniable. In the evening, I had a heart-to-heart conversation with a friend, sharing our highs and lows. It was therapeutic and a reminder of the importance of human connection. Unfortunately, I didn't get to my daily workout routine, and that's okay. Tomorrow is another opportunity to prioritize physical health. Overall, a day of trade-offs and lessons learned.",
        "Today was filled with unexpected twists and turns. Started the day with a positive mindset, but a sudden change in plans threw me off. Despite the challenges, I embraced the spontaneity and found joy in the unpredictability. Work was a mix of setbacks and achievements – a project meeting went smoothly, but a technical glitch caused some delays. I didn't get around to finishing the research for a personal writing project, and that's disappointing. However, I'm choosing to view it as a chance to dive deeper tomorrow. In the evening, I took a spontaneous walk in the rain, letting go of the day's stressors. Today taught me the importance of flexibility and resilience, and I'm grateful for the opportunities to learn and grow."
    ]

<<<<<<< HEAD:models/llm_call.js
    for (const prompt of prompts) {
        console.log(`Prompt:\n\t${prompt}`)
        const summary = await get_summary(prompt);
        console.log(`\nSummary:\n\t${summary}`)
        const action = await get_actions(prompt);
        console.log(`\nAction:\n\t${action}`)
        const response = await get_response(prompt);
        console.log(`\nResponse:\n\t${response}`)
        const help = await get_response(prompt);
        console.log(`\nHelp:\n\t${help}`)
=======
    for (let curr_prompt of prompts){
        console.log(`Prompt:\n\t${curr_prompt}`)
        const summary = await handle_async_err(await query_llm(system_prompts.journal_entry, curr_prompt));
        console.log(`\nResponse:\n\t${summary}`)
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
        console.log("\n")
    }
}

<<<<<<< HEAD:models/llm_call.js
async function test_classify_text() {
    prompts = [
=======
async function test_classify_text(){
    let prompts = [
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
        "I am very full",
        "I am neither happy nor sad",
        "I am very sad",
        "I am slightly sad but had a good day!",
        "I think I am about to get disowned but I am still happy"
    ]

<<<<<<< HEAD:models/llm_call.js
    for (prompt of prompts) {
=======
    for (let prompt of prompts){
>>>>>>> main:Frontend2.0/my-app/models/llm_call_bad.tsx
        console.log(`Prompt: ${prompt}`)
        const mood = await get_mood(prompt);
        console.log(`How was the day: ${mood}\n`)
    }
}

/// Testing Area ///
//test_journal_entry();
//test_gpt_prompts();
//test_classify_text();
