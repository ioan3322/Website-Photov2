import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

const CONTENT_FILE = join(process.cwd(), 'data', 'studio-content.json');

const defaultContent = {
  gallery: Array(6).fill(null).map((_, i) => ({
    id: `gallery-${i}`,
    title: `Fotografie ${i + 1}`,
    caption: `Cadru de prezentare ${i + 1}`,
    imageUrl: '',
  })),
  albums: [],
  photographerPhotos: Array(2).fill(''),
};

async function readLocalContent() {
  try {
    const raw = await readFile(CONTENT_FILE, 'utf8');
    return JSON.parse(raw) as typeof defaultContent;
  } catch {
    return defaultContent;
  }
}

async function writeLocalContent(content: typeof defaultContent) {
  await mkdir(dirname(CONTENT_FILE), { recursive: true });
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

export async function GET() {
  try {
    const supabaseServer = getSupabaseServerClient();

    const { data, error } = await supabaseServer
      .from('studio_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      const localContent = await readLocalContent();
      return NextResponse.json(localContent);
    }

    if (!data) {
      await writeLocalContent(defaultContent);

      const { data: newData, error: insertError } = await supabaseServer
        .from('studio_content')
        .insert([{ content: defaultContent }])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(defaultContent);
      }

      return NextResponse.json(newData.content);
    }

    return NextResponse.json(data.content);
  } catch (error) {
    const localContent = await readLocalContent();
    return NextResponse.json(localContent);
  }
}

export async function POST(request: NextRequest) {
  let content: typeof defaultContent | null = null;

  try {
    const supabaseServer = getSupabaseServerClient();
    const parsedContent = (await request.json()) as typeof defaultContent;
    content = parsedContent;

    await writeLocalContent(parsedContent);

    const { data, error } = await supabaseServer
      .from('studio_content')
      .update({ content: parsedContent })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      return NextResponse.json(parsedContent);
    }

    return NextResponse.json(data.content);
  } catch (error) {
    if (content) {
      return NextResponse.json(content);
    }

    return NextResponse.json(defaultContent);
  }
}
