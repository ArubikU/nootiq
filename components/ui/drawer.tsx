import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export const Drawer = ({ isOpen, onClose, children, side = 'right' }: DrawerProps) => {
  const variants = {
    left: {
      open: { x: 0 },
      closed: { x: '-100%' },
    },
    right: {
      open: { x: 0 },
      closed: { x: '100%' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={variants[side].closed}
            animate={variants[side].open}
            exit={variants[side].closed}
            className={`fixed top-0 ${side}-0 h-full w-80 bg-bg-light shadow-xl z-50 p-6`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};