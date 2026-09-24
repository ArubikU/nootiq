"use client"

import { MathJax } from "better-react-mathjax";
import { useRef, useState } from "react";

interface QuizQuestionProps {
  questionText: string
  options: Record<string, string>
  correctOption: string
  onAnswered?: (isCorrect: boolean) => void
}

export default function QuizQuestion({ questionText, options, correctOption, onAnswered }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const questionRef = useRef<HTMLDivElement>(null)

const containsMath = (value: string) =>
  /[$\\^_{}]|\\frac|\\sqrt|\\sum|\\int/.test(value)

const renderLatex = (value: string) => {
  const isMath = containsMath(value)
  if(!isMath) {
    value = value.replace(/\\text\{(.*?)\}/g, "$1")
    return <span>{value}</span>
  }

  return <MathJax>{value}</MathJax>
}

  const handleOptionSelect = (option: string) => {
    if (!isSubmitted) {
      setSelectedOption(option)
    }
  }

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true)
      if (onAnswered) {
        onAnswered(selectedOption === correctOption)
      }
    }
  }

  const getOptionClass = (option: string) => {
    if (!isSubmitted) {
      return selectedOption === option ? "bg-gray-100 border-gray-400" : ""
    }

    if (option === correctOption) {
      return "bg-green-100 border-green-500"
    }

    if (option === selectedOption) {
      return option !== correctOption ? "bg-red-100 border-red-500" : "bg-green-100 border-green-500"
    }

    return ""
  }

  return (
    <div className="border rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-md" ref={questionRef}>
      <h3 className="text-xl font-medium mb-4" dangerouslySetInnerHTML={{ __html: questionText }} />

      <div className="space-y-3">
        {Object.entries(options).map(([key, value]) => (
          <div
            key={key}
            className={`better-box border p-3 rounded-md cursor-pointer transition-all duration-300 hover:border-gray-400 ${getOptionClass(key)}`}
            onClick={() => handleOptionSelect(key)}
          >
            <div className="flex items-start ">
              <div className="w-6 h-6 rounded-full border flex items-center justify-center mr-3 flex-shrtext-0 transition-colors">
                {key}
              </div>
              <div className="better-box ">

              {renderLatex(value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isSubmitted && (
        <button 
          className={`mt-6 bg-custom-accent text-white px-4 py-2 rounded-md transition-all duration-300 ${
            !selectedOption ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-dark'
          }`} 
          onClick={handleSubmit} 
          disabled={!selectedOption}
        >
          Comprobar Respuesta
        </button>
      )}

      {isSubmitted && (
        <div
          className={`mt-6 p-4 rounded-md transition-all duration-300 ${
            selectedOption === correctOption ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {selectedOption === correctOption ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>¡Correcto! Bien hecho.</p>
            </div>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>Incorrecto. La respuesta correcta es: {correctOption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
