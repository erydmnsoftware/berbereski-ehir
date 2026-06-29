"use client";

import { X, Plus, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface StaffComparisonSelectorProps {
  selectedStaffIds: string[];
  onChange: (ids: string[]) => void;
}

export default function StaffComparisonSelector({ selectedStaffIds, onChange }: StaffComparisonSelectorProps) {
  
  // Mock available staff from the system
  const allStaff = [
    { id: "1", name: "Eray Duman" },
    { id: "2", name: "Ahmet Yılmaz" },
    { id: "3", name: "Mehmet Kaya" },
    { id: "4", name: "Ali Yılmaz" },
  ];

  const toggleStaff = (id: string) => {
    if (selectedStaffIds.includes(id)) {
      if (selectedStaffIds.length > 1) { // must have at least 1
        onChange(selectedStaffIds.filter(s => s !== id));
      }
    } else {
      onChange([...selectedStaffIds, id]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 mr-2 text-sm font-semibold text-gray-500">
        <Users className="w-4 h-4" /> Karşılaştırılan Personeller:
      </div>

      {selectedStaffIds.map(id => {
        const staff = allStaff.find(s => s.id === id);
        if (!staff) return null;
        
        return (
          <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-[#1C1B1A] dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold shadow-sm animate-in fade-in zoom-in duration-200">
            {staff.name}
            {selectedStaffIds.length > 1 && (
              <button 
                onClick={() => toggleStaff(id)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                aria-label={`${staff.name} kişisini çıkar`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {selectedStaffIds.length < allStaff.length && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full border-dashed border-gray-300 dark:border-[#444] text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 h-auto font-medium">
              <Plus className="w-3.5 h-3.5 mr-1" /> Ekle
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2 dark:bg-[#1a1a1a]" align="start">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 pt-1">Personel Seçin</div>
            <div className="space-y-1">
              {allStaff.filter(s => !selectedStaffIds.includes(s.id)).map(staff => (
                <button
                  key={staff.id}
                  onClick={() => toggleStaff(staff.id)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-md font-medium transition-colors"
                >
                  {staff.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
