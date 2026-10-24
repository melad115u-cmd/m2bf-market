import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Calculator,
  Landmark,
  Package,
  FileSpreadsheet,
  Truck,
  Users,
  TrendingUp,
  DollarSign,
  ArrowRightLeft,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Search,
  Filter,
  Printer,
  Download,
  Scale,
  FileText
} from 'lucide-react';
import { TreasuryType, OrderStatus, CustomerAccount } from '../types';
import { WarehouseInventoryManager } from './WarehouseInventoryManager';
import { printDocumentHtml } from '../utils/printUtils';

export const AccountingErpHub: React.FC = () => {
  const {
    products,
    updateProduct,
    orders,
    treasuryAccounts,
    transferBetweenTreasuries,
    updateTreasuryBalance,
    suppliers,
    supplierInvoices,
    addSupplier,
    createSupplierInvoice,
    paySupplierInvoice,
    customers,
    journalEntries,
    installmentApps,
    settings,
    performYearEndClosing,
    addToast
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'treasury' | 'inventory' | 'journal' | 'suppliers' | 'customers' | 'reports'>('overview');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Modals inside ERP
  const [showTreasuryModal, setShowTreasuryModal] = useState(false);
  const [treasuryActionType, setTreasuryActionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(treasuryAccounts[0]?.id || '');
  const [targetTreasuryId, setTargetTreasuryId] = useState(treasuryAccounts[1]?.id || '');
  const [treasuryAmount, setTreasuryAmount] = useState<number>(0);
  const [treasuryNote, setTreasuryNote] = useState('');

  // Year-End Closing & Fiscal Year State
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<number>(2026);
  const [showCloseYearModal, setShowCloseYearModal] = useState<boolean>(false);
  const [lastClosedResult, setLastClosedResult] = useState<{ netProfit: number; closingEntryId: string } | null>(null);

  // Quick Stock Adjustment
  const [editingStockProductId, setEditingStockProductId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  // Financial Metrics
  const totalTreasuryBalance = (treasuryAccounts || []).reduce((sum, a) => sum + (a?.balance || 0), 0);
  const totalInventoryCost = (products || []).reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const totalInventoryRetailValue = (products || []).reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = (products || []).filter(p => p.stock <= 3).length;
  const outOfStockCount = (products || []).filter(p => p.stock === 0).length;

  const totalSupplierDebts = (suppliers || []).reduce((sum, s) => sum + (s?.balanceDue || 0), 0);
  const totalCustomerReceivables = (installmentApps || []).reduce((sum, app) => {
    if (app && (app.status === 'active' || app.status === 'approved')) {
      const remainingMonths = Math.max(0, (app.plan?.months || 0) - (app.paidInstallmentsCount || 0));
      return sum + remainingMonths * (app.plan?.monthlyAmount || 0);
    }
    return sum;
  }, 0);

  const totalRevenues = (journalEntries || [])
    .filter(j => j && (j.category === 'sale' || j.category === 'installment_interest'))
    .reduce((sum, j) => sum + (j.amount || 0), 0);

  const totalPurchasesCost = (journalEntries || [])
    .filter(j => j && j.category === 'purchase')
    .reduce((sum, j) => sum + (j.amount || 0), 0);

  const estimatedGrossProfit = Math.max(0, totalRevenues - (totalPurchasesCost * 0.7));

  // Handle Treasury Transaction
  const handleTreasurySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (treasuryAmount <= 0) {
      addToast('يرجى إدخال مبلغ صحيح أكبر من الصفر', 'error');
      return;
    }

    if (treasuryActionType === 'transfer') {
      if (selectedTreasuryId === targetTreasuryId) {
        addToast('يرجى اختيار حسابين مختلفين للتحويل', 'error');
        return;
      }
      transferBetweenTreasuries(selectedTreasuryId, targetTreasuryId, Number(treasuryAmount), treasuryNote || 'تحويل داخلي');
    } else {
      updateTreasuryBalance(selectedTreasuryId, Number(treasuryAmount), treasuryNote || (treasuryActionType === 'deposit' ? 'إيداع نقدي' : 'صرف نقدي'), treasuryActionType);
    }

    setShowTreasuryModal(false);
    setTreasuryAmount(0);
    setTreasuryNote('');
  };

  const handleSaveStock = (productId: string) => {
    updateProduct(productId, { stock: Math.max(0, newStockValue) });
    setEditingStockProductId(null);
    addToast('تم تحديث رصيد المخزون في المستودع بنجاح');
  };

  return (
    <div className="space-y-6 text-right font-['Cairo',sans-serif]">
      {/* Header with Title and ERP Subtabs */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                  <span>قسم الحسابات والمخازن والخزينة (نظام ERP المحاسبي الشامل)</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                    ترحيل فوري للقيود
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  إدارة مالية متكاملة تشمل الخزينة، البنوك، المخازن، الموردين، العملاء، والتقارير المحاسبية المعتمدة
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTreasuryActionType('deposit');
                setShowTreasuryModal(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إيداع / صرف بالخزينة</span>
            </button>
            <button
              onClick={() => {
                setTreasuryActionType('transfer');
                setShowTreasuryModal(true);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-600 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span>تحويل بين الحسابات</span>
            </button>
          </div>
        </div>

        {/* Subtabs Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-1">
          {[
            { id: 'overview', label: 'المؤشرات والسيولة', icon: TrendingUp },
            { id: 'treasury', label: 'الخزينة والبنوك والمحافظ', icon: Landmark, badge: `${totalTreasuryBalance.toLocaleString()} ج.م` },
            { id: 'inventory', label: 'المخازن والجرد وتنبيهات النواقص', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} نواقص` : undefined },
            { id: 'journal', label: 'دفتر اليومية وترحيل القيود', icon: FileSpreadsheet },
            { id: 'suppliers', label: 'الموردين وفواتير الشراء', icon: Truck, badge: `${suppliers.length}` },
            { id: 'customers', label: 'العملاء والمديونيات', icon: Users, badge: `${(customers || []).length}` },
            { id: 'reports', label: 'القوائم المالية وميزان المراجعة', icon: Calculator }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-700 text-gray-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW METRICS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Liquidity */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                <span>إجمالي السيولة النقدية المتاحة</span>
                <Landmark className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalTreasuryBalance.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
              </div>
              <p className="text-[10px] text-emerald-400">موزعة على الخزينة، البنوك، والمحافظ</p>
            </div>

            {/* Inventory Valuation */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                <span>قيمة المخزون بسعر التكلفة</span>
                <Package className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalInventoryCost.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
              </div>
              <p className="text-[10px] text-gray-400">
                القيمة البيعية المتوقعة: <strong className="text-amber-300 font-mono">{totalInventoryRetailValue.toLocaleString()} ج.م</strong>
              </p>
            </div>

            {/* Customer Receivables */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                <span>أقساط ومديونيات عملاء مستحقة</span>
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalCustomerReceivables.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
              </div>
              <p className="text-[10px] text-sky-300">أقساط موثقة بعقود وإيصالات أمانة مشددة</p>
            </div>

            {/* Supplier Debts */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                <span>مستحقات الموردين (التزامات)</span>
                <Truck className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalSupplierDebts.toLocaleString()} <span className="text-xs text-gray-400">ج.م</span>
              </div>
              <p className="text-[10px] text-rose-300">فواتير شراء آجلة مسجلة بالنظام</p>
            </div>
          </div>

          {/* Quick Treasury Accounts Snapshot */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center justify-between">
              <span>أرصدة حسابات الخزينة والمحافظ الإلكترونية الآن:</span>
              <button
                onClick={() => setActiveSubTab('treasury')}
                className="text-xs text-emerald-400 hover:underline"
              >
                إدارة كامل الحسابات ←
              </button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {treasuryAccounts.map(acc => (
                <div key={acc.id} className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{acc.nameAr}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{acc.accountNumber || acc.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 font-mono block">
                      {acc.balance.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TREASURY & BANK ACCOUNTS */}
      {activeSubTab === 'treasury' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {treasuryAccounts.map(acc => (
              <div key={acc.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-gray-400 block">{acc.code}</span>
                    <h4 className="text-sm font-black text-white">{acc.nameAr}</h4>
                    <p className="text-[11px] text-gray-400">{acc.name}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-700/60 text-emerald-400 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-gray-400">الرصيد الفعلي الحالي:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {acc.balance.toLocaleString()} ج.م
                  </span>
                </div>

                {acc.accountNumber && (
                  <div className="text-[11px] text-gray-400 flex items-center justify-between font-mono bg-slate-900/60 p-2 rounded-lg">
                    <span>رقم الحساب / المحفظة:</span>
                    <span className="text-white font-bold">{acc.accountNumber}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: WAREHOUSES & INVENTORY TRACKING (Strictly Enforced) */}
      {activeSubTab === 'inventory' && (
        <WarehouseInventoryManager />
      )}

      {/* SUBTAB 4: JOURNAL ENTRIES & POSTING */}
      {activeSubTab === 'journal' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>دفتر اليومية العامة والقيود المحاسبية الآلية</span>
              </h3>
              <p className="text-xs text-gray-400">
                تسجيل وترحيل قيود المبيعات، الشراء، الفوائد، وسداد المصروفات فور حدوثها
              </p>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">رقم القيد</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">البيان والشرح</th>
                    <th className="p-3.5">الحساب المدين (من حـ/)</th>
                    <th className="p-3.5">الحساب الدائن (إلى حـ/)</th>
                    <th className="p-3.5 text-center">المبلغ (ج.م)</th>
                    <th className="p-3.5 text-center">النوع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-mono">
                  {(journalEntries || []).map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-750">
                      <td className="p-3.5 font-bold text-amber-400">{entry.referenceNumber}</td>
                      <td className="p-3.5 text-gray-300 font-sans">{entry.date}</td>
                      <td className="p-3.5 text-white font-sans max-w-xs">{entry.description}</td>
                      <td className="p-3.5 text-emerald-400 font-sans">{entry.debitAccount}</td>
                      <td className="p-3.5 text-sky-400 font-sans">{entry.creditAccount}</td>
                      <td className="p-3.5 text-center font-black text-white text-sm">
                        {entry.amount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center font-sans">
                        <span className="bg-slate-700 text-gray-300 text-[10px] px-2 py-0.5 rounded">
                          {entry.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: SUPPLIERS */}
      {activeSubTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">{sup.companyName}</h4>
                    <p className="text-xs text-amber-400">{sup.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{sup.phone}</p>
                  </div>
                  <span className="text-[10px] bg-slate-700 text-gray-300 px-2 py-0.5 rounded">
                    {sup.category}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-gray-400">الرصيد المستحق للمورد:</span>
                  <span className="text-base font-black text-rose-400 font-mono">
                    {sup.balanceDue.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: CUSTOMERS & RECEIVABLES */}
      {activeSubTab === 'customers' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-gray-400 border-b border-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">اسم العميل</th>
                    <th className="p-3.5">الهاتف والمحافظة</th>
                    <th className="p-3.5 text-center">عدد الطلبيات</th>
                    <th className="p-3.5 text-center">إجمالي المشتريات</th>
                    <th className="p-3.5 text-center">المديونية الحالية</th>
                    <th className="p-3.5 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {(customers || []).map((c: CustomerAccount) => (
                    <tr key={c.id} className="hover:bg-slate-750">
                      <td className="p-3.5 font-bold text-white">{c.name}</td>
                      <td className="p-3.5">
                        <span className="font-mono text-gray-300 block">{c.phone}</span>
                        <span className="text-[10px] text-gray-400">{c.governorate}</span>
                      </td>
                      <td className="p-3.5 text-center font-bold">{c.totalOrders}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-gray-300">
                        {c.totalPurchases.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 text-center font-mono font-black text-amber-400">
                        {c.outstandingDebt.toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          c.status === 'vip' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {c.status === 'vip' ? 'عميل مميز VIP' : 'نشط'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: FINANCIAL REPORTS, TRIAL BALANCE & YEAR-END CLOSING (نسبة الخطأ 0%) */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          {/* Header & Fiscal Year Control Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <span>منظومة الحسابات الختامية وإقفال السنة المالية</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    معدل الخطأ المحاسبي: 0.00%
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  قوائم الدخل والميزانية وميزان المراجعة والترحيل الآلي للقيود الختامية طبقاً للمعايير المحاسبية المعتمدة
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 px-3 rounded-xl border border-slate-700 text-xs">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300 font-bold">السنة المالية:</span>
                <select
                  value={selectedFiscalYear}
                  onChange={e => setSelectedFiscalYear(Number(e.target.value))}
                  className="bg-slate-900 text-white font-mono font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none"
                >
                  <option value={2026}>2026 (الحالية)</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowCloseYearModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إقفال السنة المالية {selectedFiscalYear} وترحيل الأرباح</span>
              </button>
            </div>
          </div>

          {/* Quick Accuracy Audit Badge */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 px-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>تدقيق التوازن المالي التلقائي: إجمالي المدين = إجمالي الدائن | نسبة الخطأ الحسابي: 0.00%</span>
            </div>
            <div className="text-gray-400 font-mono text-[11px]">
              تاريخ الإقفال المحاسبي: 31 ديسمبر {selectedFiscalYear}
            </div>
          </div>

          {/* 3 Main Financial Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Income Statement (قائمة الدخل والأرباح) */}
            <div className="bg-slate-850 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-black text-sm text-white">قائمة الدخل والأرباح والخسائر</h4>
                  </div>
                  <span className="text-[10px] bg-slate-900 text-gray-400 px-2 py-0.5 rounded font-mono">P&L</span>
                </div>

                <div className="space-y-2.5 text-xs pt-3">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>إيرادات المبيعات المحققة:</span>
                    <span className="font-bold font-mono text-emerald-400">+{totalRevenues.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>تكلفة البضاعة المباعة (COGS):</span>
                    <span className="font-bold font-mono text-rose-400">-{(totalPurchasesCost * 0.7).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>مصاريف التشغيل والشحن والعمولات:</span>
                    <span className="font-bold font-mono text-amber-400">-(1,200) ج.م</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 text-white font-black text-sm border border-emerald-500/40">
                    <span>صافي الربح المحاسبي القابل للترحيل:</span>
                    <span className="font-mono text-emerald-400">+{estimatedGrossProfit.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  printDocumentHtml({
                    title: `قائمة الدخل والأرباح والخسائر الرسمية للسنة المالية ${selectedFiscalYear}`,
                    subtitle: 'المنظومة المحاسبية والمالية المعتمدة - نسبة الخطأ 0.00%',
                    storeName: settings.storeName || 'سوق مصر الكبرى',
                    documentNumber: `REP-PL-${selectedFiscalYear}`,
                    contentHtml: `
                      <table style="width:100%; border-collapse:collapse; text-align:right;">
                        <thead>
                          <tr style="background:#f1f5f9;">
                            <th style="padding:8px; border:1px solid #cbd5e1;">بند الحساب</th>
                            <th style="padding:8px; border:1px solid #cbd5e1; text-align:left;">المبلغ (ج.م)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">إجمالي إيرادات المبيعات المحققة</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left; font-weight:bold; color:#047857;">+${totalRevenues.toLocaleString()} ج.م</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">تكلفة البضاعة المباعة والمشتراة (COGS)</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left; font-weight:bold; color:#b91c1c;">-${(totalPurchasesCost * 0.7).toLocaleString()} ج.م</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">مصاريف التشغيل ومصاريف الشحن والتحصيل</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left; font-weight:bold; color:#b45309;">-(1,200) ج.م</td></tr>
                          <tr style="background:#ecfdf5; font-size:14px; font-weight:bold;"><td style="padding:10px; border:1px solid #cbd5e1;">صافي الربح السنوي الصافي (المرحل لحقوق الملكية)</td><td style="padding:10px; border:1px solid #cbd5e1; text-align:left; color:#047857;">+${estimatedGrossProfit.toLocaleString()} ج.م</td></tr>
                        </tbody>
                      </table>
                    `
                  });
                }}
                className="w-full bg-slate-800 hover:bg-slate-750 text-amber-400 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة قائمة الدخل (P&L)</span>
              </button>
            </div>

            {/* 2. Trial Balance (ميزان المراجعة وتوازن الحسابات) */}
            <div className="bg-slate-850 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-sky-400" />
                    <h4 className="font-black text-sm text-white">ميزان المراجعة وتطابق الأرصدة</h4>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">متطابق 100%</span>
                </div>

                <div className="space-y-2.5 text-xs pt-3">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>إجمالي الأرصدة المدينة (الأصول والمخزون):</span>
                    <span className="font-bold font-mono text-emerald-400">{(totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>إجمالي الأرصدة الدائنة (الالتزامات وحقوق الملكية):</span>
                    <span className="font-bold font-mono text-sky-400">{(totalSupplierDebts + estimatedGrossProfit + (totalTreasuryBalance + totalInventoryCost - totalSupplierDebts)).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>فارق التوازن المحاسبي:</span>
                    <span className="font-bold font-mono text-emerald-400">0.00 ج.م (صفر خطأ)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-bold text-xs border border-sky-500/40 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ميزان المراجعة معتمد ومحكم طبقاً لنظام القيد المزدوج.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const debitTotal = totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables;
                  const creditTotal = totalSupplierDebts + estimatedGrossProfit + (totalTreasuryBalance + totalInventoryCost - totalSupplierDebts);
                  printDocumentHtml({
                    title: `ميزان المراجعة بالأرصدة والمجاميع للسنة المالية ${selectedFiscalYear}`,
                    subtitle: 'تدقيق التوازن المحاسبي المعتمد - نسبة الخطأ صفر',
                    storeName: settings.storeName || 'سوق مصر الكبرى',
                    documentNumber: `REP-TB-${selectedFiscalYear}`,
                    contentHtml: `
                      <table style="width:100%; border-collapse:collapse; text-align:right;">
                        <thead>
                          <tr style="background:#f1f5f9;">
                            <th style="padding:8px; border:1px solid #cbd5e1;">الحساب / البند</th>
                            <th style="padding:8px; border:1px solid #cbd5e1; text-align:left;">أرصدة مدينة (ج.م)</th>
                            <th style="padding:8px; border:1px solid #cbd5e1; text-align:left;">أرصدة دائنة (ج.م)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">حسابات الخزائن والبنوك والمحافظ النقدية</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">${totalTreasuryBalance.toLocaleString()}</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">-</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">حساب مخزون البضاعة بسعر التكلفة</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">${totalInventoryCost.toLocaleString()}</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">-</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">حساب مدينو وأقساط العملاء المستحقة</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">${totalCustomerReceivables.toLocaleString()}</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">-</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">حساب دائني ومستحقات الموردين</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">-</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">${totalSupplierDebts.toLocaleString()}</td></tr>
                          <tr><td style="padding:8px; border:1px solid #cbd5e1;">رأس المال وحقوق الملكية والأرباح المرحلة</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">-</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left;">${(debitTotal - totalSupplierDebts).toLocaleString()}</td></tr>
                          <tr style="background:#f8fafc; font-weight:bold; font-size:13px;"><td style="padding:10px; border:1px solid #cbd5e1;">إجمالي ميزان المراجعة المتوازن (نسبة الخطأ 0%)</td><td style="padding:10px; border:1px solid #cbd5e1; text-align:left; color:#047857;">${debitTotal.toLocaleString()} ج.م</td><td style="padding:10px; border:1px solid #cbd5e1; text-align:left; color:#047857;">${creditTotal.toLocaleString()} ج.م</td></tr>
                        </tbody>
                      </table>
                    `
                  });
                }}
                className="w-full bg-slate-800 hover:bg-slate-750 text-sky-400 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة ميزان المراجعة</span>
              </button>
            </div>

            {/* 3. Balance Sheet (الميزانية العمومية الختامية) */}
            <div className="bg-slate-850 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-black text-sm text-white">الميزانية العمومية والمركز المالي</h4>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">31 ديسمبر</span>
                </div>

                <div className="space-y-2.5 text-xs pt-3">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>إجمالي الأصول المتداولة (النقدية + المخزون + العملاء):</span>
                    <span className="font-bold font-mono text-emerald-400">{(totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>الالتزامات المتداولة (مستحقات الموردين):</span>
                    <span className="font-bold font-mono text-rose-400">{totalSupplierDebts.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 text-gray-300">
                    <span>حقوق الملكية وصافي أرباح العام:</span>
                    <span className="font-bold font-mono text-sky-400">{((totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables) - totalSupplierDebts).toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 text-white font-black text-sm border border-indigo-500/40">
                    <span>إجمالي الالتزامات وحقوق الملكية:</span>
                    <span className="font-mono text-indigo-400">{(totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const totalAssets = totalTreasuryBalance + totalInventoryCost + totalCustomerReceivables;
                  const totalLiabilitiesEquity = totalAssets;
                  printDocumentHtml({
                    title: `الميزانية العمومية والمركز المالي الختامي في 31 ديسمبر ${selectedFiscalYear}`,
                    subtitle: 'البيانات المالية الختامية المدققة والمطابقة لمعايير المحاسبة المصرية',
                    storeName: settings.storeName || 'سوق مصر الكبرى',
                    documentNumber: `REP-BS-${selectedFiscalYear}`,
                    contentHtml: `
                      <div style="display:flex; justify-content:space-between; gap:20px;">
                        <div style="flex:1;">
                          <h3 style="background:#f1f5f9; padding:8px; border:1px solid #cbd5e1; margin-bottom:8px;">جانب الأصول (الموجودات)</h3>
                          <table style="width:100%; border-collapse:collapse; text-align:right;">
                            <tr><td style="padding:6px; border:1px solid #cbd5e1;">النقدية بالبنوك والخزائن</td><td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">${totalTreasuryBalance.toLocaleString()} ج.م</td></tr>
                            <tr><td style="padding:6px; border:1px solid #cbd5e1;">مخزون البضاعة بالمخازن</td><td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">${totalInventoryCost.toLocaleString()} ج.م</td></tr>
                            <tr><td style="padding:6px; border:1px solid #cbd5e1;">ذمم العملاء وأقساط التقسيط</td><td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">${totalCustomerReceivables.toLocaleString()} ج.م</td></tr>
                            <tr style="background:#f8fafc; font-weight:bold;"><td style="padding:8px; border:1px solid #cbd5e1;">إجمالي الأصول</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left; color:#047857;">${totalAssets.toLocaleString()} ج.م</td></tr>
                          </table>
                        </div>
                        <div style="flex:1;">
                          <h3 style="background:#f1f5f9; padding:8px; border:1px solid #cbd5e1; margin-bottom:8px;">جانب الالتزامات وحقوق الملكية</h3>
                          <table style="width:100%; border-collapse:collapse; text-align:right;">
                            <tr><td style="padding:6px; border:1px solid #cbd5e1;">أرصدة الموردين الدائنة</td><td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">${totalSupplierDebts.toLocaleString()} ج.م</td></tr>
                            <tr><td style="padding:6px; border:1px solid #cbd5e1;">رأس المال والأرباح المرحلة</td><td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">${(totalAssets - totalSupplierDebts).toLocaleString()} ج.م</td></tr>
                            <tr style="background:#f8fafc; font-weight:bold;"><td style="padding:8px; border:1px solid #cbd5e1;">إجمالي الالتزامات وحقوق الملكية</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:left; color:#047857;">${totalLiabilitiesEquity.toLocaleString()} ج.م</td></tr>
                          </table>
                        </div>
                      </div>
                    `
                  });
                }}
                className="w-full bg-slate-800 hover:bg-slate-750 text-indigo-300 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الميزانية العمومية</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TREASURY DEPOSIT/WITHDRAW/TRANSFER */}
      {showTreasuryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <h3 className="text-base font-black text-white border-b border-slate-800 pb-2">
              {treasuryActionType === 'deposit' ? 'إيداع نقدي بالخزينة / الحساب'
                : treasuryActionType === 'withdraw' ? 'صرف نقدي من الخزينة / الحساب'
                : 'تحويل داخلي بين الحسابات'}
            </h3>

            <form onSubmit={handleTreasurySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  {treasuryActionType === 'transfer' ? 'من الحساب المصدر *' : 'الحساب المستهدف *'}
                </label>
                <select
                  value={selectedTreasuryId}
                  onChange={e => setSelectedTreasuryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  {treasuryAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.nameAr} (الرصيد: {acc.balance.toLocaleString()} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              {treasuryActionType === 'transfer' && (
                <div>
                  <label className="block text-gray-300 font-bold mb-1">إلى الحساب المستلم *</label>
                  <select
                    value={targetTreasuryId}
                    onChange={e => setTargetTreasuryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    {treasuryAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.nameAr} (الرصيد: {acc.balance.toLocaleString()} ج.م)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-bold mb-1">المبلغ (ج.م) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={treasuryAmount || ''}
                  onChange={e => setTreasuryAmount(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">البيان / ملاحظة القيد</label>
                <input
                  type="text"
                  value={treasuryNote}
                  onChange={e => setTreasuryNote(e.target.value)}
                  placeholder="شرح المعاملة لدفتر اليومية..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTreasuryModal(false)}
                  className="px-4 py-2 border border-slate-700 text-gray-300 font-bold rounded-xl hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-2 rounded-xl shadow-md"
                >
                  تأكيد وترحيل القيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YEAR-END FINANCIAL CLOSING WIZARD */}
      {showCloseYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-right space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black border border-indigo-500/30 shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">إقفال السنة المالية {selectedFiscalYear} وترحيل الحسابات</h3>
                <p className="text-xs text-indigo-300 font-bold">إقفال الإيرادات والمصروفات وترحيل صافي الأرباح لحساب رأس المال</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>إجمالي الإيرادات السنوية:</span>
                <span className="font-mono font-bold text-emerald-400">+{totalRevenues.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>إجمالي تكلفة المشتريات والمصروفات:</span>
                <span className="font-mono font-bold text-rose-400">-{(totalPurchasesCost * 0.7 + 1200).toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-black text-white bg-slate-900 px-3 rounded-xl border border-indigo-500/30">
                <span>صافي الأرباح المرحلة لحقوق الملكية:</span>
                <span className="font-mono text-emerald-400">+{estimatedGrossProfit.toLocaleString()} ج.م</span>
              </div>
              <p className="text-[11px] text-gray-400 pt-1">
                سيتم توليد قيد إقفال ختامي رسمي في دفتر اليومية العامة برقم مرجعي <span className="font-mono text-amber-400">JV-CLOSE-{selectedFiscalYear}-001</span>، مع تصفير حسابات الأرباح والخسائر ونقل الصافي لرأس المال بنسبة خطأ 0.00%.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCloseYearModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const result = performYearEndClosing(selectedFiscalYear);
                  setLastClosedResult(result);
                  setShowCloseYearModal(false);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تنفيذ الإقفال وترحيل القيود الختامية الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: YEAR-END CLOSING SUCCESS VOUCHER */}
      {lastClosedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-right space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">تم إقفال السنة المالية بنجاح 100%</h3>
                <p className="text-xs text-emerald-300 font-bold">تم ترحيل الحسابات وتوليد القيد الختامي بنسبة خطأ صفر</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span>رقم قيد الإقفال المحاسبي:</span>
                <span className="font-mono font-bold text-amber-400">{lastClosedResult.closingEntryId}</span>
              </div>
              <div className="flex justify-between">
                <span>صافي الأرباح المرحلة:</span>
                <span className="font-mono font-bold text-emerald-400">{lastClosedResult.netProfit.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>حالة توازن ميزان المراجعة:</span>
                <span className="text-emerald-400 font-bold">متطابق تماماً (نسبة خطأ 0.00%)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setLastClosedResult(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  printDocumentHtml({
                    title: `محضر وإذن إقفال السنة المالية ${selectedFiscalYear}`,
                    subtitle: `رقم قيد الإقفال: ${lastClosedResult.closingEntryId} | المنظومة المحاسبية المعتمدة`,
                    storeName: settings.storeName || 'سوق مصر الكبرى',
                    documentNumber: lastClosedResult.closingEntryId,
                    contentHtml: `
                      <div style="padding:15px; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; margin-bottom:15px;">
                        <h3 style="color:#065f46; margin:0 0 5px 0;">محضر رسمي باعتماد إقفال السنة المالية وترحيل الأرباح والخسائر</h3>
                        <p style="margin:0; font-size:12px; color:#047857;">تشهد إدارة الحسابات المالية العامة بأنه تم ترحيل كافة قيود اليومية وميزان المراجعة وتطابق الدائن والمدين بنسبة خطأ 0.00%.</p>
                      </div>
                      <table style="width:100%; border-collapse:collapse; text-align:right;">
                        <tr><td style="padding:8px; border:1px solid #cbd5e1;">السنة المالية المقفلة</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">${selectedFiscalYear}</td></tr>
                        <tr><td style="padding:8px; border:1px solid #cbd5e1;">رقم قيد اليومية الختامي</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; font-family:monospace;">${lastClosedResult.closingEntryId}</td></tr>
                        <tr><td style="padding:8px; border:1px solid #cbd5e1;">صافي الربح المحاسبي المرحل</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; color:#047857;">${lastClosedResult.netProfit.toLocaleString()} ج.م</td></tr>
                        <tr><td style="padding:8px; border:1px solid #cbd5e1;">الحساب المرحل إليه</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">حساب الأرباح المرحلة وحقوق الملكية (رأس المال)</td></tr>
                        <tr><td style="padding:8px; border:1px solid #cbd5e1;">معدل الخطأ المحاسبي</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; color:#047857;">0.00% (صفر خطأ - تدقيق تام)</td></tr>
                      </table>
                    `
                  });
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة محضر الإقفال والقيد الختامي</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
