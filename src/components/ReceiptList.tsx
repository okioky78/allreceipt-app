import React from 'react';
import { Receipt } from '../constants';
import { Calendar, MapPin, CreditCard, User, CheckCircle, Trash2, Eye } from 'lucide-react';

interface ReceiptListProps {
  receipts: Receipt[];
  onDelete: (id: number) => void;
}

export const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onDelete }) => {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
        <p className="text-zinc-500">등록된 영수증이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          className="group relative bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded uppercase tracking-wider">
                  {receipt.business_unit}
                </span>
                <span className="text-xs text-zinc-400 font-medium">#{receipt.id}</span>
              </div>
              <button
                onClick={() => {
                  if (receipt.document_image) {
                    const link = document.createElement('a');
                    link.href = receipt.document_image;
                    link.download = `${receipt.date}_${receipt.place}.jpg`;
                    link.click();
                  } else {
                    alert('이미지가 생성되지 않았습니다.');
                  }
                }}
                className="text-lg font-bold text-zinc-900 hover:text-blue-600 transition-colors text-left"
              >
                {receipt.place}
              </button>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-zinc-900">
                {receipt.amount.toLocaleString()}원
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-zinc-500">
                <CreditCard className="w-3 h-3" />
                {receipt.payment_method}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-50">
            <div className="flex items-center gap-2 text-zinc-600">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-sm">{receipt.date}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <User className="w-4 h-4 text-zinc-400" />
              <span className="text-sm">{receipt.user}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <CheckCircle className="w-4 h-4 text-zinc-400" />
              <span className="text-sm">{receipt.approver || '미승인'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-sm">{receipt.approval_date || '-'}</span>
            </div>
          </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (receipt.document_image) {
                    const link = document.createElement('a');
                    link.href = receipt.document_image;
                    link.download = `${receipt.date}_${receipt.place}.jpg`;
                    link.click();
                  } else {
                    alert('이미지가 생성되지 않았습니다.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold transition-all"
              >
                <Eye className="w-5 h-5" />
                <span>사진보기</span>
              </button>
              <button
                onClick={() => receipt.id && onDelete(receipt.id)}
                className="p-2 text-zinc-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
      ))}
    </div>
  );
};
