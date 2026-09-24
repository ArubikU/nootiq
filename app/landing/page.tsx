"use client"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@clerk/nextjs"
import "@/lib/i18n"
import { ArrowRight, Play } from "lucide-react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterProps {
  words: string[]
  typingSpeed?: number   // ms por letra
  deleteSpeed?: number   // ms por letra al borrar
  pauseTime?: number     // pausa antes de borrar
  className?: string
}

function Typewriter({
  words,
  typingSpeed = 120,
  deleteSpeed = 60,
  pauseTime = 2000,
  className = "",
}: TypewriterProps) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopIndex, setLoopIndex] = useState(0)

  useEffect(() => {
    const currentWord = words[loopIndex % words.length]
    let timer: NodeJS.Timeout

    if (!isDeleting && text !== currentWord) {
      // escribiendo
      timer = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && text === currentWord) {
      // pausa antes de borrar
      timer = setTimeout(() => setIsDeleting(true), pauseTime)
    } else if (isDeleting && text !== "") {
      // borrando
      timer = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1))
      }, deleteSpeed)
    } else if (isDeleting && text === "") {
      // pasa a la siguiente palabra
      setIsDeleting(false)
      setLoopIndex((prev) => (prev + 1) % words.length)
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, loopIndex, words, typingSpeed, deleteSpeed, pauseTime])

  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block"
      >
        |
      </motion.span>
    </span>
  )
}
export default function HeroSection() {
  const { userId } = useAuth()
  const { t } = useTranslation()
  return (
    <main className="scroll-smooth">
      <section id="header">
        <div className="container mx-auto px-12 flex items-center justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center justify-items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  {t("home.hero.title_part1")}
                  <Typewriter
                    words={t("home.hero.title_part3",{joinArrays: ''}).split(' ')}
                    className="text-accent"
                  />
                  {t("home.hero.title_part3")}
                  <Typewriter
                    words={t("home.hero.title_part4",{joinArrays: ''}).split(' ')}
                    className="text-accent"
                  />
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg mx-auto lg:mx-0">
                  {t("home.hero.subtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-accent hover:bg-accent-light text-primary-foreground">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>

              {/*
          <div className="flex items-center space-x-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-accent rounded-full"></div>
        <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-accent rounded-full"></div>
        <span>14-day free trial</span>
          </div>
        </div>*/}
            </div>

            {/* Hero Image */}
            <div className="relative flex justify-center">
              <div className="relative z-10">
                <img
                  src="/nootiq.gif"
                />
              </div>
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent-20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary-20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
