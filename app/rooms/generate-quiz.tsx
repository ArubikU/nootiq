"use client"

import { useCustomAlerts } from "@/hooks/use-custom-alerts"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { useRouter } from "next/navigation"
import { useState } from "react"



function GenerateQuizButton({ roomId }: { roomId: string }) {
    const [loading, setLoading] = useState(false)
    const { alert } = useCustomAlerts()
    const { getErrorMessage } = useErrorHandler()
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/ai/process/quizs", {
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
                    alert(data.error || "Error al generar quiz", "error")
                }
                return
            }
            
            alert(data.message || "Quiz generado exitosamente", "success")
            router.refresh()
        } catch (error) {
            console.error("Error generating quiz:", error)
            alert(getErrorMessage('INTERNAL_ERROR', 'Error inesperado al generar quiz'), "error")
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

export default GenerateQuizButton;