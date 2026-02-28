import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordGateProps {
  onAuthorized: () => void;
  title?: string;
  description?: string;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ 
  onAuthorized, 
  title = "비밀번호 확인", 
  description = "내역 확인을 위해 비밀번호를 입력하세요." 
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'grs6131@') {
      onAuthorized();
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-zinc-900" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-zinc-500">{description}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all text-center"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
};
