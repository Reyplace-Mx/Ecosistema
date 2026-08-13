import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKeyRaw = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

const supabaseUrl = isValidUrl(supabaseUrlRaw) ? supabaseUrlRaw : 'https://placeholder.supabase.co';
const supabaseAnonKey = supabaseAnonKeyRaw || 'placeholder';

if (!isValidUrl(supabaseUrlRaw) || !supabaseAnonKeyRaw) {
  console.warn(
    'Faltan las variables de entorno de Supabase, o la URL es inválida (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Usando un cliente simulado (placeholder).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
