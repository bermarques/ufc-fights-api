import cron from "node-cron";
import { ScrapingService } from "./scrapingService.js";
import { AIService } from "./aiService.js";
import { DataService } from "./dataService.js";

export class CronService {
  private static cronJob: any = null;
  private static isActive = false;

  static start(): void {
    if (this.isActive) {
      console.log("Cron job already running");
      return;
    }

    try {
      this.cronJob = cron.schedule("0 9 * * 4", () => {
        this.executeScraping();
      });

      this.isActive = true;
      console.log("Cron job initialized: Thursday 9am (GMT-3)");
    } catch (error) {
      console.error("Error intializing cron job:", error);
    }
  }

  static stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      this.isActive = false;
      console.log("Cron job stopped");
    }
  }

  static getStatus(): { active: boolean; schedule: string } {
    return {
      active: this.isActive,
      schedule: "Thursday 9am (GMT-3)",
    };
  }

  private static async executeScraping(): Promise<void> {
    const startTime = Date.now();

    try {
      console.log("[CRON] Initializing automatic process...");

      console.log("[CRON] Starting scraping...");
      const events = await ScrapingService.scrapeLatestEvents();

      console.log("[CRON] Generating AI predictions...");
      for (const event of events) {
        if (event.fights.length > 0) {
          const predictions = await AIService.getFightsPredictions(event);
          event.fights.forEach((fight, index) => {
            fight.prediction = predictions.fights[index];
          });
        }
      }

      console.log("[CRON] Saving data...");
      await DataService.saveEvents(events);

      const duration = Math.round((Date.now() - startTime) / 1000);
      console.log(`[CRON] Process finished in ${duration}s`);
    } catch (error) {
      console.error("[CRON] Error during execution:", error);
    }
  }
}
