import { config } from "dotenv";
import { createServer } from "./server.js";
import { CONFIG } from "./config/constants.js";

config();

const init = async () => {
  try {
    const app = createServer();

    app.listen(CONFIG.PORT, () => {
      console.log(`Server listening on port ${CONFIG.PORT}`);
      console.log(`Environment: ${CONFIG.NODE_ENV}`);
    });
  } catch (err) {
    console.error("Failed to initialize application:", err);
    process.exit(1);
  }
};

init();
