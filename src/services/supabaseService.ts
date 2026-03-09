import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Storage features will be disabled.');
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

export const supabaseService = {
  uploadReceipt: async (dataUrl: string, filename: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not initialized. Please check your environment variables.');
    }

    try {
      console.log('Converting dataUrl to Blob...');
      // Convert dataUrl to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      console.log('Blob conversion successful. Size:', blob.size);

      console.log(`Uploading to bucket "allreceipt" as "${filename}"...`);
      // Upload to 'allreceipt' bucket
      const { data, error } = await supabase.storage
        .from('allreceipt')
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error details:', error);
        throw error;
      }

      console.log('Upload successful. Data:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('allreceipt')
        .getPublicUrl(filename);

      console.log('Public URL generated:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }
  }
};
