/**
 * Aniimo Webshop Constants & Reverse Engineered Configurations
 * Extracted from WorldX Web Store Global Bundle (FunPlus / Kingsgroup)
 */
export const ANIIMO_CONFIG = {
  GAME_ID: 999002,
  GAME_PROJECT: 'worldx_global',
  SOURCE: 'web',
  REGION: 'global',
  ENTITY: 'rawprint',
  
  // Official API Endpoints
  ENDPOINTS: {
    OFFICIAL_STORE: 'https://www.aniimo.com/store/',
    OFFICIAL_STORE_TW: 'https://www.aniimo.com/store/zh-tw/',
    STORE_ACCOUNT_API: 'https://worldx-store-account.kingsgroupgames.com',
    STORE_COIN_API: 'https://worldx-store-coin.kingsgroupgames.com',
    AME_API: 'https://worldx-ame.kingsgroupgames.com',
    LOGIN_SDK: 'https://worldx-website-cdn.aniimo.com/official-website/worldx/office_global/login_sdk',
    DEVPROXY_SHUMEI: 'https://devproxy-web.kingsgroupgames.com',
  },

  // Taiwan Region Lock
  PAYMENT_TARGET: {
    REGION: 'Taiwan',
    COUNTRY: 'TW',
    CURRENCY: 'TWD',
    PAY_CHANNEL: 'mycard',
    LOCALE: 'zh-tw',
  },

  // Anti-Bot & Fingerprinting Config (Shumei Web SDK)
  SHUMEI: {
    ORGANIZATION: 'xNxMh079HgFDeRkJE1qN',
    APP_ID: 'web_sdk',
    API_HOST: 'devproxy-web.kingsgroupgames.com',
    PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtbekoieD6v30htpLAEPVp3w2nr9DRC8ElQu+qQfT+MPIU3K3Qc1FiF3gL0GDIKoTOXGuCXz/pVe7snZqcBh/8fsxpsQQMv/pSpzd6rLOthwwbvxLbWW06CU6SGXHBUDCYY+V/Y4GtsgwzhAf3Z0VZ/t0DXX8Yh/SaPXJuKJFn0wIDAQAB',
  },

  // Official Servers
  SERVERS: [
    { id: '1', name: 'Server 1 (Apac)', area: 1 },
    { id: '2', name: 'Server 2 (America)', area: 2 },
    { id: '3', name: 'Server 3 (Europe)', area: 3 },
    { id: '4', name: 'Server 4 (Taiwan/HK/Global)', area: 4 },
  ],

  // Taiwan Region Top-Up Products Catalogue (TWD Currency / MyCard)
  PRODUCTS: [
    {
      id: 'prod_star_60',
      productId: 'com.aniimo.star60.tw',
      name: '60 ดาว + โบนัส 6',
      firstTimeBonus: '+60 ดาว',
      originalPrice: 30,
      price: 28,
      currency: 'TWD',
      category: 'CRYSTAL',
      icon: '💎'
    },
    {
      id: 'prod_star_300',
      productId: 'com.aniimo.star300.tw',
      name: '300 ดาว + โบนัส 30 (ซื้อครั้งแรก +300)',
      firstTimeBonus: 'ซื้อครั้งแรก +300',
      originalPrice: 150,
      price: 138,
      currency: 'TWD',
      category: 'CRYSTAL',
      isPopular: true,
      icon: '💎'
    },
    {
      id: 'prod_star_980',
      productId: 'com.aniimo.star980.tw',
      name: '980 ดาว + โบนัส 98 (ซื้อครั้งแรก +980)',
      firstTimeBonus: 'ซื้อครั้งแรก +980',
      originalPrice: 490,
      price: 451,
      currency: 'TWD',
      category: 'CRYSTAL',
      icon: '💎'
    },
    {
      id: 'prod_star_1980',
      productId: 'com.aniimo.star1980.tw',
      name: '1980 ดาว + โบนัส 198 (ซื้อครั้งแรก +1980)',
      firstTimeBonus: 'ซื้อครั้งแรก +1980',
      originalPrice: 911,
      price: 911,
      currency: 'TWD',
      category: 'CRYSTAL',
      icon: '💎'
    },
    {
      id: 'prod_star_3280',
      productId: 'com.aniimo.star3280.tw',
      name: '3280 ดาว + โบนัส 328',
      firstTimeBonus: 'ซื้อครั้งแรก +3280',
      price: 1510,
      currency: 'TWD',
      category: 'CRYSTAL',
      icon: '💎'
    },
    {
      id: 'prod_monthly_pass',
      productId: 'com.aniimo.monthlypass.tw',
      name: 'Monthly Pass (บัตรรายเดือน)',
      firstTimeBonus: 'รับ 300 ดาวทันที + 90 ดาว/วัน',
      price: 150,
      currency: 'TWD',
      category: 'PASS',
      icon: '🎫'
    },
    {
      id: 'prod_adv_handbook',
      productId: 'com.aniimo.advhandbook.tw',
      name: 'Advanced Companion Handbook',
      firstTimeBonus: 'ปลดล็อกคู่มือพิเศษ Lv. 1-50',
      price: 300,
      currency: 'TWD',
      category: 'HANDBOOK',
      icon: '📖'
    },
  ]
};
