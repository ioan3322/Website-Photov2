# Ghid Configurare Supabase

## Pasul 1: Creează Supabase Project
1. Mergi la https://supabase.com
2. Click "Start your project"
3. Sign in cu GitHub
4. Click "New project"
5. Denumește-l "baby-studio"
6. Pentru parolă, generează una sigură
7. Click "Create new project" și așteaptă 2-3 minute

## Pasul 2: Creează Tabelul în Supabase
1. În Supabase dashboard, click "SQL Editor" din stânga
2. Click "New query"
3. Paste acest cod SQL:

```sql
CREATE TABLE studio_content (
  id BIGINT PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT only_one_row CHECK (id = 1)
);

-- Permite lipsa autentificării (pentru aplicația publică)
ALTER TABLE studio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON studio_content FOR SELECT
  USING (true);

CREATE POLICY "Allow public write"
  ON studio_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public insert"
  ON studio_content FOR INSERT
  WITH CHECK (true);
```

4. Click "Run"

## Pasul 2.1: Creează Bucket Pentru Imagini
1. În Supabase dashboard, mergi la **Storage**
2. Creează un bucket nou cu numele `studio-images`
3. Setează bucket-ul ca **Public**

Rulează apoi în SQL Editor aceste politici pentru upload/public read:

```sql
-- Permite acces la storage.objects pentru bucket-ul studio-images
drop policy if exists "Public can view studio images" on storage.objects;
drop policy if exists "Public can upload studio images" on storage.objects;

create policy "Public can view studio images"
on storage.objects for select
to public
using (bucket_id = 'studio-images');

create policy "Public can upload studio images"
on storage.objects for insert
to public
with check (bucket_id = 'studio-images');
```

Alternativ (mai sigur pentru API): folosește cheia `SUPABASE_SERVICE_ROLE_KEY` în `.env.local`.
În acest caz, upload-ul din API trece prin service role și nu mai depinde de politica `insert` pentru utilizatorii anonimi.

## Pasul 3: Copiază Credențialele
1. Click "Settings" (rotița) din stânga jos
2. Click "API"
3. Copie:
   - **Project URL** → NEXT_PUBLIC_SUPABASE_URL
   - **anon public** key (din "Project API keys") → NEXT_PUBLIC_SUPABASE_ANON_KEY

## Pasul 4: Creează .env.local
1. În rădăcina proiectului, creează fișier `.env.local`
2. Paste-ază valorile:

```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=studio-images
```

## Pasul 5: Testează
1. Run: `npm run dev`
2. Mergi la http://localhost:3000
3. Admin panel la http://localhost:3000/admin
4. Datele vor fi salvate în baza de date!

## Pasul 6: Deploy pe Vercel
1. Mergi la https://vercel.com
2. Import your GitHub repo
3. Adaugă environment variables în Settings:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy!
