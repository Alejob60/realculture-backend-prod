// src/common/constants/pricing.ts

// Precios de cada plan (en COP)
export const PLAN_PRICES = {
  CREATOR: 15000,  // Precio de la suscripción CREATOR en COP
  PRO: 45000,      // Precio de la suscripción PRO en COP
};

// Créditos asignados por cada plan
export const PLAN_CREDITS = {
  'promo-image': { FREE: 10, CREATOR: 15, PRO: 10 },
  'promo-video': { FREE: 25, CREATOR: 25, PRO: 15 },
  audio: { FREE: 5, CREATOR: 5, PRO: 0 },
  subtitles: { FREE: 10, CREATOR: 10, PRO: 5 },
  'ai-agent': { FREE: null, CREATOR: 150, PRO: 150 },
  'campaign-automation': { FREE: null, CREATOR: 40, PRO: 20 },
  avatar: { FREE: null, CREATOR: null, PRO: 150 },
};

// Precios de los paquetes de créditos (en COP)
export const CREDIT_PACKAGES = {
  25: 5000,   // Paquete de 25 créditos por 5000 COP
  100: 15000, // Paquete de 100 créditos por 15000 COP
  500: 50000, // Paquete de 500 créditos por 50000 COP
};

// Costo de compra de créditos por duración de audio
export const AUDIO_DURATION_CREDIT_COST: Record<number, number> = {
  20: 5000,   // Costo de 20 segundos de audio
  30: 10000,  // Costo de 30 segundos de audio
  60: 25000,  // Costo de 60 segundos de audio
};
