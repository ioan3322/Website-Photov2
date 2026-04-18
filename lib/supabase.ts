import { createBrowserClient } from '@supabase/ssr';
import { createNoopSupabaseClient, readSupabaseEnv, resolveSupabaseKey } from '@/lib/supabase-helpers';

const env = readSupabaseEnv();
const supabaseUrl = env.hasValidUrl ? env.url : '';
const supabaseKey = resolveSupabaseKey({ env });

export const supabase = supabaseUrl && supabaseKey
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : createNoopSupabaseClient('[lib/supabase]');

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  showOnHome?: boolean;
};

export type AlbumItem = {
  id: string;
  title: string;
  description: string;
  photos: string[];
  showOnHome?: boolean;
};

export type PackageItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  showOnPolicies?: boolean;
};

export type StudioContent = {
  gallery: GalleryItem[];
  albums: AlbumItem[];
  photographerPhotos: string[];
  packages: PackageItem[];
};
