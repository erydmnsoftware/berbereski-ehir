import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', '63402b50-496c-4114-8213-f55c23fc276f');
    
  console.log("Error:", error);
  console.log("Data:", data);
}

testUpdate();
