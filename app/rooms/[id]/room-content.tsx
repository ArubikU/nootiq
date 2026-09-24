"use client"

import DocumentList from "@/components/documents/document-list"
import DocumentUpload from "@/components/documents/upload-document"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { importTypes } from "@/lib/getLimits"
import { Quiz, Room } from "@/lib/types"
import Link from "next/link"
import GenerateFlashcardsButton from "../generate-flashcards"
import GenerateQuizButton from "../generate-quiz"
import ShortCards from "./flashcards/sample"
import ShortQuizzis from "./quizzes/sample"

interface RoomContentProps {
  room: Room
  documents: {
    id: string
    type: importTypes
    url: string
  }[]
  flashcards: any[]
  quizzes: Quiz[]
  roomAiLimit: number
  userAiMonthLimit: number
  limits: {
    aiGenerations: number
    filesPerRoom: number
  }
}

export default function RoomContent({
  room,
  documents,
  flashcards,
  quizzes,
  roomAiLimit,
  userAiMonthLimit,
  limits
}: RoomContentProps) {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
        {room.description && (
          <p className="text-muted-foreground text-lg">{room.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {room.tags?.map((tag, i) => (
          <span key={i} className="bg-on-accent text-accent text-xs px-2 py-1 rounded-full animate-pulse">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <SectionCard title={t('rooms.sections.documents')}>
          <DocumentList documents={documents} roomId={room.id} />
          <div className="mt-4">
            <DocumentUpload 
              roomId={room.id} 
              aiGenerationsLeft={Math.min(roomAiLimit, userAiMonthLimit)} 
              aiGenerationsLimit={limits.aiGenerations} 
              filesCount={documents.length} 
              filesPerRoomLimit={limits.filesPerRoom} 
            />
          </div>
        </SectionCard>

        <SectionCard title={t('rooms.sections.flashcards')} actions={
          <div className="flex gap-3">
            {flashcards.length > 0 && (
              <Link href={`/rooms/${room.id}/flashcards`} className="text-accent text-sm hover:underline">
                {t('rooms.actions.view_all')}
              </Link>
            )}
            {(roomAiLimit > 0 && userAiMonthLimit > 0) && <GenerateFlashcardsButton roomId={room.id} />}
          </div>
        }>
          <ShortCards cards={flashcards} />
        </SectionCard>

        <SectionCard title={t('rooms.sections.quizzes')} actions={
          <div className="flex gap-3">
            {quizzes.length > 0 && (
              <Link href={`/rooms/${room.id}/quizzes`} className="text-accent text-sm hover:underline">
                {t('rooms.actions.view_all')}
              </Link>
            )}
            {(roomAiLimit > 0 && userAiMonthLimit > 0) && <GenerateQuizButton roomId={room.id} />}
          </div>
        }>
          <ShortQuizzis quizzes={quizzes} room={room} />
        </SectionCard>
      </div>
    </div>
  )
}

function SectionCard({ title, children, actions }: { title: string, children: React.ReactNode, actions?: React.ReactNode }) {
  return (
    <Card
      title={title}
      header={actions}
      className="p-4 bg-surface"
    >
      {children}
    </Card>
  )
}
