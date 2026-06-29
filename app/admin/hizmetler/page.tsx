"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Scissors, Clock, DollarSign, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  created_at?: string;
  category?: string;
}

const emptyForm = { name: "", duration: 30, price: 0, category: "Saç & Sakal" };

export default function ServicesPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/data?type=services', { cache: 'no-store' });
      const json = await res.json();
      if (json.data) {
        setServices(json.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (editingId) {
      // Supabase Update
      const { error } = await supabase.from('services').update({
        name: form.name,
        duration_minutes: form.duration,
        price: form.price,
        category: form.category
      }).eq('id', editingId);
      
      if (!error) {
        setServices(prev => prev.map(s => s.id === editingId ? { ...s, name: form.name, duration_minutes: form.duration, price: form.price, category: form.category } as Service : s));
      }
    } else {
      // Supabase Create
      const { data, error } = await supabase.from('services').insert({
        salon_id: '11111111-1111-1111-1111-111111111111',
        name: form.name,
        duration_minutes: form.duration,
        price: form.price,
        category: form.category,
        is_active: true,
        sort_order: services.length + 1
      }).select().single();

      if (data && !error) {
        setServices([{ id: data.id, name: data.name, duration_minutes: data.duration_minutes, price: data.price, category: data.category, created_at: data.created_at }, ...services]);
      }
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setIsLoading(false);
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      duration: service.duration_minutes,
      price: service.price,
      category: service.category || "Saç & Sakal"
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Bu hizmeti silmek istediğinize emin misiniz? (Bağlı randevular etkilenebilir)")) {
      setIsLoading(true);
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) {
        setServices(prev => prev.filter(s => s.id !== id));
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Hizmetler & Fiyatlar
          </h2>
          <p className="text-sm text-gray-400 mt-1">Sistemdeki tüm işlemleri, sürelerini ve fiyatlarını yönetin.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hizmet veya kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-[#333] bg-[#111] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#c39943] text-black text-sm font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Hizmet Ekle
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border p-6 transition-all bg-[#1c1c1c] border-[#333] hover:border-[#d4a853]/50 hover:shadow-[0_8px_30px_rgb(212,168,83,0.1)] relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-32 h-32 bg-[#d4a853] opacity-0 group-hover:opacity-10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#333] to-[#111] border border-[#d4a853]/30 shadow-lg">
                    <Scissors className="w-6 h-6 text-[#d4a853]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[#d4a853]">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{service.category || "Genel"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#111] border border-[#222]">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> İşlem Süresi
                  </span>
                  <span className="text-white font-bold">{service.duration_minutes} Dakika</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#111] border border-[#222]">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Fiyat
                  </span>
                  <span className="text-[#d4a853] font-bold text-lg">{service.price} ₺</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(service)}
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg bg-[#2a2a2a] text-gray-300 font-semibold hover:text-white hover:bg-[#333] transition-colors text-sm"
                >
                  <Pencil className="w-4 h-4" /> Düzenle
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex items-center justify-center w-11 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#444] bg-[#111]">
          <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">Aradığınız hizmet bulunamadı.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl border p-7 shadow-2xl bg-[#1c1c1c] border-[#333] relative z-10 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4a853] opacity-10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Fiyat ve süre güncellemelerini yönetin.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:text-white border border-[#333] hover:border-[#555] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Hizmet / Ürün Adı <span className="text-red-500">*</span></label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                    placeholder="Örn: VIP Saç Kesimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none appearance-none">
                    <option value="Saç & Sakal">Saç & Sakal</option>
                    <option value="Bakım">Bakım</option>
                    <option value="Renklendirme">Renklendirme</option>
                    <option value="Paketler">Paketler</option>
                    <option value="Ürün Satışı">Ürün Satışı</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">İşlem Süresi (Dk)</label>
                    <input type="number" min="0" step="5" required value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Fiyat (₺)</label>
                    <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                      placeholder="250"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-5">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold bg-[#2a2a2a] text-gray-300 hover:bg-[#333] transition-colors border border-[#444]">
                    İptal
                  </button>
                  <button type="submit"
                    className="flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#d4a853] to-[#c39943] text-black hover:scale-[1.02] transition-transform">
                    {editingId ? "Güncelle" : "Kaydet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
