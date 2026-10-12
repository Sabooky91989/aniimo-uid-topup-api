import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { createTopupOrderSchema } from './order.validator';

export class OrderController {
  private orderService = new OrderService();

  /**
   * POST /api/v1/aniimo/order
   * Create UID Top-Up order locked to Taiwan TWD via MyCard
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createTopupOrderSchema.parse(req.body);
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      const order = await this.orderService.createOrder(parsed, clientIp);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/aniimo/order/:orderId
   * Retrieve order details
   */
  public getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
      const order = this.orderService.getOrder(orderId);
      if (!order) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order '${orderId}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };
}
