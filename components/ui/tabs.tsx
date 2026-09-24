import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
}

export const Tabs = ({ tabs, defaultValue = tabs[0]?.value }: TabsProps) => {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue}>
      <TabsPrimitive.List className="flex border-b border-bg">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-text/70 data-[state=active]:text-text relative"
          >
            {tab.label}
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-custom-accent"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="py-4"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};