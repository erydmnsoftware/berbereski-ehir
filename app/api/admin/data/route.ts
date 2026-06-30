export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const type = searchParams.get('type');

    if (type === 'barbers') {
      const { data } = await supabase.from('barbers').select('*');
      return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    if (type === 'services') {
      const { data } = await supabase.from('services').select('*');
      return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    if (type === 'customers') {
      const { data } = await supabase
        .from('customers')
        .select(`
          *,
          appointments (
            id, start_time, status, price, services (name)
          )
        `)
        .order('created_at', { ascending: false });
      return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    if (type === 'appointments') {
      let query = supabase.from('appointments').select(`
        id, start_time, created_at, status, price, barber_id, service_id,
        customers (id, name, phone)
      `).order('start_time', { ascending: false });
      if (start) query = query.gte('start_time', start);
      if (end) query = query.lte('start_time', end);
      
      const { data } = await query;
      return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    if (type === 'stock_movements') {
      const { data } = await supabase.from('stock_movements').select(`quantity, created_at, type, products (price)`).eq('type', 'RESTOCK');
      return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    return NextResponse.json({ error: 'Geçersiz type' }, { status: 400 });
  } catch (error: any) {
    console.error('API /admin/data hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
