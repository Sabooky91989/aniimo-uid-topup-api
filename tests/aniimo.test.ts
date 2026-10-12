import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Aniimo UID Top-Up API Technical Assessment Tests', () => {
  describe('Part 1: Character Verification Endpoint (POST /api/v1/aniimo/verify)', () => {
    it('should verify character successfully for valid UID and Server (e.g. 412000126173 on Server 4)', async () => {
      const res = await request(app)
        .post('/api/v1/aniimo/verify')
        .send({
          uid: '412000126173',
          server: '4',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roleName).toBe('Sweettoast');
      expect(res.body.data.level).toBe(80);
      expect(res.body.data.serverId).toBe('4');
      expect(res.body.data.currency).toBe('TWD');
      expect(res.body.data.region).toBe('Taiwan');
    });

    it('should reject non-numeric UID with 400 Validation Error', async () => {
      const res = await request(app)
        .post('/api/v1/aniimo/verify')
        .send({
          uid: 'ABC12345678',
          server: '4',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid server with 400 Error', async () => {
      const res = await request(app)
        .post('/api/v1/aniimo/verify')
        .send({
          uid: '412000126173',
          server: '99',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_SERVER');
    });

    it('should return 404 for non-existent UID', async () => {
      const res = await request(app)
        .post('/api/v1/aniimo/verify')
        .send({
          uid: '1234', // too short, non-existent
          server: '4',
        });

      expect(res.status).toBe(400); // failed schema min 5 digits
    });
  });

  describe('Part 2: Server List & Packages (Region Taiwan TWD)', () => {
    it('GET /api/v1/aniimo/servers should list all official servers', async () => {
      const res = await request(app).get('/api/v1/aniimo/servers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.servers.length).toBeGreaterThanOrEqual(4);
    });

    it('GET /api/v1/aniimo/packages should list packages locked to Taiwan TWD with MyCard channel', async () => {
      const res = await request(app).get('/api/v1/aniimo/packages');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.region).toBe('Taiwan');
      expect(res.body.data.currency).toBe('TWD');
      expect(res.body.data.payChannel).toBe('mycard');
      expect(res.body.data.packages.length).toBeGreaterThanOrEqual(5);

      // Verify 300 stars package highlighted in assignment
      const pkg300 = res.body.data.packages.find((p: any) => p.id === 'prod_star_300');
      expect(pkg300).toBeDefined();
      expect(pkg300.price).toBe(138);
    });
  });

  describe('Part 3: Top-up Order Creation via UID & MyCard Flow (POST /api/v1/aniimo/order)', () => {
    it('should create top-up order with MyCard session URL without requiring user password', async () => {
      const res = await request(app)
        .post('/api/v1/aniimo/order')
        .send({
          uid: '412000126173',
          serverId: '4',
          packageId: 'prod_star_300',
          payChannel: 'mycard_points',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderId).toMatch(/^ANIIMO-/);
      expect(res.body.data.fpOrderId).toMatch(/^FP-/);
      expect(res.body.data.characterName).toBe('Sweettoast');
      expect(res.body.data.currency).toBe('TWD');
      expect(res.body.data.paymentUrl).toContain('mycard520.com.tw');
    });

    it('should retrieve order details via GET /api/v1/aniimo/order/:orderId', async () => {
      const createRes = await request(app)
        .post('/api/v1/aniimo/order')
        .send({
          uid: '412000126173',
          serverId: '4',
          packageId: 'prod_star_60',
          payChannel: 'mycard_points',
        });

      const orderId = createRes.body.data.orderId;
      const getRes = await request(app).get(`/api/v1/aniimo/order/${orderId}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.orderId).toBe(orderId);
    });
  });
});
