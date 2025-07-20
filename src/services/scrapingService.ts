// services/scrapingService.ts
import { Event } from "../types/event.js";
import { scrapeEvents, scrapeEventDetails } from "../utils/scrape";

export class ScrapingService {
  static async scrapeLatestEvents(): Promise<Event[]> {
    try {
      const events = await scrapeEvents();
      const eventDetails = await scrapeEventDetails(events);
      return eventDetails.filter((event) => event.fights.length > 0);
    } catch (error) {
      console.error("Error in ScrapingService:", error);
      throw new Error("Failed to scrape events");
    }
  }
}
