"use client"
import ErrorMessage from "@/components/error-message";
import QuizQuestionsClient from "@/components/quizzes/quiz-questions-client";
import { useTranslation } from "@/hooks/use-translation";

export default function QuizQuestionsContent({ quiz, roomId }: { quiz: any, roomId: string }) {
  const { t } = useTranslation();

  if (!quiz) {
    return (
      <ErrorMessage 
        errorType="quiz.not_found" 
        backLinkHref={`/rooms/${roomId}/quizzes`}
        backLinkText={t('quizzes.back_to_quizzes')}
        backLink 
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-accent">
          {t('quizzes.all_questions')}: {quiz.title}
        </h1>
        <div className="bg-surface rounded-2xl shadow-xl p-6">
          <QuizQuestionsClient 
            questions={quiz.questions}
            quizTitle={quiz.title}
            roomId={roomId}
          />
        </div>
      </div>
    </div>
  );
}