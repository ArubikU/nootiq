'use client'

import SummaryChat from "@/components/chat/summary-chat";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { MathJax } from "better-react-mathjax";
import "highlight.js/styles/github.css"; // Estilo para el código (puedes cambiar el tema)
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function SummaryContent({ id, sum, currentPlan }: { id: string, sum: string, currentPlan: any }) {
  const { t } = useTranslation();

  if (!sum) {
    return <ErrorMessage errorType="document.not_found" backLinkType="dashboard" backLink />
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header con botón de volver */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/rooms">
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t('summaries.back_to_dashboard')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-accent">
            {t('summaries.title')}
          </h1>
        </div>

      {/* Contenido principal */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-2xl shadow-2xl bg-primary overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-custom-accent prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
                <MathJax dynamic hideUntilTypeset="every">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {sum}
                  </ReactMarkdown>
                </MathJax>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Component */}
      {(currentPlan.isUltra || currentPlan.isUltimate) && (
        <SummaryChat documentId={id} />
      )}
    </div>
  )
}
