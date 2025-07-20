import { prediction } from "../../data/prediction";
import { Event } from "../types/event";
import { Fight, FightPrediction } from "../types/fight";
import { basePrompt } from "../utils/prompt";

export class AIService {
  private static readonly AI_API_URL =
    process.env.AI_API_URL || "https://api.example.com/predict";
  private static readonly AI_API_KEY = process.env.AI_API_KEY;

  static async buildPrompt(event: Event) {
    const prompt = `
    ${basePrompt} \n
    EVENT: ${event.title},
    DATE: ${event.date},
    FIGHTS: 
    ${event.fights.map((fight) => `${fight.fighterA.name} vs ${fight.fighterB.name}`).join("\n")}
    `;
    return prompt;
  }

  static async getFightsPredictions(event: Event): Promise<FightPrediction[]> {
    try {
      this.buildPrompt(event);

      //   const response = await fetch(this.AI_API_URL, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${this.AI_API_KEY}`,
      //     },
      //     body: JSON.stringify({ fights: fightData }),
      //   });

      //   if (!response.ok) {
      //     throw new Error(`AI API responded with status: ${response.status}`);
      //   }

      //   const result = await response.json();
      const result = prediction;

      return result;
    } catch (error) {
      console.error("Error getting AI predictions:", error);
      return this.getMockPredictions(event.fights);
    }
  }

  private static getMockPredictions(fights: Fight[]): FightPrediction[] {
    return fights.map(() => ({
      winner: Math.random() > 0.5 ? "fighterA" : "fighterB",
      confidence: Math.round((Math.random() * 40 + 60) * 100) / 100,
      analysis: "Análise baseada em histórico de lutas e estatísticas",
      keyFactors: [],
    }));
  }
}
