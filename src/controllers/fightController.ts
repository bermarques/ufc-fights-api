import { Request, Response } from "express";
import { ScrapingService } from "../services/scrapingService.js";
import { AIService } from "../services/aiService.js";
import { DataService } from "../services/dataService.js";
import { ScrapeRequest, ApiResponse } from "../types/api.js";

export class FightController {
  static async scrapeAndUpdateFights(
    req: Request<{}, {}, ScrapeRequest>,
    res: Response<ApiResponse>
  ) {
    try {
      const { key } = req.body;

      if (!key || key !== process.env.TRIGGER_KEY) {
        return res.status(401).json({
          error: true,
          message: "Invalid trigger key",
        });
      }
      const events = await ScrapingService.scrapeLatestEvents();

      await DataService.saveEvents(events);

      return res.status(200).json({
        error: false,
        message: "Scraping succesfully completed",
      });
    } catch (error) {
      console.error("Error in scrapeAndUpdateFights:", error);
      return res.status(500).json({
        error: true,
        message: "Error during scraping",
      });
    }
  }

  static async getFights(req: Request, res: Response<ApiResponse>) {
    try {
      const data = (await DataService.getEvents()).data;
      return res.status(200).json({
        error: false,
        data: data?.[0],
      });
    } catch (error) {
      console.error("Error retrieving fights:", error);
      return res.status(404).json({
        error: true,
        message: "Fights data not found",
      });
    }
  }

  static async updatePredictions(req: Request, res: Response<ApiResponse>) {
    try {
      const existingData = await DataService.getEvents();
      req.setTimeout(300000);

      for (const event of existingData.data) {
        if (event.fights.length > 0) {
          const predictions = await AIService.getFightsPredictions(event);
          event.fights.forEach((fight, index) => {
            fight.prediction = predictions.fights[index];
          });
        }
      }

      await DataService.saveEvents(existingData.data);

      return res.status(200).json({
        error: false,
        message: "Predictions updated successfully",
        data: existingData.data,
      });
    } catch (error) {
      console.error("Error updating predictions:", error);
      return res.status(500).json({
        error: true,
        message: "Error updating predictions",
      });
    }
  }
}
