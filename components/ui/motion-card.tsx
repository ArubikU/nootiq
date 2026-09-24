import { motion } from 'framer-motion';
import { Card } from './card';

interface MotionCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bg' | 'surface';
}

export const MotionCard = ({ 
  title, 
  description, 
  children, 
  header,
  className,
  variant = 'default'
}: MotionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        title={title} 
        header={header}
        description={description}
        className={className}
        variant={variant}
      >
        {children}
      </Card>
    </motion.div>
  );
};