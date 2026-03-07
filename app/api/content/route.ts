import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('studio_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      // Creează inițial dacă nu există
      const initialContent = {
        gallery: Array(6).fill(null).map((_, i) => ({
          id: `gallery-${i}`,
          title: `Fotografie ${i + 1}`,
          caption: `Cadru de prezentare ${i + 1}`,
          imageUrl: '',
        })),
        albums: [],
        photographerPhotos: Array(2).fill(''),
      };

      const { data: newData, error: insertError } = await supabaseServer
        .from('studio_content')
        .insert([{ content: initialContent }])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json(newData.content);
    }

    return NextResponse.json(data.content);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();

    const { data, error } = await supabaseServer
      .from('studio_content')
      .update({ content })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data.content);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
