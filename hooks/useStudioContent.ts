import { useState, useEffect, useCallback } from 'react';
import type { StudioContent } from '@/lib/supabase';

const STORAGE_KEY = 'babyStudioContentV2';

const defaultContent: StudioContent = {
  gallery: [],
  albums: [],
  photographerPhotos: [],
};

export function useStudioContent() {
  const [content, setContent] = useState<StudioContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content from API or localStorage
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        // Try to fetch from API first
        try {
          const response = await fetch('/api/content');
          if (response.ok) {
            const data = await response.json();
            setError(null);
            setContent(data);
            return;
          }
        } catch {
          console.log('API not available, using localStorage fallback');
        }

        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setError(null);
            setContent(JSON.parse(stored));
            return;
          }
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Save content to API and/or localStorage
  const saveContent = useCallback(async (newContent: StudioContent) => {
    try {
      setContent(newContent);

      // Always save to localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      }

      // Always try to persist remotely so content stays in sync across devices.
      try {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContent),
        });

        if (!response.ok) {
          console.warn('Failed to save to database, local backup kept');
        }
      } catch (apiErr) {
        console.warn('API error while saving, local backup kept:', apiErr);
      }

      return newContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error saving content:', err);
      throw err;
    }
  }, []);

  return { content, loading, error, saveContent, setContent };
}
