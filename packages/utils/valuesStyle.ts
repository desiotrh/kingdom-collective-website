export type ReflectPrompts = { before: string[]; after: string[] };

export function getReflectPrompts(faithMode: boolean): ReflectPrompts {
  if (faithMode) {
    return {
      before: [
        "Does this honor your calling?",
        "Who is this meant to serve, and how?",
        "What scripture or testimony informs this?",
      ],
      after: [
        "What will you change so it reflects your values and calling?",
        "Is this truthful and dignifying?",
        "What would God have you emphasize?",
      ],
    };
  }

  // Neutral: biblically faithful principles in values-grounded language
  return {
    before: [
      "What’s the goal, and who is this for?",
      "What would you create without AI?",
      "What unique perspective or story are you bringing?",
    ],
    after: [
      "What will you change so it truly sounds like you?",
      "Is this honest, dignifying, and respectful?",
      "What should be emphasized to serve people well?",
    ],
  };
}

// Optional phrase guard to steer away from language that conflicts with guardrails
export function ensureTruthfulLanguage(text: string): string {
  if (!text) return text;
  let out = text;
  // Soft replacements to avoid problematic jargon
  out = out.replace(/\bmanifest(?:ing)?\b/gi, "commit to disciplined action");
  out = out.replace(/\byour truth\b/gi, "be honest and clear");
  out = out.replace(/\bfake it till you make it\b/gi, "grow with integrity over time");
  return out;
}

export function defaultTone(faithMode: boolean): string {
  return faithMode ? 'biblical' : 'purpose-driven';
}


