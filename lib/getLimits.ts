

export function getLimits(plan: string) {

  if (plan === "premium") {
    return { aiGenerations: 20, rooms: 20, aiPerMonth: 100, filesPerRoom: 10 };
  } else if (plan === "ultimate") {
    return { aiGenerations: Number.POSITIVE_INFINITY, rooms: Number.POSITIVE_INFINITY, aiPerMonth: Number.POSITIVE_INFINITY, filesPerRoom: Number.POSITIVE_INFINITY };
  } else if (plan === "ultra") {
    return { aiGenerations: Number.POSITIVE_INFINITY, rooms: Number.POSITIVE_INFINITY, aiPerMonth: Number.POSITIVE_INFINITY, filesPerRoom: Number.POSITIVE_INFINITY };
  } else {
    return { aiGenerations: 5, rooms: 5, aiPerMonth: 25, filesPerRoom: 3 };
  }
}

export function getTierObject(plan: string ) {
  const limits = getLimits(plan);
  const formattedName = plan === "ultra"
    ? "Ultra"
    : plan === "ultimate"
      ? "Ultimate"
      : plan === "premium"
        ? "Premium"
        : "Gratuito";

  const can = plan === "ultimate" || plan === "premium" || plan === "ultra";

  const exportTypes = ["pdf", "md"]
  //if premium add csv
  //if ultra/ultimate add anki
  if (plan === "premium") {
    exportTypes.push("csv");
  } else if (plan === "ultimate" || plan === "ultra") {
    exportTypes.push("anki");
    exportTypes.push("csv");
  }

  const importTypes = ["pdf", "md", "pdf-link"];

  if (plan === "premium") {
    importTypes.push("csv");
  } else if (plan === "ultimate" || plan === "ultra") {
    importTypes.push("csv");
    //img
    importTypes.push("img");
  }
  const importFileTypes = [
    "application/pdf",
    "application/md",
  ]
  if (plan === "premium") {
    importFileTypes.push("application/csv");
  } else if (plan === "ultimate" || plan === "ultra") {
    importFileTypes.push("application/csv");
    //img
    importFileTypes.push("image/png");
    importFileTypes.push("image/jpeg");
  }

  return {
    canGenerateAi: can,
    canCreateRoom: can,
    canUploadFiles: can,
    canCreateFlashcards: can,
    canCreateQuizzes: can,
    limits,
    formattedName,
    isUltimate: plan === "ultimate" || plan === "ultra",
    isUltra: plan === "ultra",
    isPremium: plan === "premium",
    isFree: plan === "free",
    id: plan,
    exportTypes,
    importTypes,
    importFileTypes,
  };
}

export type TierObject = ReturnType<typeof getTierObject>;
export type importTypes = "pdf" | "md" | "pdf-link" | "csv" | "img";
export type exportTypes = "pdf" | "md" | "csv" | "anki";
export type Plan = "premium" | "ultimate" | "ultra" | "free";
export type PlanLimits = {
  aiGenerations: number;
  rooms: number;
  aiPerMonth: number;
  filesPerRoom: number;
};