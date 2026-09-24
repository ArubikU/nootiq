"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MathJax } from "better-react-mathjax"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface QuizQuestion {
  id: string
  question_text: string
  options: Record<string, string>
  correct_option: string
  explanation?: string
}

interface QuizQuestionsClientProps {
  questions: QuizQuestion[] | any[]
  quizTitle: string
  roomId: string
}

export default function QuizQuestionsClient({ questions, quizTitle, roomId }: QuizQuestionsClientProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  
  const containsMath = (value: string) =>
    /[$\\^_{}]|\\frac|\\sqrt|\\sum|\\int/.test(value)
  
  const renderLatex = (value: string) => {
    const isMath = containsMath(value)
    if(!isMath) {
      value = value.replace(/\\text\{(.*?)\}/g, "$1")
      return <span>{value}</span>
    }
  
    const processed = containsMath(value) ? value : `\\text{${value}}`
  return <MathJax>{processed}</MathJax>
  }
  

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null)
    } else {
      setExpandedQuestion(questionId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-2">
          <Link href={`/rooms/${roomId}/quizzes`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a quizzes
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4 overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <div className="flex-shrtext-0 h-8 w-8 rounded-full bg-on-accent text-accent-dark flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" >
                    {renderLatex(question.question_text)}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleQuestion(question.id)}
                    className="mt-2"
                  >
                    {expandedQuestion === question.id ? "Ocultar respuesta" : "Ver respuesta"}
                  </Button>
                </div>
              </div>
            </div>

            {expandedQuestion === question.id && (
              <div className="mt-4 pl-11 border-t pt-3">
                <p className="text-sm text-text mb-2">Opciones:</p>
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div 
                      key={key} 
                      className={`p-2 rounded-md ${
                        key === question.correct_option 
                          ? "bg-green-50 border border-green-200" 
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                          key === question.correct_option 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-300 text-text"
                        }`}>
                          {key}
                        </div>
                        <div className="text-sm">
                          {renderLatex(value as string)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-1">Explicación:</p>
                    <p className="text-sm text-text" dangerouslySetInnerHTML={{ __html: question.explanation }} />
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
