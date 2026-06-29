"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DayEntry } from "@/lib/api/types/staff-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Ban, Plus, Trash2, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface EditShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayEntry | null;
  staffName: string;
}

export default function EditShiftModal({ isOpen, onClose, day, staffName }: EditShiftModalProps) {
  const [availability, setAvailability] = useState<"ONLINE" | "WALK_IN" | "UNAVAILABLE">("ONLINE");
  const [shifts, setShifts] = useState<{start: string, end: string}[]>([]);
  const [recurrence, setRecurrence] = useState<"NONE" | "WEEKLY" | "BIWEEKLY">("NONE");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Reset form when day changes
  useEffect(() => {
    if (day) {
      if (day.status === "SCHEDULED") {
        setAvailability("ONLINE");
        setShifts(day.shifts && day.shifts.length > 0 ? [...day.shifts] : [{ start: "10:00", end: "18:00" }]);
      } else {
        setAvailability("UNAVAILABLE");
        setShifts([]);
      }
      setRecurrence("NONE");
      setIsPreviewMode(false);
    }
  }, [day]);

  if (!day) return null;

  const handleAddShift = () => {
    setShifts([...shifts, { start: "10:00", end: "18:00" }]);
  };

  const handleRemoveLast = () => {
    if (shifts.length > 0) {
      setShifts(shifts.slice(0, -1));
    }
  };

  const updateShift = (index: number, field: "start" | "end", value: string) => {
    const newShifts = [...shifts];
    newShifts[index] = { ...newShifts[index], [field]: value };
    setShifts(newShifts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#151515] border-gray-200 dark:border-[#333] p-0 flex flex-col max-h-[90vh] sm:rounded-2xl">
        <DialogHeader className="p-6 border-b border-gray-100 dark:border-[#222]">
          <DialogTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {staffName} için Personel Rotasını {day.dayLabel} 2026'den değiştirin
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          
          {isPreviewMode ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-center font-bold text-xl text-gray-900 dark:text-white mb-6">
                Değişiklik Özeti
              </h3>
              
              <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#333] p-6 space-y-4 max-w-lg mx-auto shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="text-gray-500 font-medium">Uygulanacak Gün</span>
                  <span className="font-bold text-gray-900 dark:text-white">{day.dayLabel} 2026</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="text-gray-500 font-medium">Müsaitlik Durumu</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    availability === "ONLINE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    availability === "WALK_IN" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {availability === "ONLINE" ? "Online Kabul" :
                     availability === "WALK_IN" ? "Rezervasyonsuz (Walk-in)" : "Kullanım Dışı"}
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="text-gray-500 font-medium">Çalışma Saatleri</span>
                  <div className="text-right font-bold text-gray-900 dark:text-white">
                    {availability === "UNAVAILABLE" ? (
                      <span className="text-gray-400">Kapalı</span>
                    ) : shifts.length === 0 ? (
                      <span className="text-gray-400">Saat belirtilmedi</span>
                    ) : (
                      <div className="space-y-1">
                        {shifts.map((s, i) => (
                          <div key={i}>{s.start} - {s.end}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Tekrarlama Kuralı</span>
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    {recurrence === "NONE" ? "Sadece Bu Gün" :
                     recurrence === "WEEKLY" ? "Haftada Bir" : "İki Haftada Bir"}
                  </span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 pt-2">
                Bu değişiklikler Eray Duman'ın takvimine uygulanacak ve online rezervasyon sistemine anında yansıyacaktır.
              </div>
            </div>
          ) : (
            <>
              {/* Availability Selection */}
              <div className="space-y-4">
            <h3 className="text-center font-bold text-lg text-gray-900 dark:text-white">
              {staffName} için müsaitlik durumunu seçin:
            </h3>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setAvailability("ONLINE")}
                className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors ${
                  availability === "ONLINE" 
                    ? "bg-[#81c784] text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Online Rezervasyon Kabul Etme
              </button>

              <button 
                onClick={() => setAvailability("WALK_IN")}
                className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors ${
                  availability === "WALK_IN" 
                    ? "bg-gray-400 text-white" // Custom styling for middle option based on image
                    : "bg-[#b0bec5] text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                Rezervasyonsuz Müşteri Kabulü İçin Uygun
              </button>

              <button 
                onClick={() => setAvailability("UNAVAILABLE")}
                className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors ${
                  availability === "UNAVAILABLE" 
                    ? "bg-[#b0bec5] text-gray-800 border-2 border-[#b0bec5]" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                <Ban className="w-4 h-4" />
                Kullanım dışı
              </button>
            </div>
          </div>

          {/* Time Inputs */}
          {availability !== "UNAVAILABLE" && (
            <div className="space-y-6">
              <h3 className="text-center font-bold text-lg text-gray-900 dark:text-white">
                Çalışma sürelerini ayarlayın:
              </h3>

              <div className="space-y-4 max-w-lg mx-auto">
                {shifts.map((shift, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-100 dark:border-[#222]">
                    <div className="flex-1 space-y-1">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">başla</label>
                      <Input 
                        type="time" 
                        value={shift.start} 
                        onChange={(e) => updateShift(idx, "start", e.target.value)}
                        className="bg-white dark:bg-[#222] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Dur</label>
                      <Input 
                        type="time" 
                        value={shift.end} 
                        onChange={(e) => updateShift(idx, "end", e.target.value)}
                        className="bg-white dark:bg-[#222] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleRemoveLast}
                    disabled={shifts.length === 0}
                    className="bg-[#ff8a80] text-white hover:bg-[#ff5252] hover:text-white border-0"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sonuncuyu Kaldır
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleAddShift}
                    className="bg-[#1f9328] text-white hover:bg-[#1b8022]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Daha Fazla Zaman Ekle
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recurrence */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-lg text-gray-900 dark:text-white">
              Bu değişikliğin nasıl tekrar edileceğini seçin:
            </h3>

            <div className="flex justify-center border rounded-md overflow-hidden mx-auto max-w-fit">
              <button 
                onClick={() => setRecurrence("NONE")}
                className={`px-4 py-2 flex items-center gap-2 font-medium text-sm transition-colors ${
                  recurrence === "NONE" 
                    ? "bg-[#b0bec5] text-gray-800 border-r border-[#90a4ae]" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#222] dark:text-gray-300"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Tekrar yok
              </button>
              <button 
                onClick={() => setRecurrence("WEEKLY")}
                className={`px-4 py-2 flex items-center gap-2 font-medium text-sm transition-colors ${
                  recurrence === "WEEKLY" 
                    ? "bg-[#90caf9] text-white border-r border-[#64b5f6]" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#222] dark:text-gray-300 border-x border-gray-200 dark:border-[#444]"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Haftada bir tekrarla
              </button>
              <button 
                onClick={() => setRecurrence("BIWEEKLY")}
                className={`px-4 py-2 flex items-center gap-2 font-medium text-sm transition-colors ${
                  recurrence === "BIWEEKLY" 
                    ? "bg-[#b0bec5] text-gray-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#222] dark:text-gray-300"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                İki haftada bir tekrarla
              </button>
            </div>
          </div>
            </>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222] flex flex-col items-end gap-3 bg-gray-50 dark:bg-[#1a1a1a]">
          {isPreviewMode ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-3">
              <button 
                onClick={() => setIsPreviewMode(false)}
                className="w-full sm:w-auto px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
              >
                Geri Dön ve Düzenle
              </button>
              <Button 
                className="w-full sm:w-auto bg-[#1f9328] hover:bg-[#1b8022] text-white text-lg py-6 px-10 shadow-sm"
                onClick={onClose} 
              >
                Onayla ve Kaydet
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-end gap-3">
              <Button 
                className="w-full sm:w-auto bg-[#1f9328] hover:bg-[#1b8022] text-white text-lg py-6"
                onClick={() => setIsPreviewMode(true)}
              >
                Yeni Zaman Çizelgesini Önizle
              </Button>
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#222]"
              >
                Kaydetmeden kapat
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
