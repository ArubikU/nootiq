"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Room, SortMethods, SortOrder } from "@/lib/types"
import { Book, ClipboardList, Layers, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Option, Select } from "@/components/ui/select"
import CreateRoom from "./create-room"
import RoomCard from "./room-card"

interface DashboardRoomsClientProps {
  user: any
  currentPlan: any
  leftRoomsCount: number
  rooms: Room[]
}

export default function DashboardRoomsClient({ 
  user, 
  currentPlan, 
  leftRoomsCount, 
  rooms 
}: DashboardRoomsClientProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  // Estados para filtros y búsqueda
  const sortOptions: Option[] = [
    { id: "name-asc", label: t('notebooks.sort.name_asc') },
    { id: "name-desc", label: t('notebooks.sort.name_desc') },
    { id: "date-desc", label: t('notebooks.sort.date_desc') },
    { id: "date-asc", label: t('notebooks.sort.date_asc') },
  ]
  
  const [sortOrder, setSortOrder] = useState<Option>(sortOptions[0])
  const [inputValue, setInputValue] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms)
  const suggestionsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const tags = new Set<string>()
    rooms.forEach((room) => {
      room.tags?.forEach((tag) => tags.add(tag))
    })
    setAllTags(Array.from(tags))
  }, [rooms])

  useEffect(() => {
    let filtered = [...rooms]

    if (inputValue) {
      filtered = filtered.filter((room) =>
        room.title.toLowerCase().includes(inputValue.toLowerCase())
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((room) =>
        selectedTags.every((tag) => room.tags?.includes(tag))
      )
    }

    if (sortOrder) {
      filtered = filtered.sort(SortMethods[sortOrder.id as SortOrder])
    }

    setFilteredRooms(filtered)
  }, [inputValue, selectedTags, sortOrder, rooms])

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setInputValue("")
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const filteredSuggestions = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag)
  )

  const displayedRooms = isExpanded ? filteredRooms : filteredRooms.slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-12 text-secondary">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary">{t('dashboard.welcome')}</h1>
          {!currentPlan.isUltimate && (
            <p className="text-sm text-primary mt-2">
              {t('dashboard.notebooks_remaining')}: <span className="font-medium text-accent">{leftRoomsCount}</span> / {currentPlan.limits.rooms}
            </p>
          )}
        </div>
        <CreateRoom leftRoomsCount={leftRoomsCount} />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 bg-surface shadow-xl rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-accent">
              {isExpanded ? t('notebooks.my_notebooks') : t('dashboard.recent_notebooks')}
            </h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-secondary hover:text-accent transition-colors"
            >
              {isExpanded ? (
                <>
                  {t('dashboard.show_less')}
                  <ChevronUp size={20} />
                </>
              ) : (
                <>
                  {t('dashboard.view_all_notebooks')}
                  <ChevronDown size={20} />
                </>
              )}
            </button>
          </div>

          {/* Expandable Search and Filters */}
          {isExpanded && (
            <div className="mb-8 space-y-4 border-b border-accent-light pb-6">
              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Input + Tags */}
                <div className="relative w-full md:w-2/3">
                  <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-primary border border-accent-light rounded-full shadow-md focus-within:ring-2 focus-within:ring-accent-heavy transition">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-accent text-accent-heavy text-sm px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          className="text-accent-heavy hover:text-accent"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={t('notebooks.search_placeholder')}
                      className="flex-grow bg-transparent outline-none text-text"
                    />
                  </div>
                  {inputValue && filteredSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 mt-1 w-full bg-primary border border-accent-light rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredSuggestions.map((tag) => (
                        <div
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="px-4 py-2 hover:bg-accent-heavy cursor-pointer text-text"
                        >
                          #{tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort selector */}
                <Select
                  value={sortOrder}
                  options={sortOptions}
                  onChange={setSortOrder}
                />
              </div>
            </div>
          )}

          {/* Notebooks Grid */}
          {displayedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-primary mb-4">
                {rooms.length === 0 ? t('dashboard.no_notebooks_yet') : t('notebooks.no_notebooks')}
              </p>
            </div>
          )}
        </div>

        {/* Statistics Sidebar */}
        <div className="bg-surface shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-accent">{t('dashboard.statistics')}</h2>
          <div className="space-y-6">
            <StatBox 
              icon={<Layers className="text-accent" />} 
              label={t('dashboard.total_notebooks')} 
              value={rooms.length} 
            />
            <StatBox 
              icon={<Book className="text-accent" />} 
              label={t('dashboard.flashcards_created')} 
              value="-" 
            />
            <StatBox 
              icon={<ClipboardList className="text-accent" />} 
              label={t('dashboard.quizzes_completed')} 
              value="-" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xl font-bold text-secondary">{value}</p>
      </div>
    </div>
  )
}
