import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Menu,
  Percent,
  FileCheck,
  CreditCard,
  Flame,
  Truck,
  Sparkles
} from 'lucide-react';

export const CategoriesBar: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setViewMode,
    setAdminTab
  } = useStore();

  return (
    <div className="bg-[#232f3e] text-gray-200 border-t border-slate-700/60 text-xs px-4 py-1.5 shadow-sm overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
        {/* Categories Pills */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'hover:bg-slate-700 text-white'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>كل الأقسام</span>
          </button>

          {categories.filter(c => c.id !== 'all').map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-700 text-gray-200'
              }`}
            >
              <span>{cat.name}</span>
              {cat.badge && (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold scale-90">
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-300">
          <button
            onClick={() => {
              setViewMode('admin');
              setAdminTab('installments');
            }}
            className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>عقود التقسيط وإيصالات الأمانة</span>
          </button>

          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            <CreditCard className="w-3.5 h-3.5" />
            <span>فودافون كاش • إنستاباي • ميزة • فوري</span>
          </div>

          <div className="flex items-center gap-1 text-sky-300 hidden xl:flex">
            <Truck className="w-3.5 h-3.5" />
            <span>شحن سريع لجميع المحافظات</span>
          </div>
        </div>
      </div>
    </div>
  );
};
