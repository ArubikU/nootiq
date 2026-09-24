"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Trash2, Eye } from "lucide-react"

export default function DocumentsClient() {
  const { t } = useTranslation()

  // Mock data - replace with actual data fetching
  const documents: any[] = []

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-text">{t('documents.title')}</h1>
        </div>
        <Button className="btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          {t('documents.upload_document')}
        </Button>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document: any) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">{t('documents.no_documents')}</h3>
          <p className="text-gray-600 mb-6">{t('documents.upload_first')}</p>
          <Button className="btn-primary">
            <Upload className="w-4 h-4 mr-2" />
            {t('documents.upload_document')}
          </Button>
        </div>
      )}
    </div>
  )
}

function DocumentCard({ document }: { document: any }) {
  const { t } = useTranslation()
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-custom-accent" />
          {document.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              {t('documents.view')}
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-500">
            {document.status === 'ready' && t('documents.ready')}
            {document.status === 'processing' && t('documents.processing')}
            {document.status === 'error' && t('documents.error')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
