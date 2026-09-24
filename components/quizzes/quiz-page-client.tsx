"use client"

import QuizQuestion from "@/components/quizzes/quiz-question"
import { Button } from "@/components/ui/button"
import { ConfettiButton } from "@/components/ui/confetti-button"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface QuizQuestion {
  question_text: string
  options: Record<string, string>
  correct_option: string
  explanation?: string
}

interface QuizPageClientProps {
  questions: QuizQuestion[]
  quizTitle: string
  roomId: string
  quizId: string
}

export default function QuizPageClient({ questions, quizTitle, roomId, quizId }: QuizPageClientProps) {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(Array(questions.length).fill(false))
  const [completedQuestions, setCompletedQuestions] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(Array(questions.length).fill(false))
  const [score, setScore] = useState(0)
  
  // Limitar a 5 preguntas para el quiz
  const limitedQuestions = questions.slice(0, 5)
  const hasMoreQuestions = questions.length > 5

  
  useEffect(() => {
    // Usar limitedQuestions.length en lugar de questions.length
    const allAnswered = answered.slice(0, limitedQuestions.length).every(item => item === true)
    setAllQuestionsAnswered(allAnswered)
    
    const totalAnswered = answered.filter(item => item === true).length
    setCompletedQuestions(totalAnswered)
    
    const totalCorrect = correctAnswers.filter(item => item === true).length
    setScore(totalCorrect)
    
    if (allAnswered && !showSummary) {
    }
  }, [answered, correctAnswers, showSummary, limitedQuestions.length])

  const handleNextPage = () => {
    if (currentPage < questions.length - 1) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  const handleGoToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleAnswered = (index: number, isCorrect: boolean) => {
    const newAnswered = [...answered]
    newAnswered[index] = true
    setAnswered(newAnswered)
    
    const newCorrectAnswers = [...correctAnswers]
    newCorrectAnswers[index] = isCorrect
    setCorrectAnswers(newCorrectAnswers)
  }

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-1">
          {limitedQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoToPage(index)}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                currentPage === index
                  ? "bg-custom-accent text-white"
                  : answered[index]
                  ? correctAnswers[index]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-text hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage === limitedQuestions.length - 1}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setCurrentPage(limitedQuestions.length - 1)}
          disabled={currentPage === limitedQuestions.length - 1}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-bg-light rounded-lg shadow-sm p-6 mb-8"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            {(() => {
              const percent = (score / limitedQuestions.length) * 100
              if (percent === 100) {
                // Trophy icon for perfect score
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                    <path d="M8 21h8M12 17v4M17 5V3H7v2"></path>
                    <path d="M17 5a5 5 0 0 1-10 0"></path>
                    <path d="M21 5c0 4-3 7-9 7S3 9 3 5"></path>
                  </svg>
                )
              } else if (percent >= 70) {
                // Medal icon for good score
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-dark">
                    <circle cx="12" cy="8" r="7"></circle>
                    <path d="M8.5 22l3.5-7 3.5 7"></path>
                  </svg>
                )
              } else if (percent >= 40) {
                // Star icon for avetext-secondary score
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )
              } else {
                // Default checkmark for low score
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )
              }
            })()}
          </div>
          <h3 className="text-2xl font-bold mb-2">{t('quiz_completed')}</h3>
          <p className="text-xl font-medium">{t('results.completed_title', { title: quizTitle })}</p>
          
          <div className="mt-6 mb-4">
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>{t('results.your_score')}</span>
              <span className="font-bold text-custom-accent">{score} de {limitedQuestions.length}</span>
              <span>({Math.round((score / limitedQuestions.length) * 100)}%)</span>
            </div>
            
            <div className="mt-4 w-full max-w-sm mx-auto h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-custom-accent rounded-full transition-all duration-500"
                style={{ width: `${(score / limitedQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <motion.div 
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {questions.map((question, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  correctAnswers[index] ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <p className="font-medium mb-2 text-sm">{t('results.question_number', { number: index + 1 })}</p>
                <p className="text-sm mb-1">{question.question_text}</p>
                <p className={`text-xs font-medium ${
                  correctAnswers[index] ? "text-green-700" : "text-red-700"
                }`}>
                  {correctAnswers[index] ? t('results.question_correct') : t('results.question_incorrect')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline"
            onClick={() => {
              setShowSummary(false)
              setCurrentPage(0)
            }}
          >
            {t('results.review_questions')}
          </Button>
          <Button>
            <Link href={`/rooms/${roomId}/quizzes`}>
              {t('results.back_to_quizzes')}
            </Link>
          </Button>
        </div>
      </motion.div>
    )
  }
  return (
    <div >
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-text">
            {t('question_of', { current: currentPage + 1, total: limitedQuestions.length })}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
            <div 
              className="h-full bg-custom-accent rounded-full transition-all duration-300"
              style={{ width: `${(completedQuestions / limitedQuestions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-text">
            {Math.round((completedQuestions / limitedQuestions.length) * 100)}%
          </span>
        </div>
        {allQuestionsAnswered && (
          <ConfettiButton 
            onClick={() => setShowSummary(true)}
            className="bg-green-600 hover:bg-green-700"
            triggerConfetti={allQuestionsAnswered}
          >
            {t('results.see_results')}
          </ConfettiButton>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuizQuestion
            questionText={limitedQuestions[currentPage].question_text}
            options={limitedQuestions[currentPage].options}
            correctOption={limitedQuestions[currentPage].correct_option}
            onAnswered={(isCorrect) => handleAnswered(currentPage, isCorrect)}
          />
        </motion.div>
      </AnimatePresence>
        {renderPagination()}
      
      {hasMoreQuestions && (
        <div className="mt-4 text-center">
          <Link href={`/rooms/${roomId}/quizzes/${quizId}/questions`} className="text-sm text-custom-accent hover:underline">
            {t('results.see_all_questions')}
          </Link>
        </div>
      )}
    </div>
  )
}
