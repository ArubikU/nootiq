"use client"
import { importTypes } from "@/lib/getLimits"
import { useTranslation } from "@/hooks/use-translation"

interface DocumentListProps {
  documents: {
    id: string
    type: importTypes
    url: string
  }[]
  roomId: string
}

export default function DocumentList({ documents, roomId }: DocumentListProps) {
  const { t } = useTranslation()
  
  return (
    <div>
      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="bg-secondary rounded-xl p-4">
                <p className="font-medium">
                {document.type === "pdf"
                  ? "PDF"
                  : document.type === "csv"
                  ? "CSV"
                  : document.type === "img"
                  ? "Imagen"
                  : document.type === "md"
                  ? "Markdown"
                  : document.type === "pdf-link"
                  ? "PDF (enlace)"
                  : document.type === "anki"
                  ? "Anki"
                  : "Otro"}
                </p>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-custom-accent hover:underline"
              >
                {(document.url.includes("blob.vercel") ? document.url.split("/").pop() : document.url)?.replaceAll("%20", " ")}
              </a>
              <a
                href={`/summaries/${document.id}`}
                title={t('rooms.actions.view_summary')}
                className="inline-flex items-center ml-2 text-text hover:text-custom-accent transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text mb-2">{t('rooms.empty_states.no_documents')}</p>
          <p className="text-sm">{t('rooms.empty_states.no_documents_description')}</p>
        </div>
      )}
    </div>
  )
}
