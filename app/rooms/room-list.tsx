"use client";
import { Option, Select } from "@/components/ui/select";
import { Room, SortMethods, SortOrder } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import CreateRoom from "./create-room";
import RoomCard from "./room-card";

interface RoomListProps {
    receivedRooms: Room[];
    leftRoomsCount: number;
    limits: { rooms: number };
    currentPlan: { isUltimate: boolean };
}

export default function RoomList({
    receivedRooms,
    leftRoomsCount,
    limits,
    currentPlan,
}: RoomListProps) {
    const { t } = useTranslation();
    
    const sortOptions: Option[] = [
        { id: "name-asc", label: t('notebooks.sort.name_asc') },
        { id: "name-desc", label: t('notebooks.sort.name_desc') },
        { id: "date-desc", label: t('notebooks.sort.date_desc') },
        { id: "date-asc", label: t('notebooks.sort.date_asc') },
    ];
    
    const [sortOrder, setSortOrder] = useState<Option>(sortOptions[0]);
    const [inputValue, setInputValue] = useState("");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [rooms, setRooms] = useState<Room[]>(receivedRooms);
    const suggestionsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const tags = new Set<string>();
        receivedRooms.forEach((room) => {
            room.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(Array.from(tags));
    }, [receivedRooms]);

    useEffect(() => {
        let filtered = [...receivedRooms];

        if (inputValue) {
            filtered = filtered.filter((room) =>
                room.title.toLowerCase().includes(inputValue.toLowerCase())
            );
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter((room) =>
                selectedTags.every((tag) => room.tags?.includes(tag))
            );
        }

        if (sortOrder) {
            filtered = filtered.sort(SortMethods[sortOrder.id as SortOrder]);
        }

        setRooms(filtered);
    }, [inputValue, selectedTags, sortOrder, receivedRooms]);

    const addTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setInputValue("");
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const filteredSuggestions = allTags.filter(
        (tag) =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag)
    );

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent-heavy">{t('notebooks.my_notebooks')}</h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    {!currentPlan.isUltimate && (
                        <span className="text-text text-sm">
                            {t('dashboard.notebooks_remaining')}: {leftRoomsCount} / {limits.rooms}
                        </span>
                    )}
                    <CreateRoom leftRoomsCount={leftRoomsCount} />
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
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

            {/* Resultados */}
            {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-accent-heavy mb-2">{t('notebooks.no_notebooks')}</h2>
                    <p className="text-primary mb-8">{t('notebooks.create_first')}</p>
                </div>
            )}
        </>
    );
}
