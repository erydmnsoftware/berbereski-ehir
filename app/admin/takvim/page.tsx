"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ChevronDown, Filter, Plus, ChevronLeft, ChevronRight, MoreVertical, Clock, User, Scissors, Check, Bell, Save
} from "lucide-react";
import { format, addDays, startOfDay, endOfDay, isToday, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00"
];

export default function CalendarPage() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [barbers, setBarbers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Modal states
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ time: "", barber_id: "", service_id: 1 });
  
  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const bRes = await fetch('/api/admin/data?type=barbers');
        const bJson = await bRes.json();
        setBarbers(bJson.data || []);

        const sRes = await fetch('/api/admin/data?type=services');
        const sJson = await sRes.json();
        setServices(sJson.data || []);

        const start = startOfDay(selectedDate).toISOString();
        const end = endOfDay(selectedDate).toISOString();

        const aRes = await fetch(`/api/admin/data?type=appointments&start=${start}&end=${end}`);
        const aJson = await aRes.json();
        
        if (aJson.data && aJson.data.length > 0) {
          setAppointments(aJson.data);
        } else {
          setAppointments([]);
        }
      } catch (err: any) {
        console.error("Fetch data error:", err.message);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (isToday(selectedDate) && scrollRef.current) {
      const hour = currentTime.getHours();
      if (hour >= 8 && hour <= 20) {
        const percentage = (hour - 8) / 12;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight * percentage - 100;
      }
    }
  }, [selectedDate]);

  // Show Toast automatically hiding after 4s
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const sendSms = async (to: string, message: string) => {
    if (!to) return;
    try {
      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTimeChange = async (appt: any, diffSlots: number) => {
    const oldTime = new Date(appt.start_time);
    const newTime = new Date(oldTime.getTime() + diffSlots * 30 * 60000);
    const newTimeIso = newTime.toISOString();

    // 1. Optimistic UI update
    setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, start_time: newTimeIso } : a));

    // 2. Supabase update (no SMS — bildirim devre dışı)
    await supabase.from('appointments').update({ start_time: newTimeIso }).eq('id', appt.id);
    triggerToast(`⏰ ${appt.customers?.name || 'Müşteri'} randevusu ${format(newTime, "HH:mm")} saatine taşındı.`);
  };

  const saveEdit = async () => {
    if (!selectedAppt) return;
    const oldTime = new Date(selectedAppt.start_time);
    const dateStr = format(oldTime, "yyyy-MM-dd");
    const newTime = new Date(`${dateStr}T${editForm.time}:00`);
    const newTimeIso = newTime.toISOString();

    // 1. Optimistic UI
    setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { 
      ...a, 
      start_time: newTimeIso,
      barber_id: editForm.barber_id,
      service_id: Number(editForm.service_id)
    } : a));
    
    // 2. Supabase update (no SMS — bildirim devre dışı)
    await supabase.from('appointments').update({
      start_time: newTimeIso,
      barber_id: editForm.barber_id,
      service_id: Number(editForm.service_id)
    }).eq('id', selectedAppt.id);

    triggerToast(`✏️ ${selectedAppt.customers?.name || 'Müşteri'} randevusu güncellendi.`);

    setIsEditing(false);
    setSelectedAppt(null);
  };

  const getServiceColor = () => "#d4a853"; 
  const getServiceName = (serviceId: number) => services?.find((s) => s.id === serviceId)?.name || "VIP İşlem";
  const getBarberAppointments = (barberId: any) => appointments?.filter((a) => a.barber_id === barberId) || [];
  const formatTitleDate = (date: Date) => format(date, "d MMMM yyyy, EEEE", { locale: tr });

  const isCurrentDay = isToday(selectedDate);
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const showTimeIndicator = isCurrentDay && currentHour >= 8 && currentHour <= 20;

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden relative">
      
      {/* Toast Notification Layer */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#d4a853] p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-[#d4a853] animate-bounce" />
            </div>
            <p className="text-sm font-medium text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="p-2 rounded-xl transition-all hover:scale-105 hover:bg-[#333] text-gray-400 border border-[#444] bg-[#1a1a1a] shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <h2 className={`text-2xl font-bold capitalize tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {formatTitleDate(selectedDate)}
            </h2>
            {isCurrentDay && (
              <span className="text-sm font-medium text-[#d4a853]">Bugün</span>
            )}
          </div>

          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="p-2 rounded-xl transition-all hover:scale-105 hover:bg-[#333] text-gray-400 border border-[#444] bg-[#1a1a1a] shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#c39943] text-black text-sm font-bold hover:shadow-lg hover:scale-105 transition-all">
            <Plus className="w-4 h-4" />
            Yeni Randevu
          </button>
        </div>
      </div>

      {/* Main Calendar Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl border overflow-hidden bg-[#111111] border-[#333] shadow-2xl relative"
      >
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#111]">
          <div style={{ minWidth: `${Math.max(barbers?.length || 2, 1) * 240 + 80}px` }}>
            <div className="grid border-b border-[#333] sticky top-0 z-30 bg-[#111111]/95 backdrop-blur-md"
              style={{ gridTemplateColumns: `80px repeat(${Math.max(barbers?.length || 2, 1)}, minmax(240px, 1fr))` }}>
              <div className="p-4 text-xs font-bold uppercase tracking-widest text-[#888] flex items-center justify-center border-r border-[#222] sticky left-0 bg-[#111111]/95 z-40">
                Saat
              </div>
              {barbers?.map((barber) => (
                <div key={barber.id} className="p-5 flex flex-col items-center gap-3 border-r last:border-r-0 border-[#222] relative group">
                  <div className="relative z-10">
                    {barber.avatar ? (
                      <img loading="lazy" decoding="async" src={barber.avatar} alt={barber.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#d4a853] shadow-lg pointer-events-none" />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-[#d4a853] to-[#b0893f] text-black shadow-lg">
                        {barber.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-base font-semibold text-gray-100 z-10">{barber.name}</span>
                </div>
              ))}
            </div>

            <div ref={scrollRef} className="overflow-y-auto max-h-[calc(100vh-280px)] relative scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#111]" style={{ touchAction: 'pan-y' }}>
              {showTimeIndicator && (
                <div 
                  className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                  style={{ top: `${(currentHour - 8) * 120 + (currentMinute * 2)}px` }}
                >
                  <div className="w-[80px] text-right pr-2 text-xs font-bold text-red-500 bg-[#111] py-1 sticky left-0 z-20">
                    {format(currentTime, "HH:mm")}
                  </div>
                  <div className="flex-1 h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)] relative">
                    <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]" />
                  </div>
                </div>
              )}

              <div className="relative">
                {TIME_SLOTS.map((timeSlot) => (
                  <div
                    key={timeSlot}
                    className="grid border-b last:border-b-0 border-[#222] relative"
                    style={{ 
                      gridTemplateColumns: `80px repeat(${Math.max(barbers?.length || 2, 1)}, minmax(240px, 1fr))`,
                      height: '120px'
                    }}
                  >
                    <div className="absolute top-[60px] left-[80px] right-0 border-b border-dashed border-[#222]/50 pointer-events-none" />
                    <div className="text-xs font-medium text-[#666] border-r border-[#222] flex items-start justify-center pt-2 bg-[#161616] sticky left-0 z-20">
                      {timeSlot}
                    </div>

                    {barbers?.map((barber) => {
                      const barberAppts = getBarberAppointments(barber.id).filter((a) => {
                        const d = new Date(a.start_time);
                        return d.getHours() === parseInt(timeSlot.split(":")[0]);
                      });

                      return (
                        <div
                          key={`${barber.id}-${timeSlot}`}
                          className="border-r last:border-r-0 relative group transition-colors border-[#222] hover:bg-[#1a1a1a]/80"
                        >
                          <AnimatePresence>
                            {barberAppts.map((appt) => {
                              const startTime = new Date(appt.start_time);
                              const minutes = startTime.getMinutes();
                              const topOffset = minutes * 2; 
                              const durationMinutes = appt.durationMinutes || 45; 
                              const heightPx = durationMinutes * 2;

                              return (
                                <motion.div
                                  key={`${appt.id}-${appt.start_time}`}
                                  drag="y"
                                  dragConstraints={{ top: -1000, bottom: 1000 }}
                                  dragElastic={0.2}
                                  dragMomentum={false}
                                  onDragEnd={(e, info) => {
                                    const yOffset = info.offset.y;
                                    if (Math.abs(yOffset) > 15) {
                                      handleTimeChange(appt, Math.round(yOffset / 2));
                                    }
                                  }}
                                  onClick={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (!target.closest('.drag-handle')) {
                                      setSelectedAppt(appt);
                                    }
                                  }}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  whileHover={{ scale: 1.02, zIndex: 40 }}
                                  className={`absolute left-2 right-2 rounded-xl p-3 shadow-lg cursor-pointer transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden backdrop-blur-md ${appt.status === 'completed' ? 'opacity-70 grayscale-[30%]' : ''}`}
                                  style={{
                                    top: `${topOffset}px`,
                                    height: `${heightPx}px`,
                                    backgroundColor: appt.status === 'completed' ? "rgba(16, 185, 129, 0.1)" : "rgba(212, 168, 83, 0.12)",
                                    border: `1px solid ${appt.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 168, 83, 0.3)'}`,
                                    borderLeft: `4px solid ${appt.status === 'completed' ? '#10b981' : getServiceColor()}`,
                                    zIndex: 10
                                  }}
                                >
                                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#d4a853] opacity-5 rounded-full blur-xl pointer-events-none" />

                                  <div className="flex flex-col h-full justify-between relative z-10">
                                    <div className="flex items-start justify-between">
                                      <div className="min-w-0">
                                        <h4 className="text-sm font-bold truncate text-[#e0e0e0] flex items-center gap-1.5">
                                          <Scissors className="w-3.5 h-3.5 text-[#d4a853]" />
                                          {getServiceName(appt.service_id)}
                                        </h4>
                                        <p className="text-[11px] mt-1 font-medium text-[#aaa] flex items-center gap-1 drag-handle cursor-grab active:cursor-grabbing hover:bg-white/10 p-0.5 rounded" title="Aşağı yukarı sürükleyerek saati değiştirin">
                                          <Clock className="w-3 h-3 text-[#d4a853]" />
                                          {format(startTime, "HH:mm")} - {format(new Date(startTime.getTime() + durationMinutes * 60000), "HH:mm")}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[#d4a853]/20">
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold bg-gradient-to-br from-[#333] to-[#111] text-[#d4a853] border border-[#d4a853]/30">
                                        {appt.customers?.name?.charAt(0) || "?"}
                                      </div>
                                      <span className="text-xs font-semibold truncate text-[#ccc]">
                                        {appt.customers?.name || "Bilinmeyen"}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appointment Action Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { setSelectedAppt(null); setIsEditing(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1c1c1c] border border-[#333] rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden z-10"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4a853] opacity-10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{isEditing ? "Randevuyu Düzenle" : "Randevu Detayları"}</h3>
                  <p className="text-sm text-gray-400">İşlem yönetimi ve optimizasyon</p>
                </div>
                <button onClick={() => { setSelectedAppt(null); setIsEditing(false); }} className="p-2 text-gray-400 hover:text-white transition-colors bg-[#2a2a2a] rounded-lg border border-[#333] hover:border-[#555]">
                  ✕
                </button>
              </div>

              {!isEditing ? (
                <>
                  <div className="space-y-3 mb-8 relative z-10">
                    <div className="flex items-center justify-between p-3.5 bg-[#222] rounded-xl border border-[#333]">
                      <span className="text-sm text-gray-400">Müşteri</span>
                      <span className="text-sm font-semibold text-white">{selectedAppt.customers?.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#222] rounded-xl border border-[#333]">
                      <span className="text-sm text-gray-400">Hizmet</span>
                      <span className="text-sm font-semibold text-[#d4a853]">{getServiceName(selectedAppt.service_id)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#222] rounded-xl border border-[#333]">
                      <span className="text-sm text-gray-400">Durum</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${selectedAppt.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {selectedAppt.status === 'completed' ? 'Tamamlandı' : 'İşlemde / Bekliyor'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    {selectedAppt.status !== 'completed' && (
                      <button 
                        onClick={async () => {
                          const now = new Date();
                          
                          // 1. Optimistic UI
                          setAppointments(prev => prev.map(a => 
                            a.id === selectedAppt.id 
                              ? { ...a, status: 'completed' } 
                              : a
                          ));
                          
                          // 2. Supabase DB update
                          await supabase.from('appointments').update({ 
                            status: 'completed' 
                          }).eq('id', selectedAppt.id);
                          
                          triggerToast(`✅ ${selectedAppt.customers?.name || 'Müşteri'} işlemi başarıyla tamamlandı.`);
                          setSelectedAppt(null);
                        }}
                        className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-green-900/50 border border-green-500/30 flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        İşlemi Erken Bitir (Boşa Çıkar)
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setEditForm({
                          time: format(new Date(selectedAppt.start_time), "HH:mm"),
                          barber_id: selectedAppt.barber_id,
                          service_id: selectedAppt.service_id
                        });
                        setIsEditing(true);
                      }}
                      className="w-full py-3.5 rounded-xl font-bold bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white transition-colors border border-[#444]"
                    >
                      Randevuyu Düzenle
                    </button>
                    <button 
                      onClick={() => {
                          setAppointments(prev => prev.filter(a => a.id !== selectedAppt.id));
                          setSelectedAppt(null);
                      }}
                      className="w-full py-3.5 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                      İptal Et / Sil
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Randevu Saati</label>
                    <input 
                      type="time" 
                      value={editForm.time}
                      onChange={e => setEditForm({...editForm, time: e.target.value})}
                      className="w-full bg-[#111] border border-[#444] text-white p-3 rounded-xl focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hizmeti Veren Berber</label>
                    <select 
                      value={editForm.barber_id}
                      onChange={e => setEditForm({...editForm, barber_id: e.target.value})}
                      className="w-full bg-[#111] border border-[#444] text-white p-3 rounded-xl focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none appearance-none"
                    >
                      {barbers.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hizmet</label>
                    <select 
                      value={editForm.service_id}
                      onChange={e => setEditForm({...editForm, service_id: Number(e.target.value)})}
                      className="w-full bg-[#111] border border-[#444] text-white p-3 rounded-xl focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none appearance-none"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3.5 rounded-xl font-bold bg-[#2a2a2a] text-gray-300 hover:bg-[#333] transition-colors"
                    >
                      Vazgeç
                    </button>
                    <button 
                      onClick={saveEdit}
                      className="flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#d4a853] to-[#c39943] text-black hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Kaydet
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
