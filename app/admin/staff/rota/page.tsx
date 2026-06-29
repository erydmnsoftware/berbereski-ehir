"use client";

import { useState, useEffect } from "react";
import { useStaffScheduleReport } from "@/lib/api/staff-schedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RotaDateScroller from "@/components/staff/RotaDateScroller";
import EditShiftModal from "@/components/staff/EditShiftModal";
import { DayEntry } from "@/lib/api/types/staff-schedule";
import { CalendarDays, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StaffRotaPage() {
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [editingDay, setEditingDay] = useState<DayEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barbers, setBarbers] = useState<any[]>([]);

  // Fetch barbers dynamically
  useEffect(() => {
    fetch('/api/admin/data?type=barbers')
      .then(r => r.json())
      .then(d => {
        if (d.data && d.data.length > 0) {
          setBarbers(d.data);
          setSelectedStaff(d.data[0].id);
        }
      });
  }, []);

  // Use MONTH mode to get an array of days easily
  const { data: report, isLoading } = useStaffScheduleReport(selectedStaff, 2026, "MONTH", !!selectedStaff);

  const openEditModal = (day: DayEntry) => {
    setEditingDay(day);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#B5482E] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Extract all days from the first period (e.g. current month)
  const days = report?.periods[0]?.days || [];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-[#B5482E]" /> Çalışan Vardiyası
          </h1>
          <p className="text-gray-500 mt-2">Personellerinizin günlük çalışma saatlerini ve müsaitliklerini yönetin.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-[#151515] p-2 rounded-lg border border-gray-200 dark:border-[#333] shadow-sm">
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[200px] border-none bg-transparent focus:ring-0 shadow-none font-bold">
              <SelectValue placeholder="Personel Seçin" />
            </SelectTrigger>
            <SelectContent>
              {barbers.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="border-none">
            <Settings className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Main Rota Viewer */}
      <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#1a1a1a]">
          <h2 className="font-bold text-lg">{report?.staffName} - Günlük Planlama</h2>
          <p className="text-sm text-gray-500 mt-1">Günü düzenlemek için tıklayın. Sürükleyerek diğer günleri görüntüleyebilirsiniz.</p>
        </div>

        <div className="p-6">
          {days.length > 0 ? (
            <RotaDateScroller days={days} onDayClick={openEditModal} />
          ) : (
            <div className="text-center py-10 text-gray-500">Takvim verisi bulunamadı.</div>
          )}
        </div>
      </div>

      <EditShiftModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        day={editingDay} 
        staffName={report?.staffName || "Personel"} 
      />
    </div>
  );
}
