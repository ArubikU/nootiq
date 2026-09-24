"use client"

import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"
import { useCustomAlerts } from "@/hooks/use-custom-alerts"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { useUser } from "@clerk/nextjs"
import { GenericDialog, GenericDialogContent, GenericDialogHeader, GenericDialogTitle, GenericDialogTrigger } from "@/components/ui/gdialog"
import { GenericButton } from "@/components/ui/gbutton"

export default function CreateRoom({ leftRoomsCount }: { leftRoomsCount: number }) {
  const router = useRouter()
  const { user } = useUser()
  const { t } = useTranslation()
  const { alert } = useCustomAlerts()
  const { getErrorMessage } = useErrorHandler()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  })
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tags: tagsArray,
        }),
      })

      const data = await response.json()



      if (!response.ok) {
        // Si la API devuelve un error estructurado con messageKey
        if (data.error?.code) {
          const errorMessage = getErrorMessage(data.error.code)
          alert(errorMessage, "error")
        } else {
          alert(data.error || "Error al crear el room", "error")
        }
        return
      }

      // Success case
      if (data.success && data.id) {
        alert(data.message || "Room creado exitosamente", "success")
        setIsOpen(false)
        setFormData({ title: "", description: "", tags: "" }) // Reset form
        router.push(`/rooms/${data.id}`)
      }
    } catch (error) {
      console.error("Error creating room:", error)
      alert(getErrorMessage('INTERNAL_ERROR', 'Error inesperado al crear el room'), "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GenericDialog open={isOpen} onOpenChange={setIsOpen}>
      <GenericDialogTrigger asChild>
        <button
          className="text-light bg-accent hover:text-light hover:bg-accent-heavy font-semibold rounded-2xl px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
          disabled={leftRoomsCount === 0}
        >
          {isMobile ? (
            <PlusIcon className="w-5 h-5 m-0" />
          ) : (
            t('notebooks.create_notebook')
          )}
        </button>
      </GenericDialogTrigger>
      <GenericDialogContent  className="max-w-2xl bg-quinary sm:rounded-xl flex flex-col p-0 sm:p-6">
        <div className="px-5 pt-14 pb-2 sm:p-0 sm:pb-4 sticky top-0 bg-quinary/90 backdrop-blur-sm z-10 border-b border-primary/10 sm:border-none">
          <GenericDialogHeader>
            <GenericDialogTitle className="text-primary text-base sm:text-lg">{t('notebooks.create_notebook')}</GenericDialogTitle>
          </GenericDialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-24 sm:pb-0 sm:px-0 sm:overflow-visible space-y-5 mt-2 sm:mt-0">
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-secondary">
              {t('notebooks.form.title')} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input w-full text-sm"
              required
              placeholder={t('notebooks.form.title_placeholder')}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-secondary">
              {t('notebooks.description')}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[120px] w-full text-sm resize-y"
              placeholder={t('notebooks.form.description_placeholder')}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tags" className="block text-xs sm:text-sm font-medium text-secondary">
              {t('notebooks.form.tags')}
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full input text-sm"
              placeholder={t('notebooks.form.tags_placeholder')}
            />
          </div>
        
        </form>
        <div className="fixed left-0 right-0 bottom-0 sm:static bg-quinary/95 backdrop-blur-sm px-5 py-3 sm:p-0 border-t border-primary/10 sm:border-none flex gap-3 sm:gap-2 justify-end">
          <GenericButton
            type="button"
            size={"xl"}
            variant={"destructive"}
            className="flex-1 sm:flex-none"
            onClick={() => setIsOpen(false)}
          >
            {t('common.cancel')}
          </GenericButton>
          <GenericButton
            type="submit"
            variant={"accentbold"}
            size={"xl"}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
            onClick={handleSubmit as any}
          >
            {isSubmitting ? t('notebooks.form.creating') : t('notebooks.create')}
          </GenericButton>
        </div>
      </GenericDialogContent>
    </GenericDialog>
  )
}
