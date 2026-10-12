import { Request, Response } from 'express';
import { ANIIMO_CONFIG } from '../../config/constants';

export class ProductsController {
  /**
   * GET /api/v1/aniimo/packages
   * Retrieve official top-up packages locked to Taiwan region (TWD Currency)
   */
  public getPackages = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        region: ANIIMO_CONFIG.PAYMENT_TARGET.REGION,
        country: ANIIMO_CONFIG.PAYMENT_TARGET.COUNTRY,
        currency: ANIIMO_CONFIG.PAYMENT_TARGET.CURRENCY,
        payChannel: ANIIMO_CONFIG.PAYMENT_TARGET.PAY_CHANNEL,
        packages: ANIIMO_CONFIG.PRODUCTS,
      },
    });
  };
}
