import { Request, Response, NextFunction } from 'express';
import { VerifyService } from './verify.service';
import { verifyCharacterSchema } from './verify.validator';
import { ANIIMO_CONFIG } from '../../config/constants';

export class VerifyController {
  private verifyService = new VerifyService();

  /**
   * POST /api/v1/aniimo/verify
   * Verify character details by UID and Server
   */
  public verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = verifyCharacterSchema.parse(req.body);
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      const result = await this.verifyService.verifyCharacter(parsed, clientIp);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/aniimo/servers
   * List supported game servers
   */
  public getServers = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        gameId: ANIIMO_CONFIG.GAME_ID,
        gameProject: ANIIMO_CONFIG.GAME_PROJECT,
        servers: ANIIMO_CONFIG.SERVERS,
      },
    });
  };
}
