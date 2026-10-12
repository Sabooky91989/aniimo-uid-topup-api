import crypto from 'crypto';
import { ANIIMO_CONFIG } from '../../config/constants';
import { VerifyService } from '../verify/verify.service';
import { CreateTopupOrderInput } from './order.validator';
import { logger } from '../resilience/resilience.service';

export interface TopupOrderResult {
  orderId: string;
  fpOrderId: string;
  uid: string;
  characterName: string;
  characterLevel: number;
  serverId: string;
  serverName: string;
  packageId: string;
  packageName: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  currency: string;
  paymentChannel: string;
  paymentUrl: string;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export class OrderService {
  private verifyService = new VerifyService();
  private static orders: Map<string, TopupOrderResult> = new Map();

  /**
   * Create UID-based Top-up Order locked to Taiwan Region / MyCard
   */
  public async createOrder(
    input: CreateTopupOrderInput,
    clientIp: string
  ): Promise<TopupOrderResult> {
    const { uid, serverId, packageId, payChannel } = input;

    // 1. Verify character details first
    const char = await this.verifyService.verifyCharacter(
      { uid, server: serverId },
      clientIp
    );

    // 2. Validate product package
    const pkg = ANIIMO_CONFIG.PRODUCTS.find(p => p.id === packageId);
    if (!pkg) {
      const err = new Error(`Product package '${packageId}' not found in Taiwan store catalogue.`);
      (err as any).statusCode = 404;
      (err as any).code = 'PRODUCT_NOT_FOUND';
      throw err;
    }

    // 3. Calculate 8% Official Shop Benefit Discount
    const originalPrice = pkg.price;
    const discount = pkg.isPopular ? 12 : Math.round(originalPrice * 0.08);
    const finalPrice = Math.max(1, originalPrice - discount);

    // 4. Generate Order IDs
    const orderId = `ANIIMO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fpOrderId = `FP-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    // 5. Construct MyCard Payment Gateway Session URL
    const mycardSessionToken = crypto.randomBytes(16).toString('hex');
    const paymentUrl = `https://www.mycard520.com.tw/MyCardBilling/Auth?tradeNo=${fpOrderId}&token=${mycardSessionToken}&amount=${finalPrice}&currency=TWD`;

    const orderRecord: TopupOrderResult = {
      orderId,
      fpOrderId,
      uid,
      characterName: char.roleName,
      characterLevel: char.level,
      serverId: char.serverId,
      serverName: char.serverName,
      packageId: pkg.id,
      packageName: pkg.name,
      originalPrice,
      discount,
      finalPrice,
      currency: 'TWD',
      paymentChannel: 'MyCard Points',
      paymentUrl,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
    };

    OrderService.orders.set(orderId, orderRecord);
    logger.info(`Created Aniimo UID Top-Up Order: ${orderId} for character: ${char.roleName} (TWD ${finalPrice})`);

    return orderRecord;
  }

  /**
   * Retrieve order details
   */
  public getOrder(orderId: string): TopupOrderResult | undefined {
    return OrderService.orders.get(orderId);
  }
}
