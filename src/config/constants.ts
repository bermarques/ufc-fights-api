import { Type } from "@google/genai";

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

export const GEMINI_CONFIG = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    required: ["fights"],
    properties: {
      fights: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ["analysis", "confidence", "keyFactors", "winner"],
          properties: {
            analysis: {
              type: Type.STRING,
            },
            confidence: {
              type: Type.NUMBER,
            },
            keyFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            winner: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  },
};

export const GEMINI_MODEL = "gemini-2.5-flash";
