import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export interface ProxyNode {
  url: string;
  region: string;
  latencyMs: number;
  fails: number;
  lastUsed: number;
}

export class ResilienceService {
  private static instance: ResilienceService;

  // Rate Limiter storage: ip -> timestamps
  private requestHistory: Map<string, number[]> = new Map();
  private readonly RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 30; // 30 req/min per IP

  // Outbound Taiwan Regional Proxy Pool
  private proxyPool: ProxyNode[] = [
    { url: 'http://tw-proxy-hinet-01.local:8080', region: 'TW-Taipei', latencyMs: 25, fails: 0, lastUsed: 0 },
    { url: 'http://tw-proxy-taiwanmobile-02.local:8080', region: 'TW-Taichung', latencyMs: 32, fails: 0, lastUsed: 0 },
    { url: 'http://tw-proxy-chunghwa-03.local:8080', region: 'TW-Kaohsiung', latencyMs: 29, fails: 0, lastUsed: 0 },
  ];
  private currentProxyIndex = 0;

  // Pre-warmed Shumei Device Fingerprint Tokens
  private deviceTokens: string[] = [
    'sm_b49912aa_9f1b4028_c890123f_devtoken_tw01',
    'sm_c12847ff_41e0992a_da77102b_devtoken_tw02',
    'sm_d99104cc_71b9338e_eb11904a_devtoken_tw03'
  ];

  public static getInstance(): ResilienceService {
    if (!ResilienceService.instance) {
      ResilienceService.instance = new ResilienceService();
    }
    return ResilienceService.instance;
  }

  /**
   * Check client rate limits (Sliding Window Algorithm)
   */
  public checkRateLimit(clientIp: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
    const now = Date.now();
    const history = this.requestHistory.get(clientIp) || [];

    // Filter out timestamps outside the sliding window
    const validTimestamps = history.filter(ts => now - ts < this.RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= this.MAX_REQUESTS_PER_WINDOW) {
      const oldest = validTimestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + this.RATE_LIMIT_WINDOW_MS - now) / 1000);
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`, { retryAfterSeconds });
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    validTimestamps.push(now);
    this.requestHistory.set(clientIp, validTimestamps);

    return {
      allowed: true,
      remaining: this.MAX_REQUESTS_PER_WINDOW - validTimestamps.length
    };
  }

  /**
   * Get next active Taiwan Regional Proxy Node for outbound request to bypass IP bans
   */
  public getNextProxy(): ProxyNode {
    const activeProxies = this.proxyPool.filter(p => p.fails < 3);
    const pool = activeProxies.length > 0 ? activeProxies : this.proxyPool;
    
    this.currentProxyIndex = (this.currentProxyIndex + 1) % pool.length;
    const proxy = pool[this.currentProxyIndex];
    proxy.lastUsed = Date.now();
    return proxy;
  }

  /**
   * Report proxy failure for health tracking
   */
  public reportProxyFailure(proxyUrl: string): void {
    const proxy = this.proxyPool.find(p => p.url === proxyUrl);
    if (proxy) {
      proxy.fails += 1;
      logger.warn(`Reported failure for proxy: ${proxyUrl}`, { fails: proxy.fails });
    }
  }

  /**
   * Acquire a valid Shumei Anti-Fraud Device Token
   */
  public getShumeiDeviceToken(): string {
    const token = this.deviceTokens[Math.floor(Math.random() * this.deviceTokens.length)];
    return token;
  }

  /**
   * Prepare request headers mimicking real browser in Taiwan region
   */
  public getBrowserHeaders(options?: { referer?: string }): Record<string, string> {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'Origin': 'https://www.aniimo.com',
      'Referer': options?.referer || 'https://www.aniimo.com/store/zh-tw/',
      'Sec-Ch-Ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'X-Device-Fingerprint': this.getShumeiDeviceToken(),
    };
  }
}
