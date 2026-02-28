import React, { useState, useEffect } from 'react';
import { Receipt } from '../constants';
import { Eye, Download, Search, X } from 'lucide-react';

interface HistoryPageProps {
  receipts: Receipt[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ receipts }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReceipts = receipts.filter(r => 
    r.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.business_unit.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(r => r.document_image); // Only show those with document images

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">품의서 보관함</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="검색 (상호, 사용자, 사업장)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-zinc-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceipts.map((receipt) => (
          <div 
            key={receipt.id}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="aspect-[3/4] bg-zinc-100 relative overflow-hidden">
              {receipt.document_image && (
                <img 
                  src={receipt.document_image} 
                  alt="Document" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => setSelectedImage(receipt.document_image || null)}
                  className="p-5 bg-white rounded-full text-zinc-900 hover:scale-110 transition-transform shadow-lg"
                >
                  <Eye className="w-8 h-8" />
                </button>
                <a 
                  href={receipt.document_image} 
                  download={`품의서_${receipt.date}_${receipt.place}.jpg`}
                  className="p-3 bg-white rounded-full text-zinc-900 hover:scale-110 transition-transform"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {receipt.business_unit}
                </span>
                <span className="text-xs text-zinc-400">{receipt.date}</span>
              </div>
              <h3 className="font-bold text-zinc-900 truncate">{receipt.place}</h3>
              <p className="text-xs text-zinc-500">사용자: {receipt.user}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredReceipts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
          <p className="text-zinc-500">저장된 품의서가 없습니다.</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full Document" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
