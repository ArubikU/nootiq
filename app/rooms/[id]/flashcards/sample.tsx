"use client";
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';

export default function ShortCards({cards}: {cards: any[]}) {
    const { t } = useTranslation();

    return (
        <>
            {cards.length > 0 ? (
                <div className="space-y-4">
                    {cards.slice(0, 3).map((card) => (
                        <motion.div 
                            key={card.id} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.3 }} 
                            className="bg-accent-light rounded-xl p-4 border border-accent-light shadow-md"
                        >
                            <p className="font-medium text-primary">{card.front}</p>
                            <p className="text-sm text-secondary mt-1">{card.back.substring(0, 100)}...</p>
                        </motion.div>
                    ))}
                    {cards.length > 3 && <p className="text-sm text-center text-accent">+{cards.length - 3} {t('common.more')}</p>}
                </div>
            ) : (
                <p className="text-center text-sm text-secondary">{t('flashcards.no_flashcards_available')}</p>
            )}
        </>
    );
}