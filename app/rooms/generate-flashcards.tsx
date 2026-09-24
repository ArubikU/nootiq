"use client"

import { useCustomAlerts } from "@/hooks/use-custom-alerts"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { useRouter } from "next/navigation"
import { useState } from "react"



function GenerateFlashcardsButton({ roomId }: { roomId: string }) {
    const [loading, setLoading] = useState(false)
    const { alert } = useCustomAlerts()
    const { getErrorMessage } = useErrorHandler()
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/ai/process/flash-cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomId }),
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                if (data.error?.code) {
                    const errorMessage = getErrorMessage(data.error.code)
                    alert(errorMessage, "error")
                } else {
                    alert(data.error || "Error al generar flashcards", "error")
                }
                return
            }
            
            alert(data.message || "Flashcards generadas exitosamente", "success")
            router.refresh()
        } catch (error) {
            console.error("Error generating flashcards:", error)
            alert(getErrorMessage('INTERNAL_ERROR', 'Error inesperado al generar flashcards'), "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
        <button
            onClick={handleClick}
            disabled={loading}
            className="text-xs bg-accent text-primary px-2 py-1 rounded hover:bg-accent-heavy disabled:opacity-50"
        >
            {loading ? "Generando..." : "Generar"}
        </button>
        </div>
    );
}

export default GenerateFlashcardsButton;