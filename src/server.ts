import cors from "cors";
import express from "express";
import morgan from "morgan";
import { router } from "./routes/index.js";

export const createServer = () => {
  const app = express();

  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cors());

  app.use(router);

  app.get("/", async (req, res) => {
    res.redirect("/api/fights");
  });

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error("Unhandled error:", err);
      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  );

  return app;
};
