const llm_model = "cf/mistral/mistral-7b-instruct-v0.1";
const text_class_model = "cf/huggingface/distilbert-sst-2-int8";

const system_prompts = {
  journal_entry:
    "You are a friendly assistant that helps summarize what you are told like a journal. Put all of your points in bullet points",
  action_items:
    "You are a friendly assistant that helps me come up with things I need to do. Based on what I tell you about my day, please give me bullet point suggestions on what I should do tomorrow",
  dino_response:
    "You are a friendly assistant that replies to what you are told like a good friend",
  stress_help:
    "You are a friendly assistant that helps me cope with my stress described by what I gave you",
};

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
  };
}

/// Functions for querying llms ///
async function run_llm(model, input) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.EXPO_PUBLIC_ACCOUNT_ID}/ai/run/${model}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
        //'content-type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  const result = await response.json();
  return result;
}

async function query_llm(system_content, user_content) {
  const message_body = create_message_body(system_content, user_content);
  const response = await run_llm(`@${llm_model}`, message_body);

  if (!response.success) {
    return undefined;
  }

  return response.result.response.trim();
}

async function classify_text(text) {
  const classified_result = await run_llm(`@${text_class_model}`, {
    text: text,
  });

  if (!classified_result) {
    return undefined;
  }

  const results = classified_result.result;
  const pos =
    results[0].label === "POSITIVE" ? results[0].score : results[1].score;

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
  }
}

export async function get_summary(text) {
  const summary = await query_llm(system_prompts.journal_entry, text);
  return summary;
}

export async function get_actions(text) {
  const actions = await query_llm(system_prompts.action_items, text);
  return actions;
}

export async function get_response(text) {
  const response = await query_llm(system_prompts.dino_response, text);
  return response;
}

export async function get_help(text) {
  const help = await query_llm(system_prompts.stress_help, text);
  return help;
}

export async function get_mood(text) {
  const mood = await classify_text(text);
  return mood;
}
