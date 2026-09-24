'use client'
import ErrorMessage from "@/components/error-message"
import QuizPageClient from "@/components/quizzes/quiz-page-client"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import QuizDownload from "./quiz-download"

export default function QuizContent({ room, quiz, params }: any) {
  const { t } = useTranslation()

  if (!room) {
    return <ErrorMessage errorType="room.not_found" backLink />
  }

  if (!quiz) {
    return <ErrorMessage errorType="quiz.not_found" backLinkHref={`/rooms/${room.id}/quizzes`} backLinkText={t('quizzes.back_to_quizzes')} backLink />
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header integrado */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/rooms/${room.id}/quizzes`}>
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t('quizzes.back_to_quizzes')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-accent">
            {quiz.title}
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-secondary mt-2">{quiz.description}</p>

          {quiz.tags && quiz.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {quiz.tags.map((tag: string, i: number) => (
                <span key={i} className="bg-accent-light text-accent-heavy text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {quiz.difficulty && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-secondary mr-2">{t('quizzes.difficulty')}:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full mx-0.5 ${i < quiz.difficulty ? "bg-accent" : "bg-muted"
                      }`}
                  />
                ))}
              </div>
            </div>
          )}

          {quiz.source && (
            <div className="mt-2 text-sm text-secondary">
              <span className="font-medium">{t('quizzes.source')}:</span> {quiz.source}
            </div>
          )}
        </div>

        <div className="mb-6">
          <QuizDownload quiz={quiz} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-surface rounded-2xl shadow-xl border border-accent-light overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-accent">
                {t('quizzes.questions')} ({quiz.questions?.length || 0})
              </h2>
              {quiz.questions && quiz.questions.length > 0 ? (
                <QuizPageClient
                  questions={quiz.questions as any[]}
                  quizTitle={quiz.title}
                  roomId={room.id}
                  quizId={quiz.id!}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary">{t('quizzes.no_questions')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href={`/rooms/${room.id}/quizzes`} className="bg-secondary hover:bg-muted text-primary font-semibold py-3 px-6 rounded-xl shadow-md transition-all">
              {t('quizzes.back_to_quizzes')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}