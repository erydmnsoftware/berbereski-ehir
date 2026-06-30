'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Bugünkü Randevular', value: '0', icon: '📅', trend: '', isPositive: true },
    { title: 'Aktif Müşteriler', value: '0', icon: '👥', trend: '', isPositive: true },
    { title: 'Aylık Gelir', value: '0 ₺', icon: '💰', trend: '', isPositive: true },
    { title: 'Riskli Müşteriler', value: '0', icon: '⚠️', trend: '30 gündür gelmeyenler', isPositive: false },
  ]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // 1. Fetch Today's Appointments Count
        const today = new Date().toISOString().split('T')[0];
        const { count: todayAppts } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .gte('start_time', `${today}T00:00:00Z`)
          .lte('start_time', `${today}T23:59:59Z`);

        // 2. Fetch Active Customers
        const { count: activeCustomers } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Monthly Income (Completed appointments this month)
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        const { data: monthAppts } = await supabase
          .from('appointments')
          .select('price')
          .eq('status', 'completed')
          .gte('start_time', firstDayOfMonth.toISOString());
        
        const monthlyIncome = monthAppts?.reduce((sum, app) => sum + (Number(app.price) || 0), 0) || 0;

        setStats([
          { title: 'Bugünkü Randevular', value: `${todayAppts || 0}`, icon: '📅', trend: 'Bugün', isPositive: true },
          { title: 'Aktif Müşteriler', value: `${activeCustomers || 0}`, icon: '👥', trend: 'Toplam kayıtlı', isPositive: true },
          { title: 'Aylık Gelir', value: `${monthlyIncome} ₺`, icon: '💰', trend: 'Bu ay', isPositive: true },
          { title: 'Riskli Müşteriler', value: '0', icon: '⚠️', trend: '30 gündür gelmeyenler', isPositive: false },
        ]);

        // 4. Fetch Recent Appointments for the list
        const { data: recentAppts } = await supabase
          .from('appointments')
          .select(`
            id, start_time, status,
            customers (name),
            services (name),
            barbers (name)
          `)
          .order('start_time', { ascending: false })
          .limit(5);
        setRecentAppointments(recentAppts || []);

        // 5. Fetch Data for Charts (Last 7 Days Earnings vs Expenses)
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = subDays(new Date(), 6 - i);
          return format(d, 'yyyy-MM-dd');
        });

        const { data: completedAppts } = await supabase
          .from('appointments')
          .select('start_time, price')
          .eq('status', 'completed')
          .gte('start_time', subDays(new Date(), 7).toISOString());

        const { data: expenses } = await supabase
          .from('stock_movements')
          .select('created_at, quantity, products(price)')
          .eq('type', 'RESTOCK')
          .gte('created_at', subDays(new Date(), 7).toISOString());

        const chartAgg = last7Days.map(dateStr => {
          // Earnings
          const dayEarnings = (completedAppts || [])
            .filter(a => {
              try {
                // Güvenli tarih kontrolü: UTC'den yerel saate çevirerek karşılaştır
                const appDate = new Date(a.start_time);
                const appDateStr = appDate.toISOString().split('T')[0];
                return appDateStr === dateStr || a.start_time.startsWith(dateStr);
              } catch(e) {
                return false;
              }
            })
            .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
          
          // Expenses
          const dayExpenses = (expenses || [])
            .filter(e => {
              try {
                const expDate = new Date(e.created_at);
                const expDateStr = expDate.toISOString().split('T')[0];
                return expDateStr === dateStr || e.created_at.startsWith(dateStr);
              } catch(e) {
                return false;
              }
            })
            .reduce((sum, e) => {
              const price = Array.isArray(e.products) ? (e.products[0]?.price || 0) : ((e.products as any)?.price || 0);
              return sum + (Number(e.quantity) * Number(price));
            }, 0);

          return {
            date: format(new Date(dateStr), 'dd MMM', { locale: tr }),
            Kazanç: dayEarnings,
            Gider: dayExpenses
          };
        });

        setChartData(chartAgg);

      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
      setIsLoading(false);
    }
    fetchDashboardData();
  }, [supabase]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>Özet</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>BerberEskişehir VIP anlık durum raporu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: stat.isPositive ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Kazanç ve Giderler (Son 7 Gün)</h3>
        <div style={{ height: '300px', width: '100%' }}>
          {isLoading ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Yükleniyor...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `₺${val}`} />
                <Tooltip cursor={{fill: '#222'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Kazanç" fill="#2E8B57" radius={[4,4,0,0]} name="Kazanç (Tamamlanan Randevular)" />
                <Bar dataKey="Gider" fill="#B5482E" radius={[4,4,0,0]} name="Gider (Stok Alımları)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Son Randevular */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="heading-md">Son Randevular</h3>
            <Link href="/admin/takvim" style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>Tümünü Gör</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentAppointments.length === 0 ? (
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Henüz randevu yok.</div>
            ) : (
              recentAppointments.map((app, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: i !== recentAppointments.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ background: 'var(--color-surface-2)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                    {format(new Date(app.start_time), 'HH:mm')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{app.customers?.name || 'Bilinmiyor'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{app.services?.name} - {app.status === 'completed' ? '✅' : app.status === 'cancelled' ? '❌' : '⏳'}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {app.barbers?.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hızlı Eylemler */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Hızlı Eylemler</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link href="/admin/takvim" className="btn btn-outline" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>➕</span>
              Yeni Randevu
            </Link>
            <Link href="/admin/inventory" className="btn btn-outline" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</span>
              Stok Ekle
            </Link>
            <Link href="/admin/staff/rota" className="btn btn-outline" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛑</span>
              Vardiya Ekle
            </Link>
            <Link href="/admin/reports" className="btn btn-outline" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</span>
              Detaylı Rapor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
