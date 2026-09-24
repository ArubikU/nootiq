import { whenPlanExpires } from "@/lib/db";
import { getTierObject } from "@/lib/getLimits";
import { auth, clerkClient } from "@clerk/nextjs/server";
import PromoClientPage from "./promo-client";
import PromoRedirectHandler from "./promo-redirect-handler";

export default async function PromoPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
    const authObject = await auth();
  const { userId } = authObject;
  const params = await searchParams;

  if (!userId) {
    // Si no está autenticado, renderizar el componente que manejará la redirección
    return <PromoRedirectHandler searchParams={params} />;
  }

    const client = await clerkClient()
    const userData = await client.users.getUser(userId)
    const currentPlan = userData?.publicMetadata?.plan as string | undefined || "free"
  const tierInfo = getTierObject(currentPlan);
  
  // Obtener fecha de expiración
  const expDate = await whenPlanExpires(userId);
  
  return (
    <div className="container mx-auto py-10">
      <PromoClientPage 
        currentPlan={tierInfo.formattedName} 
        planId={tierInfo.id}
        expirationDate={expDate ? expDate.toISOString() : null}
        initialCode={params.code}
      />
    </div>
  );
}
