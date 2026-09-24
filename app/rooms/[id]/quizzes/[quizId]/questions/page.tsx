import ErrorMessage from "@/components/error-message";
import { getQuizById, isTheirRoom, getUserByClerkId } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuizQuestionsContent from "./quiz-question-content";

interface QuizQuestionPageProps {
  params: {
    id: string;
    quizId: string;
  };
}


export default async function QuizQuestionsPage({ params }: QuizQuestionPageProps) {
  const { id: roomId, quizId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/login");
  }

  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return (
          <ErrorMessage 
            errorType="account.not_found" 
            backLinkType="dashboard" 
            backLink 
            showSupport 
          />
      );
    }

    // Obtener la sala para verificar acceso
    const isRoom = await isTheirRoom(clerkId, roomId);
    if (!isRoom) {
      return (
          <ErrorMessage errorType="room.access_denied" backLink />
      );
    }

    const quiz = await getQuizById(quizId);

    return (
        <QuizQuestionsContent quiz={quiz} roomId={roomId} />
    );
  } catch (error) {
    console.error("Error loading quiz:", error);
    return (
        <ErrorMessage 
          errorType="generic.unexpected_error" 
          backLinkType="dashboard" 
          backLink 
          showSupport 
        />
    );
  }
}