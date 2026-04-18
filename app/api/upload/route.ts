import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { isAdminAuthenticatedRequest } from '@/lib/admin-auth';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_BUCKET = 'studio-images';

function slugifyFileName(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function getFileExtension(filename: string) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

function getBaseName(filename: string) {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex <= 0) {
    return filename;
  }

  return filename.slice(0, dotIndex);
}

async function saveFileLocally(fileValue: File, objectPath: string) {
  const localPath = join(process.cwd(), 'public', 'uploads', objectPath);
  await mkdir(dirname(localPath), { recursive: true });
  const buffer = Buffer.from(await fileValue.arrayBuffer());
  await writeFile(localPath, buffer);
  return `/uploads/${objectPath.replace(/\\/g, '/')}`;
}

function isProd() {
  return process.env.NODE_ENV === 'production';
}

export async function POST(request: NextRequest) {
  console.info('[api/upload][POST] request received');

  if (!isAdminAuthenticatedRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const formData = await request.formData();
    const fileValue = formData.get('file');
    const folderValue = formData.get('folder');
    const fileNameValue = formData.get('fileName');

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
    }

    if (!fileValue.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const folder = typeof folderValue === 'string' && folderValue.trim().length > 0
      ? folderValue.trim()
      : 'general';

    const preferredName = typeof fileNameValue === 'string' && fileNameValue.trim().length > 0
      ? fileNameValue.trim()
      : getBaseName(fileValue.name);

    const ext = getFileExtension(fileValue.name);
    const safeName = slugifyFileName(preferredName) || 'image';
    const objectPath = `${folder}/${safeName}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bucket =
      process.env.SUPABASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
      DEFAULT_BUCKET;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, fileValue, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileValue.type,
      });

    if (uploadError) {
      console.error('[api/upload][POST] Supabase upload failed', {
        bucket,
        message: uploadError.message,
      });

      if (isProd()) {
        return NextResponse.json(
          {
            error:
              `Upload failed in Supabase Storage (${uploadError.message}). ` +
              'Configure SUPABASE_STORAGE_BUCKET and ensure the bucket exists and is public.',
          },
          { status: 500 },
        );
      }

      const localUrl = await saveFileLocally(fileValue, objectPath);

      return NextResponse.json(
        {
          url: localUrl,
          path: objectPath,
          bucket: 'local-fallback',
          warning:
            `Upload to Supabase failed (${uploadError.message}). Saved locally in /public/uploads (development only).`,
        },
        { status: 200 },
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

    if (!data.publicUrl) {
      return NextResponse.json({ error: 'Failed to generate public URL.' }, { status: 500 });
    }

    return NextResponse.json({
      url: data.publicUrl,
      path: objectPath,
      bucket,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[api/upload][POST] Unhandled exception', error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
