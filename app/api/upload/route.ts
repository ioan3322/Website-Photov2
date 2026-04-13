import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

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

export async function POST(request: NextRequest) {
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
      const isMissingBucket = /bucket.*not\s*found/i.test(uploadError.message);

      const localUrl = await saveFileLocally(fileValue, objectPath);

      if (isMissingBucket) {
        return NextResponse.json(
          {
            url: localUrl,
            path: objectPath,
            bucket: 'local-fallback',
            warning:
              `Bucket not found: "${bucket}". Imaginea a fost salvata local in /public/uploads. ` +
              'Configureaza Supabase Storage pentru persistenta in productie.',
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          url: localUrl,
          path: objectPath,
          bucket: 'local-fallback',
          warning:
            `Upload to Supabase failed (${uploadError.message}). Imaginea a fost salvata local in /public/uploads.`,
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
    const isFetchFailure = /fetch failed/i.test(message);

    if (request.method === 'POST') {
      try {
        const formData = await request.clone().formData();
        const fileValue = formData.get('file');
        const folderValue = formData.get('folder');
        const fileNameValue = formData.get('fileName');

        if (fileValue instanceof File) {
          const folder = typeof folderValue === 'string' && folderValue.trim().length > 0
            ? folderValue.trim()
            : 'general';

          const preferredName = typeof fileNameValue === 'string' && fileNameValue.trim().length > 0
            ? fileNameValue.trim()
            : getBaseName(fileValue.name);
          const ext = getFileExtension(fileValue.name);
          const safeName = slugifyFileName(preferredName) || 'image';
          const objectPath = `${folder}/${safeName}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const localUrl = await saveFileLocally(fileValue, objectPath);

          return NextResponse.json(
            {
              url: localUrl,
              path: objectPath,
              bucket: 'local-fallback',
              warning: isFetchFailure
                ? 'Conexiunea catre Supabase a esuat. Imaginea a fost salvata local in /public/uploads.'
                : `Upload fallback local after error: ${message}`,
            },
            { status: 200 },
          );
        }
      } catch {
        // Fall through to the original error response.
      }
    }

    if (isFetchFailure) {
      return NextResponse.json(
        {
          error:
            'Conexiunea catre Supabase a esuat (fetch failed). Imaginea a fost salvata local in /public/uploads.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
