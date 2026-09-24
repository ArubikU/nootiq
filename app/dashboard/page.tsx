
import { redirect } from "next/navigation"

export default function DashboardRedirect() {
  // Redirigir a /rooms ya que dashboard y rooms están fusionados
  redirect("/rooms")
}
