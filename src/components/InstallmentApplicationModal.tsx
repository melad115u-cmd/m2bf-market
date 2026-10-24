import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { printDocumentHtml } from '../utils/printUtils';
import {
  X,
  ShieldCheck,
  FileText,
  Upload,
  User,
  Phone,
  Briefcase,
  Home,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  CalendarCheck,
  Printer,
  Stamp,
  Fingerprint,
  QrCode,
  Image as ImageIcon,
  Check,
  Eye,
  FileCheck2
} from 'lucide-react';

export const InstallmentApplicationModal: React.FC = () => {
  const {
    isInstallmentModalOpen,
    setIsInstallmentModalOpen,
    activeInstallmentProduct,
    submitInstallmentApplication,
    settings,
    addToast
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Plan parameters
  const [months, setMonths] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);

  // Applicant info
  const [customerName, setCustomerName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(15000);

  // Guarantor (الضامن الطرف الثالث)
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorNationalId, setGuarantorNationalId] = useState('');
  const [guarantorRelation, setGuarantorRelation] = useState('قريب درجة أولى');
  const [guarantorAddress, setGuarantorAddress] = useState('');
  const [guarantorJob, setGuarantorJob] = useState('');

  // Documents
  const [docIdFront, setDocIdFront] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [docIdBack, setDocIdBack] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [docGuarantorId, setDocGuarantorId] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [docIncome, setDocIncome] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [docUtility, setDocUtility] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [docPersonalPhoto, setDocPersonalPhoto] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');

  // Signature & Agreements
  const [digitalSignatureName, setDigitalSignatureName] = useState('');
  const [agreedToLegalTerms, setAgreedToLegalTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  if (!isInstallmentModalOpen || !activeInstallmentProduct) return null;

  const product = activeInstallmentProduct;

  // Installment Math
  const downPayment = Math.round(product.price * (downPaymentPercent / 100));
  const financedPrincipal = product.price - downPayment;
  const rateMap: Record<number, number> = { 3: 0.0, 6: 0.04, 12: 0.08, 18: 0.12, 24: 0.16 };
  const interestRate = rateMap[months] || 0.10;
  const totalAmountWithInterest = Math.round(financedPrincipal * (1 + interestRate));
  const monthlyAmount = Math.round(totalAmountWithInterest / months);
  const adminFee = 400;

  // National ID validation helper (Egyptian ID is 14 digits)
  const isNationalIdValid = (id: string) => /^[23]\d{13}$/.test(id.trim());

  // Handle file uploads (converts file to Data URL for realistic preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
          addToast('تم إرفاق المستند بنجاح', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!customerName.trim() || !nationalId.trim() || !phone.trim() || !address.trim() || !jobTitle.trim() || !employer.trim()) {
        addToast('يرجى استكمال جميع بيانات العميل الشخصية ومكان العمل', 'error');
        return;
      }
      if (!isNationalIdValid(nationalId)) {
        addToast('الرقم القومي غير صحيح. يجب أن يتكون من 14 رقماً ويبدأ بـ 2 أو 3', 'error');
        return;
      }
      if (phone.trim().length < 11) {
        addToast('رقم الهاتف المحمول يجب أن يتكون من 11 رقماً', 'error');
        return;
      }
      if (!guarantorName.trim() || !guarantorPhone.trim() || !guarantorNationalId.trim()) {
        addToast('يرجى ملء بيانات الضامن الأساسية (الاسم، الهاتف، والرقم القومي)', 'error');
        return;
      }
      if (!isNationalIdValid(guarantorNationalId)) {
        addToast('الرقم القومي للضامن غير صحيح. يجب أن يتكون من 14 رقماً', 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!docIdFront || !docIdBack || !docGuarantorId || !docIncome || !docUtility) {
        addToast('يرجى التأكد من إرفاق جميع المستندات الإلزامية الخمسة', 'error');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToLegalTerms) {
      addToast('يرجى الموافقة على الشروط القانونية وتفويض الاستعلام الائتماني', 'error');
      return;
    }

    if (!digitalSignatureName.trim()) {
      addToast('يرجى كتابة الاسم الثلاثي أو الرباعي في خانة التوقيع الرقمي للإقرار', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const app = submitInstallmentApplication({
        orderId: `ORD-${Date.now().toString().slice(-4)}`,
        customerName: customerName.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        phone2: phone2.trim() || undefined,
        email: email.trim() || `${phone.trim()}@customer.nilemart.eg`,
        address: address.trim(),
        landmark: landmark.trim() || 'بجوار المعلم الرئيسي',
        governorate,
        city: city.trim() || undefined,
        jobTitle: jobTitle.trim(),
        employer: employer.trim(),
        workPhone: workPhone.trim() || undefined,
        monthlyIncome,
        guarantorName: guarantorName.trim(),
        guarantorPhone: guarantorPhone.trim(),
        guarantorNationalId: guarantorNationalId.trim(),
        guarantorRelation,
        guarantorAddress: guarantorAddress.trim() || address.trim(),
        guarantorJob: guarantorJob.trim() || 'موظف',
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        plan: {
          months,
          downPayment,
          totalFinanced: financedPrincipal,
          totalAmountWithInterest,
          monthlyAmount,
          interestRate,
          administrativeFee: adminFee
        },
        status: 'pending_review',
        riskScore: monthlyIncome > monthlyAmount * 3.5 ? 'low' : 'medium',
        documents: {
          nationalIdFront: docIdFront,
          nationalIdBack: docIdBack,
          guarantorIdFront: docGuarantorId,
          guarantorIdBack: docGuarantorId,
          incomeProof: docIncome,
          utilityBill: docUtility,
          clientPersonalPhoto: docPersonalPhoto
        },
        customerSignatureData: digitalSignatureName.trim()
      });

      setIsSubmitting(false);
      setSubmittedApp(app);
      addToast('تم تسجيل طلب التقسيط والتعاقد بنجاح!', 'success');
    }, 1200);
  };

  const contractPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintContract = () => {
    if (contractPrintRef.current) {
      printDocumentHtml({
        title: `استمارة وعقد بيع بالتقسيط وإيصال أمانة معتمد`,
        subtitle: `العميل: ${customerName || ''} | السلعة: ${product?.name || ''}`,
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: `INST-${Date.now().toString().slice(-6)}`,
        contentHtml: contractPrintRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col text-right font-['Cairo',sans-serif]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-4 px-6 flex items-center justify-between border-b border-emerald-900 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">استمارة التقسيط المعتمدة وعقد البيع وإيصال الأمانة القانوني</h2>
              <p className="text-xs text-emerald-200">
                منظومة قانونية محكمة 100% طبقاً لأحكام القانون المدني وقانون العقوبات المصري
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 4 && (
              <button
                type="button"
                onClick={handlePrintContract}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة العقد</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsInstallmentModalOpen(false);
                setSubmittedApp(null);
                setStep(1);
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        {!submittedApp && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs font-bold print:hidden overflow-x-auto">
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 1 ? 'text-emerald-700' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1</span>
              <span>خطة التقسيط</span>
            </div>
            <div className="h-0.5 w-6 sm:w-12 mx-2 bg-gray-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 2 ? 'text-emerald-700' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>2</span>
              <span>البيانات الشخصية والضامن</span>
            </div>
            <div className="h-0.5 w-6 sm:w-12 mx-2 bg-gray-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 3 ? 'text-emerald-700' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>3</span>
              <span>إرفاق المستندات الإلزامية</span>
            </div>
            <div className="h-0.5 w-6 sm:w-12 mx-2 bg-gray-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 4 ? 'text-emerald-700' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>4</span>
              <span>مراجعة وتوقيع العقد الرسمي</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {submittedApp ? (
            /* Application Submitted Success */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-950">
                  تم استلام وتوثيق طلب التقسيط بنجاح برقم #{submittedApp.id}
                </h3>
                <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                  تم تسجيل ملفك الائتماني، إرفاق كافة المستندات المطلوبة، وإصدار عقد البيع بالتقسيط وإيصال الأمانة الثلاثي الأطراف المعتمد. يقوم قسم الائتمان بفحص الملف ومطابقة الأوراق خلال 24 ساعة.
                </p>
              </div>

              {/* Legal Reference & File Info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-right space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-emerald-200 pb-2">
                  <span className="text-gray-600 font-bold">رقم العقد القانوني المخصص:</span>
                  <span className="font-mono font-black text-emerald-900">{submittedApp.contractNumber}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-2">
                  <span className="text-gray-600 font-bold">رقم إيصال الأمانة الثلاثي:</span>
                  <span className="font-mono font-black text-emerald-900">{submittedApp.promissoryNoteNumber}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-2">
                  <span className="text-gray-600 font-bold">المنتج:</span>
                  <span className="font-bold text-gray-900 line-clamp-1">{submittedApp.productName}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-200 pb-2">
                  <span className="text-gray-600 font-bold">القسط الشهري:</span>
                  <span className="font-black text-emerald-700">{submittedApp.plan.monthlyAmount.toLocaleString()} ج.م / شهر ({submittedApp.plan.months} شهر)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-bold">حالة الطلب:</span>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    قيد فحص الأوراق والموافقة من الإدارة
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintContract}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>طباعة نسختك من العقد وإيصال الأمانة</span>
                </button>
                <button
                  onClick={() => {
                    setIsInstallmentModalOpen(false);
                    setSubmittedApp(null);
                    setStep(1);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-xs transition-colors shadow-lg cursor-pointer"
                >
                  العودة للمتجر
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 1: Installment Plan */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Selected Product Summary */}
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-contain bg-white rounded-lg border p-1"
                    />
                    <div className="flex-1">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">{product.brand}</div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                      <div className="text-sm font-black text-gray-950 mt-1">
                        السعر النقدي: {product.price.toLocaleString()} ج.م
                      </div>
                    </div>
                  </div>

                  {/* Tenor Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                      اختر مدة التقسيط (الشهور):
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[3, 6, 12, 18, 24].filter(m => m <= (product.maxInstallmentMonths || 12)).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonths(m)}
                          className={`py-2.5 rounded-xl border text-xs font-black transition-all ${
                            months === m
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                          }`}
                        >
                          {m} شهر
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Down Payment Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                      نسبة الدفعة المقدمة:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 10, 20, 30].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDownPaymentPercent(pct)}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            downPaymentPercent === pct
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                          }`}
                        >
                          {pct === 0 ? 'بدون مقدم (0%)' : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Math Breakdown Box */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-gray-500 text-[10px] block">المقدم المطلوب:</span>
                      <span className="text-sm font-black text-gray-900">{downPayment.toLocaleString()} ج.م</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-gray-500 text-[10px] block">المبلغ المموّل:</span>
                      <span className="text-sm font-black text-gray-900">{financedPrincipal.toLocaleString()} ج.م</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-gray-500 text-[10px] block">إجمالي الفوائد والمصاريف:</span>
                      <span className="text-sm font-black text-gray-900">{(totalAmountWithInterest - financedPrincipal).toLocaleString()} ج.م</span>
                    </div>
                    <div className="bg-emerald-700 text-white p-2.5 rounded-xl shadow-sm">
                      <span className="text-emerald-200 text-[10px] block">القسط الشهري الثابت:</span>
                      <span className="text-base font-black">{monthlyAmount.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Full Personal Data & Guarantor */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      طبقاً لقانون التجارة المصري، يجب تسجيل كافة البيانات الشخصية والوظيفية بدقة لمطابقتها مع بطاقة الرقم القومي.
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-gray-950 uppercase border-b pb-1">أولاً: بيانات العميل الشخصية (الطرف الثاني المشتري):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">الاسم الرباعي كاملاً (طابق البطاقة) *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: أحمد محمود علي عبد الرحيم"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">الرقم القومي للعميل (14 رقماً) *</label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        placeholder="29501010101234"
                        value={nationalId}
                        onChange={e => setNationalId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">رقم التليفون الأساسي المحمول *</label>
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        placeholder="010XXXXXXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">رقم هاتف بديل أو أرضي</label>
                      <input
                        type="tel"
                        placeholder="رقم بديل للطوارئ"
                        value={phone2}
                        onChange={e => setPhone2(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">المحافظة *</label>
                      <select
                        value={governorate}
                        onChange={e => setGovernorate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {Object.keys(settings.shippingFeesByGovernorate || {}).map(gov => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">المدينة أو الحي *</label>
                      <input
                        type="text"
                        placeholder="مدينة نصر / التجمع / المعادي"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">العنوان التفصيلي طبقاً لبطاقة الرقم القومي *</label>
                      <input
                        type="text"
                        required
                        placeholder="رقم العقار، اسم الشارع، رقم الشقة والدور"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">علامة مميزة بالعنوان *</label>
                      <input
                        type="text"
                        required
                        placeholder="بجوار مدرسة أو مسجد أو صيدلية"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-gray-950 uppercase border-b pb-1 pt-2">ثانياً: بيانات العمل والدخل الشهري:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">جهة العمل / اسم الشركة *</label>
                      <input
                        type="text"
                        required
                        placeholder="شركة النور أو جهة حكومية"
                        value={employer}
                        onChange={e => setEmployer(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">المسمى الوظيفي الحالي *</label>
                      <input
                        type="text"
                        required
                        placeholder="مهندس برمجيات / محاسب / مدير"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">تليفون العمل / الخط الأرضي</label>
                      <input
                        type="tel"
                        placeholder="02XXXXXXXX"
                        value={workPhone}
                        onChange={e => setWorkPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">الدخل الشهري الصافي (ج.م) *</label>
                      <input
                        type="number"
                        required
                        value={monthlyIncome}
                        onChange={e => setMonthlyIncome(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-gray-950 uppercase border-b pb-1 pt-2">ثالثاً: بيانات الضامن المتضامن الكفيل الغارم (الطرف الثالث):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">اسم الضامن الرباعي *</label>
                      <input
                        type="text"
                        required
                        placeholder="اسم الوالد / الشقيق / الزوجة"
                        value={guarantorName}
                        onChange={e => setGuarantorName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">الرقم القومي للضامن (14 رقماً) *</label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        placeholder="28001010101234"
                        value={guarantorNationalId}
                        onChange={e => setGuarantorNationalId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">صلة القرابة بالعميل *</label>
                      <input
                        type="text"
                        required
                        placeholder="والد / والدة / شقيق / شريك"
                        value={guarantorRelation}
                        onChange={e => setGuarantorRelation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">رقم هاتف الضامن *</label>
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        placeholder="010XXXXXXXX"
                        value={guarantorPhone}
                        onChange={e => setGuarantorPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">محل إقامة وعمل الضامن</label>
                      <input
                        type="text"
                        placeholder="عنوان إقامة الضامن ووظيفته"
                        value={guarantorAddress}
                        onChange={e => setGuarantorAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Mandatory Document Uploads */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      إرفاق المستندات الرسمية إلزامي لتأمين كامل الحقوق وإصدار إيصال الأمانة المعتمد. يمكنك رفع صور من جهازك أو استخدام المستندات النموذجية المرفقة.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {/* Doc 1: National ID Front */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">1. بطاقة الرقم القومي (الوجه) *</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">إلزامي</span>
                        </div>
                        <img src={docIdFront} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع صورة البطاقة (وجه)</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocIdFront)} />
                      </label>
                    </div>

                    {/* Doc 2: National ID Back */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">2. بطاقة الرقم القومي (الظهر) *</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">إلزامي</span>
                        </div>
                        <img src={docIdBack} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع صورة البطاقة (ظهر)</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocIdBack)} />
                      </label>
                    </div>

                    {/* Doc 3: Guarantor ID */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">3. بطاقة الرقم القومي للضامن *</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">إلزامي</span>
                        </div>
                        <img src={docGuarantorId} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع بطاقة الضامن</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocGuarantorId)} />
                      </label>
                    </div>

                    {/* Doc 4: Income Proof */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">4. مفردات مرتب / كشف حساب *</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">إلزامي</span>
                        </div>
                        <img src={docIncome} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع إثبات الدخل</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocIncome)} />
                      </label>
                    </div>

                    {/* Doc 5: Utility Bill */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">5. إيصال مرافق حديث (كهرباء/غاز) *</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">إلزامي</span>
                        </div>
                        <img src={docUtility} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع إيصال المرافق</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocUtility)} />
                      </label>
                    </div>

                    {/* Doc 6: Personal Photo */}
                    <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">6. صورة شخصية للعميل (سيلفي)</span>
                          <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">موصى به</span>
                        </div>
                        <img src={docPersonalPhoto} alt="" className="w-full h-24 object-cover rounded-xl border bg-white" />
                      </div>
                      <label className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-1.5 px-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رفع الصورة الشخصية</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setDocPersonalPhoto)} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: The 100% Legal Contract & Tripartite Promissory Note */}
              {step === 4 && (
                <div className="space-y-6">
                  {/* Contract Header Card */}
                  <div ref={contractPrintRef} className="border-2 border-gray-900 bg-white rounded-2xl p-6 space-y-6 text-gray-900">
                    <div className="border-b-2 border-gray-900 pb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-base font-black text-gray-950">جمهورية مصر العربية</h3>
                        <div className="text-xs font-bold text-gray-800">
                          شركة {settings.storeName} للتجارة والتوزيع ش.م.م (س.ت: 14892 الجيزة)
                        </div>
                        <div className="text-[11px] text-gray-500">
                          عقد بيع بالتقسيط مع حفظ حق الملكية وحظر التصرف وإيصال أمانة ثلاثي
                        </div>
                      </div>

                      <div className="text-left font-mono text-xs space-y-1">
                        <div className="font-black text-emerald-800">العقد: EG-LGL-2026-AUTO</div>
                        <div className="text-gray-600 font-bold">إيصال أمانة: EGY-BOND-3P</div>
                        <div className="text-gray-400 text-[10px]">تاريخ: {new Date().toISOString().split('T')[0]}</div>
                      </div>
                    </div>

                    {/* Parties Clause */}
                    <div className="text-xs text-justify leading-relaxed space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-black text-sm text-gray-950 underline">أولاً: أطراف التعاقد:</h4>
                      <p>
                        <strong>1. شركة {settings.storeName} للتجارة والتوزيع ش.م.م</strong>، ويمثلها في التوقيع السيد المدير التنفيذي / رئيس قطاع الائتمان (طرف أول - بائع).
                      </p>
                      <p>
                        <strong>2. السيد / {customerName || 'اسم العميل'}</strong>، مصري الجنسية، بطاقة رقم قومي: <strong>({nationalId || 'الرقم القومي'})</strong>، المقيم في: {address || 'العنوان'}، {governorate}، هاتف: ({phone})، ويعمل: {jobTitle || 'الوظيفة'} لدى: {employer || 'جهة العمل'} (طرف ثانٍ - مشتري ومدين).
                      </p>
                      <p>
                        <strong>3. السيد / {guarantorName || 'اسم الضامن'}</strong>، بطاقة رقم قومي: <strong>({guarantorNationalId || 'رقم قومي الضامن'})</strong>، صلة القرابة: ({guarantorRelation})، هاتف: ({guarantorPhone}) (طرف ثالث - ضامن متضامن وكفيل غارم).
                      </p>
                    </div>

                    {/* Terms */}
                    <div className="text-xs text-justify leading-relaxed space-y-2.5">
                      <h4 className="font-black text-sm text-gray-950 underline">ثانياً: شروط العقد وبنود الحماية القانونية المحكمة (تدرأ أي دفع أو ثغرة):</h4>
                      <p>
                        <strong>البند الأول (المبيع):</strong> باع الطرف الأول وأسقط وتنازل بكافة الضمانات الفعلية والقانونية للطرف الثاني القابل لذلك ما هو: <strong>{product.name}</strong> بحالة جديدة تماماً ومطابقة للمواصفات القياسية.
                      </p>
                      <p>
                        <strong>البند الثاني (الثمن والأقساط):</strong> اتفق الطرفان على أن إجمالي الثمن بالتقسيط هو <strong>{totalAmountWithInterest.toLocaleString()} ج.م</strong>، يسدد منه الطرف الثاني دفعة مقدمة قدرها <strong>{downPayment.toLocaleString()} ج.م</strong>، والباقي وقدره <strong>{financedPrincipal.toLocaleString()} ج.م</strong> يسدد على <strong>({months}) قسطاً شهرياً متتالياً</strong>، قيمة كل قسط <strong>{monthlyAmount.toLocaleString()} ج.م</strong>.
                      </p>
                      <p className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-950 font-bold">
                        <strong>البند الثالث (حفظ حق الملكية وحظر التصرف - م 430 مدني):</strong> تظل ملكية المبيع محجوزة ومملوكة ملكية رقبة ومنفعة للطرف الأول البائع، ولا تنتقل ملكية المبيع للطرف الثاني إلا بعد سداد كامل الثمن والأقساط حتى آخر قسط. ويحظر على الطرف الثاني بيع أو رهن أو إيجار أو التصرف بأي صورة في المبيع قبل سداد كامل الثمن، ويعد أي تصرف منه تبديداً معاقباً عليه جنائياً.
                      </p>
                      <p className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-rose-950 font-bold">
                        <strong>البند الرابع (الشرط الفاسخ الصريح وسقوط الأجل - م 158 مدني):</strong> إذا تخلف الطرف الثاني عن سداد أي قسط في ميعاده أو تأخر لأكثر من 10 أيام، يعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار أو حكم قضائي، وتسقط جميع الأقساط المتبقية وتصبح حالة الأداء فوراً، ويحق للطرف الأول استرداد المبيع ومصادرة ما تم سداده كتعويض اتفاقي غير خاضع لرقابة القضاء.
                      </p>
                      <p>
                        <strong>البند الخامس (تضامن الضامن):</strong> يقر الطرف الثالث (الضامن) بأنه يضمن الطرف الثاني ضماناً تضامنياً مطلقاً ككفيل غارم متضامن في سداد كامل الأقساط والتعويضات، متنازلاً عن حقه في التجريد أو الدفع بالرجوع على المدين أولاً.
                      </p>
                    </div>

                    {/* Tripartite Promissory Note (إيصال أمانة ثلاثي الأطراف معتمد بنود المادة 341 عقوبات) */}
                    <div className="border-2 border-dashed border-gray-900 bg-amber-50/70 p-5 rounded-2xl space-y-3">
                      <div className="text-center space-y-1 border-b border-amber-200 pb-2">
                        <span className="bg-slate-900 text-amber-400 font-black text-[11px] px-3 py-0.5 rounded-full uppercase">
                          إيصال أمانة قانوني واجب النفاذ الجنائي (ثلاثي الأطراف)
                        </span>
                        <h3 className="text-base font-black text-gray-950">إيـصـال أمـانـة</h3>
                      </div>

                      <p className="text-xs text-justify leading-loose">
                        استلمت أنا الموقع أدناه / <strong>{customerName || 'اسم العميل'}</strong>، مصري الجنسية، بطاقة رقم قومي: <strong>({nationalId || 'الرقم القومي'})</strong>، والمقيم في: <strong>{address || 'العنوان'}، {governorate}</strong>،
                        من السيد / <strong>ممثل شركة {settings.storeName} للتجارة والتوزيع ش.م.م</strong>،
                        مبلغاً وقدره <strong>{totalAmountWithInterest.toLocaleString()} ج.م (فقط وقدره {totalAmountWithInterest.toLocaleString()} جنيه مصري لا غير)</strong>،
                        <strong>
                          وذلك على سبيل الأمانة لتسليمه إلى السيد / المستشار القانوني للشركة، ولصالح تصفية حساب التعاقد بالتقسيط.
                        </strong>
                        وإذا لم أقم بتسليم هذا المبلغ أكون مبدداً وخائناً للأمانة ومسؤولاً جنائياً ومدنياً طبقاً لأحكام <strong>المادة 341 من قانون العقوبات المصري</strong>.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-amber-200 text-[11px]">
                        <div>
                          <span className="font-bold block text-gray-700">المقر بما فيه (المستلم):</span>
                          <span className="font-black text-gray-950 block">{customerName || 'اسم العميل'}</span>
                          <span className="font-mono text-gray-500 block">{nationalId || 'الرقم القومي'}</span>
                        </div>
                        <div className="text-center">
                          <span className="font-bold block text-gray-700">بصمة الإبهام الأيمن:</span>
                          <div className="w-12 h-12 border-2 border-emerald-600 rounded-xl bg-emerald-50 mx-auto flex items-center justify-center text-emerald-700 mt-1">
                            <Fingerprint className="w-8 h-8" />
                          </div>
                          <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">موثق إلكترونياً</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-bold block text-gray-700">ختم وتوثيق الشركة:</span>
                          <div className="w-12 h-12 border-2 border-amber-600 rounded-full bg-amber-50 mx-auto flex items-center justify-center text-amber-700 mt-1">
                            <Stamp className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-amber-900 font-bold block text-center mt-0.5">{settings.storeName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Signature Input */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <FileCheck2 className="w-4 h-4" />
                        <span>التوقيع الإلكتروني والإقرار الرسمي للعميل:</span>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-xs mb-1">اكتب اسمك الثلاثي أو الرباعي هنا للتوقيع والموافقة على العقد وإيصال الأمانة *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: أحمد محمود علي عبد الرحيم"
                          value={digitalSignatureName}
                          onChange={e => setDigitalSignatureName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-amber-400 text-xs font-bold"
                        />
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToLegalTerms}
                          onChange={e => setAgreedToLegalTerms(e.target.checked)}
                          className="mt-1 text-emerald-500 rounded focus:ring-emerald-400"
                        />
                        <span className="text-xs font-bold text-emerald-300">
                          أقر أنا الموقع أعلاه بصحة كافة البيانات المدخلة، وأوافق على كافة بنود عقد البيع بالتقسيط وإيصال الأمانة المذكور، وأفوض إدارة المتجر بالاستعلام لدى البنك المركزي والشركة المصرية للاستعلام الائتماني (I-Score).
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!submittedApp && (
          <div className="bg-gray-50 border-t border-gray-200 p-4 px-6 flex items-center justify-between print:hidden">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 transition-colors cursor-pointer"
              >
                السابق
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span>{step === 3 ? 'معاينة العقد القانوني وإيصال الأمانة' : 'متابعة الخطوة التالية'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !agreedToLegalTerms || !digitalSignatureName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-black px-8 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <span>جارٍ تسجيل العقد وتوثيق إيصال الأمانة...</span>
                ) : (
                  <span>تأكيد التوقيع وإرسال طلب التقسيط</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
