import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from('photos').upload(fileName, file);
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from('photos').getPublicUrl(fileName);

  return publicUrl;
}

export async function updateProjectStatus(
  projectId: string,
  updates: Record<string, unknown>
) {
  const { error, data } = await supabaseAdmin
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw new Error(`Update failed: ${error.message}`);
  return data;
}

export async function getProjectsByUser(userId: string) {
  const { error, data } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch projects failed: ${error.message}`);
  return data;
}

export async function getProjectBySessionId(sessionId: string) {
  const { error, data } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error) throw new Error(`Fetch project failed: ${error.message}`);
  return data;
}
