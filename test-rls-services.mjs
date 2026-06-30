import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data, error } = await supabase
    .from('services')
    .update({ price: 300 })
    .eq('id', 'ae22eafc-8880-4537-9272-83340eb98980')
    .select();
    
  console.log("Error:", error);
  console.log("Data:", data);
}

testUpdate();
