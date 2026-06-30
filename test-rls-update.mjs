import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  console.log("Attempting to update an appointment...");
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', 'baaad365-a64a-4bc8-a6ab-dea9e2d1fd8a') // Using a known pending appointment ID from previous output
    .select();
    
  console.log("Update Error:", error);
  console.log("Update Data returned (if any):", data);
}

testUpdate();
