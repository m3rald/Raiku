import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Users, HelpCircle } from 'lucide-react';

interface JoinModalProps {
  initialCode?: string;
  onJoinAsParticipant: (code: string, nickname: string) => void;
  onEnterAdminMode: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  initialCode,
  onJoinAsParticipant,
  onEnterAdminMode,
}) => {
  const [code, setCode] = useState(initialCode || '');
  const [nickname, setNickname] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Extract invite query parameter or initialCode if exists
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    if (inviteCode) {
      setCode(inviteCode.trim().toUpperCase());
    }
  }, [initialCode]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setNickname('');
    } else if (val === '@') {
      setNickname('@');
    } else {
      let cleaned = val;
      while (cleaned.startsWith('@')) {
        cleaned = cleaned.substring(1);
      }
      setNickname('@' + cleaned);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNick = nickname.trim();
    if (!code.trim() || !finalNick || finalNick === '@') {
      alert('Please provide both the 6-character invite code and your Discord username.');
      return;
    }
    onJoinAsParticipant(code.trim().toUpperCase(), finalNick);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'ADMIN2026') {
      onEnterAdminMode();
    } else {
      alert('Incorrect Admin password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 px-4 animate-fade-in">
      {/* Intro Icon */}
      <div className="text-center mb-6 sm:mb-8 space-y-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#C0FF38]/10 border border-[#C0FF38]/20 animate-pulse" />
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#C0FF38] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(192,255,56,0.25)]">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#000204]" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Raiku Quiz Event
          </h1>
          <p className="text-[10px] text-[#C0FF38] font-mono tracking-widest uppercase font-bold">
            Real Time Quiz
          </p>
        </div>
      </div>

      {!showAdminLogin ? (
        <div className="p-5 sm:p-8 bg-[#0A0E12] border border-[#C0FF38]/15 rounded-2xl space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Users className="w-5 h-5 text-[#C0FF38]" />
            <h2 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">Join Active Event</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-mono">
                Event Invite Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. RAIKU7"
                className="w-full bg-[#040608] border border-white/10 focus:border-[#C0FF38] focus:ring-1 focus:ring-[#C0FF38]/20 rounded-xl px-4 py-3 text-base sm:text-lg font-mono font-bold tracking-widest text-center text-white outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-mono flex items-center gap-1.5">
                <span>Discord Username (Mandatory)</span>
              </label>
              <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="e.g. @username"
                className="w-full bg-[#040608] border border-white/10 focus:border-[#C0FF38] focus:ring-1 focus:ring-[#C0FF38]/20 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-100 outline-none transition-all font-mono placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C0FF38] hover:bg-[#d0ff5e] text-[#000204] font-black rounded-xl shadow-[0_4px_20px_rgba(192,255,56,0.25)] hover:shadow-[0_4px_25px_rgba(192,255,56,0.4)] transition-all cursor-pointer active:scale-[0.98] mt-2 uppercase text-xs tracking-wider"
            >
              Enter Quiz Arena
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex justify-center">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs text-slate-400 hover:text-[#C0FF38] transition-all flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Access Admin Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-8 bg-[#0A0E12] border border-[#C0FF38]/15 rounded-2xl space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Shield className="w-5 h-5 text-[#C0FF38]" />
            <h2 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">Admin Authentication</h2>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-mono">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#040608] border border-white/10 focus:border-[#C0FF38] focus:ring-1 focus:ring-[#C0FF38]/20 rounded-xl px-4 py-3 text-base sm:text-base text-center text-white outline-none tracking-widest transition-all font-mono placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C0FF38] hover:bg-[#d0ff5e] text-[#000204] font-black rounded-xl shadow-[0_4px_20px_rgba(192,255,56,0.25)] hover:shadow-[0_4px_25px_rgba(192,255,56,0.4)] transition-all cursor-pointer active:scale-[0.98] uppercase text-xs tracking-wider"
            >
              Log In as Administrator
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex justify-center">
            <button
              onClick={() => {
                setShowAdminLogin(false);
                setAdminPassword('');
              }}
              className="text-xs text-slate-400 hover:text-[#C0FF38] transition-all cursor-pointer font-mono uppercase tracking-wider font-semibold"
            >
              Back to Joining Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
