import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      appointments (
        id, start_time, status, price, services (name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) console.error("Error:", error);
  console.log("Customers with appts:", JSON.stringify(data, null, 2));
}

checkData();
