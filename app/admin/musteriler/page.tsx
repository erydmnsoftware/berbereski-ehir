"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Users, Phone, Mail, Calendar, User, Check, XCircle, Scissors, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  total_visits?: number;
  appointments?: any[];
}

const emptyForm = { name: "", email: "", phone: "", notes: "" };

export default function CustomersPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/data?type=customers');
      const json = await res.json();
      const data = json.data;

      if (data && data.length > 0) {
        // Appointments are already nested in data thanks to the updated API route
        const finalData = data.map((c: any) => ({
          ...c,
          total_visits: c.total_visits || 0,
          appointments: c.appointments || []
        }));

        setCustomers(finalData);
      } else {
        setCustomers([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setCustomers([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (editingId) {
      // Supabase Update
      const { error } = await supabase.from('customers').update({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null
      }).eq('id', editingId);
      
      if (!error) {
        setCustomers(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
      }
    } else {
      // Supabase Create
      const { data, error } = await supabase.from('customers').insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null
      }).select().single();

      if (data && !error) {
        setCustomers([{ ...data, total_visits: 0 }, ...customers]);
      }
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setIsLoading(false);
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      setIsLoading(true);
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (!error) {
        setCustomers(prev => prev.filter(c => c.id !== id));
      }
      setIsLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId: string, action: 'completed' | 'cancelled') => {
    setActionLoading(appointmentId);
    const { error } = await supabase.from('appointments').update({ status: action }).eq('id', appointmentId);
    if (!error) {
      // Remove from local state
      setCustomers(prev => prev.map(c => ({
        ...c,
        appointments: (c.appointments || []).filter(a => a.id !== appointmentId),
        total_visits: action === 'completed' ? (c.total_visits || 0) + 1 : c.total_visits
      })));
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="İsim veya telefon ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-xl border border-[#333] bg-[#111] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#c39943] text-black text-sm font-bold hover:shadow-lg hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Yeni Müşteri Ekle
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border p-6 transition-all bg-[#1c1c1c] border-[#333] hover:border-[#d4a853]/50 hover:shadow-[0_8px_30px_rgb(212,168,83,0.1)] relative overflow-hidden group"
            >
              {/* Gold glow effect on hover */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4a853] opacity-0 group-hover:opacity-10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-[#333] to-[#111] text-[#d4a853] border border-[#d4a853]/30 shadow-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {customer.name}
                    </h3>
                    <p className="text-xs font-medium text-[#d4a853] mt-0.5">
                      {customer.total_visits} Ziyaret (VIP)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(customer)}
                    className="p-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
                    title="Düzenle"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center border border-[#333]">
                      <Phone className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center border border-[#333]">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center border border-[#333]">
                    <Calendar className="w-4 h-4 text-[#d4a853]" />
                  </div>
                  <span className="font-medium">Kayıt: {format(new Date(customer.created_at), "d MMMM yyyy", { locale: tr })}</span>
                </div>
              </div>

              {/* All Appointments */}
              {customer.appointments && customer.appointments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#333] space-y-2 relative z-10">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tüm Randevular</p>
                  {customer.appointments.map((appt: any) => (
                    <div key={appt.id} className="flex flex-col gap-2 p-2.5 bg-[#111] rounded-xl border border-[#222]">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <Scissors className="w-3.5 h-3.5 text-[#d4a853] flex-shrink-0" />
                          <span className="text-xs text-gray-300 truncate">{appt.services?.name || 'İşlem'}</span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(appt.start_time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      {appt.status === 'completed' && (
                        <div className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded w-fit">
                          <Check className="w-3 h-3" /> Hizmet Tamamlandı
                        </div>
                      )}
                      
                      {appt.status === 'cancelled' && (
                        <div className="flex items-center gap-1 text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded w-fit">
                          <XCircle className="w-3 h-3" /> İptal Edildi
                        </div>
                      )}

                      {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                        <div className="flex gap-1.5 flex-shrink-0 mt-1">
                          <button
                            disabled={actionLoading === appt.id}
                            onClick={() => handleAppointmentAction(appt.id, 'completed')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" /> Tamamlandı
                          </button>
                          <button
                            disabled={actionLoading === appt.id}
                            onClick={() => handleAppointmentAction(appt.id, 'cancelled')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3 h-3" /> İptal
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {customer.notes && (
                <div className="mt-5 p-3 rounded-xl bg-[#111] border border-[#333] relative z-10">
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    <span className="text-[#d4a853] font-bold mr-1">Not:</span>
                    {customer.notes}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && filteredCustomers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-[#444] bg-[#111]">
          <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">Aradığınız müşteri bulunamadı.</p>
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
              className="w-full max-w-lg rounded-2xl border p-7 shadow-2xl bg-[#1c1c1c] border-[#333] relative z-10 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4a853] opacity-10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingId ? "Müşteriyi Düzenle" : "Yeni Müşteri Ekle"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Müşteri detaylarını ve VIP notlarını yönetin.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:text-white border border-[#333] hover:border-[#555] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Ad Soyad <span className="text-red-500">*</span></label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Telefon</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">E-posta</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none" 
                      placeholder="ornek@mail.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Özel Notlar (Saç Tipi, Kesim Tercihi vb.)</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-[#111] border-[#444] text-white focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] outline-none resize-none" 
                    placeholder="Müşterinin özel tercihlerini buraya not alın..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
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
