"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectAfterAuth() {
  const router = useRouter();

  const saveCurrentUrl = (url: string) => {
    // Guardar solo si no es una ruta de auth
    if (!url.includes('/login') && !url.includes('/register')) {
      localStorage.setItem('redirectAfterAuth', url);
    }
  };

  const handleRedirectAfterAuth = () => {
    const savedUrl = localStorage.getItem('redirectAfterAuth');
    if (savedUrl) {
      localStorage.removeItem('redirectAfterAuth');
      router.push(savedUrl);
      return true;
    }
    return false;
  };

  const redirectToAuth = (authType: 'login' | 'register' = 'login') => {
    // Guardar la URL actual antes de redirigir
    saveCurrentUrl(window.location.pathname + window.location.search);
    router.push(`/${authType}`);
  };

  return {
    saveCurrentUrl,
    handleRedirectAfterAuth,
    redirectToAuth,
  };
}
