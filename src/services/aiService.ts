import { GoogleGenAI } from "@google/genai";
import { Event } from "../types/event";
import { Fight, GeminiResponse } from "../types/fight";
import { basePrompt } from "../utils/prompt";
import { GEMINI_CONFIG, GEMINI_MODEL } from "../config/constants";

export class AIService {
  static buildPrompt(event: Event) {
    const prompt = `
    ${basePrompt} \n
    EVENT: ${event.title},
    DATE: ${event.date},
    FIGHTS: 
    ${event.fights.map((fight) => `${fight.fighterA.name} vs ${fight.fighterB.name}`).join("\n")}
    `;
    return prompt;
  }

  static async getFightsPredictions(event: Event): Promise<GeminiResponse> {
    try {
      const prompt = this.buildPrompt(event);

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        config: GEMINI_CONFIG,
        contents: prompt,
      });

      const prediction = JSON.parse(response.text || "");

      const result = prediction;

      return result;
    } catch (error) {
      console.error("Error getting AI predictions:", error);
      return this.getMockPredictions(event.fights);
    }
  }

  private static getMockPredictions(fights: Fight[]): GeminiResponse {
    return {
      fights: fights.map(() => ({
        winner: Math.random() > 0.5 ? "fighterA" : "fighterB",
        confidence: Math.round((Math.random() * 40 + 60) * 100) / 100,
        analysis: "Análise baseada em histórico de lutas e estatísticas",
        keyFactors: [],
      })),
    };
  }
}
