import { Router } from "express";
import { FightController } from "../controllers/fightController.js";
import { validateTriggerKey } from "../middleware/auth.js";

const router = Router();

router.get("/", FightController.getFights);

router.post(
  "/scrape",
  validateTriggerKey,
  FightController.scrapeAndUpdateFights
);

router.post(
  "/predictions",
  validateTriggerKey,
  FightController.updatePredictions
);

export { router as fightsRouter };
