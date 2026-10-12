import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { VerifyController } from './modules/verify/verify.controller';
import { ProductsController } from './modules/products/products.controller';
import { OrderController } from './modules/orders/order.controller';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app: Application = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static interactive frontend
  app.use(express.static(path.join(__dirname, '../public')));

  // Healthcheck
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'aniimo-uid-topup-api',
      region: 'Taiwan (TWD)',
      paymentGateway: 'MyCard',
      timestamp: new Date().toISOString(),
    });
  });

  // Controllers
  const verifyController = new VerifyController();
  const productsController = new ProductsController();
  const orderController = new OrderController();

  // API v1 Routes
  const router = express.Router();

  // 1. Character Verification & Server routes
  router.post('/aniimo/verify', verifyController.verify);
  router.get('/aniimo/servers', verifyController.getServers);

  // 2. Packages Catalogue (Region Taiwan TWD)
  router.get('/aniimo/packages', productsController.getPackages);

  // 3. Order & Payment Flow
  router.post('/aniimo/order', orderController.create);
  router.get('/aniimo/order/:orderId', orderController.getById);

  app.use('/api/v1', router);

  // Fallback to Web UI
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
