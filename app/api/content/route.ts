import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONTENT_FILE = join(process.cwd(), 'data', 'studio-content.json');

const defaultContent = {
  gallery: [],
  albums: [],
  photographerPhotos: [],
};

async function readLocalContent() {
  if (process.env.NODE_ENV === 'production') {
    return defaultContent;
  }

  try {
    const raw = await readFile(CONTENT_FILE, 'utf8');
    return JSON.parse(raw) as typeof defaultContent;
  } catch {
    return defaultContent;
  }
}

async function writeLocalContent(content: typeof defaultContent) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  await mkdir(dirname(CONTENT_FILE), { recursive: true });
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

export async function GET() {
  console.info('[api/content][GET] request received');

  try {
    const supabaseServer = getSupabaseServerClient();

    const { data, error } = await supabaseServer
      .from('studio_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[api/content][GET] Supabase select failed', {
        code: error.code,
        message: error.message,
      });

      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Failed to fetch content from database.' },
          { status: 500 },
        );
      }

      const localContent = await readLocalContent();
      return NextResponse.json(localContent, { status: 200 });
    }

    if (!data) {
      await writeLocalContent(defaultContent);

      const { data: newData, error: insertError } = await supabaseServer
        .from('studio_content')
        .upsert([{ id: 1, content: defaultContent }], { onConflict: 'id' })
        .select()
        .single();

      if (insertError) {
        console.error('[api/content][GET] Supabase upsert failed', {
          code: insertError.code,
          message: insertError.message,
        });

        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'Failed to initialize content in database.' },
            { status: 500 },
          );
        }

        return NextResponse.json(defaultContent, { status: 200 });
      }

      return NextResponse.json(newData.content);
    }

    return NextResponse.json(data.content);
  } catch (error) {
    console.error('[api/content][GET] Unhandled exception', error);

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unhandled server error.' }, { status: 500 });
    }

    const localContent = await readLocalContent();
    return NextResponse.json(localContent, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  console.info('[api/content][POST] request received');

  let content: typeof defaultContent | null = null;

  try {
    const supabaseServer = getSupabaseServerClient();
    const parsedContent = (await request.json()) as typeof defaultContent;
    content = parsedContent;

    await writeLocalContent(parsedContent);

    const { data, error } = await supabaseServer
      .from('studio_content')
      .upsert([{ id: 1, content: parsedContent }], { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[api/content][POST] Supabase upsert failed', {
        code: error.code,
        message: error.message,
      });

      return NextResponse.json(
        { error: 'Failed to persist content to database.' },
        { status: 500 },
      );
    }

    return NextResponse.json(data.content);
  } catch (error) {
    console.error('[api/content][POST] Unhandled exception', error);

    if (content && process.env.NODE_ENV !== 'production') {
      return NextResponse.json(content, { status: 200 });
    }

    return NextResponse.json({ error: 'Unhandled server error.' }, { status: 500 });
  }
}
