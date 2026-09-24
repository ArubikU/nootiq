"use client";

import { useRedirectAfterAuth } from "@/hooks/use-redirect-after-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface PromoRedirectHandlerProps {
  searchParams: { code?: string };
}

export default function PromoRedirectHandler({ searchParams }: PromoRedirectHandlerProps) {
  const router = useRouter();
  const { saveCurrentUrl } = useRedirectAfterAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Construir la URL completa incluyendo el código si existe
    const currentPath = '/promo';
    const currentSearch = searchParams.code ? `?code=${searchParams.code}` : '';
    const fullUrl = currentPath + currentSearch;
    
    // Guardar código en localStorage si existe
    if (searchParams.code) {
      localStorage.setItem("pendingPromoCode", searchParams.code);
    }

    // Guardar la URL completa para redirección después del login
    saveCurrentUrl(fullUrl);
    
    // Redirigir al login
    router.push('/login');
  }, [searchParams.code, router, saveCurrentUrl]);

  // Mostrar un loading mientras se redirige
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-dark mx-auto mb-4"></div>
        <p className="text-text">{t("promo.redirect.loading")}</p>
      </div>
    </div>
  );
}
