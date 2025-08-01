export type CURRENCY = "PEN" | "USD" | "EUR";
export type CURRENCY_SYMBOL = "S/" | "$" | "€";
export const CURRENCY_SYMBOLS: Record<CURRENCY, CURRENCY_SYMBOL> = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
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

export const getPlanById = (id: string) => {

  if (id === "ultra") id = "ultimate";
  return plans.find((plan) => plan.id === id);
}

export const billingLabels: Record<string, string> = {
  monthly: "Mensual",
  quarterly: "Cuatrismestral (-10%)",
  yearly: "Anual (-20%)",
};
