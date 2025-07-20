import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Event } from "../types/event.js";
import { FileData } from "../types/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DataService {
  private static readonly isProduction = process.env.NODE_ENV === "production";
  private static readonly DATA_DIR = this.isProduction
    ? "/data"
    : path.join(__dirname, "..", "..", "data");
  private static readonly DATA_FILE_PATH = path.join(
    this.DATA_DIR,
    "fights.data"
  );

  static async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.DATA_DIR, { recursive: true });
    } catch (err: any) {
      if (err.code !== "EEXIST") {
        console.error(`Error creating directory: ${err.message}`);
        throw err;
      }
    }
  }

  static async saveEvents(events: Event[]): Promise<void> {
    try {
      await this.ensureDirectoryExists();

      const fileData: FileData = {
        data: events,
        updatedAt: new Date(),
      };

      const buffer = Buffer.from(JSON.stringify(fileData));
      await fs.writeFile(this.DATA_FILE_PATH, buffer);
    } catch (error) {
      console.error("Error saving events:", error);
      throw new Error("Failed to save events");
    }
  }

  static async getEvents(): Promise<FileData> {
    try {
      const buffer = await fs.readFile(this.DATA_FILE_PATH);
      const data = JSON.parse(buffer.toString());
      return data;
    } catch (error) {
      console.error("Error reading events:", error);
      throw new Error("Failed to read events data");
    }
  }
}
