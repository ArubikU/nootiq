import DocumentList from "@/components/documents/document-list"
import DocumentUpload from "@/components/documents/upload-document"
import ErrorMessage from "@/components/error-message"
import { Card } from "@/components/ui/card"
import {
  canGenerateAi,
  getDocumentsByRoomId,
  getFlashcardsByRoomId,
  getQuizzesByRoomId,
  getRoomById,
  getUserByClerkId,
  thisRoomIsLimited,
  userOwnRoom,
} from "@/lib/db"
import { getTierObject, importTypes } from "@/lib/getLimits"
import { Quiz, Room } from "@/lib/types"
import { auth, clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import GenerateFlashcardsButton from "../generate-flashcards"
import GenerateQuizButton from "../generate-quiz"
import ShortCards from "./flashcards/sample"
import ShortQuizzis from "./quizzes/sample"

export default async function RoomPage({ params }: { params: { id: string } }) {
  const authObj = await auth()
  const { userId: clerkId } = authObj
  if (!clerkId) redirect("/login")

  const user = await getUserByClerkId(clerkId)
  if (!user) return <ErrorMessage title="Error de cuenta" message="No se encontró tu cuenta. Contacta a soporte." />


  const ownRoom = await userOwnRoom(user.id, (await params).id)
  if (!ownRoom) {
    return <ErrorMessage title="Acceso denegado" message="No tienes permiso para ver este room." backLink />
  }

  const room: Room | null = await getRoomById((await params).id)
  if (!room) return <ErrorMessage title="Room no encontrado" message="Este room no existe o no tienes acceso." backLink />
  if (room.user_id !== user.id) return <ErrorMessage title="Acceso denegado" message="No tienes permiso para ver este room." backLink />

  
  const client = await clerkClient()
  const userData = await client.users.getUser(clerkId)
  const currentPlan = getTierObject(userData?.publicMetadata?.plan as string | undefined || "free")

  const limited = await thisRoomIsLimited(room.id,user.id,currentPlan)
  if (limited) {
    return <ErrorMessage title="Room limitado" message="Este room ha alcanzado su límite de uso." backLink />
  }
  const documents:{
      id: string
      type: importTypes
      url: string
    }[] = await getDocumentsByRoomId(room.id) as any
  const quizzes: Quiz[] = await getQuizzesByRoomId(room.id)
  const flashcards = await getFlashcardsByRoomId(room.id)

  const limits = currentPlan.limits
  const { roomAiLimit, userAiMonthLimit } = await canGenerateAi(authObj, room.id, limits)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
      {/* Botón Volver a Rooms */}
      <div className="mb-6">
        <Link href="/rooms" className="inline-block px-4 py-2 bg-irisdark text-white rounded-lg shadow-md hover:bg-iris transition-colors ease-in-out text-sm sm:text-base">
          ← Volver a Rooms
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-irisdark">{room.title}</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">

        </div>
      </div>
      
      {room.description && <p className="text-ink mb-3">{room.description}</p>}

      <div className="flex flex-wrap gap-2">
        {room.tags?.map((tag, i) => (
          <span key={i} className="bg-irisforeground text-iris text-xs px-2 py-1 rounded-full animate-pulse">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <SectionCard title="Documentos">
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

        <SectionCard title="Flashcards" actions={
          <div className="flex gap-3">
            {flashcards.length > 0 && <Link href={`/rooms/${room.id}/flashcards`} className="text-irisdark text-sm hover:underline">Ver todas</Link>}
            {(roomAiLimit > 0 && userAiMonthLimit > 0) && <GenerateFlashcardsButton roomId={room.id} />}
          </div>
        }>
          <ShortCards cards={flashcards} />
        </SectionCard>

        <SectionCard title="Quizzes" actions={
          <div className="flex gap-3">
            {quizzes.length > 0 && <Link href={`/rooms/${room.id}/quizzes`} className="text-irisdark text-sm hover:underline">Ver todos</Link>}
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
      className="p-4"
    >
      {children}
    </Card>
  )
}