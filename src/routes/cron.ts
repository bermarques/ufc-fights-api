import { Router } from "express";
import { CronController } from "../controllers/cronController.js";
import { validateTriggerKey } from "../middleware/auth.js";

const router = Router();

router.get("/", CronController.getStatus);

router.post("/start", validateTriggerKey, CronController.start);

router.post("/stop", validateTriggerKey, CronController.stop);

export { router as cronRouter };
