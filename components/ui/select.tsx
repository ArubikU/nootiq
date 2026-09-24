import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Fragment } from 'react';

export interface Option {
  id: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  label?: string;
}

export const Select = ({ options, value, onChange, label }: SelectProps) => {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          {label && (
            <Listbox.Label className="block text-sm font-medium text-text mb-1">
              {label}
            </Listbox.Label>
          )}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Listbox.Button className="relative w-full bg-primary border border-bg rounded-xl py-4 px-4 text-left focus:outline-none focus:ring-2 focus:ring-accent">
              <span className="block truncate">{value.label}</span>
            </Listbox.Button>
          </motion.div>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-primary shadow-lg max-h-60 rounded-xl py-1 overflow-auto focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-2 px-4 ${
                      active ? 'bg-accent text-primary' : 'text-secondary'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};