import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0; // Disable cache for real-time data

export async function GET() {
  try {
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (servicesError) throw servicesError;

    const { data: barbers, error: barbersError } = await supabase
      .from('barbers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (barbersError) throw barbersError;

    return NextResponse.json({ services, barbers });
  } catch (error) {
    console.error("API Error (bilgi):", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
