import { TFunction } from 'i18next';

export type CURRENCY = "PEN" | "USD" | "EUR";
export type CURRENCY_AVALIABLE = "USD" | "EUR";
export type CURRENCY_SYMBOL = "S/" | "$" | "€";
export const CURRENCY_SYMBOLS: Record<CURRENCY, CURRENCY_SYMBOL> = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
};

export const CURRENCY_SYMBOLS_AVAILABLE: Record<CURRENCY_AVALIABLE, CURRENCY_SYMBOL> = {
  USD: "$",
  EUR: "€",
};

export type PAYMENT_METHOD = "paypal" | "pago-efectivo";

export const CURRENCY_PAYMENT_METHODS: Record<CURRENCY, PAYMENT_METHOD[]> = {
  PEN: ["pago-efectivo"],
  USD: ["paypal"],
  EUR: ["paypal"],
};

export const CURRENCIES: CURRENCY[] = ["PEN", "USD", "EUR"];
export type WAYS_KEYS = "monthly" | "quarterly" | "yearly";
export type WAYS = { [key in WAYS_KEYS]: number  };
export type Plan = {
  id: string;
  name: string;
  description: string;
  recommended: boolean;
  prices: Record<CURRENCY, WAYS>;
  features: string[];
  unavailable: string[];
};
// Función para obtener los billing labels traducidos
export const getBillingLabels = (t: TFunction): Record<string, string> => ({
  monthly: t('pricing.billing.monthly'),
  quarterly: t('pricing.billing.quarterly'),
  yearly: t('pricing.billing.yearly'),
});

// Función para obtener los planes con traducciones
export const getPlans = (t: TFunction): Plan[] => [
  {
    id: "free",
    name: t('pricing.plans.free.name'),
    description: t('pricing.plans.free.description'),
    recommended: false,
    prices: {
      PEN: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      USD: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      EUR: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
    },
    features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
    unavailable: t('pricing.plans.free.unavailable', { returnObjects: true }) as string[],
  },
  {
    id: "premium",
    name: t('pricing.plans.premium.name'),
    description: t('pricing.plans.premium.description'),
    recommended: true,
    prices: {
      PEN: {
        monthly: 40.0,
        quarterly: 35.0,
        yearly: 30.0,
      },
      USD: {
        monthly: Number.parseFloat((40.0 / 3.8).toFixed(2)),
        quarterly: Number.parseFloat((35.0 / 3.8).toFixed(2)),
        yearly: Number.parseFloat((30.0 / 3.8).toFixed(2)),
      },
      EUR: {
        monthly: Number.parseFloat((40.0 / 4).toFixed(2)),
        quarterly: Number.parseFloat((35.0 / 4).toFixed(2)),
        yearly: Number.parseFloat((30.0 / 4).toFixed(2)),
      },
    },
    features: t('pricing.plans.premium.features', { returnObjects: true }) as string[],
    unavailable: t('pricing.plans.premium.unavailable', { returnObjects: true }) as string[],
  },
  {
    id: "ultimate",
    name: t('pricing.plans.ultimate.name'),
    description: t('pricing.plans.ultimate.description'),
    recommended: false,
    prices: {
      PEN: {
        monthly: 80.0,
        quarterly: 75.0,
        yearly: 70.0,
      },
      USD: {
        monthly: Number.parseFloat((80.0 / 3.8).toFixed(2)),
        quarterly: Number.parseFloat((75.0 / 3.8).toFixed(2)),
        yearly: Number.parseFloat((70.0 / 3.8).toFixed(2)),
      },
      EUR: {
        monthly: Number.parseFloat((80.0 / 4).toFixed(2)),
        quarterly: Number.parseFloat((75.0 / 4).toFixed(2)),
        yearly: Number.parseFloat((70.0 / 4).toFixed(2)),
      },
    },
    features: t('pricing.plans.ultimate.features', { returnObjects: true }) as string[],
    unavailable: t('pricing.plans.ultimate.unavailable', { returnObjects: true }) as string[],
  },
];

// Planes estáticos para compatibilidad con código existente que no use traducciones
export const plans: Plan[] = [
   {
    id: "free",
    name: "Free",
    description: "Para uso personal básico",
    recommended: false,
    prices: {
      PEN: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      USD: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      EUR: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
    },
    features: [
      "Hasta 5 Rooms",
      "5 generaciones de AI por Room",
      "25 generaciones de AI mensuales",
      "3 Archivos por room",
      "Exportación básica de flashcards",
    ],
    unavailable: ["Soporte prioritario"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Para estudiantes y profesionales",
    recommended: true,
    prices: {
      PEN: {
        monthly: 40.0,
        quarterly: 35.0,
        yearly: 30.0,
      },
      USD: {
        monthly: Number.parseFloat((40.0 / 3.8).toFixed(2)),
        quarterly: Number.parseFloat((35.0 / 3.8).toFixed(2)),
        yearly: Number.parseFloat((30.0 / 3.8).toFixed(2)),
      },
      EUR: {
        monthly: Number.parseFloat((40.0 / 4).toFixed(2)),
        quarterly: Number.parseFloat((35.0 / 4).toFixed(2)),
        yearly: Number.parseFloat((30.0 / 4).toFixed(2)),
      },
    },
    features: [
      "Hasta 20 Rooms",
      "20 generaciones de AI por Room",
      "100 generaciones de AI mensuales",
      "10 Archivos por room",
      "Exportación avanzada (CSV)",
      "Documentos especiales (CSV)",
    ],
    unavailable: ["Soporte prioritario"],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    description: "Para uso intensivo",
    recommended: false,
    prices: {
      PEN: {
        monthly: 80.0,
        quarterly: 75.0,
        yearly: 70.0,
      },
      USD: {
        monthly: Number.parseFloat((80.0 / 3.8).toFixed(2)),
        quarterly: Number.parseFloat((75.0 / 3.8).toFixed(2)),
        yearly: Number.parseFloat((70.0 / 3.8).toFixed(2)),
      },
      EUR: {
        monthly: Number.parseFloat((80.0 / 4).toFixed(2)),
        quarterly: Number.parseFloat((75.0 / 4).toFixed(2)),
        yearly: Number.parseFloat((70.0 / 4).toFixed(2)),
      },
    },
    features: [
      "Rooms ilimitados",
      "Generaciones de AI ilimitadas",
      "Exportación ultimate (CSV, Anki)",
      "Soporte prioritario",
      "Documentos especiales (CSV, IMG)",
      "Conversa con el documento",
    ],
    unavailable: [],
  },
];

export const getPlanById = (id: string, t?: TFunction) => {
  if (id === "ultra") id = "ultimate";
  
  if (t) {
    const translatedPlans = getPlans(t);
    return translatedPlans.find((plan) => plan.id === id);
  }
  
  return plans.find((plan) => plan.id === id);
}

// Función para obtener los billing labels con traducciones o fallback
export const getBillingLabelsWithFallback = (t?: TFunction): Record<string, string> => {
  if (t) {
    return getBillingLabels(t);
  }
  
  return billingLabels;
}

export const billingLabels: Record<string, string> = {
  monthly: "Mensual",
  quarterly: "Cuatrismestral (-10%)",
  yearly: "Anual (-20%)",
};
