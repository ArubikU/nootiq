"use client";
import { Quiz, Room } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

interface SampleProps {
    quizzes: Quiz[];
    room: Room;
}

export default function ShortQuizzis({ quizzes, room }: SampleProps) {
    const { t } = useTranslation();

    return (
        <>
            {quizzes.length > 0 ? (
                <div className="space-y-4">
                    {quizzes.map((quiz) => (
                        <motion.div
                            key={quiz.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-accent-light rounded-xl border border-accent-light hover:border-accent p-4 cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                            <Link href={`/rooms/${room.id}/quizzes/${quiz.id}`}>
                                <div>
                                    <h3 className="font-semibold text-lg text-accent">{quiz.title}</h3>
                                    <p className="text-sm text-secondary mt-1">
                                        {quiz.description?.substring(0, 100)}...
                                    </p>
                                    {quiz.difficulty && (
                                        <div className="mt-2 flex items-center">
                                            <span className="text-xs text-secondary mr-2">{t('quizzes.difficulty')}:</span>
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full mx-0.5 ${
                                                        i < quiz.difficulty ? 'bg-accent' : 'bg-muted'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-sm text-secondary">{t('quizzes.no_quizzes_yet')}</p>
            )}
        </>
    );
}