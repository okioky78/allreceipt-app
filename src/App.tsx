import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { ReceiptForm } from './components/ReceiptForm';
import { Receipt } from './constants';
import { extractReceiptData } from './services/geminiService';
import { storageService } from './services/storageService';
import { optimizeImage } from './utils/imageOptimizer';
import { Loader2, Plus, Receipt as ReceiptIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Receipt> | null>(null);

  const handleCapture = async (base64: string) => {
    setIsLoading(true);
    try {
      // Optimize image before sending to API
      const optimizedBase64 = await optimizeImage(base64);
      
      const data = await extractReceiptData(optimizedBase64);
      if (data) {
        setExtractedData({
          ...data,
          image_url: optimizedBase64
        });
      } else {
        alert('영수증 정보를 읽을 수 없습니다. 직접 입력해주세요.');
        setExtractedData({ image_url: optimizedBase64 });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setExtractedData({ image_url: base64 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Receipt) => {
    try {
      storageService.saveReceipt(data);
      setExtractedData(null);
      alert('영수증이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save receipt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Supabase Warning */}
      {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-sm text-amber-700 font-medium">
            ⚠️ 슈퍼베이스 설정이 누락되었습니다. Secrets에서 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해 주세요.
          </p>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => {
              setExtractedData(null);
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
              <ReceiptIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">영수증 관리</h1>
          </button>
          
          <nav className="flex items-center gap-4 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/50 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setExtractedData(null);
              }}
              className="flex items-center justify-center w-12 h-11 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer bg-white shadow-md text-zinc-900 border border-zinc-100"
            >
              <Plus className="w-6 h-6 text-blue-600" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {!extractedData && !isLoading && (
              <div className="space-y-6">
                <div className="text-center space-y-8 py-12">
                  <h2 className="text-5xl md:text-6xl font-black text-[#2563EB] tracking-tight">
                    영수증(지출증빙) 등록 시스템
                  </h2>
                  <div className="space-y-6">
                    <p className="text-2xl font-medium text-zinc-500 max-w-lg mx-auto leading-relaxed">
                      사용하신 영수증 이미지를 업로드 하세요.
                    </p>
                    <div className="bg-[#EFF6FF] px-10 py-6 rounded-[32px] text-lg text-zinc-500 inline-block text-left border border-blue-100/50 shadow-sm">
                      <ul className="space-y-2 list-disc list-inside">
                        <li>회사카드 사용 = <span className="font-bold text-[#2563EB]">카드</span></li>
                        <li>개인카드 사용 = <span className="font-bold text-[#2563EB]">이체</span>로 등록하시고 사용내용에 입금받을 계좌를 작성하세요.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <CameraCapture onCapture={handleCapture} />
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-zinc-900 animate-spin" />
                <p className="text-zinc-600 font-medium">영수증 정보를 분석하고 있습니다...</p>
              </div>
            )}

            {extractedData && !isLoading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">정보 확인</h2>
                  <button
                    onClick={() => setExtractedData(null)}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    취소
                  </button>
                </div>
                
                <ReceiptForm
                  initialData={extractedData}
                  onSave={handleSave}
                  onCancel={() => setExtractedData(null)}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
