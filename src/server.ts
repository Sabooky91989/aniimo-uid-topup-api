import { createApp } from './app';
import { logger } from './modules/resilience/resilience.service';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const app = createApp();

app.listen(PORT, () => {
  logger.info(`🎮 Aniimo UID Top-Up API & Webshop Service running at http://localhost:${PORT}`);
  logger.info(`🇹🇼 Region locked to Taiwan (TWD) | Payment Channel: MyCard`);
});
