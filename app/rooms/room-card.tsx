"use client"

import { useCustomAlerts } from "@/hooks/use-custom-alerts"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { Room } from "@/lib/types"
import { TrashIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MouseEvent } from "react"
interface RoomCardProps {
  room: Room
  key?: string
}

export default function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()
  const { alert } = useCustomAlerts()
  const { handleError, getErrorMessage, getErrorTitle } = useErrorHandler()

  const handleDelete = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const resp = await fetch(`/api/rooms/${room.id}`, {
        method: "DELETE",
      })
      
      const data = await resp.json()
      
      if (!resp.ok) {
        if (data.error?.code) {
          // Usar handleError para errores con messageKey
          const errorMessage = getErrorMessage(data.error.code)
          alert(errorMessage, "error")
        } else {
          alert(data.error || "Error al eliminar la sala", "error")
        }
        return
      }
      
      alert(data.message || "Sala eliminada exitosamente", "success")
      router.refresh()
    } catch (error) {
      console.error("Error deleting room:", error)
      alert(getErrorMessage('INTERNAL_ERROR', 'Error inesperado al eliminar la sala'), "error")
    }
  }

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group block rounded-2xl  bg-secondary shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-text group-hover:text-accent-dark transition-colors">
            {room.title}
          </h2>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded-full hover:text-error-heavy transition"
            aria-label="Eliminar sala"
          >
            <TrashIcon className="w-5 h-5 transition-colors duration-150" />
          </button>
        </div>

        <p className="text-sm text-text mt-2 line-clamp-3">
          {room.description || "Sin descripción"}
        </p>

        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {room.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-accent-heavy text-primary text-xs px-2 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {(!room.tags || room.tags.length === 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-accent-heavy text-primary text-xs px-2 py-1 rounded-full font-medium">
              Sin etiquetas
              </span>
              </div>
            )}
      </div>
      <div className="mt-auto w-full bg-terciary px-4 py-2 text-xs text-primary">
        Creado el {new Date(room.created_at).toLocaleDateString()}
      </div>
    </Link>
  )
}
