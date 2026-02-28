import React from 'react';
import { Upload } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onLoading: (loading: boolean) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <label className="w-full max-w-md aspect-[2/3] flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-[60px] cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all group shadow-sm bg-white">
        <Upload className="w-24 h-24 mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
        <span className="text-3xl font-bold text-zinc-500 group-hover:text-blue-600">이미지 업로드</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </label>
    </div>
  );
};
