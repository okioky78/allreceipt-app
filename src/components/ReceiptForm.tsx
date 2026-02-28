import React, { useState, useRef } from 'react';
import { BUSINESS_UNITS, PAYMENT_METHODS, Receipt } from '../constants';
import { storageService } from '../services/storageService';
import { supabaseService } from '../services/supabaseService';
import { Save, RotateCcw, FileText, Download, Calendar as CalendarIcon, Image as ImageIcon, CloudUpload, Loader2 } from 'lucide-react';
import { domToJpeg } from 'modern-screenshot';
import { ReceiptDocument } from './ReceiptDocument';

interface ReceiptFormProps {
  initialData: Partial<Receipt>;
  onSave: (data: Receipt) => void;
  onCancel: () => void;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Receipt>({
    date: initialData.date || new Date().toISOString().split('T')[0],
    place: initialData.place || '',
    amount: initialData.amount || 0,
    business_unit: initialData.business_unit || BUSINESS_UNITS[0],
    payment_method: initialData.payment_method || PAYMENT_METHODS[0],
    user: initialData.user || '',
    approval_date: initialData.approval_date || new Date().toISOString().split('T')[0],
    approver: initialData.approver || '',
    usage_purpose: initialData.usage_purpose || '',
    image_url: initialData.image_url || '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : value
    }));
  };

  const generateAndDownload = async () => {
    if (!documentRef.current) return null;
    
    try {
      // Wait for any pending renders to settle
      await new Promise(resolve => setTimeout(resolve, 1500));

      const dataUrl = await domToJpeg(documentRef.current, {
        quality: 0.8,
        scale: 1, // Changed from 1.5 to 1 as requested
        backgroundColor: '#ffffff',
      });
      
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0') + 
                     now.getSeconds().toString().padStart(2, '0');
      
      const unitMap: Record<string, string> = {
        "그린섬": "green",
        "디자인": "design",
        "목동": "MD",
        "강남": "KN",
        "분당": "BD",
        "강프리어": "Kfreer",
        "홍프리어": "Hfreer",
        "애니섬": "ani",
        "미잼": "allsum",
        "미엔": "mi",
        "하이섬": "hi"
      };
      
      const unitCode = unitMap[formData.business_unit] || formData.business_unit;
      const filename = `${unitCode}_${formData.date}_${timeStr}.jpg`;

      setGeneratedDataUrl(dataUrl);
      setGeneratedFilename(filename);

      // Download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return dataUrl;
    } catch (error: any) {
      console.error('Error generating document:', error);
      alert(`이미지 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}\n다시 시도해 주세요.`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSupabaseUpload = async () => {
    if (!generatedDataUrl || !generatedFilename) {
      alert('먼저 이미지를 생성해 주세요.');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting upload to Supabase...');
      await supabaseService.uploadReceipt(generatedDataUrl, generatedFilename);
      console.log('Successfully uploaded to Supabase');
      alert(`슈퍼베이스 업로드 성공: ${generatedFilename}`);
    } catch (uploadError: any) {
      console.error('Supabase upload failed:', uploadError);
      alert(`슈퍼베이스 업로드 실패: ${uploadError.message || '알 수 없는 오류'}\n\n폴더(Bucket) 이름이 'receipts'인지, 그리고 권한(Policy) 설정이 완료되었는지 확인해 주세요.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Give UI time to show loading state before heavy capture work
      await new Promise(resolve => setTimeout(resolve, 100));
      await generateAndDownload();
    } catch (error) {
      console.error('Error in handleGenerate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    if (generatedDataUrl) {
      onSave({ ...formData, document_image: generatedDataUrl });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Left Column: Form */}
      <div className="flex-1 w-full space-y-8">
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 space-y-10">
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">데이터 확인</h2>

          <div className="space-y-8">
            {/* Business Unit Grid */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">사업장</label>
              <div className="grid grid-cols-3 gap-3">
                {BUSINESS_UNITS.map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, business_unit: unit }))}
                    className={`py-4 rounded-2xl font-bold transition-all duration-300 ${
                      formData.business_unit === unit
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                        : 'bg-white text-zinc-500 border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Amount */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">일자</label>
                <div className="relative group">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-6 pr-12 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-zinc-700 text-lg"
                  />
                  <CalendarIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">금액</label>
                <div className="relative">
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount.toLocaleString()}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, amount: parseInt(val) || 0 }));
                    }}
                    className="w-full px-8 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-blue-600 text-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Place */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">상호명</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="상호명을 입력하세요"
                className="w-full px-8 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-zinc-700 text-lg"
              />
            </div>

            {/* Usage Classification (Payment Method) */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">사용 구분</label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, payment_method: method }))}
                    className={`py-4 rounded-2xl font-bold transition-all duration-300 ${
                      formData.payment_method === method
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                        : 'bg-white text-zinc-500 border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* User and Approver */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">사용자</label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="사용자"
                  className="w-full px-8 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-zinc-700 text-lg"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">승인자</label>
                <input
                  type="text"
                  name="approver"
                  value={formData.approver}
                  onChange={handleChange}
                  placeholder="승인자"
                  className="w-full px-8 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-zinc-700 text-lg"
                />
              </div>
            </div>

            {/* Usage Purpose */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">사용 용도</label>
              <textarea
                name="usage_purpose"
                value={formData.usage_purpose}
                onChange={handleChange}
                placeholder="사용 용도를 입력하세요"
                rows={2}
                className="w-full px-8 py-5 bg-zinc-50/50 rounded-3xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-zinc-700 text-lg resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-5 rounded-3xl font-bold text-zinc-500 hover:bg-zinc-50 transition-all"
              >
                다시 업로드
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <FileText className="w-6 h-6 animate-pulse" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    이미지 생성하기
                  </>
                )}
              </button>
            </div>

            {generatedDataUrl && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleSupabaseUpload}
                  disabled={isUploading}
                  className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-6 h-6" />
                      슈퍼베이스로 전송하기
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleComplete}
                  className="w-full py-5 bg-zinc-800 text-white rounded-3xl font-black text-xl shadow-xl shadow-zinc-200 hover:bg-zinc-900 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-6 h-6" />
                  저장 및 완료하기
                </button>
              </div>
            )}
            
            {!generatedDataUrl && (
              <button
                type="button"
                disabled
                className="w-full py-5 bg-zinc-100 text-zinc-300 rounded-3xl font-black text-xl flex items-center justify-center gap-3 cursor-not-allowed"
              >
                <CloudUpload className="w-6 h-6" />
                슈퍼베이스로 전송하기
              </button>
            )}
            
            <p className="text-[10px] text-zinc-500 text-center font-medium">
              v1.1 - 슈퍼베이스 전송 기능 활성화됨
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-full lg:w-[450px] sticky top-24 space-y-6">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block text-center">품의서 미리보기</label>
        <div className="bg-white p-4 rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
          <div className="relative w-full aspect-[1/1.414] bg-zinc-50 rounded-[24px] overflow-hidden border border-zinc-100">
            <div 
              className="absolute top-0 left-0 origin-top-left"
              style={{ 
                transform: 'scale(0.48)', // Scale 850px to ~408px
                width: '850px'
              }}
            >
              <ReceiptDocument data={formData} />
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 text-center mt-4 font-medium">
            * 저장 시 위 양식의 품의서 이미지가 자동으로 생성됩니다.
          </p>
        </div>
      </div>

      <div 
        style={{ 
          position: 'fixed',
          left: '0',
          top: '0',
          width: '850px',
          height: '1200px',
          zIndex: -1000,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.01 // Nearly invisible but still "rendered" for the library
        }}
      >
        <div 
          ref={documentRef} 
          id="capture-area" 
          style={{ 
            backgroundColor: 'white'
          }}
        >
          <ReceiptDocument data={formData} />
        </div>
      </div>
    </div>
  );
};
