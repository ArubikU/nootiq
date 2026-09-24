'use client'

import EnhancedFlashcardView from "@/components/flashcards/enhanced-flashcard-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface FlashcardsClientProps {
  roomId: string
  room: any
  flashcards: any[]
  plan: any
  user: any
}

export default function FlashcardsClient({ roomId, room, flashcards, plan, user }: FlashcardsClientProps) {
  const { t } = useTranslation()

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8 bg-primary">
        <h1 className="text-2xl font-bold mb-4 text-primary">{t('flashcards.notebook_not_found')}</h1>
        <p className="text-secondary">{t('flashcards.notebook_not_found_desc')}</p>
        <Link href="/rooms" className="text-accent hover:text-accent-heavy hover:underline mt-4 inline-block">
          {t('flashcards.back_to_notebooks')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header integrado */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/rooms/${roomId}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t('flashcards.back_to_room')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-accent">
            {t('flashcards.title')}: {room.title}
          </h1>
        </div>

        {flashcards.length > 0 ? (
          <div className="mx-auto max-w-6xl">
            <EnhancedFlashcardView
              cards={flashcards.map((card: any) => ({
                id: card.id,
                front: card.front,
                back: card.back,
                keywords: card.keywords,
              }))}
              plan={plan}
            />
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-2xl shadow-xl">
            <p className="text-xl text-primary mb-4">{t('flashcards.no_flashcards')}</p>
            <Link
              href={`/rooms/${roomId}`}
              className="bg-accent hover:bg-accent-heavy text-negated-primary font-semibold py-3 px-6 rounded-xl shadow-md transition-all"
            >
              {t('flashcards.generate_flashcards')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
