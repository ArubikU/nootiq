"use client";

import { useDateFormatter, useCurrentDate } from "@/hooks/use-date-formatter";
import { useTranslation } from "@/hooks/use-translation";

export function DateExample() {
  const { formatDate, formatSpecificDate, currentLanguage } = useDateFormatter();
  const { t } = useTranslation();
  const currentDates = useCurrentDate();

  // Example dates
  const exampleDate = new Date(2025, 4, 14); // May 14, 2025
  const anotherDate = formatSpecificDate(25, 12, 2024); // December 25, 2024

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Date Formatting Examples ({currentLanguage})</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Current Date:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            <li>Full: {currentDates.full}</li>
            <li>Medium: {currentDates.medium}</li>
            <li>Short: {currentDates.short}</li>
            <li>Long: {currentDates.long}</li>
          </ul>
        </div>
        
        <div>
          <strong>Example Date (May 14, 2025):</strong>
          <ul className="ml-4 mt-1 space-y-1">
            <li>Full: {formatDate(exampleDate, 'full')}</li>
            <li>Medium: {formatDate(exampleDate, 'medium')}</li>
            <li>Short: {formatDate(exampleDate, 'short')}</li>
            <li>Long: {formatDate(exampleDate, 'long')}</li>
          </ul>
        </div>
        
        <div>
          <strong>Christmas 2024:</strong> {anotherDate}
        </div>
      </div>
    </div>
  );
}
