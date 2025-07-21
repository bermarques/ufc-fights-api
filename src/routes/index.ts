import { Router } from "express";
import { HealthController } from "../controllers/healthController.js";
import { fightsRouter } from "./fights.js";
import { cronRouter } from "./cron.js";

const router = Router();

router.get("/health", HealthController.check);

router.use("/api/fights", fightsRouter);

router.use("/api/cron", cronRouter);

export { router };
