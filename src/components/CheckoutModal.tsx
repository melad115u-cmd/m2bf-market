import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethodType } from '../types';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building,
  CheckCircle2,
  Lock,
  CalendarCheck,
  MapPin,
  Phone,
  Copy,
  Check
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    createOrder,
    openInstallmentApplication,
    settings,
    getShippingFee,
    addToast
  } = useStore();

  // Form Fields per user exact specifications
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState(''); // إلزامي
  const [customerPhone2, setCustomerPhone2] = useState(''); // اختياري
  const [customerEmail, setCustomerEmail] = useState(''); // اختياري
  const [governorate, setGovernorate] = useState('القاهرة');
  const [shippingAddress, setShippingAddress] = useState(''); // إلزامي
  const [landmark, setLandmark] = useState(''); // علامة مميزة بالمكان (إلزامي)

  // Payment methods: instapay, vodafone_cash, orange_cash, etisalat_cash, bank_transfer, cash_on_delivery, installment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('instapay');

  // Customer transfer references
  const [walletNumber, setWalletNumber] = useState('');
  const [instapayHandle, setInstapayHandle] = useState('');
  const [bankAccountRef, setBankAccountRef] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingFee = cartTotal > 0 ? getShippingFee(governorate) : 0;
  const finalTotal = cartTotal + shippingFee;

  // Check if any cart item allows installments
  const hasInstallmentItem = cart.some(item => item.product.isInstallmentAvailable);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      addToast('يرجى إدخال الاسم بالكامل', 'error');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 11) {
      addToast('يرجى إدخال رقم هاتف محمول أساسي صحيح (11 رقماً)', 'error');
      return;
    }

    if (!shippingAddress.trim()) {
      addToast('يرجى كتابة العنوان بالتفصيل', 'error');
      return;
    }

    if (!landmark.trim()) {
      addToast('يرجى كتابة علامة مميزة بالمكان لتسهيل وصول المندوب', 'error');
      return;
    }

    // If installment is chosen
    if (paymentMethod === 'installment') {
      const eligibleItem = cart.find(i => i.product.isInstallmentAvailable) || cart[0];
      if (eligibleItem) {
        setIsCheckoutOpen(false);
        openInstallmentApplication(eligibleItem.product);
      }
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerPhone2: customerPhone2.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        landmark: landmark.trim(),
        governorate,
        items: [...cart],
        subtotal: cartTotal,
        shippingFee,
        discount: 0,
        total: finalTotal,
        paymentMethod,
        paymentDetails: {
          method: paymentMethod,
          walletNumber: walletNumber || undefined,
          instapayHandle: instapayHandle || undefined,
          bankAccountRef: bankAccountRef || undefined,
          paidAt: new Date().toISOString(),
          isPaid: paymentMethod !== 'cash_on_delivery'
        },
        isInstallment: false,
        status: 'received'
      });

      setIsProcessing(false);
      setCompletedOrder(order);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-[#131921] text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black">
              {completedOrder ? 'تم تأكيد طلبك بنجاح' : 'إتمام الشراء وبيانات التوصيل والدفع'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedOrder(null);
            }}
            className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-950">
                  تم استلام طلبك بنجاح! رقم الشحنة #{completedOrder.id}
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  شكراً لشرائك من {settings.storeName}. تم تسجيل طلبك ويمكنك متابعة مساره في أي وقت من زر "متابعة طلبي" برقم الطلب أو الهاتف.
                </p>
              </div>

              {/* Order Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-md mx-auto text-right text-xs space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">اسم العميل:</span>
                  <span className="font-bold text-gray-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {completedOrder.customerPhone} {completedOrder.customerPhone2 ? ` / ${completedOrder.customerPhone2}` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">العنوان والعلامة المميزة:</span>
                  <span className="font-bold text-gray-900">
                    {completedOrder.governorate} - {completedOrder.shippingAddress} ({completedOrder.landmark})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">طريقة الدفع:</span>
                  <span className="font-bold text-indigo-700">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-600 font-bold">المبلغ المستحق:</span>
                  <span className="text-lg font-black text-amber-600">
                    {completedOrder.total.toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCompletedOrder(null);
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-8 py-3 rounded-xl text-xs transition-colors"
              >
                العودة للمتجر
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* 1. Customer Information (As requested: Name, Phone 1, Phone 2 optional, Address, Landmark required, Email optional) */}
              <div>
                <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  <span>بيانات المشتري ومقر التوصيل (المطلوبة للشحن)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-800 font-bold mb-1">
                      الاسم بالكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمود عبد الرحمن"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Phone 1 (Required) */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1">
                      رقم التليفون الأساسي * (إلزامي)
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      placeholder="010XXXXXXXX / 011 / 012 / 015"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    />
                  </div>

                  {/* Phone 2 (Optional) */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1">
                      رقم تليفون بديل أو أرضي (اختياري)
                    </label>
                    <input
                      type="tel"
                      placeholder="رقم تليفون إضافي للتواصل"
                      value={customerPhone2}
                      onChange={e => setCustomerPhone2(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    />
                  </div>

                  {/* Governorate / Shipping Region */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1">
                      المحافظة أو المنطقة * (يحدد تكلفة الشحن ومدة التوصيل)
                    </label>
                    <select
                      value={governorate}
                      onChange={e => setGovernorate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      {settings.shippingRegions && settings.shippingRegions.length > 0 ? (
                        settings.shippingRegions.map(reg => (
                          <option key={reg.id} value={reg.name}>
                            {reg.name} (شحن: {reg.fee} ج.م) {reg.deliveryDays ? `• ${reg.deliveryDays}` : ''}
                          </option>
                        ))
                      ) : (
                        Object.keys(settings.shippingFeesByGovernorate || {}).map(gov => (
                          <option key={gov} value={gov}>
                            {gov} (شحن: {settings.shippingFeesByGovernorate[gov]} ج.م)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-gray-800 font-bold mb-1">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Detailed Address (Required) */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-800 font-bold mb-1">
                      العنوان بالتفصيل * (الشارع، رقم العقار، الشقة)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شارع التحرير، عمارة 24، الدور الثالث شقة 5"
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Landmark (Required as requested) */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-800 font-bold mb-1 flex items-center gap-1">
                      <span>علامة مميزة بالمكان *</span>
                      <span className="text-gray-400 font-normal text-[11px]">(مسجد، مدرسة، مستشفى، بنك، سوبرماركت مشهور بجوارك)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: بجوار بنك CIB وأمام مسجد النور ومحطة الأتوبيس"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method (InstaPay, Vodafone Cash, Orange Cash, Etisalat Cash, Bank Transfer, COD, Installment) */}
              <div>
                <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  <span>طريقة الدفع المختارة:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {/* InstaPay */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'instapay'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="instapay"
                        checked={paymentMethod === 'instapay'}
                        onChange={() => setPaymentMethod('instapay')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <QrCode className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">إنستاباي (InstaPay)</div>
                      <div className="text-[10px] text-gray-500">تحويل بنكي لحظي عبر المعرف الرسمي</div>
                    </div>
                  </label>

                  {/* Vodafone Cash */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-rose-500 bg-rose-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vodafone_cash"
                        checked={paymentMethod === 'vodafone_cash'}
                        onChange={() => setPaymentMethod('vodafone_cash')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <Smartphone className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">فودافون كاش (Vodafone)</div>
                      <div className="text-[10px] text-gray-500">تحويل لمحفظة كاش الخاصة بالمتجر</div>
                    </div>
                  </label>

                  {/* Orange Cash */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'orange_cash'
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="orange_cash"
                        checked={paymentMethod === 'orange_cash'}
                        onChange={() => setPaymentMethod('orange_cash')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <Smartphone className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">أورانج كاش (Orange Cash)</div>
                      <div className="text-[10px] text-gray-500">تحويل لمحفظة أورانج المعتمدة</div>
                    </div>
                  </label>

                  {/* Etisalat Cash */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'etisalat_cash'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="etisalat_cash"
                        checked={paymentMethod === 'etisalat_cash'}
                        onChange={() => setPaymentMethod('etisalat_cash')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">اتصالات كاش (Etisalat Cash)</div>
                      <div className="text-[10px] text-gray-500">تحويل لمحفظة اتصالات كاش</div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-sky-600 bg-sky-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <Building className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">تحويل بنكي على الحساب</div>
                      <div className="text-[10px] text-gray-500">إيداع بحساب الشركة في البنك الأهلي</div>
                    </div>
                  </label>

                  {/* Cash On Delivery */}
                  <label
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <Banknote className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">الدفع عند الاستلام (COD)</div>
                      <div className="text-[10px] text-gray-500">معاينة الشحنة قبل الاستلام والدفع</div>
                    </div>
                  </label>

                  {/* Installment option if items eligible */}
                  {hasInstallmentItem && (
                    <label
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                        paymentMethod === 'installment'
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="installment"
                          checked={paymentMethod === 'installment'}
                          onChange={() => setPaymentMethod('installment')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <CalendarCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-emerald-950">تقسيط معتمد بعقود وإيصالات</div>
                        <div className="text-[10px] text-emerald-700">رفع الأوراق والمستندات الرسمية</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Dynamic Payment Details Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-3">
                {paymentMethod === 'instapay' && (
                  <div className="space-y-2">
                    <div className="font-bold text-indigo-950 flex items-center justify-between">
                      <span>عنوان إنستاباي التجاري المعتمد (IPA):</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.instapayAddress)}
                        className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ العنوان</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-200 font-mono font-black text-indigo-700 text-sm">
                      {settings.instapayAddress}
                    </div>
                    <input
                      type="text"
                      placeholder="عنوان الـ IPA الخاص بك أو رقم العملية المرجعية بعد التحويل"
                      value={instapayHandle}
                      onChange={e => setInstapayHandle(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                )}

                {paymentMethod === 'vodafone_cash' && (
                  <div className="space-y-2">
                    <div className="font-bold text-rose-950 flex items-center justify-between">
                      <span>رقم محفظة فودافون كاش الرسمية:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.vodafoneCashNumber)}
                        className="text-rose-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ الرقم</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-rose-200 font-mono font-black text-rose-700 text-sm">
                      {settings.vodafoneCashNumber}
                    </div>
                    <input
                      type="tel"
                      placeholder="رقم المحفظة التي قمت بالتحويل منها (010...)"
                      value={walletNumber}
                      onChange={e => setWalletNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'orange_cash' && (
                  <div className="space-y-2">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>رقم محفظة أورانج كاش الرسمية:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.orangeCashNumber)}
                        className="text-amber-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ الرقم</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 font-mono font-black text-amber-700 text-sm">
                      {settings.orangeCashNumber}
                    </div>
                    <input
                      type="tel"
                      placeholder="رقم المحفظة التي قمت بالتحويل منها (012...)"
                      value={walletNumber}
                      onChange={e => setWalletNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'etisalat_cash' && (
                  <div className="space-y-2">
                    <div className="font-bold text-emerald-950 flex items-center justify-between">
                      <span>رقم محفظة اتصالات كاش الرسمية:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.etisalatCashNumber)}
                        className="text-emerald-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>نسخ الرقم</span>
                      </button>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono font-black text-emerald-700 text-sm">
                      {settings.etisalatCashNumber}
                    </div>
                    <input
                      type="tel"
                      placeholder="رقم المحفظة التي قمت بالتحويل منها (011...)"
                      value={walletNumber}
                      onChange={e => setWalletNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                    />
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-2">
                    <div className="font-bold text-sky-950">بيانات الحساب البنكي الرسمي:</div>
                    <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-1 font-mono text-[11px]">
                      <div><strong>البنك:</strong> {settings.bankName}</div>
                      <div><strong>اسم الحساب:</strong> {settings.bankAccountHolder}</div>
                      <div><strong>رقم الحساب:</strong> {settings.bankAccountNumber}</div>
                      <div><strong>الآيبان IBAN:</strong> {settings.bankAccountIban}</div>
                    </div>
                    <input
                      type="text"
                      placeholder="رقم إيصال الإيداع أو اسم المحوّل كما في البنك"
                      value={bankAccountRef}
                      onChange={e => setBankAccountRef(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                )}

                {paymentMethod === 'cash_on_delivery' && (
                  <p className="text-gray-600 text-[11px]">
                    يتاح لك معاينة الشحنة وفحصها مع مندوب التوصيل قبل سداد المبلغ نقدياً.
                  </p>
                )}
              </div>

              {/* Submit Total */}
              <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500">المبلغ الإجمالي للدفع:</div>
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    {finalTotal.toLocaleString()} ج.م
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 disabled:bg-gray-300 text-slate-950 font-black px-8 py-3 rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>جارٍ معالجة وتأكيد الطلب...</span>
                  ) : paymentMethod === 'installment' ? (
                    <span>الانتقال لنموذج التقسيط والعقود الرسمية</span>
                  ) : (
                    <span>تأكيد الطلب الآن</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
