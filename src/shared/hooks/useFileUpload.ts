'use client';

import { useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';

interface UploadResult {
  url: string;
  path: string;
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, folder?: string) => Promise<UploadResult | null>;
  uploadFiles: (files: File[], folder?: string) => Promise<UploadResult[]>;
  deleteFile: (path: string) => Promise<boolean>;
  isConfigured: boolean;
}

const BUCKET_NAME = 'calendar-media';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const uploadFile = useCallback(async (file: File, folder = 'uploads'): Promise<UploadResult | null> => {
    if (!isSupabaseConfigured()) {
      setError('File upload is not configured. Please contact support.');
      return null;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const supabase = getSupabase();

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'file';
      const fileName = `${folder}/${timestamp}-${randomId}.${extension}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(100);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[], folder = 'uploads'): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(Math.round((i / files.length) * 100));

      const result = await uploadFile(file, folder);
      if (result) {
        results.push(result);
      }
    }

    setProgress(100);
    return results;
  }, [uploadFile]);

  const deleteFile = useCallback(async (path: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('File delete is not configured. Please contact support.');
      return false;
    }

    try {
      const supabase = getSupabase();
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      return false;
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadFiles,
    deleteFile,
    isConfigured,
  };
}
