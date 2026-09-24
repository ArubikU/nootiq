"use client"

import { TierObject } from "@/lib/getLimits"
import { jsPDF } from "jspdf"
import { ChevronLeft, ChevronRight, Download, Search, Shuffle, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "@/hooks/use-translation"

interface EnhancedFlashcardProps {
  cards: {
    id: string
    front: string
    back: string
    keywords?: string
  }[],
  plan: TierObject
}

export default function EnhancedFlashcardView({ cards, plan }: EnhancedFlashcardProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cardsProgress, setCardsProgress] = useState<string[]>([])
  const [knownCards, setKnownCards] = useState<string[]>([])
  const [downloadFormat, setDownloadFormat] = useState<string>("markdown")
  
  // Estados para la búsqueda por keywords
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<typeof cards>(cards)
  const searchRef = useRef<HTMLDivElement>(null)

  
  // Extraer todas las keywords únicas de las tarjetas
  const extractAllKeywords = (): string[] => {
    const allKeywords = new Set<string>()
    
    cards.forEach(card => {
      if (card.keywords) {
        const keywordsArray = card.keywords.split('-').map(k => k.trim()).filter(k => k)
        keywordsArray.forEach(keyword => allKeywords.add(keyword))
      }
    })
    
    return Array.from(allKeywords).sort()
  }
  
  const allKeywords = extractAllKeywords()
  
  // Filtrar sugerencias basadas en la consulta de búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([])
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = allKeywords
      .filter(keyword => 
        keyword.toLowerCase().includes(query) && 
        !selectedKeywords.includes(keyword)
      )
    setSuggestions(filtered)
  }, [searchQuery, selectedKeywords])
  
  // Filtrar tarjetas basadas en las keywords seleccionadas
  useEffect(() => {
    if (selectedKeywords.length === 0) {
      setFilteredCards(cards)
      return
    }
    
    const filtered = cards.filter(card => {
      if (!card.keywords) return false
      
      const cardKeywords = card.keywords.split('-').map(k => k.trim()).filter(k => k)
      return selectedKeywords.some(selected => cardKeywords.includes(selected))
    })
    
    setFilteredCards(filtered)
    
    // Reiniciar el índice si las tarjetas filtradas no incluyen la tarjeta actual
    if (filtered.length > 0 && !filtered.some(card => card.id === cards[currentIndex]?.id)) {
      setCurrentIndex(0)
      setIsFlipped(false)
    }
  }, [selectedKeywords, cards])
  
  // Cerrar sugerencias al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  // Añadir keyword seleccionada
  const handleSelectKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
    setSearchQuery("")
    setShowSuggestions(false)
  }
  
  // Remover keyword seleccionada
  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))
  }
  
  // Función para voltear la tarjeta
  const handleFlip = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setIsFlipped(!isFlipped)
    
    // Quitar la clase de animación después de la transición
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }
    // Navegar a la siguiente tarjeta
  const handleNext = () => {
    if (isAnimating || filteredCards.length === 0) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setIsFlipped(false)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredCards.length)
      setIsAnimating(false)
      
      // Marcar como vista
      if (!cardsProgress.includes(filteredCards[currentIndex].id)) {
        setCardsProgress([...cardsProgress, filteredCards[currentIndex].id])
      }
    }, isFlipped ? 150 : 0)
  }
  
  // Navegar a la tarjeta anterior
  const handlePrev = () => {
    if (isAnimating || filteredCards.length === 0) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setIsFlipped(false)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredCards.length) % filteredCards.length)
      setIsAnimating(false)
    }, isFlipped ? 150 : 0)
  }
  
  // Barajar las tarjetas
  const handleShuffle = () => {
    if (isAnimating || filteredCards.length <= 1) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setIsFlipped(false)
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * filteredCards.length)
      } while (newIndex === currentIndex && filteredCards.length > 1)
      
      setCurrentIndex(newIndex)
      setIsAnimating(false)
    }, isFlipped ? 150 : 0)
  }
  
  // Marcar tarjeta como conocida/desconocida
  const toggleKnown = () => {
    if (filteredCards.length === 0) return
    
    const cardId = filteredCards[currentIndex].id
    if (knownCards.includes(cardId)) {
      setKnownCards(knownCards.filter(id => id !== cardId))
    } else {
      setKnownCards([...knownCards, cardId])
    }
  }
    // Función para generar el contenido de las flashcards en formato markdown
  const generateMarkdownContent = () => {
    let content = `# Flashcards\n\n`;
    
    // Usar las tarjetas filtradas si hay keywords seleccionadas, de lo contrario usar todas
    const cardsToExport = selectedKeywords.length > 0 ? filteredCards : cards;
    
    if (selectedKeywords.length > 0) {
      content += `## Filtrado por keywords: ${selectedKeywords.join(', ')}\n\n`;
    }
    
    cardsToExport.forEach((card, index) => {
      content += `## Tarjeta ${index + 1}\n\n`;
      content += `### Pregunta\n\n${card.front}\n\n`;
      content += `### Respuesta\n\n${card.back}\n\n`;
      
      if (card.keywords) {
        const keywordsList = card.keywords.split('-').map(k => k.trim()).filter(k => k);
        if (keywordsList.length > 0) {
          content += `### Keywords\n\n${keywordsList.join(', ')}\n\n`;
        }
      }
      
      content += `---\n\n`;
    });
    
    return content;
  }
  
  // Función para descargar el contenido como archivo Markdown
  const downloadAsMarkdown = () => {
    const content = generateMarkdownContent();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedKeywords.length > 0 ? `flashcards-filtered.md` : 'flashcards.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Función para descargar como CSV
  const downloadAsCSV = () => {
    const cardsToExport = selectedKeywords.length > 0 ? filteredCards : cards;
    const header = "Pregunta,Respuesta,Keywords\n";
    const rows = cardsToExport
      .map(({ front, back, keywords }) =>
        `"${front.replace(/"/g, '""')}","${back.replace(/"/g, '""')}","${(keywords || "").replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      selectedKeywords.length > 0 ? "flashcards-filtered.csv" : "flashcards.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Función para descargar como archivo Anki (formato .txt, tab-separated)
  const downloadAsAnki = () => {
    const cardsToExport = selectedKeywords.length > 0 ? filteredCards : cards;
    const rows = cardsToExport
      .map(({ front, back }) => `${front}\t${back}`)
      .join("\n");

    const blob = new Blob([rows], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      selectedKeywords.length > 0 ? "flashcards-filtered-anki.txt" : "flashcards-anki.txt"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Función para descargar como PDF
  const downloadAsPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Usar las tarjetas filtradas si hay keywords seleccionadas, de lo contrario usar todas
    const cardsToExport = selectedKeywords.length > 0 ? filteredCards : cards;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Flashcards', 105, yPos, { align: 'center' });
    yPos += 15;
    
    if (selectedKeywords.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      const filterText = `Filtrado por keywords: ${selectedKeywords.join(', ')}`;
      const filterLines = doc.splitTextToSize(filterText, 170);
      doc.text(filterLines, 20, yPos);
      yPos += filterLines.length * 6 + 10;
    }
    
    cardsToExport.forEach((card, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Tarjeta ${index + 1}`, 20, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Pregunta:', 20, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Manejar pregunta multilinea
      const frontLines = doc.splitTextToSize(card.front, 170);
      doc.text(frontLines, 20, yPos);
      yPos += frontLines.length * 6 + 10;
      
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Respuesta:', 20, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Manejar respuesta multilinea
      const backLines = doc.splitTextToSize(card.back, 170);      doc.text(backLines, 20, yPos);
      yPos += backLines.length * 6 + 10;
      
      // Mostrar keywords si existen
      if (card.keywords) {
        const keywordsList = card.keywords.split('-').map(k => k.trim()).filter(k => k);
        if (keywordsList.length > 0 && yPos < 250) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('Keywords:', 20, yPos);
          yPos += 7;
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.text(keywordsList.join(', '), 20, yPos);
          yPos += 10;
        } else if (keywordsList.length > 0) {
          doc.addPage();
          yPos = 20;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('Keywords:', 20, yPos);
          yPos += 7;
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.text(keywordsList.join(', '), 20, yPos);
          yPos += 10;
        }
      }
      
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos - 5, 190, yPos - 5);
      
      // Asegurarse de que hay espacio para la siguiente tarjeta
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    doc.save(selectedKeywords.length > 0 ? `flashcards-filtered.pdf` : 'flashcards.pdf');
  }
  
  

  // Función para manejar la descarga según el formato seleccionado
  const handleDownload = () => {
    if (downloadFormat === 'markdown') {
      downloadAsMarkdown();
    } else if (downloadFormat === 'pdf') {
      downloadAsPDF();
    }
    else if (downloadFormat === 'csv') {
      downloadAsCSV();
    } else if (downloadFormat === 'anki') {
      downloadAsAnki();
    }
    else{
      downloadAsPDF();
    }
  }
    // Calcular el progreso
  const progress = (cardsProgress.length / cards.length) * 100
  const knownProgress = (knownCards.length / cards.length) * 100
  
  const currentCard = filteredCards[currentIndex]
  const isCardKnown = currentCard && knownCards.includes(currentCard.id)
  
  if (!cards.length) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-secondary">{t('flashcards.no_flashcards_available')}</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Barra de progreso */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center text-sm text-secondary mb-1">
          <span>{t('flashcards.progress')}: {Math.round(progress)}% ({cardsProgress.length}/{cards.length})</span>
          <span>{t('flashcards.learned')}: {Math.round(knownProgress)}% ({knownCards.length}/{cards.length})</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-success transition-all duration-300" 
            style={{ width: `${knownProgress}%` }}
          />
        </div>
      </div>
      
      {/* Controles superiores */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        {/* Buscador por keywords */}
        <div className="relative" ref={searchRef}>
          <div className="flex flex-wrap gap-2 items-center border border-accent-light rounded-lg p-2 bg-surface w-full md:w-96">
            {selectedKeywords.map(keyword => (
              <div key={keyword} className="flex items-center bg-accent-light text-accent-heavy px-2 py-1 rounded text-sm">
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 hover:text-accent"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex-1 min-w-[150px]">
              <div className="flex items-center">
                <Search className="w-4 h-4 text-muted mr-1" />
                <input
                  type="text"
                  placeholder={t('flashcards.search_by_keyword')}
                  className="border-none outline-none w-full text-sm bg-transparent text-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
            </div>
          </div>
          
          {/* Sugerencias de autocompletado */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full md:w-96 max-h-60 overflow-auto bg-bg-light rounded-md shadow-lg border">
              {suggestions.map(keyword => (
                <div
                  key={keyword}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectKeyword(keyword)}
                >
                  {keyword}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Descargar tarjetas */}
        <div className="flex items-center space-x-3">
          <select 
            className="text-sm border rounded-md px-2 py-1"
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="pdf">PDF (.pdf)</option>
            {(plan.isPremium || plan.isUltimate) && (
              <option value="csv">CSV (.csv)</option>
            )}
            {(plan.isUltimate) && (
              <option value="anki">Anki (.apkg)</option>
            )}
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('flashcards.download_text')}</span>
          </button>
        </div>
      </div>
      
      {/* Resultados de la búsqueda */}
      {selectedKeywords.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="font-medium">
            {t('flashcards.showing')} {filteredCards.length} {filteredCards.length === 1 ? t('flashcards.card') : t('flashcards.cards')} 
            {filteredCards.length === 0 ? ` ${t('flashcards.no_matches')}` : ''}
          </span>
          {filteredCards.length > 0 && (
            <button 
              onClick={() => setSelectedKeywords([])}
              className="ml-2 text-blue-600 hover:underline"
            >
              {t('flashcards.show_all')}
            </button>
          )}
        </div>
      )}
      
      {/* Contador de tarjetas */}
      <div className="text-center mb-4 text-sm text-text">
        {filteredCards.length > 0 && `Tarjeta ${currentIndex + 1} de ${filteredCards.length}`}
      </div>
      {/* Tarjeta */}
      <div className="flex-grow flex justify-center items-center">
        {filteredCards.length > 0 ? (
          <div className="flashcard-container">
            <div 
              className={`flashcard-enhanced bg-secondary ${isFlipped ? "flipped" : ""} ${isAnimating ? "animating" : ""} ${isCardKnown ? "known" : ""}`} 
              onClick={handleFlip}
            >
              <div className="flashcard-front-enhanced">
                <div className="p-8 h-full flex flex-col justify-center">
                  <p className="text-2xl font-medium text-center">{currentCard.front}</p>
                  
                  <div className="absolute bottom-4 right-4 opacity-50 text-xs">
                    Haz clic para ver la respuesta
                  </div>
                  
                  {isCardKnown && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        Aprendida
                      </span>
                    </div>
                  )}
                  
                  {/* Mostrar keywords si existen */}
                  {currentCard.keywords && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[70%]">
                      {currentCard.keywords.split('-').map(keyword => keyword.trim()).filter(k => k).map((keyword, idx) =>
                        idx > 1 ? (
                          <div className="md:hidden" key={idx}>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-text text-xs">
                              {keyword}
                            </span>
                          </div>
                        ) : (
                          <span key={idx} className="px-2 py-0.5 rounded-full bg-gray-100 text-text text-xs">
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flashcard-back-enhanced">
                <div className="p-8 h-full flex flex-col justify-center overflow-auto">
                  <p className="text-lg">{currentCard.back}</p>
                  
                  <div className="absolute bottom-4 right-4 opacity-50 text-xs">
                    Haz clic para ver la pregunta
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-text mb-2">No hay tarjetas que coincidan con tu búsqueda</p>
            <button 
              onClick={() => setSelectedKeywords([])}
              className="text-blue-600 hover:underline"
            >
              Mostrar todas las tarjetas
            </button>
          </div>
        )}
      </div>
      
      {/* Controles */}
      {filteredCards.length > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-6">
          <button 
            onClick={handlePrev}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-text" />
          </button>
          
          <button 
            onClick={toggleKnown}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isCardKnown 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-gray-100 text-text hover:bg-gray-200"
            }`}
          >
            {isCardKnown ? "Aprendida ✓" : "Marcar como aprendida"}
          </button>
          
          <button 
            onClick={handleShuffle}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Barajar"
          >
            <Shuffle className="w-5 h-5 text-text" />
          </button>
          
          <button 
            onClick={handleNext}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-text" />
          </button>
        </div>
      )}
    </div>
  )
}
