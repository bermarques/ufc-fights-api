import cors from "cors";
import express from "express";
import fs from "fs/promises";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { scrapeEventDetails, scrapeEvents } from "../utils/scrape";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

const DATA_DIR = isProduction ? "/data" : path.join(__dirname, "..", "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "fights.data");

async function ensureDirectoryExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.log(err);
    if (err.code !== "EEXIST") {
      console.error(`Error creating directory: ${err.message}`);
    }
  }
}

export const createServer = () => {
  const app = express();

  // @ts-expect-error unexpected
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cors());

  app.post("/scrape", async (req, res) => {
    const { key } = req.body;
    console.log(key);
    if (!key || key !== process.env.TRIGGER_KEY) {
      return res
        .status(401)
        .send({ error: true, message: "Invalid trigger key" });
    }

    try {
      await ensureDirectoryExists();

      const events = await scrapeEvents();
      const eventDetails = await scrapeEventDetails(events);

      const fileData = {
        data: eventDetails,
        updatedAt: new Date(),
      };

      const buffer = Buffer.from(JSON.stringify(fileData));
      await fs.writeFile(DATA_FILE_PATH, buffer);

      return res
        .status(200)
        .send({ error: false, message: "Scraping and updating completed" });
    } catch (err) {
      console.error("Error during scraping process:", err);
      return res
        .status(500)
        .send({ error: true, message: "Error during scraping process" });
    }
  });

  app.get("/", async (req, res) => {
    try {
      const buffer = await fs.readFile(DATA_FILE_PATH);
      const data = JSON.parse(buffer.toString());
      return res.status(200).send(data);
    } catch (err) {
      console.error("Error retrieving data:", err);
      return res.status(404).send({ error: true, message: "Data not found" });
    }
  });

  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  return app;
};
