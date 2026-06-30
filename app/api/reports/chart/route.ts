export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, addDays } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = searchParams.get('metric') || 'TOTAL_SALES';
    const dimension = searchParams.get('dimension') || 'SHOP';

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, price, status, start_time,
        barbers (id, name),
        services (id, name)
      `)
      .eq('status', 'completed');

    if (error) throw error;

    const colors = ["#B5482E", "#1C1B1A", "#C28A2E", "#9CA3AA", "#2E8B57", "#4682B4", "#D2691E"];
    const points: any[] = [];
    const seriesSet = new Set<string>();

    (appointments || []).forEach((app: any) => {
      let groupKey = "Berber Eskişehir VIP";
      if (dimension === "BARBER") groupKey = app.barbers?.name || "Bilinmiyor";
      else if (dimension === "SERVICE") groupKey = app.services?.name || "Bilinmiyor";

      seriesSet.add(groupKey);
      const dateStr = new Date(app.start_time).toISOString().split('T')[0];
      points.push({
        date: dateStr,
        groupKey,
        value: Number(app.price) || 0,
      });
    });

    // Aggregate points by date+groupKey
    const aggMap: Record<string, number> = {};
    points.forEach(p => {
      const key = `${p.date}|${p.groupKey}`;
      aggMap[key] = (aggMap[key] || 0) + p.value;
    });

    const aggregatedPoints = Object.entries(aggMap).map(([key, value]) => {
      const [date, groupKey] = key.split('|');
      return { date, groupKey, value };
    });

    const seriesArray = Array.from(seriesSet);
    const series = seriesArray.map((key, i) => ({ groupKey: key, color: colors[i % colors.length] }));

    return NextResponse.json({
      metric,
      granularity: "DAILY",
      points: aggregatedPoints,
      series
    });
  } catch (err: any) {
    console.error('Reports chart error:', err);
    return NextResponse.json({ error: 'Beklenmeyen hata' }, { status: 500 });
  }
}
