import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dimension = searchParams.get('dimension') || 'SHOP';

    // Fetch completed appointments with joined data
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, price, status, start_time,
        barbers (id, name),
        services (id, name, category),
        customers (id, name)
      `)
      .eq('status', 'completed');

    if (error) throw error;

    const colors = ["#B5482E", "#1C1B1A", "#C28A2E", "#9CA3AA", "#2E8B57", "#4682B4", "#D2691E"];
    const rows: any[] = [];
    const groupMap: Record<string, any> = {};

    (appointments || []).forEach((app: any) => {
      let key = "Diğer";
      if (dimension === "SHOP") key = "Berber Eskişehir VIP";
      else if (dimension === "BARBER") key = app.barbers?.name || "Bilinmiyor";
      else if (dimension === "SERVICE") key = app.services?.name || "Bilinmiyor";
      else if (dimension === "BOOKING_TYPE") key = app.source || "Online";
      else if (dimension === "CUSTOMERS") key = "Tamamlanmış";

      if (!groupMap[key]) {
        groupMap[key] = { total: 0, count: 0, customers: new Set() };
      }
      groupMap[key].total += Number(app.price) || 0;
      groupMap[key].count += 1;
      if (app.customers?.id) groupMap[key].customers.add(app.customers.id);
    });

    let colorIdx = 0;
    let grandTotal = 0;

    Object.entries(groupMap).forEach(([key, val]) => {
      grandTotal += val.total;
      rows.push({
        groupKey: key,
        groupColor: colors[colorIdx % colors.length],
        total: val.total,
        cancelled: 0,
        noShow: 0,
        customers: val.customers.size,
        avgTicket: val.count > 0 ? Math.round(val.total / val.count) : 0,
        hoursSold: 0,
        newSignups: 0,
      });
      colorIdx++;
    });

    // If no data, return empty with proper structure
    if (rows.length === 0) {
      return NextResponse.json({
        dimension,
        rows: [],
        grandTotal: { groupKey: "Genel Toplam", groupColor: "#000", total: 0, cancelled: 0, noShow: 0, customers: 0, avgTicket: 0, hoursSold: 0, newSignups: 0 },
        dateRange: { from: new Date().toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] }
      });
    }

    return NextResponse.json({
      dimension,
      rows,
      grandTotal: {
        groupKey: "Genel Toplam",
        groupColor: "#000000",
        total: grandTotal,
        cancelled: 0,
        noShow: 0,
        customers: rows.reduce((acc, r) => acc + (r.customers ?? 0), 0),
        avgTicket: rows.length > 0 ? Math.round(grandTotal / rows.reduce((acc, r) => acc + (r.customers || 1), 0)) : 0,
        hoursSold: 0,
        newSignups: 0,
      },
      dateRange: { from: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] }
    });
  } catch (err: any) {
    console.error('Reports table error:', err);
    return NextResponse.json({ error: 'Beklenmeyen hata' }, { status: 500 });
  }
}
