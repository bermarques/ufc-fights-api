import { Request, Response, NextFunction } from "express";

export const validateTriggerKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { key } = req.body;

  if (!key || key !== process.env.TRIGGER_KEY) {
    return res.status(401).json({
      error: true,
      message: "Invalid or missing trigger key",
    });
  }

  next();
};
