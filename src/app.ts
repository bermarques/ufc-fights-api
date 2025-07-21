import { config } from "dotenv";
import { createServer } from "./server";
import { CONFIG } from "./config/constants";
import { CronService } from "./services/cronService";

config();

const init = async () => {
  try {
    const app = createServer();

    app.listen(CONFIG.PORT, () => {
      console.log(`Server listening on port ${CONFIG.PORT}`);
      console.log(`Environment: ${CONFIG.NODE_ENV}`);

      const enableCron = process.env.ENABLE_CRON === "true";

      if (enableCron) {
        console.log("Starting cron job...");
        CronService.start();
      } else {
        console.log("Cron job disabled (ENABLE_CRON=false)");
      }
    });
  } catch (err) {
    console.error("Failed to initialize application:", err);
    process.exit(1);
  }
};

init();
