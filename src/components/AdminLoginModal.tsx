import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Users
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginAdmin,
    settings,
    employees
  } = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto wipe inputs whenever modal opens or closes
  React.useEffect(() => {
    if (isLoginModalOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setIsLoginModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const submittedUser = username.trim();
    const submittedPass = password.trim();

    setTimeout(() => {
      loginAdmin(submittedUser, submittedPass);
      // Immediately wipe inputs to leave no traces in memory or form fields
      setUsername('');
      setPassword('');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-right flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تسجيل الدخول للوحة الإدارة</h3>
              <p className="text-xs text-amber-400 font-mono">
                {settings.storeName} • تشفير تام ومسح تلقائي للبيانات
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs" autoComplete="off">
          <div>
            <label className="block text-gray-300 font-bold mb-1.5">
              اسم المستخدم / رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم أو رقم الهاتف"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-10 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono text-sm"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1.5">
              الرقم السري المشفر
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-10 pl-10 text-white outline-none focus:ring-2 focus:ring-amber-400 font-mono text-sm"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Guarantee Notice */}
          <div className="bg-slate-950/90 p-3 rounded-xl border border-emerald-900/40 text-emerald-300/90 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>حماية أمنية مشددة (256-bit):</strong> يتم مسح الحقول الحساسة تلقائياً فور تسجيل الدخول أو الخروج لمنع أي دخول غير مصرح به.
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-700 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
          >
            {isLoading ? (
              <span>جارٍ التحقق وتأكيد الصلاحية...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>دخول لوحة التحكم والـ ERP</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
