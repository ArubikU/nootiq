"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface CustomCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

export function CustomCheckbox({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false 
}: CustomCheckboxProps) {
  return (
    <label className={`text-primary flex items-start space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative mt-0.5">
        <motion.div
          className={`
            w-5 h-5 rounded border-2 transition-all duration-200
            ${checked 
              ? 'bg-accent border-accent' 
              : 'bg-transparent border-gray-300'
            }
            ${!disabled && 'hover:border-accent'}
          `}
          whileTap={disabled ? {} : { scale: 0.95 }}
          onClick={() => !disabled && onChange(!checked)}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium ">
          {label}
        </div>
        {description && (
          <div className="text-sm text-secondary mt-1">
            {description}
          </div>
        )}
      </div>
    </label>
  )
}
