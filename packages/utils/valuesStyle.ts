export type ReflectPrompts = { before: string[]; after: string[] };

export function getReflectPrompts(faithMode: boolean): ReflectPrompts {
  if (faithMode) {
    return {
      before: [
        "Does this honor your calling?",
        "Who is this for, and how will it serve them?",
        "What scripture or testimony informs this?",
      ],
      after: [
        "What will you change so it reflects your values and calling?",
        "Is this truthful, dignifying, and clear?",
        "What would God have you emphasize?",
      ],
    };
  }

  // Neutral: biblically faithful principles in values-grounded language
  return {
    before: [
      "What’s the goal—and who is this for?",
      "What would you do without AI—what’s your first draft?",
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

// simple local storage util for remember choices
export function persistChoice(key: string, value: unknown, days = 7) {
  try {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    const payload = { until, value };
    // @ts-ignore: RN/Expo may not have localStorage; host apps can swap this impl
    localStorage?.setItem(key, JSON.stringify(payload));
  } catch {}
}

export function readChoice<T>(key: string): T | undefined {
  try {
    const raw = localStorage?.getItem(key);
    if (!raw) return undefined;
    const { until, value } = JSON.parse(raw);
    if (until && until > Date.now()) return value as T;
  } catch {}
  return undefined;
}


