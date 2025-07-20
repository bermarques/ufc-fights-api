export const CONFIG = {
  PORT: process.env.PORT || 1000,
  NODE_ENV: process.env.NODE_ENV || "development",
  TRIGGER_KEY: process.env.TRIGGER_KEY,
  AI_API_URL: process.env.AI_API_URL,
  AI_API_KEY: process.env.AI_API_KEY,
  PROXY_URL: process.env.PROXY_URL,
} as const;

export const MAJOR_ORGS = ["UFC", "PFL", "BELLATOR", "ONE", "RIZIN"] as const;

export const MAX_EVENTS = 1;
