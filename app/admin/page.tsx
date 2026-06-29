"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { createClient } from '@/lib/supabase/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, TrendingDown, ShoppingCart, Users, UserPlus,
  ChevronDown, MoreHorizontal, Check, Clock, Calendar as CalendarIcon
} from "lucide-react";

const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isDark = true; // Force dark mode for VIP theme
  const supabase = createClient();

  const [summary, setSummary] = useState({ totalRevenue: 0, revenueChange: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState({ newOrders: 0, orderChange: 0, uniqueVisitors: 0, visitorChange: 0, newUsers: 0, userChange: 0 });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState("");

  useEffect(() => {
    // Set dynamic current month
    const now = new Date();
    setCurrentMonthName(now.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }));

    async function loadDashboard() {
      // Fetch Recent Appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          id, start_time, created_at, status, price,
          customers (id, name, phone)
        `)
        .order('start_time', { ascending: false });

      if (appointments) {
        // Calculate KPIs
        const completedAppointments = appointments.filter(a => a.status === 'completed');
        const totalRevenue = completedAppointments.reduce((acc, curr) => acc + (curr.price || 0), 0);
        
        const uniqueCustomers = new Set(appointments.map(a => {
          const cust = a.customers as any;
          return cust?.id;
        }).filter(Boolean));
        
        setSummary({ totalRevenue, revenueChange: 0 }); // real data, static change for now
        setKpiData({
          newOrders: appointments.length, orderChange: 0,
          uniqueVisitors: uniqueCustomers.size, visitorChange: 0,
          newUsers: uniqueCustomers.size, userChange: 0
        });

        // Set Recent Transactions
        const txs = appointments.slice(0, 10).map(app => {
          const cust = app.customers as any;
          return {
            id: app.id,
            clientName: cust?.name || "Bilinmiyor",
            date: app.start_time,
            createdAt: app.created_at,
            status: app.status
          };
        });
        setRecentTx(txs);

        // Generate Chart Data from real appointments
        const revenueMap: Record<string, number> = {};
        completedAppointments.forEach(app => {
          const dateStr = new Date(app.start_time).toISOString().split('T')[0];
          revenueMap[dateStr] = (revenueMap[dateStr] || 0) + (app.price || 0);
        });

        const sortedDates = Object.keys(revenueMap).sort();
        const generatedRevenue = sortedDates.map(date => ({
          date,
          revenue: revenueMap[date]
        }));
        
        setRevenueData(generatedRevenue.length > 0 ? generatedRevenue : [{ date: now.toISOString().split('T')[0], revenue: 0 }]);
        
        // Fetch expense data from stock_movements (RESTOCK purchases)
        const { data: stockMovements } = await supabase
          .from('stock_movements')
          .select(`quantity, created_at, products (price)`)
          .eq('type', 'RESTOCK');
        
        if (stockMovements && stockMovements.length > 0) {
          const expenseMap: Record<string, number> = {};
          stockMovements.forEach((sm: any) => {
            const dateStr = new Date(sm.created_at).toISOString().split('T')[0];
            const cost = (sm.products?.price || 0) * sm.quantity;
            expenseMap[dateStr] = (expenseMap[dateStr] || 0) + cost;
          });
          const sortedExpenseDates = Object.keys(expenseMap).sort();
          const generatedExpenses = sortedExpenseDates.map(date => ({
            date,
            amount: expenseMap[date]
          }));
          setExpenseData(generatedExpenses.length > 0 ? generatedExpenses : [{ date: now.toISOString().split('T')[0], amount: 0 }]);
        } else {
          setExpenseData([{ date: now.toISOString().split('T')[0], amount: 0 }]);
        }
      } else {
        // Safe 0 defaults
        setSummary({ totalRevenue: 0, revenueChange: 0 });
        setKpiData({ newOrders: 0, orderChange: 0, uniqueVisitors: 0, visitorChange: 0, newUsers: 0, userChange: 0 });
        setRecentTx([]);
        setRevenueData([{ date: now.toISOString().split('T')[0], revenue: 0 }]);
        setExpenseData([{ date: now.toISOString().split('T')[0], amount: 0 }]);
      }
    }
    loadDashboard();
  }, [revenuePeriod]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2 rounded-2xl p-6 bg-[#1c1c1c] text-white shadow-sm border border-[#333]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-300 mb-1">Kazanç</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#d4a853]">{formatCurrency(summary.totalRevenue)}</span>
                <span className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
                  summary.revenueChange >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {summary.revenueChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {summary.revenueChange >= 0 ? "+" : ""}{summary.revenueChange}%
                </span>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a2a2a] border border-[#444] text-sm text-gray-300 hover:bg-[#333] transition-colors focus:ring-2 focus:ring-[#d4a853]"
              >
                <CalendarIcon className="w-4 h-4 text-[#d4a853]" />
                {currentMonthName}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] border border-[#444] rounded-xl shadow-xl z-10 overflow-hidden">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors">Geçen Ay</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-[#d4a853] bg-[#333] transition-colors">Bu Ay</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors">Yılbaşından Bugüne</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a853" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d4a853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickFormatter={(v) => `₺${v}`}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: 12,
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                  itemStyle={{ color: '#d4a853' }}
                  formatter={(value: any) => [formatCurrency(value) as any, "Kazanç"]}
                  labelFormatter={(label: any) => formatDate(label)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4a853"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, fill: "#d4a853", stroke: "#1c1c1c", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* All Expenses Card */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl p-6 bg-[#1c1c1c] text-white shadow-sm border border-[#333]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-300">Giderler</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2a2a] border border-[#444] text-sm text-gray-300 hover:bg-[#333] transition-colors">
              Aylık
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-400">Aylık Rapor</p>
            <p className="text-xs text-[#888]">Performans Analizi</p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-red-400">{formatCurrency(expenseData.reduce((sum, d) => sum + (d.amount || 0), 0))}</span>
            <span className="text-sm text-gray-400">Bu ay toplam gider</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{ fill: "#999", fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₺${v}`}
                />
                <Tooltip
                  cursor={{ fill: '#333' }}
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  itemStyle={{ color: '#ef4444' }}
                  formatter={(value: any) => [formatCurrency(value) as any, "Gider"]}
                  labelFormatter={(label: any) => formatDate(label)}
                />
                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Yeni Randevular", value: kpiData.newOrders, change: kpiData.orderChange, icon: CalendarIcon, color: "#d4a853" },
          { label: "Ziyaretçiler", value: kpiData.uniqueVisitors, change: kpiData.visitorChange, icon: Users, color: "#008dd2" },
          { label: "Yeni Müşteriler", value: kpiData.newUsers, change: kpiData.userChange, icon: UserPlus, color: "#10b981" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-6 border transition-colors bg-[#1c1c1c] border-[#333] shadow-sm hover:border-[#555]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">
                {kpi.label}
              </span>
              <button className="p-1.5 rounded hover:bg-[#2a2a2a] transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {kpi.value}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Geçen haftaya göre
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.change >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {kpi.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: kpi.color + "15" }}>
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions Table */}
      <motion.div
        custom={5}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border overflow-hidden transition-colors bg-[#1c1c1c] border-[#333] shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#333]">
          <h3 className="text-lg font-semibold text-white">
            Son Randevular
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border border-[#444] bg-[#2a2a2a] text-gray-300 hover:bg-[#333]">
            En Yeni
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wider border-[#333] bg-[#222] text-[#888]">
                <th className="px-6 py-4">Müşteri</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Saat</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {recentTx.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="transition-colors hover:bg-[#2a2a2a]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-[#d4a853] text-black shadow-inner">
                        {tx.clientName.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-200">
                          {tx.clientName}
                        </span>
                        <span className="block text-xs text-gray-500">VIP Müşteri</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300 font-medium">
                      {new Date(tx.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-400 bg-[#333] px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                      tx.status === "completed"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : tx.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {tx.status === "completed" && <Check className="w-3 h-3" />}
                      {tx.status === "pending" && <Clock className="w-3 h-3" />}
                      {tx.status === "completed" ? "Tamamlandı" : tx.status === "pending" ? "Bekliyor" : "İptal Edildi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-[#333] transition-colors border border-transparent hover:border-[#444]">
                      <MoreHorizontal className="w-4 h-4 text-[#888]" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
