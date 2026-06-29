"use client";

import { ReportDimension, DIMENSION_CONFIGS } from "@/lib/reports/dimension-schemas";
import { MapPin, Scissors, Repeat, Tag, Calendar, Smartphone, Users } from "lucide-react";

interface DimensionSelectorProps {
  value: ReportDimension;
  onChange: (val: ReportDimension) => void;
}

const ICONS: Record<string, React.ElementType> = {
  MapPin, Scissors, Repeat, Tag, Calendar, Smartphone, Users
};

export default function DimensionSelector({ value, onChange }: DimensionSelectorProps) {
  const mainDimensions: ReportDimension[] = ["SHOP", "BARBER", "SERVICE", "PRODUCT", "BOOKING_TYPE"];
  const customDimensions: ReportDimension[] = ["CUSTOMERS"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full overflow-x-auto pb-2 scrollbar-hide">
      
      {/* Main Dimensions Group */}
      <div 
        role="radiogroup" 
        aria-label="Ana Rapor Boyutları"
        className="flex gap-2 p-1 bg-gray-100/50 dark:bg-[#1a1a1a]/50 rounded-xl"
      >
        {mainDimensions.map(dim => {
          const config = DIMENSION_CONFIGS[dim];
          const Icon = ICONS[config.icon || ""] || MapPin;
          const isSelected = value === dim;

          return (
            <button
              key={dim}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(dim)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                ${isSelected 
                  ? 'bg-white dark:bg-[#222] text-[#B5482E] shadow-sm ring-1 ring-gray-200 dark:ring-[#333]' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#222]'
                }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-[#333] shrink-0" />

      {/* Customer Growth Dimension (Separated visually) */}
      <div 
        role="radiogroup" 
        aria-label="Müşteri Büyüme Raporları"
        className="flex gap-2 p-1 bg-gray-100/50 dark:bg-[#1a1a1a]/50 rounded-xl shrink-0"
      >
        {customDimensions.map(dim => {
          const config = DIMENSION_CONFIGS[dim];
          const Icon = ICONS[config.icon || ""] || Users;
          const isSelected = value === dim;

          return (
            <button
              key={dim}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(dim)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                ${isSelected 
                  ? 'bg-[#B5482E] text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#222]'
                }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

    </div>
  );
}
