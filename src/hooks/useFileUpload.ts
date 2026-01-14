'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

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
}

const BUCKET_NAME = 'calendar-media';

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, folder = 'uploads'): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

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
    try {
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
  };
}
