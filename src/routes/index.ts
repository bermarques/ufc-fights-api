import { Router } from "express";
import { HealthController } from "../controllers/healthController.js";
import { fightsRouter } from "./fights.js";

const router = Router();

router.get("/health", HealthController.check);

router.use("/api/fights", fightsRouter);

export { router };
