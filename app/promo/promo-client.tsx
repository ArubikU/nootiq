"use client";

import { getPlanById } from "@/components/pricing/billingLabels";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCustomAlerts } from "@/hooks/use-custom-alerts";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface PromoClientPageProps {
  currentPlan: string;
  planId: string;
  expirationDate: string | null;
  initialCode?: string;
}

export default function PromoClientPage({

  currentPlan,
  planId,
  expirationDate,
  initialCode,
}: PromoClientPageProps) {
  const { alert } = useCustomAlerts();
  const { getErrorMessage } = useErrorHandler();
  const router = useRouter();
  const { t } = useTranslation();
  const { formatDateString } = useDateFormatter();

  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [claimedPlan, setClaimedPlan] = useState<string | null>(null);
  const [claimedDuration, setClaimedDuration] = useState<number | null>(null);
const didLoadPromoCode = useRef(false);

useEffect(() => {
  if (didLoadPromoCode.current) return;
  didLoadPromoCode.current = true;

  // Primero intentar obtener el código de la URL
  const params = new URLSearchParams(window.location.search);
  const urlCode = params.get("code");
  
  // Si hay código en la URL, usarlo y guardarlo en localStorage
  if (urlCode) {
    setPromoCode(urlCode);
    localStorage.setItem("pendingPromoCode", urlCode);
    return;
  }

  // Si no hay código en URL pero hay initialCode del servidor, usarlo
  if (initialCode) {
    setPromoCode(initialCode);
    return;
  }

  // Finalmente, intentar obtener desde localStorage
  const storedCode = localStorage.getItem("pendingPromoCode");
  if (storedCode) {
    setPromoCode(storedCode);
  }
}, [initialCode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setError(t("promo.redeemForm.emptyError"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/promo/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        if (data.error?.code) {
          const errorMessage = getErrorMessage(data.error.code);
          setError(errorMessage);
          alert(errorMessage, "error");
        } else {
          const message = data.message || t("promo.errors.generic");
          setError(message);
          alert(message, "error");
        }
        return;
      }

      setSuccess(true);
      setClaimedPlan(data.planName);
      setClaimedDuration(data.duration);

      // Limpiar el código del localStorage una vez reclamado exitosamente
      localStorage.removeItem("pendingPromoCode");

      setTimeout(() => router.refresh(), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("promo.errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  }, [promoCode, t, getErrorMessage, alert, router]);

  const handlePromoCodeChange = useCallback((val: string) => {
    setPromoCode(val);
  }, []);

  const PromoInfoCard = () => (
    <Card className="shadow-md p-8 bg-secondary">
      <CardHeader>
        <CardTitle className="text-accent-heavy">{t("promo.currentPlan.title")}</CardTitle>
        <CardDescription>{t("promo.currentPlan.description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium ">{t("promo.currentPlan.plan")}</span>
          <span className="font-semibold text-accent-heavy">{currentPlan}</span>
        </div>
        {expirationDate && planId !== "free" && (
          <div className="flex justify-between">
            <span className="font-medium ">{t("promo.currentPlan.expires")}</span>
            <span>{formatDateString(expirationDate, 'medium')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SuccessCard = () => (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <Card className="border border-success p-8 bg-secondary">
        <CardHeader>
          <CardTitle className="text-secondary">
            {t("promo.success.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="">{t("promo.success.planActivated")}</span>
            <span className="font-bold text-accent-heavy">{claimedPlan}</span>
          </div>
          <div className="flex justify-between">
            <span className="">{t("promo.success.duration")}</span>
            <span>{claimedDuration} {t("promo.success.days")}</span>
          </div>
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">{t("promo.success.benefits")}</h4>
            <ul className="space-y-2">
              {getPlanById(claimedPlan!.toLowerCase(), t)?.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <BadgeCheck className="h-5 w-5 text-success mr-2 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-accent hover:bg-accent-heavy"
            onClick={() => router.push("/rooms")}
            disabled={isLoading}
          >
            {t("promo.success.goToDashboard")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const PromoForm = useMemo(() => (
    <form onSubmit={handleSubmit}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Card className="shadow-sm p-8 bg-secondary">
          <CardHeader>
            <CardTitle className="text-accent-heavy">{t("promo.redeemForm.title")}</CardTitle>
            <CardDescription>
              {t("promo.redeemForm.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="promoCode" className="text-sm font-medium">
                {t("promo.redeemForm.label")}
              </label>
              <Input
                placeholder={t("promo.redeemForm.placeholder")}
                value={promoCode}
                onChange={handlePromoCodeChange}
                className="text-primary bg-primary border-none"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>{t("promo.errors.errorTitle")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-heavy"
              disabled={isLoading}
            >
              {isLoading ? t("promo.redeemForm.redeeming") : t("promo.redeemForm.redeemButton")}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </form>
  ), [handleSubmit, t, promoCode, handlePromoCodeChange, error, isLoading]);

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">{t("promo.title")}</h1>
        <p className="text-xl text-text max-w-2xl mx-auto">
          {t("promo.subtitle")}
        </p>
      </div>
      <motion.div
        className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PromoInfoCard />
        {success ? <SuccessCard /> : PromoForm}
      </motion.div>
    </div>
  );
}
