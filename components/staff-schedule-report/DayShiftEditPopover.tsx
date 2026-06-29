"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayEntry, DayShiftStatus, GroupByMode } from "@/lib/api/types/staff-schedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateShift } from "@/lib/api/staff-schedule";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { Clock, ShieldAlert } from "lucide-react";

interface DayShiftEditPopoverProps {
  staffId: string;
  day: DayEntry;
  children: React.ReactNode;
}

export default function DayShiftEditPopover({ staffId, day, children }: DayShiftEditPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<DayShiftStatus>(day.status);
  const [start, setStart] = useState(day.shiftStart || "09:00");
  const [end, setEnd] = useState(day.shiftEnd || "18:00");
  const [reason, setReason] = useState("");

  const updateMutation = useUpdateShift(staffId);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset state on open
      setStatus(day.status);
      setStart(day.shiftStart || "09:00");
      setEnd(day.shiftEnd || "18:00");
      setReason("");
    }
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        date: day.date,
        status,
        shiftStart: status === "SCHEDULED" ? start : null,
        shiftEnd: status === "SCHEDULED" ? end : null
      });
      toast.success("Vardiya güncellendi");
      setIsOpen(false);
    } catch (e) {
      toast.error("Güncelleme başarısız oldu");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 overflow-hidden dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333]" align="start">
        <div className="bg-gray-50 dark:bg-[#111] p-4 border-b border-gray-100 dark:border-[#222]">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon />
            {format(parseISO(day.date), "EEEE, d MMMM yyyy", { locale: tr })}
          </h4>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-gray-500 mb-1.5 block">Durum</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DayShiftStatus)}>
              <SelectTrigger className="w-full bg-white dark:bg-[#222] border-gray-200 dark:border-[#333]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLOSED">Kapalı (İzinli)</SelectItem>
                <SelectItem value="SCHEDULED">Vardiyalı (Açık)</SelectItem>
                <SelectItem value="DAY_BLOCKED">Tüm Gün Bloklu (Tatil/Rapor vb.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "SCHEDULED" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-gray-500 mb-1.5 block">Başlangıç</Label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="time" 
                    value={start} 
                    onChange={e => setStart(e.target.value)}
                    className="pl-9 bg-white dark:bg-[#222] border-gray-200 dark:border-[#333]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label className="text-gray-500 mb-1.5 block">Bitiş</Label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="time" 
                    value={end} 
                    onChange={e => setEnd(e.target.value)}
                    className="pl-9 bg-white dark:bg-[#222] border-gray-200 dark:border-[#333]"
                  />
                </div>
              </div>
            </div>
          )}

          {status === "DAY_BLOCKED" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-gray-500 mb-1.5 block">Sebep (Opsiyonel)</Label>
              <Textarea 
                placeholder="Örn: Yıllık izin, Sağlık raporu..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="resize-none h-20 bg-white dark:bg-[#222] border-gray-200 dark:border-[#333]"
              />
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Bu gün için tüm online randevular otomatik engellenecektir.
              </p>
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#111] border-t border-gray-100 dark:border-[#222] flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            İptal
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={updateMutation.isPending}
            className="bg-[#1C1B1A] dark:bg-white text-white dark:text-black"
          >
            {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  );
}
