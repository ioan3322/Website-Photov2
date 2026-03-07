import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

const DEFAULT_BUCKET = 'studio-images';

function getFileExtension(filename: string) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileValue = formData.get('file');
    const folderValue = formData.get('folder');

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
    }

    if (!fileValue.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const folder = typeof folderValue === 'string' && folderValue.trim().length > 0
      ? folderValue.trim()
      : 'general';

    const ext = getFileExtension(fileValue.name);
    const objectPath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bucket =
      process.env.SUPABASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
      DEFAULT_BUCKET;

    const { error: uploadError } = await supabaseServer.storage
      .from(bucket)
      .upload(objectPath, fileValue, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileValue.type,
      });

    if (uploadError) {
      const isMissingBucket = /bucket.*not\s*found/i.test(uploadError.message);
      const isRlsError = /row-level security policy|violates row-level security policy/i.test(
        uploadError.message,
      );

      if (isMissingBucket) {
        return NextResponse.json(
          {
            error:
              `Bucket not found: "${bucket}". Creeaza bucket-ul in Supabase Storage ` +
              'sau seteaza variabila SUPABASE_STORAGE_BUCKET / NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET cu numele corect.',
          },
          { status: 400 },
        );
      }

      if (isRlsError) {
        return NextResponse.json(
          {
            error:
              `Upload blocat de RLS pentru bucket-ul "${bucket}". ` +
              'Seteaza SUPABASE_SERVICE_ROLE_KEY in .env.local (recomandat) ' +
              'sau adauga politici INSERT pe storage.objects pentru acest bucket.',
          },
          { status: 403 },
        );
      }

      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseServer.storage.from(bucket).getPublicUrl(objectPath);

    if (!data.publicUrl) {
      return NextResponse.json({ error: 'Failed to generate public URL.' }, { status: 500 });
    }

    return NextResponse.json({
      url: data.publicUrl,
      path: objectPath,
      bucket,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
