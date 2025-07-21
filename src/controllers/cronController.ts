import { Request, Response } from "express";
import { CronService } from "../services/cronService";

export class CronController {
  static getStatus(req: Request, res: Response) {
    const status = CronService.getStatus();
    res.json({
      error: false,
      data: status,
    });
  }

  static start(req: Request, res: Response) {
    try {
      CronService.start();
      res.json({
        error: false,
        message: "Cron job iniciado com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Erro ao iniciar cron job",
      });
    }
  }

  static stop(req: Request, res: Response) {
    try {
      CronService.stop();
      res.json({
        error: false,
        message: "Cron job parado com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Erro ao parar cron job",
      });
    }
  }
}
