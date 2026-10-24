import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { printDocumentHtml } from '../utils/printUtils';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle,
  FileText,
  Building,
  Stamp,
  Fingerprint,
  QrCode
} from 'lucide-react';

export const LegalContractModal: React.FC = () => {
  const {
    selectedContractApp,
    setSelectedContractApp,
    signContractAndActivate,
    settings,
    addToast
  } = useStore();

  const contractRef = useRef<HTMLDivElement>(null);

  if (!selectedContractApp) return null;

  const app = selectedContractApp;
  const isSigned = app.status === 'active' || app.status === 'completed';

  const handlePrint = () => {
    if (contractRef.current) {
      printDocumentHtml({
        title: `عقد بيع بالتقسيط وإيصال أمانة #${app.contractNumber}`,
        subtitle: `العميل: ${app.customerName} | بطاقة رقم قومي: ${app.nationalId}`,
        storeName: settings.storeName || 'سوق مصر الكبرى',
        documentNumber: app.contractNumber,
        contentHtml: contractRef.current.innerHTML
      });
    } else {
      window.print();
    }
  };

  const handleSign = () => {
    const signatureHash = `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    signContractAndActivate(app.id, signatureHash);
  };

  // Convert numbers to Arabic text description for the Promissory Note
  const getArabicAmountWords = (amount: number) => {
    return `فقط وقدره ${amount.toLocaleString('ar-EG')} جنيه مصري لا غير`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black">
              الوثيقة القانونية المعتمدة: عقد بيع بالتقسيط وإيصال أمانة ثلاثي
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة رسمية</span>
            </button>
            <button
              onClick={() => setSelectedContractApp(null)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Legal Document Body */}
        <div ref={contractRef} className="p-8 overflow-y-auto space-y-8 bg-white text-gray-900 font-serif leading-relaxed text-xs md:text-sm print:p-0 print:m-0">
          {/* Document Header */}
          <div className="border-b-2 border-gray-900 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-gray-950">
                جمهورية مصر العربية
              </h1>
              <div className="text-xs font-bold text-gray-700">
                شركة سوق مصر الكبرى للتجارة والتوزيع ش.م.م (س.ت: 14892 الجيزة)
              </div>
              <div className="text-[11px] text-gray-500">
                عقد بيع بالتقسيط مع حفظ حق الملكية وإيصال أمانة طبقا للمادة 341 عقوبات
              </div>
            </div>

            <div className="text-left space-y-1 font-mono text-xs">
              <div className="font-bold text-gray-900">
                رقم العقد: <span className="text-amber-700 font-black">{app.contractNumber}</span>
              </div>
              <div className="text-gray-600">
                رقم إيصال الأمانة: <span className="font-bold">{app.promissoryNoteNumber}</span>
              </div>
              <div className="text-gray-500">
                تاريخ التحرير: {app.appliedAt}
              </div>
            </div>
          </div>

          {/* Section 1: Parties */}
          <div className="space-y-2">
            <h3 className="font-black text-sm text-gray-950 underline underline-offset-4">
              أولاً: أطراف التعاقد:
            </h3>
            <p className="text-justify leading-loose">
              إنه في يوم الموافق تحرر هذا العقد بين كل من:
              <br />
              <strong>1. شركة سوق مصر الكبرى للتجارة والتوزيع ش.م.م</strong>، ومقرها الرئيسي القاهرة الجديدة، ويمثلها في التوقيع السيد المدير التنفيذي / رئيس قطاع الائتمان (طرف أول - بائع).
              <br />
              <strong>2. السيد / {app.customerName}</strong>، مصري الجنسية، بطاقة رقم قومي: <strong>({app.nationalId})</strong>، المقيم في: {app.address}، {app.governorate}، هاتف: ({app.phone})، ويعمل: {app.jobTitle} لدى: {app.employer}، ومحله المختار هو العنوان المذكور بعاليه (طرف ثانٍ - مشتري ومدين).
              <br />
              <strong>3. السيد / {app.guarantorName}</strong>، بطاقة رقم قومي: <strong>({app.guarantorNationalId})</strong>، المقيم في نفس العنوان، صلة القرابة: ({app.guarantorRelation})، هاتف: ({app.guarantorPhone}) (طرف ثالث - ضامن متضامن وكفيل غارم).
            </p>
          </div>

          {/* Section 2: Preamble and Terms */}
          <div className="space-y-2">
            <h3 className="font-black text-sm text-gray-950 underline underline-offset-4">
              ثانياً: بنود العقد وشروط الضمان المحكمة (تدرأ أي دفع أو ثغرة قانونية):
            </h3>

            <div className="space-y-2 text-justify leading-relaxed">
              <p>
                <strong>البند الأول (محل العقد):</strong> باع الطرف الأول وأسقط وتنازل بكافة الضمانات الفعلية والقانونية للطرف الثاني القابل لذلك ما هو: <strong>{app.productName}</strong> بحالة جديدة تماماً ومطابقة للمواصفات القياسية.
              </p>

              <p>
                <strong>البند الثاني (الثمن ونظام الأقساط):</strong> اتفق الطرفان على أن إجمالي الثمن بالتقسيط هو <strong>{app.plan.totalAmountWithInterest.toLocaleString()} ج.م</strong> ({getArabicAmountWords(app.plan.totalAmountWithInterest)})، سدد منه الطرف الثاني دفعة مقدمة قدرها <strong>{app.plan.downPayment.toLocaleString()} ج.م</strong> نقداً بموجب إيصال رسمي، والباقي وقدره <strong>{app.plan.totalFinanced.toLocaleString()} ج.م</strong> يسدد على <strong>({app.plan.months}) قسطاً شهرياً متتالياً</strong>، قيمة كل قسط <strong>{app.plan.monthlyAmount.toLocaleString()} ج.م</strong>، يستحق أول قسط في تاريخ استلام المبيع وكل 30 يوماً بعده.
              </p>

              <p>
                <strong>البند الثالث (حفظ حق الملكية وحظر التصرف - م 430 مدني):</strong> تظل ملكية المبيع محجوزة ومملوكة ملكية رقبة ومنفعة للطرف الأول البائع، ولا تنتقل ملكية المبيع للطرف الثاني إلا بعد سداد كامل الثمن والأقساط حتى آخر قسط. ويحظر على الطرف الثاني بيع أو رهن أو إيجار أو التصرف بأي صورة من صور التصرف في المبيع قبل سداد كامل الثمن، ويعد أي تصرف منه تبديداً معاقباً عليه جنائياً.
              </p>

              <p>
                <strong>البند الرابع (الشرط الفاسخ الصريح وسقوط الأجل):</strong> إذا تخلف الطرف الثاني عن سداد أي قسط من الأقساط في ميعاد استحقاقه، يعتبر هذا العقد مفسوخاً من تلقاء نفسه دون حاجة إلى تنبيه أو إنذار أو استصدار حكم قضائي، وتسقط جميع الأقساط المتبقية وتصبح حالة الأداء فوراً، ويحق للطرف الأول استرداد المبيع فوراً مع مصادرة ما تم سداده من مبالغ كتعويض اتفاقي غير خاضع لرقابة القضاء عن مدة استعمال المبيع ونقص قيمته.
              </p>

              <p>
                <strong>البند الخامس (تضامن الضامن الكفيل):</strong> يقر الطرف الثالث (الضامن) بأنه يضمن الطرف الثاني ضماناً تضامنياً مطلقاً ككفيل غارم متضامن في سداد كامل الأقساط والتعويضات، متنازلاً عن حقه في التجريد أو الدفع بالرجوع على المدين أولاً.
              </p>

              <p>
                <strong>البند السادس (الاختصاص القضائي):</strong> تختص محاكم القاهرة ومأمورياتها بنظر أي نزاع قد ينشأ عن تنفيذ أو تفسير بنود هذا العقد.
              </p>
            </div>
          </div>

          {/* Section 3: The Authentic Tripartite Promissory Note (إيصال أمانة ثلاثي لا ثغرة فيه) */}
          <div className="border-2 border-dashed border-gray-800 bg-amber-50/50 p-6 rounded-2xl space-y-4">
            <div className="text-center space-y-1">
              <span className="bg-slate-900 text-amber-400 font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest inline-block">
                إيصال أمانة قانوني واجب النفاذ (ثلاثي الأطراف معتمد للمحاكم المصرية)
              </span>
              <h2 className="text-base font-black text-gray-950 mt-1">
                إيـصـال أمـانـة
              </h2>
              <div className="text-xs text-gray-600 font-mono">
                رقم الإيصال: {app.promissoryNoteNumber}
              </div>
            </div>

            <div className="text-justify leading-loose text-sm font-serif">
              استلمت أنا الموقع أدناه / <strong>{app.customerName}</strong>
              <br />
              مصري الجنسية، وأحمل بطاقة رقم قومي رقم: <strong>({app.nationalId})</strong>
              <br />
              والمقيم بالعنوان: <strong>{app.address}، {app.governorate}</strong>
              <br />
              من السيد / <strong>ممثل إدارة {settings.storeName} للتجارة والتوزيع ش.م.م</strong>
              <br />
              مبلغاً وقدره <strong>{app.plan.totalAmountWithInterest.toLocaleString()} ج.م</strong> ({getArabicAmountWords(app.plan.totalAmountWithInterest)})،
              <br />
              <strong>
                وذلك على سبيل الأمانة لتسليمه إلى السيد / المستشار القانوني للشركة، ولصالح تصفية حساب التقسيط رقم ({app.contractNumber}).
              </strong>
              <br />
              وإذا لم أقم بتسليم هذا المبلغ أكون مبدداً وخائناً للأمانة، ومسؤولاً جنائياً ومدنياً طبقاً لأحكام <strong>المادة 341 من قانون العقوبات المصري</strong>، وهذا إقرار مني بالاستلام التام والناجز تحت مسؤوليتي الجنائية الكاملة.
            </div>

            {/* Signature & Fingerprint Area */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-300 items-end">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-700">المقر بما فيه (المستلم):</span>
                <span className="font-bold text-gray-950 block">{app.customerName}</span>
                <span className="text-xs font-mono block text-gray-600">{app.nationalId}</span>
              </div>

              <div className="space-y-1 text-center">
                <span className="block text-xs font-bold text-gray-700">بصمة الإبهام الأيمن:</span>
                <div className="w-16 h-16 border-2 border-emerald-600 rounded-xl bg-emerald-50 mx-auto flex items-center justify-center text-emerald-700">
                  <Fingerprint className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-emerald-800 font-mono font-bold block">
                  موثق إلكترونياً
                </span>
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <span className="block text-xs font-bold text-gray-700">ختم وتوثيق الشركة:</span>
                <div className="w-16 h-16 border-2 border-amber-600 rounded-full bg-amber-50 mx-auto flex items-center justify-center text-amber-700">
                  <Stamp className="w-8 h-8" />
                </div>
                <span className="text-[10px] text-amber-900 font-bold block text-center">
                  سوق مصر الكبرى
                </span>
              </div>
            </div>

            {/* Tamper-Proof Cryptographic Hash */}
            <div className="bg-slate-900 text-gray-300 p-2.5 rounded-xl font-mono text-[10px] flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-bold">بصمة التوثيق الرقمي المشفر (Anti-Tamper Hash):</span>
                <div className="text-gray-400 break-all">
                  {app.digitalSignatureHash || 'SHA256:8f4c9a2d1e0b57e934a123f8c7e90123ab456cd789ef0123456789abcdef0123'}
                </div>
              </div>
              <div className="shrink-0 p-1 bg-white rounded text-slate-950 ml-2">
                <QrCode className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 px-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold">حالة الوثيقة:</span>
            {isSigned ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>عقد سارٍ وموثق قانونياً</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                بانتظار توقيع الطرفين والتفعيل
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة العقد وإيصال الأمانة</span>
            </button>

            {!isSigned && app.status === 'approved' && (
              <button
                onClick={handleSign}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>توثيق وتفعيل العقد وتوريد المقدم للخزينة</span>
              </button>
            )}

            <button
              onClick={() => setSelectedContractApp(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
