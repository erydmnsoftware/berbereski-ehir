'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Scissors, User, Droplet, Crown, Sparkles, 
  ChevronLeft, ChevronRight, CheckCircle2, 
  Calendar as CalendarIcon, Clock, ArrowLeft,
  AlertCircle, Check
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  photo_url: string | null;
}

interface BarberItem {
  id: string;
  name: string;
  title: string;
  photo_url: string | null;
}

interface SlotItem {
  time: string;
  available: boolean;
  reason?: string;
}

const fallbackServices: ServiceItem[] = [
  { id: 'f-1', name: 'Saç Kesim', description: 'Klasik ve modern saç kesim stilleri, yıkama ve fön dahil.', duration_minutes: 30, price: 250, category: 'haircut', photo_url: null },
  { id: 'f-2', name: 'Sakal Kesim & Düzeltme', description: 'Profesyonel sakal şekillendirme, sıcak havlu kompresi ile.', duration_minutes: 20, price: 150, category: 'beard', photo_url: null },
  { id: 'f-3', name: 'Cilt Bakım', description: 'Yüz temizliği, peeling, siyah nokta temizliği ve nem maskesi.', duration_minutes: 45, price: 350, category: 'skincare', photo_url: null },
  { id: 'f-4', name: 'VIP Kombo Paket', description: 'Saç + Sakal + Detaylı Cilt Bakımı + İçecek İkramı.', duration_minutes: 90, price: 650, category: 'vip', photo_url: null },
  { id: 'f-5', name: 'Saç Boyama', description: 'Profesyonel saç rengi uygulaması ve beyaz kapama.', duration_minutes: 90, price: 500, category: 'haircut', photo_url: null },
  { id: 'f-6', name: 'Ense Düzeltme', description: 'Hızlı ense, favori ve kenar düzeltme işlemi.', duration_minutes: 15, price: 100, category: 'haircut', photo_url: null },
];

const fallbackBarbers: BarberItem[] = [
  { id: 'fb-1', name: 'Mehmet Usta', title: 'Baş Berber', photo_url: null },
  { id: 'fb-2', name: 'Ali Kaya', title: 'VIP Uzmanı', photo_url: null },
  { id: 'fb-3', name: 'Can Demir', title: 'Sakal Ustası', photo_url: null },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'haircut': return <Scissors size={24} className="text-[#d4a853]" />;
    case 'beard': return <User size={24} className="text-[#d4a853]" />;
    case 'skincare': return <Droplet size={24} className="text-[#d4a853]" />;
    case 'vip': return <Crown size={24} className="text-[#d4a853]" />;
    default: return <Sparkles size={24} className="text-[#d4a853]" />;
  }
};

function generateFallbackSlots(date: string): SlotItem[] {
  const d = new Date(date);
  const day = d.getDay();
  const now = new Date();
  if (day === 0) return [];
  const openHour = 9;
  const openMin = 0;
  const closeHour = day === 6 ? 17 : 19;
  const closeMin = 0;
  const slots: SlotItem[] = [];
  const cursor = new Date(d);
  cursor.setHours(openHour, openMin, 0, 0);
  const closing = new Date(d);
  closing.setHours(closeHour, closeMin, 0, 0);

  while (cursor < closing) {
    const time = `${cursor.getHours().toString().padStart(2, '0')}:${cursor.getMinutes().toString().padStart(2, '0')}`;
    const isPast = cursor < now;
    slots.push({ time, available: !isPast, reason: isPast ? 'past' : undefined });
    cursor.setTime(cursor.getTime() + 30 * 60000);
  }
  return slots;
}

