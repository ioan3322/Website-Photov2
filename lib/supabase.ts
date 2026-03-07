import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
};

export type AlbumItem = {
  id: string;
  title: string;
  description: string;
  photos: string[];
};

export type StudioContent = {
  gallery: GalleryItem[];
  albums: AlbumItem[];
  photographerPhotos: string[];
};
