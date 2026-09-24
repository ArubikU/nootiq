import ErrorMessage from "@/components/error-message";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { getSummaryById, getUserByClerkId } from "@/lib/db";
import { getTierObject } from "@/lib/getLimits";
import { auth, clerkClient } from "@clerk/nextjs/server";
import "highlight.js/styles/github.css"; // Estilo para el código (puedes cambiar el tema)
import { redirect } from "next/navigation";
import SummaryContent from "./summary-content";

export default async function Summary({ params }: { params: { id: string } }) {
  const authObj = await auth();
  const { userId: clerkId } = authObj;

  if (!clerkId) redirect("/login");

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return (
      <I18nProvider>
        <ErrorMessage 
          errorType="account.not_found" 
          backLinkType="dashboard" 
          backLink 
          showSupport 
        />
      </I18nProvider>
    );
  }

  const { id } = await params
  const sum: string = await getSummaryById(id)
  const client = await clerkClient();
  const userData = await client.users.getUser(clerkId);
  const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free");

  return (
      <SummaryContent id={id} sum={sum} currentPlan={currentPlan} />
  )
}
