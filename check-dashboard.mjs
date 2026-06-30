import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDashboard() {
  const last7Days = Array.from({length: 7}).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, 'yyyy-MM-dd');
  });
  console.log("last7Days:", last7Days);

  const { data: completedAppts, error } = await supabase
    .from('appointments')
    .select('start_time, price, status')
    .eq('status', 'completed')
    .gte('start_time', subDays(new Date(), 7).toISOString());

  console.log("Error:", error);
  console.log("completedAppts:", JSON.stringify(completedAppts, null, 2));

  const chartAgg = last7Days.map(dateStr => {
    const dayEarnings = (completedAppts || [])
      .filter(a => a.start_time.startsWith(dateStr))
      .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    return {
      dateStr,
      Kazanc: dayEarnings
    };
  });

  console.log("ChartAgg:", chartAgg);
}

checkDashboard();
