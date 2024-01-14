// const fs = require("fs");
// import * as FileSystem from 'expo-file-system';

// require('dotenv').config();

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
        `https://api.cloudflare.com/client/v4/accounts/${process.env.EXPO_PUBLIC_ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
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
    console.log("Input audio type to function:", typeof wavFile);
    console.log("Input audio value to function:", wavFile);
    // const blob = new Uint8Array(wavFile);
    // console.log("Audio after encoding:", blob instanceof Uint8Array);

    // const blob = new Uint8Array(wavFile.buffer);
    const input = {
        audio: [...wavFile]
        // audio: [0]
    }
    // console.log("Inside the function, this is the input file:", input);

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.EXPO_PUBLIC_ACCOUNT_ID}/ai/run/${model}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
                'content-type': 'application/json'
                // 'content-type': 'application/octet-stream'
            },
            method: "POST",
            body: JSON.stringify(input), //JSON.stringify(input)
        }
    );

    const result = await response.json();
    return result;
}

async function wav_to_text(wav_file) {
    // const wav_file = fs.readFileSync(audio);
    const converted_text = await run_speech2text(`@${speech_2_text_model}`, wav_file);

    // console.log(converted_text);
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

async function query_llm(system_prompt, user_speech) {
    const message_body = create_message_body(system_prompt, user_speech);
    // console.log(message_body);
    const summary = await run_llm(`@${llm_model}`, message_body);

    // console.log(summary)
    return await llm_call_response(summary);
}

async function classify_text(text){
    const classified_result = await run_llm(`@${text_class_model}`, { text: text});

    const results = classified_result.result;
    const pos = (results[0].label == 'POSITIVE') ? results[0].score : results[1].score;

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
            dayEmotion = dayRating.get(key);
            break;
        }
    }
    
    // console.log(`Positive score: ${pos}`)
    // console.log(`How was the day: ${dayEmotion}`);
    return dayEmotion;
}


async function handle_async_err([err, res]) {
    if (err) {
        return err;
    }

    return res;
}

export async function pipeline_summary(wav_path) {
    const extracted_text = await handle_async_err(await wav_to_text(wav_path));
    console.log("Extracted text:", extracted_text);
    return await handle_async_err(await query_llm(system_prompts.journal_entry, extracted_text));
}

 async function full_pipeline(wav_path) {
    const extracted_text = await handle_async_err(await wav_to_text(wav_path));

    const summary = await handle_async_err(await query_llm(system_prompts.journal_entry, extracted_text));

    const action = await handle_async_err(await query_llm(system_prompts.action_items, summary));

    const response = await handle_async_err(await query_llm(system_prompts.dino_response, summary));

    return [summary, action, response];
}

/// Testing functions ///

async function test_journal_entry() {
    const journal_speech = "My day was full of fun! I went to a hackathon and made the best project ever with my friends! We won first place and got a nintendo switch as a prize.";
    const journal_entry = await handle_async_err(await query_llm(system_prompts.journal_entry, journal_speech));
    console.log(journal_entry);
}

async function test_full_pipeline() {
    const wavFilePath = "./models/testing_inputs/preamble.wav";
    const [summary, action, response] = await full_pipeline(wavFilePath);
    console.log('Summary:\n', summary);
    console.log('Action:\n', action);
    console.log('Response:\n', response);
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
        const summary = await handle_async_err(await query_llm(system_prompts.journal_entry, prompt));
        console.log(`\nResponse:\n\t${summary}`)
        console.log("\n")
    }
}

async function test_pipeline_summary(){
    // const wav_file = "00001111001100101010101010011010100100101101010100101100010101101010001001100101001";
    // const wav_raw = "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";
    // let enc = new TextEncoder();
    // const wav_file = enc.encode(wav_raw);
    const wav_file = fs.readFileSync("./models/testing_inputs/preamble.wav"); 
    const blob = new Uint8Array(wav_file.buffer);

    const summary = await pipeline_summary(blob);
    console.log(summary);
}

async function test_classify_text(){
    prompts = [
        "I am very full",
        "I am neither happy nor sad",
        "I am very sad",
        "I am slightly sad but had a good day!",
        "I think I am about to get disowned but I am still happy"
    ]

    for (prompt of prompts){
        console.log(`Prompt: ${prompt}`)
        const resp = await classify_text(prompt);
        console.log(`How was the day: ${resp}\n`)
    }
}

/// Testing Area ///
// test_journal_entry();
// test_full_pipeline();
// test_gpt_prompts();
// test_classify_text();
// test_pipeline_summary();