function generateNextDays(count = 14) {
  const dates = [];
  const today = new Date();
  let added = 0;
  let cursor = new Date(today);
  
  while (added < count) {
    if (cursor.getDay() !== 0) { // Skip sunday
      dates.push(new Date(cursor));
      added++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export default function RandevuPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [workingInfo, setWorkingInfo] = useState<{ open: string; close: string } | null>(null);

  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/randevu/bilgi');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services?.length ? data.services : fallbackServices);
          setBarbers(data.barbers?.length ? data.barbers : fallbackBarbers);
        } else {
          setServices(fallbackServices);
          setBarbers(fallbackBarbers);
        }
      } catch {
        setServices(fallbackServices);
        setBarbers(fallbackBarbers);
      }
    };
    loadData();
  }, []);

  const loadSlots = useCallback(async () => {
    if (!selectedBarber || !selectedService || !selectedDate) return;
    setSlotsLoading(true);
    setSelectedTime('');
    setSlots([]);
    try {
      const res = await fetch(`/api/randevu/slots?barberId=${selectedBarber}&serviceId=${selectedService}&date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        if (data.slots?.length) {
          setSlots(data.slots);
          setWorkingInfo(data.workingHours || null);
        } else {
          setSlots([]);
          setWorkingInfo(null);
        }
      } else {
        setSlots(generateFallbackSlots(selectedDate));
      }
    } catch {
      setSlots(generateFallbackSlots(selectedDate));
    }
    setSlotsLoading(false);
  }, [selectedBarber, selectedService, selectedDate]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const goToStep3 = () => {
    setStep(3);
    loadSlots();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: selectedBarber,
          serviceId: selectedService,
          date: selectedDate,
          time: selectedTime,
          name: customer.name,
          phone: customer.phone,
          email: '',
          notes: customer.notes
        })
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Randevu oluşturulamadı. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Ağ hatası oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    }
    setLoading(false);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedBarberData = barbers.find(b => b.id === selectedBarber);

  const getDayName = (dateStr: string) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[new Date(dateStr).getDay()];
  };

  const availableDays = generateNextDays(14);

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-5 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a853]/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="bg-[#111] border border-[#222] rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center relative z-10 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={50} className="text-[#d4a853]" />
          </div>
          <h2 className="text-3xl text-white font-serif mb-4">Randevunuz Onaylandı!</h2>
          <p className="text-[#aaa] mb-2">Sayın <strong className="text-white font-medium">{customer.name}</strong>,</p>
          <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 text-left border border-[#222]">
            <p className="text-[#aaa] mb-4 leading-relaxed text-center">
              Randevunuz başarıyla oluşturulmuştur. Bizi tercih ettiğiniz için teşekkür ederiz.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#333]">
                <span className="text-[#888]">Tarih</span>
                <span className="text-white">{getDayName(selectedDate)}, {selectedDate}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#333]">
                <span className="text-[#888]">Saat</span>
                <span className="text-white font-medium text-lg">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#333]">
                <span className="text-[#888]">Berber</span>
                <span className="text-white">{selectedBarberData?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">Hizmet</span>
                <span className="text-[#d4a853] font-medium">{selectedServiceData?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-6 py-4 border border-[#333] text-white rounded-xl hover:bg-[#222] transition-colors font-medium w-full sm:w-auto">
              Ana Sayfa
            </Link>
            <button onClick={() => window.location.reload()} className="px-6 py-4 bg-[#d4a853] text-black font-medium rounded-xl hover:bg-[#e5b964] transition-all shadow-[0_0_20px_rgba(212,168,83,0.3)] w-full sm:w-auto">
              Yeni Randevu
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-12 px-5 selection:bg-[#d4a853] selection:text-black relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4a853]/5 blur-[150px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-[800px] mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Ana Sayfaya Dön
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl text-white font-serif tracking-wide mb-3">Randevu Al</h1>
          <p className="text-[#888] text-lg">Premium deneyim için yerinizi ayırtın.</p>
        </div>

        {/* Premium Stepper */}
        <div className="flex items-center justify-between mb-16 relative max-w-3xl mx-auto px-2 sm:px-0">
          {[
            { num: 1, label: 'Hizmet' },
            { num: 2, label: 'Berber & Tarih' },
            { num: 3, label: 'Saat' },
            { num: 4, label: 'Onay' },
          ].map((s, idx, arr) => {
            const isActive = step === s.num;
            const isPassed = step > s.num;
            return (
              <div key={s.num} className="flex-1 flex items-center relative">
                {/* Step Item */}
                <div className="flex flex-col items-center gap-3 relative z-10 w-full">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-lg transition-all duration-700 ease-out border-2
                    ${isActive ? 'bg-gradient-to-br from-[#d4a853] to-[#b3883b] text-black border-transparent shadow-[0_0_30px_rgba(212,168,83,0.5)] scale-110' : 
                      isPassed ? 'bg-[#161616] text-[#d4a853] border-[#d4a853] shadow-[0_0_15px_rgba(212,168,83,0.2)]' : 
                      'bg-[#111] text-[#666] border-[#333]'}
                  `}>
                    {isPassed ? <Check size={22} strokeWidth={3} className="text-[#d4a853] animate-in zoom-in" /> : <span className={isActive ? "font-bold" : "font-medium"}>{s.num}</span>}
                  </div>
                  <span className={`absolute -bottom-8 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-500 whitespace-nowrap
                    ${isActive ? 'text-[#d4a853] translate-y-1' : isPassed ? 'text-white' : 'text-[#666]'}
                  `}>
                    {s.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {idx < arr.length - 1 && (
                  <div className="absolute top-6 sm:top-7 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 z-0">
                    <div className="w-full h-full bg-[#333] rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-[#d4a853] to-[#f9d788] transition-all duration-1000 ease-out`} 
                           style={{ width: isPassed ? '100%' : '0%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#222] rounded-[2rem] shadow-2xl p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* STEP 1: HİZMET */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl text-white font-serif">Hizmet Seçiniz</h3>
                <span className="text-[#666] text-sm font-medium">Adım 1 / 4</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(s => {
                  const isSelected = selectedService === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden transform
                        ${isSelected 
                          ? 'border-[#d4a853] bg-gradient-to-br from-[#d4a853]/10 to-[#0a0a0a] shadow-[0_0_30px_rgba(212,168,83,0.3)] scale-[1.02] -translate-y-1' 
                          : 'border-[#222] bg-[#161616] hover:border-[#d4a853]/40 hover:bg-[#1a1a1a] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,168,83,0.2)]'}
                      `}
                    >
                      {/* Subtly glowing background orb on hover */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4a853] opacity-0 group-hover:opacity-[0.05] rounded-full blur-2xl transition-opacity duration-500 pointer-events-none"></div>

                      {isSelected && (
                        <div className="absolute top-4 right-4 text-[#d4a853] animate-in zoom-in duration-300">
                          <CheckCircle2 size={24} className="drop-shadow-[0_0_8px_rgba(212,168,83,0.6)]" />
                        </div>
                      )}
                      <div className="flex items-start gap-4 mb-4 relative z-10">
                        <div className={`p-3 rounded-xl transition-all duration-500 transform ${isSelected ? 'bg-[#d4a853]/20 scale-110 shadow-[0_0_20px_rgba(212,168,83,0.2)]' : 'bg-[#222] group-hover:bg-[#d4a853]/10 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(212,168,83,0.1)]'}`}>
                          {getCategoryIcon(s.category)}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className={`text-xl font-medium transition-colors duration-300 pr-8 ${isSelected ? 'text-[#d4a853]' : 'text-white group-hover:text-[#f9d788]'}`}>{s.name}</h4>
                          <div className="flex items-center gap-2 text-[#888] mt-2 text-sm group-hover:text-[#aaa] transition-colors">
                            <Clock size={14} className={isSelected ? "text-[#d4a853]" : ""} />
                            {s.duration_minutes} Dakika
                          </div>
                        </div>
                      </div>
                      <p className="text-[#888] text-sm mb-6 leading-relaxed line-clamp-2 relative z-10 group-hover:text-[#999] transition-colors">{s.description}</p>
                      <div className="flex items-center justify-between mt-auto relative z-10">
                        <span className={`text-2xl font-semibold transition-colors duration-300 ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-[#aaa] group-hover:text-white'}`}>{s.price} ₺</span>
                        <div className={`text-sm font-medium px-5 py-1.5 rounded-full border transition-all duration-300
                          ${isSelected 
                            ? 'bg-[#d4a853] border-[#d4a853] text-black shadow-[0_0_15px_rgba(212,168,83,0.4)]' 
                            : 'border-[#333] text-[#666] group-hover:border-[#d4a853]/50 group-hover:text-[#d4a853] group-hover:bg-[#d4a853]/10 group-hover:shadow-[0_0_10px_rgba(212,168,83,0.1)]'}
                        `}>
                          {isSelected ? 'Seçildi' : 'Seç'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: BERBER & TARİH */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl text-white font-serif">Berber ve Tarih</h3>
                <span className="text-[#666] text-sm font-medium">Adım 2 / 4</span>
              </div>
              
              <div className="mb-10">
                <label className="block text-[#888] text-sm uppercase tracking-wider mb-4 font-medium">Uzman Berberler</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {barbers.map(b => {
                    const isSelected = selectedBarber === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBarber(b.id)}
                        className={`relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                          ${isSelected ? 'border-[#d4a853] bg-gradient-to-b from-[#d4a853]/10 to-transparent' : 'border-[#222] bg-[#161616] hover:border-[#444] hover:bg-[#1a1a1a]'}
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-[#d4a853] animate-in zoom-in">
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-serif mb-4 transition-all duration-500
                          ${isSelected ? 'bg-[#d4a853] text-black shadow-[0_0_20px_rgba(212,168,83,0.4)] scale-110' : 'bg-[#222] text-[#888]'}
                        `}>
                          {b.name.charAt(0)}
                        </div>
                        <h4 className={`font-medium text-lg mb-1 transition-colors ${isSelected ? 'text-white' : 'text-[#ccc]'}`}>{b.name}</h4>
                        <p className="text-[#666] text-sm">{b.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[#888] text-sm uppercase tracking-wider mb-4 font-medium flex items-center gap-2">
                  <CalendarIcon size={16} /> Uygun Tarihler
                </label>
                
                {/* Custom Horizontal Date Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar css-scrollbar-hide">
                  <style dangerouslySetInnerHTML={{__html: `
                    .css-scrollbar-hide::-webkit-scrollbar { display: none; }
                    .css-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                  `}} />
                  {availableDays.map(date => {
                    const y = date.getFullYear();
                    const m = (date.getMonth() + 1).toString().padStart(2, '0');
                    const d = date.getDate().toString().padStart(2, '0');
                    const dateStr = `${y}-${m}-${d}`;
                    
                    const isSelected = selectedDate === dateStr;
                    const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(date);
                    const dayNum = date.getDate();
                    const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(date);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex-none snap-start w-[85px] py-4 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300
                          ${isSelected 
                            ? 'border-[#d4a853] bg-[#d4a853] text-black shadow-[0_0_20px_rgba(212,168,83,0.3)] scale-105' 
                            : 'border-[#222] bg-[#161616] text-[#888] hover:border-[#444] hover:text-white hover:bg-[#1a1a1a]'}
                        `}
                      >
                        <span className={`text-[11px] uppercase font-medium tracking-wider mb-1 ${isSelected ? 'opacity-80' : ''}`}>{dayName}</span>
                        <span className={`text-3xl font-bold mb-1 ${isSelected ? 'text-black' : 'text-white'}`}>{dayNum}</span>
                        <span className={`text-[11px] uppercase tracking-wider ${isSelected ? 'opacity-80' : ''}`}>{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SAAT SEÇ */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl text-white font-serif">Saat Seçiniz</h3>
                <span className="text-[#666] text-sm font-medium">Adım 3 / 4</span>
              </div>
              
              <div className="flex items-center justify-center gap-6 mb-10 pb-6 border-b border-[#222]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#161616] border border-[#444]"></div>
                  <span className="text-[#888] text-sm">Müsait</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#d4a853] shadow-[0_0_10px_rgba(212,168,83,0.5)]"></div>
                  <span className="text-white text-sm">Seçili</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222]"></div>
                  <span className="text-[#444] text-sm">Dolu</span>
                </div>
              </div>

              {slotsLoading ? (
                <div className="py-20 text-center text-[#888]">
                  <div className="inline-block animate-spin text-[#d4a853] mb-4">
                    <Sparkles size={32} />
                  </div>
                  <p className="text-lg">Müsait saatler kontrol ediliyor...</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="py-16 text-center bg-[#161616] rounded-2xl border border-[#222]">
                  <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={28} className="text-[#888]" />
                  </div>
                  <h4 className="text-white text-xl mb-2">Uygun Saat Bulunamadı</h4>
                  <p className="text-[#888] mb-6">Seçtiğiniz tarihte randevu alınabilecek boş saat kalmamıştır.</p>
                  <button onClick={() => setStep(2)} className="text-[#d4a853] hover:text-[#e5b964] font-medium border-b border-[#d4a853] pb-1 transition-colors">
                    Farklı bir tarih seçin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {slots.map(slot => {
                    const isSelected = selectedTime === slot.time;
                    const isDisabled = !slot.available;
                    return (
                      <button
                        key={slot.time}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-4 rounded-xl border text-center transition-all duration-300 text-lg
                          ${isSelected 
                            ? 'bg-[#d4a853] border-[#d4a853] text-black font-semibold shadow-[0_0_20px_rgba(212,168,83,0.4)] scale-105' 
                            : isDisabled 
                              ? 'bg-[#0a0a0a] border-[#111] text-[#333] cursor-not-allowed line-through'
                              : 'bg-[#161616] border-[#222] text-[#aaa] hover:border-[#d4a853]/50 hover:text-white hover:bg-[#1a1a1a] font-medium'}
                        `}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: BİLGİLER */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl text-white font-serif">Kişisel Bilgiler</h3>
                <span className="text-[#666] text-sm font-medium">Adım 4 / 4</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <form id="randevu-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative group">
                    <input 
                      type="text" 
                      required 
                      id="name"
                      className="block w-full bg-transparent border-b-2 border-[#333] py-3 text-white text-lg focus:outline-none focus:border-[#d4a853] peer transition-colors"
                      placeholder=" "
                      value={customer.name} 
                      onChange={e => setCustomer({ ...customer, name: e.target.value })} 
                    />
                    <label htmlFor="name" className="absolute left-0 text-[#666] transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#d4a853] peer-valid:-top-4 peer-valid:text-sm peer-valid:text-[#888] pointer-events-none">
                      Adınız Soyadınız *
                    </label>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="tel" 
                      required 
                      id="phone"
                      className="block w-full bg-transparent border-b-2 border-[#333] py-3 text-white text-lg focus:outline-none focus:border-[#d4a853] peer transition-colors"
                      placeholder=" "
                      value={customer.phone} 
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })} 
                    />
                    <label htmlFor="phone" className="absolute left-0 text-[#666] transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#d4a853] peer-valid:-top-4 peer-valid:text-sm peer-valid:text-[#888] pointer-events-none">
                      Telefon Numaranız *
                    </label>
                  </div>

                  <div className="relative group pt-2">
                    <textarea 
                      id="notes"
                      rows={3} 
                      className="block w-full bg-[#161616] border border-[#333] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#d4a853] transition-colors resize-none placeholder:text-[#555]"
                      placeholder="Eklemek istediğiniz özel bir not var mı? (Opsiyonel)"
                      value={customer.notes} 
                      onChange={e => setCustomer({ ...customer, notes: e.target.value })} 
                    ></textarea>
                  </div>
                </form>

                <div className="bg-[#161616] border border-[#222] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a853]/5 blur-[50px] pointer-events-none"></div>
                  <div>
                    <h4 className="text-white text-lg font-medium mb-6 flex items-center gap-2 pb-4 border-b border-[#333]">
                      <Crown size={20} className="text-[#d4a853]" />
                      Randevu Özeti
                    </h4>
                    <div className="space-y-4 text-[15px]">
                      <div className="flex justify-between items-start">
                        <span className="text-[#888]">Hizmet</span>
                        <span className="text-white text-right font-medium max-w-[60%]">{selectedServiceData?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#888]">Uzman</span>
                        <span className="text-white font-medium">{selectedBarberData?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#888]">Tarih</span>
                        <span className="text-white font-medium">{getDayName(selectedDate)}, {selectedDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#888]">Saat</span>
                        <span className="text-[#d4a853] font-bold text-lg">{selectedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-6 border-t border-[#333] mt-8">
                    <span className="text-[#888]">Toplam Tutar</span>
                    <span className="text-[#d4a853] font-bold text-3xl">{selectedServiceData?.price} ₺</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`flex items-center justify-center w-14 h-14 rounded-full border border-[#333] text-[#888] hover:text-white hover:border-[#888] hover:bg-[#1a1a1a] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={24} />
            </button>

            {step < 4 ? (
              <button
                onClick={() => step === 2 ? goToStep3() : setStep(s => s + 1)}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!selectedBarber || !selectedDate)) ||
                  (step === 3 && !selectedTime)
                }
                className="flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-[#d4a853] transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(212,168,83,0.4)] disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                Devam Et
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                form="randevu-form"
                type="submit"
                disabled={loading || !customer.name || !customer.phone}
                className="flex items-center gap-3 px-10 py-4 bg-[#d4a853] text-black font-semibold rounded-full hover:bg-[#e5b964] transition-all shadow-[0_0_20px_rgba(212,168,83,0.3)] hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <Sparkles size={20} className="animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    Randevuyu Onayla
                    <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
