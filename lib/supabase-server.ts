import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from '@/lib/supabase-helpers';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const env = readSupabaseEnv();
    const supabaseUrl = env.hasValidUrl ? env.url : '';
    const serverKey = resolveSupabaseKey({ preferServiceRole: true, env });

    if (!supabaseUrl || !serverKey) {
      console.error('[supabase-server] Missing or invalid environment variables', {
        hasUrl: env.hasValidUrl,
        hasServiceRoleKey: env.hasValidServiceRoleKey,
        hasAnonKey: env.hasValidAnonKey,
      });

      cachedClient = createNoopSupabaseClient('[supabase-server]') as unknown as SupabaseClient;
      return cachedClient;
    }

    cachedClient = createClient(supabaseUrl, serverKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    return cachedClient;
  } catch (error) {
    console.error('[supabase-server] Failed to initialize server client', error);
    cachedClient = createNoopSupabaseClient('[supabase-server]') as unknown as SupabaseClient;
    return cachedClient;
  }
}
