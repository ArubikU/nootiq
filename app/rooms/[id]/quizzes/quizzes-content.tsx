'use client'
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function QuizzesContent({ room, quizzes, user }: any) {
  const { t } = useTranslation()

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8 bg-primary">
        <h1 className="text-2xl font-bold mb-4 text-primary">{t('quizzes.room_not_found')}</h1>
        <p className="text-secondary">{t('quizzes.room_not_found_desc')}</p>
        <Link href="/rooms" className="text-accent hover:text-accent-heavy hover:underline mt-4 inline-block">
          {t('quizzes.back_to_rooms')}
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
          <Link href={`/rooms/${room.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t('quizzes.back_to_room')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-accent">
            {t('quizzes.title')} - {room.title}
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-secondary mt-2">
            {quizzes.length} {quizzes.length === 1 ? t('quizzes.quiz_available') : t('quizzes.quizzes_available')}
          </p>
        </div>

        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: any) => (
              <Link href={`/rooms/${room.id}/quizzes/${quiz.id}`} key={quiz.id}>
                <div className="border border-accent-light rounded-xl p-6 hover:border-accent hover:shadow-lg transition-all h-full bg-surface shadow-md">
                  <h3 className="text-xl font-medium mb-2 text-primary">{quiz.title}</h3>
                  <p className="text-secondary mb-4">{quiz.description}</p>
                  
                  {quiz.tags && quiz.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quiz.tags.map((tag: string, i: number) => (
                        <span key={i} className="bg-accent-light text-accent-heavy text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {quiz.difficulty && (
                    <div className="flex items-center mb-4">
                      <span className="text-sm text-secondary mr-2">{t('quizzes.difficulty')}:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full mx-0.5 ${
                              i < quiz.difficulty ? "bg-accent" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {quiz.questions && (
                    <p className="text-sm text-secondary mt-4">
                      {quiz.questions.length} {quiz.questions.length === 1 ? t('quizzes.question') : t('quizzes.questions_plural')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl shadow-xl">
            <h3 className="text-xl font-medium text-primary mb-2">{t('quizzes.no_quizzes')}</h3>
            <p className="text-secondary mb-6">{t('quizzes.no_quizzes_desc')}</p>
            <Link href={`/rooms/${room.id}`} className="bg-accent hover:bg-accent-heavy text-negated-primary font-semibold py-3 px-6 rounded-xl shadow-md transition-all">
              {t('quizzes.back_to_room')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
