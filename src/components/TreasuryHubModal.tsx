import React, { useState, useMemo, useRef } from 'react';
import { TreasuryAccount, CustomerAccount, JournalEntry, Order, InstallmentApplication, StoreSettings } from '../types';
import { printDocumentHtml } from '../utils/printUtils';
import {
  Printer,
  X,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Search,
  User,
  Phone,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Wallet,
  ShieldCheck
} from 'lucide-react';

interface Props {
  treasuryAccounts: TreasuryAccount[];
  customers: CustomerAccount[];
  orders: Order[];
  installmentApps: InstallmentApplication[];
  journalEntries: JournalEntry[];
  settings: StoreSettings;
  onDepositWithdraw: (accountId: string, amount: number, description: string, type: 'deposit' | 'withdraw') => void;
  onTransfer: (fromId: string, toId: string, amount: number, note: string) => void;
  onClose: () => void;
}

export const TreasuryHubModal: React.FC<Props> = ({
  treasuryAccounts,
  customers,
  orders,
  installmentApps,
  journalEntries,
  settings,
  onDepositWithdraw,
  onTransfer,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'voucher' | 'customer_report'>('voucher');

  // Voucher Form State
  const [voucherType, setVoucherType] = useState<'deposit' | 'withdraw' | 'transfer'>('withdraw');
  const [selectedAccountId, setSelectedAccountId] = useState(treasuryAccounts[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState(treasuryAccounts[1]?.id || '');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('مصروفات تشغيلية وعمومية');
  const [beneficiaryName, setBeneficiaryName] = useState('');

  // Customer Statement Search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);

  // Filter matched customer
  const matchedCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.phone2 && c.phone2.includes(q)) ||
        c.id.toLowerCase().includes(q) ||
        (c.nationalId && c.nationalId.includes(q))
    );
  }, [customers, customerSearchQuery]);

  const activeCustomer = useMemo(() => {
    if (!selectedCustomerId) return matchedCustomers[0] || null;
    return customers.find(c => c.id === selectedCustomerId) || matchedCustomers[0] || null;
  }, [customers, selectedCustomerId, matchedCustomers]);

  // Customer transactions history
  const customerOrders = useMemo(() => {
    if (!activeCustomer) return [];
    return orders.filter(
      o => o.customerPhone === activeCustomer.phone || o.customerName === activeCustomer.name
    );
  }, [orders, activeCustomer]);

  const customerInstallments = useMemo(() => {
    if (!activeCustomer) return [];
    return installmentApps.filter(
      app => app.phone === activeCustomer.phone || app.nationalId === activeCustomer.nationalId
    );
  }, [installmentApps, activeCustomer]);

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      return;
    }

    if (voucherType === 'transfer') {
      if (selectedAccountId === targetAccountId) {
        return;
      }
      onTransfer(selectedAccountId, targetAccountId, amount, description || 'تحويل رصيد داخلي بين الخزائن');
    } else {
      const fullDesc = `${description} ${beneficiaryName ? `(الجهة/المستفيد: ${beneficiaryName})` : ''} - [${category}]`;
      onDepositWithdraw(selectedAccountId, amount, fullDesc.trim(), voucherType);
    }

    onClose();
  };

  const statementPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (statementPrintRef.current) {
      printDocumentHtml({
        title: `كشف حساب حركة تعاملات العميل المالية - ${activeCustomer?.name || ''}`,
        subtitle: 'إدارة الخزينة وحسابات العملاء المعتمدة',
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: `REC-CUST-${activeCustomer?.id || '001'}`,
        contentHtml: statementPrintRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-slate-900 text-gray-100 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-700 text-right print:bg-white print:text-gray-900 print:shadow-none print:border-none print:max-w-full my-auto">
        {/* Header (Hidden in Print) */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">إدارة الخزينة والمصروفات وتقارير كشف حساب العملاء</h3>
              <p className="text-xs text-gray-400">إصدار أذون الصرف والمقبوضات الفورية والاستعلام وطباعة كشف العميل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Hidden in Print) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 print:hidden text-xs font-bold">
          <button
            onClick={() => setActiveTab('voucher')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'voucher'
                ? 'bg-amber-400 text-slate-950 font-black shadow'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>إذن صرف ومصروفات / إيداع خزينة</span>
          </button>
          <button
            onClick={() => setActiveTab('customer_report')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customer_report'
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>تقرير كشف حساب عميل معين (بحث بالاسم، الهاتف، أو الكود)</span>
          </button>
        </div>

        {/* TAB 1: VOUCHER CREATION (CASH OUT / CASH IN) */}
        {activeTab === 'voucher' && (
          <form onSubmit={handleVoucherSubmit} className="p-6 space-y-4 text-xs">
            {/* Voucher Mode Buttons */}
            <div>
              <label className="block text-gray-300 font-bold mb-2">نوع العملية المالية:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setVoucherType('withdraw')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all cursor-pointer ${
                    voucherType === 'withdraw'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500'
                      : 'bg-slate-800 border-slate-700 text-gray-300'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span>إذن صرف ومصروفات (Cash Out)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoucherType('deposit')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all cursor-pointer ${
                    voucherType === 'deposit'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500'
                      : 'bg-slate-800 border-slate-700 text-gray-300'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <span>إذن إيداع ومقبوضات (Cash In)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoucherType('transfer')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all cursor-pointer ${
                    voucherType === 'transfer'
                      ? 'bg-sky-950/80 border-sky-500 text-sky-300 ring-2 ring-sky-500'
                      : 'bg-slate-800 border-slate-700 text-gray-300'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 text-sky-400" />
                  <span>تحويل داخلي بين الحسابات</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  {voucherType === 'transfer' ? 'الحساب المحول منه (الخصم) *' : 'الخزينة أو الحساب المستهدف *'}
                </label>
                <select
                  value={selectedAccountId}
                  onChange={e => setSelectedAccountId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {treasuryAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.nameAr} - الرصيد الحالي: {acc.balance.toLocaleString()} ج.م
                    </option>
                  ))}
                </select>
              </div>

              {voucherType === 'transfer' ? (
                <div>
                  <label className="block text-gray-300 font-bold mb-1">الحساب المحول إليه (الإضافة) *</label>
                  <select
                    value={targetAccountId}
                    onChange={e => setTargetAccountId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {treasuryAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.nameAr} - الرصيد الحالي: {acc.balance.toLocaleString()} ج.م
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-300 font-bold mb-1">تبويب بند المعاملة المحاسبية</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {voucherType === 'withdraw' ? (
                      <>
                        <option value="مصروفات تشغيلية وعمومية">مصروفات تشغيلية وعمومية</option>
                        <option value="مصاريف شحن ونقل لوجستي">مصاريف شحن ونقل لوجستي</option>
                        <option value="رواتب وسلف موظفين">رواتب وسلف موظفين</option>
                        <option value="سداد التزامات ومصروفات نثرية">سداد التزامات ومصروفات نثرية</option>
                        <option value="مسحوبات شخصية للمالك">مسحوبات شخصية للمالك</option>
                      </>
                    ) : (
                      <>
                        <option value="إيراد مبيعات فورية نقداً">إيراد مبيعات فورية نقداً</option>
                        <option value="تحصيل دفعات مقدمة وأقساط">تحصيل دفعات مقدمة وأقساط</option>
                        <option value="رأس مال إضافي أو تمويل">رأس مال إضافي أو تمويل</option>
                        <option value="إيرادات أخرى متنوعة">إيرادات أخرى متنوعة</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-bold mb-1">المبلغ المطلوب (ج.م) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount || ''}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-black text-base outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">اسم المستفيد أو الدافع (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: شركة الكهرباء، الموظف، المندوب..."
                  value={beneficiaryName}
                  onChange={e => setBeneficiaryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">البيان والشرح التفصيلي للعملية *</label>
                <input
                  type="text"
                  required
                  placeholder="اكتب سبب الصرف أو الإيداع بوضوح للقيود المحاسبية..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-gray-400">
                * يتم تحديث رصيد الخزينة المستهدفة فوراً وترحيل قيد اليومية العامة.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-black transition-colors cursor-pointer shadow-md ${
                    voucherType === 'withdraw'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : voucherType === 'deposit'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  {voucherType === 'withdraw'
                    ? 'اعتماد وصرف المبلغ فوراً'
                    : voucherType === 'deposit'
                    ? 'اعتماد وإيداع المبلغ بالخزينة'
                    : 'تنفيذ التحويل الداخلي'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: CUSTOMER ACCOUNT STATEMENT REPORT & PRINT */}
        {activeTab === 'customer_report' && (
          <div className="p-6 space-y-4">
            {/* Search Input (Hidden in Print) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 print:hidden space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white text-xs flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>بحث واستعلام عن عميل معين (بالاسم، أو برقم التليفون، أو بكود العميل):</span>
                </label>
                <button
                  onClick={handlePrint}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة ورقة كشف حساب الخزينة للعميل</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب اسم العميل، أو رقم الهاتف، أو كود العميل (مثال: cust-1 أو 010...)..."
                  value={customerSearchQuery}
                  onChange={e => setCustomerSearchQuery(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Matched Customer Pills */}
              <div className="flex flex-wrap gap-2 pt-1 max-h-24 overflow-y-auto">
                {matchedCustomers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeCustomer?.id === c.id
                        ? 'bg-emerald-500 text-slate-950 font-black ring-2 ring-emerald-400'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px] opacity-80">({c.phone})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Printable Customer Statement Document */}
            {activeCustomer ? (
              <div ref={statementPrintRef} className="p-6 space-y-4 border border-slate-800 print:border-none rounded-2xl bg-slate-950/60 print:bg-white text-xs print:p-0">
                {/* Statement Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-800 print:border-gray-900 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {settings.storeLogoUrl ? (
                        <img src={settings.storeLogoUrl} alt={settings.storeName} className="w-10 h-10 object-contain rounded" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                          {settings.storeLogoText || 'نيل'}
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-black text-white print:text-gray-900">{settings.storeName}</h2>
                        <p className="text-[11px] text-gray-400 print:text-gray-600">إدارة الخزينة وحسابات العملاء</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm font-black text-emerald-400 print:text-gray-900">
                      كشف حساب تفصيلي وحركة تعاملات العميل المالية
                    </div>
                  </div>

                  <div className="text-left text-xs text-gray-400 print:text-gray-700 space-y-0.5 font-mono">
                    <p>كود العميل: <strong>{activeCustomer.id}</strong></p>
                    <p>تاريخ الاستخراج: <strong>{new Date().toISOString().split('T')[0]}</strong></p>
                    <p>حالة الحساب: <strong className="text-emerald-400 print:text-emerald-700">{activeCustomer.status}</strong></p>
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 print:bg-gray-100 p-3.5 rounded-xl border border-slate-800 print:border-gray-300">
                  <div>
                    <span className="text-[10px] text-gray-400 print:text-gray-600 block">اسم العميل:</span>
                    <strong className="text-white print:text-gray-900 font-bold">{activeCustomer.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 print:text-gray-600 block">رقم الهاتف:</span>
                    <strong className="text-amber-400 print:text-gray-900 font-mono">{activeCustomer.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 print:text-gray-600 block">المحافظة:</span>
                    <strong className="text-white print:text-gray-900">{activeCustomer.governorate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 print:text-gray-600 block">إجمالي المديونية المستحقة:</span>
                    <strong className="text-rose-400 print:text-rose-700 font-mono font-black text-sm">
                      {(activeCustomer.outstandingDebt || 0).toLocaleString()} ج.م
                    </strong>
                  </div>
                </div>

                {/* Orders History Table */}
                <div>
                  <h4 className="font-bold text-gray-300 print:text-gray-900 mb-2">طلبيات ومشتريات العميل المسجلة:</h4>
                  {customerOrders.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border border-dashed border-slate-800 rounded-lg">
                      لا توجد طلبيات فورية مسجلة برقم هذا العميل
                    </div>
                  ) : (
                    <table className="w-full text-right text-xs border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
                      <thead className="bg-slate-900 print:bg-gray-100 text-gray-400 print:text-gray-800 font-bold">
                        <tr>
                          <th className="p-2">رقم الطلب</th>
                          <th className="p-2">تاريخ الطلب</th>
                          <th className="p-2">طريقة الدفع</th>
                          <th className="p-2">المبلغ</th>
                          <th className="p-2">حالة الشحن</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 print:divide-gray-200 font-mono">
                        {customerOrders.map(o => (
                          <tr key={o.id}>
                            <td className="p-2 text-amber-400 print:text-gray-900 font-bold">{o.id}</td>
                            <td className="p-2 text-gray-300 print:text-gray-700">{o.createdAt || '2026-10-15'}</td>
                            <td className="p-2 text-gray-300 print:text-gray-700 font-sans">{o.paymentMethod}</td>
                            <td className="p-2 font-black text-white print:text-gray-900">{o.total.toLocaleString()} ج.م</td>
                            <td className="p-2 font-sans text-emerald-400 print:text-emerald-700">{o.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Installment Contracts & Promissory Notes History */}
                <div>
                  <h4 className="font-bold text-gray-300 print:text-gray-900 mb-2">عقود التقسيط وإيصالات الأمانة المعتمدة:</h4>
                  {customerInstallments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border border-dashed border-slate-800 rounded-lg">
                      لا توجد عقود تقسيط مسجلة على هذا العميل
                    </div>
                  ) : (
                    <table className="w-full text-right text-xs border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
                      <thead className="bg-slate-900 print:bg-gray-100 text-gray-400 print:text-gray-800 font-bold">
                        <tr>
                          <th className="p-2">رقم العقد</th>
                          <th className="p-2">رقم إيصال الأمانة</th>
                          <th className="p-2">السلعة</th>
                          <th className="p-2">القسط الشهري</th>
                          <th className="p-2">المسدد / الإجمالي</th>
                          <th className="p-2">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 print:divide-gray-200 font-mono">
                        {customerInstallments.map(app => (
                          <tr key={app.id}>
                            <td className="p-2 text-amber-400 print:text-gray-900 font-bold">{app.contractNumber || 'EGY-CT-1045'}</td>
                            <td className="p-2 text-sky-400 print:text-gray-900">{app.promissoryNoteNumber || 'EGY-PN-5089'}</td>
                            <td className="p-2 font-sans font-bold text-white print:text-gray-900">{app.productName}</td>
                            <td className="p-2 font-black text-emerald-400 print:text-emerald-700">{app.plan.monthlyAmount.toLocaleString()} ج.م</td>
                            <td className="p-2 text-gray-300 print:text-gray-800">{app.paidInstallmentsCount} من {app.plan.months} شهر</td>
                            <td className="p-2 font-sans text-emerald-400 print:text-emerald-700">{app.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Printable Signature Box */}
                <div className="border-t border-slate-800 print:border-gray-300 pt-4 flex items-center justify-between text-[10px] text-gray-500">
                  <span>تم استخراج كشف الحساب آلياً من الخزينة العامة لـ {settings.storeName}</span>
                  <span>اعتماد أمين الخزينة والحسابات: ..............................</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                يرجى البحث عن عميل واختياره لعرض كشف حسابه فوراً
              </div>
            )}

            {/* Bottom Actions (Hidden in Print) */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 print:hidden">
              <span className="text-xs text-gray-400">
                يمكنك طباعة ورقة الخزينة أو كشف الحساب عبر زر الطباعة
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة كشف الحساب</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
