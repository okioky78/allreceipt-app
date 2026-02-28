import { Receipt } from '../constants';

const STORAGE_KEY = 'receipts_data';

export const storageService = {
  getReceipts: (): Receipt[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveReceipt: (receipt: Receipt): Receipt => {
    const receipts = storageService.getReceipts();
    // Remove the large image data before saving to localStorage to save space
    // We only keep the metadata since the image is uploaded to Supabase
    const { image_url, document_image, ...metadata } = receipt;
    
    const newReceipt = {
      ...metadata,
      id: Date.now(),
      created_at: new Date().toISOString()
    } as any;

    receipts.unshift(newReceipt);
    
    // Keep only the last 20 receipts in local storage to prevent quota issues
    const limitedReceipts = receipts.slice(0, 20);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedReceipts));
    } catch (e) {
      console.warn('LocalStorage full, clearing all data to make room...');
      localStorage.clear(); // Clear everything if it's stuck
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newReceipt]));
    }
    
    return newReceipt;
  },

  deleteReceipt: (id: number): void => {
    const receipts = storageService.getReceipts();
    const filtered = receipts.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getCountByDate: (date: string): number => {
    const receipts = storageService.getReceipts();
    return receipts.filter(r => r.date === date).length;
  }
};
