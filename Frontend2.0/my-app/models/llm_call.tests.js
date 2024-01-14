import { get_summary, get_actions, get_response, get_help, get_mood } from './llm_call';

require('dotenv').config();

// Testing summarization with a small piece of text.
async function test_journal_entry() {
  const journal_speech =
    "My day was full of fun! I went to a hackathon and made the best project ever with my friends! We won first place and got a nintendo switch as a prize.";
  const journal_summary = await get_summary(journal_speech);
  console.log(journal_summary);
}

// Testing all actions (except mood) with multiple large texts.
async function test_gpt_prompts() {
  const prompts = [
    "Today was a whirlwind of activity and emotions. I started the morning with a to-do list that seemed never-ending, but by the evening, I managed to check off the major tasks. The highlight was completing the project presentation that had been looming over me all week. The sense of accomplishment is overwhelming, and I can finally exhale. However, there were a couple of things I couldn't get to – an email I meant to send and a chapter I wanted to read for personal development. It's a reminder that there's always room for improvement in time management. Despite the minor setbacks, I'm choosing to focus on the victories and look forward to tackling the remaining tasks tomorrow.",
    "Spent the day balancing work and personal life, and it was both rewarding and challenging. Managed to meet a tight deadline at work, but it meant sacrificing some of my planned self-care time. The compromise left me a bit drained, yet the sense of accomplishment is undeniable. In the evening, I had a heart-to-heart conversation with a friend, sharing our highs and lows. It was therapeutic and a reminder of the importance of human connection. Unfortunately, I didn't get to my daily workout routine, and that's okay. Tomorrow is another opportunity to prioritize physical health. Overall, a day of trade-offs and lessons learned.",
    "Today was filled with unexpected twists and turns. Started the day with a positive mindset, but a sudden change in plans threw me off. Despite the challenges, I embraced the spontaneity and found joy in the unpredictability. Work was a mix of setbacks and achievements – a project meeting went smoothly, but a technical glitch caused some delays. I didn't get around to finishing the research for a personal writing project, and that's disappointing. However, I'm choosing to view it as a chance to dive deeper tomorrow. In the evening, I took a spontaneous walk in the rain, letting go of the day's stressors. Today taught me the importance of flexibility and resilience, and I'm grateful for the opportunities to learn and grow.",
  ];

  for (const prompt of prompts) {
    console.log(`Prompt:\n\t${prompt}`);
    const summary = await get_summary(prompt);
    console.log(`\nSummary:\n\t${summary}`);
    const action = await get_actions(prompt);
    console.log(`\nAction:\n\t${action}`);
    const response = await get_response(prompt);
    console.log(`\nResponse:\n\t${response}`);
    const help = await get_help(prompt);
    console.log(`\nHelp:\n\t${help}`);
    console.log("\n");
  }
}

// Testing mood on multiple short texts.
async function test_classify_text() {
  prompts = [
    "I am very full",
    "I am neither happy nor sad",
    "I am very sad",
    "I am slightly sad but had a good day!",
    "I think I am about to get disowned but I am still happy",
  ];

  for (prompt of prompts) {
    console.log(`Prompt: ${prompt}`);
    const mood = await get_mood(prompt);
    console.log(`How was the day: ${mood}\n`);
  }
}

//test_journal_entry();
//test_gpt_prompts();
//test_classify_text();
