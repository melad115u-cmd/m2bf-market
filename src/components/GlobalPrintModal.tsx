import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  ExternalLink,
  Download,
  X,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { PrintDocumentOptions, subscribeToPrint, generateFullPrintHtml, triggerIframePrint } from '../utils/printUtils';

export const GlobalPrintModal: React.FC = () => {
  const [printDoc, setPrintDoc] = useState<PrintDocumentOptions | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const printSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to print utility triggers
    const unsubscribe = subscribeToPrint((options) => {
      setPrintDoc(options);

      // Create a Blob URL immediately for popup / new tab bypass
      try {
        const fullHtml = generateFullPrintHtml(options);
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error('Failed to create print blob URL:', err);
      }
    });

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<PrintDocumentOptions>;
      if (customEvent.detail) {
        setPrintDoc(customEvent.detail);
        try {
          const fullHtml = generateFullPrintHtml(customEvent.detail);
          const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        } catch (err) {
          console.error('Failed to create print blob URL:', err);
        }
      }
    };

    window.addEventListener('nilemart_open_print_modal', handleCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('nilemart_open_print_modal', handleCustomEvent);
    };
  }, []);

  // Cleanup blob URL when modal closes
  const handleClose = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    setPrintDoc(null);
  };

  if (!printDoc) return null;

  // Direct Browser Print (Using isolated iframe engine for clean A4 printing without UI noise)
  const handleDirectPrint = () => {
    if (printDoc) {
      const fullHtml = generateFullPrintHtml(printDoc);
      triggerIframePrint(fullHtml);
    } else {
      window.print();
    }
  };

  // Open in Standalone Tab (100% bypasses any iframe sandbox restrictions)
  const handleOpenStandalone = () => {
    if (blobUrl) {
      const win = window.open(blobUrl, '_blank');
      if (win) {
        win.focus();
      } else {
        // Fallback: trigger link click
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  // Download printable document file
  const handleDownloadFile = () => {
    if (!printDoc) return;
    const fullHtml = generateFullPrintHtml(printDoc);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = printDoc.title.replace(/[\/\\?%*:|"<>]/g, '_');
    a.download = `${cleanTitle}_${printDoc.documentNumber || 'doc'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/90 backdrop-blur-md overflow-hidden text-right font-['Cairo',sans-serif] animate-in fade-in">
      {/* Top Action & Control Bar (Hidden on print) */}
      <div className="bg-slate-900 border-b border-slate-700/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-white line-clamp-1">{printDoc.title}</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold shrink-0">
                جاهز للطباعة والحفظ
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {printDoc.subtitle || 'مستند رسمي معتمد صادر عن المنظومة المحاسبية والمخزنية المتكاملة'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Print Button */}
          <button
            onClick={handleDirectPrint}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
            title="إرسال أمر الطباعة المباشر إلى الطابعة الموصلة"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة المستند فوراً</span>
          </button>

          {/* Standalone Tab / Save PDF Button */}
          <button
            onClick={handleOpenStandalone}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
            title="فتح المستند في تبويب مستقل لتجاوز قيود المعاينة والطباعة كـ PDF بسهولة"
          >
            <ExternalLink className="w-4 h-4" />
            <span>فتح في نافذة كاملة / حفظ PDF</span>
          </button>

          {/* Download File Button */}
          <button
            onClick={handleDownloadFile}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 hover:border-sky-500/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="تنزيل نسخة المستند على جهازك بصيغة HTML منسقة بالكامل"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل الملف</span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-gray-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
            title="إغلاق المعاينة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/60 print:p-0 print:bg-white print:overflow-visible">
        {/* Physical A4 Sheet Simulation */}
        <div
          id="global-print-sheet"
          ref={printSheetRef}
          className="w-full max-w-[800px] bg-white text-slate-900 rounded-2xl shadow-2xl border border-gray-300 p-8 sm:p-10 space-y-6 print:shadow-none print:border-none print:p-0 print:max-w-full print:rounded-none my-auto"
        >
          {/* Sheet Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {printDoc.storeName || 'سوق مصر الكبرى'}
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800 mt-1">
                {printDoc.title}
              </div>
              {printDoc.subtitle && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {printDoc.subtitle}
                </div>
              )}
            </div>

            <div className="text-left font-mono text-xs space-y-1">
              <div>
                <span className="font-bold text-slate-600 font-sans ml-1">تاريخ الإصدار:</span>
                <span className="font-bold text-slate-900">{printDoc.date || new Date().toISOString().split('T')[0]}</span>
              </div>
              {printDoc.documentNumber && (
                <div>
                  <span className="font-bold text-slate-600 font-sans ml-1">رقم الإذن / المرجع:</span>
                  <span className="bg-slate-100 text-slate-950 px-2 py-0.5 rounded border border-slate-300 font-bold">
                    {printDoc.documentNumber}
                  </span>
                </div>
              )}
              <div className="text-[11px] text-emerald-800 font-sans font-bold flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                <span>نظام ERP المالي المعتمد</span>
              </div>
            </div>
          </div>

          {/* Sheet Body Content */}
          <div
            className="prose max-w-none text-xs leading-relaxed overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: printDoc.contentHtml }}
          />

          {/* Official Signatures & Approval Footer */}
          <div className="pt-6 border-t border-slate-300 text-slate-700 text-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-1 border-b border-dashed border-slate-200 pb-3">
              <div>{printDoc.footerNotes || 'مستند رسمي معتمد صادر عن المنظومة المحاسبية والمخزنية'}</div>
              <div className="font-mono">وقت الطباعة: {new Date().toLocaleString('ar-EG')}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 text-center font-bold text-[11px]">
              <div className="border-t border-dashed border-slate-400 pt-2">
                <span className="text-slate-500 block text-[10px]">المسؤول المختص:</span>
                <span className="text-slate-900 font-black">أمين المخزن / المحاسب</span>
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2">
                <span className="text-slate-500 block text-[10px]">المراجعة والتدقيق:</span>
                <span className="text-slate-900 font-black">المراجع المالي الداخلي</span>
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2">
                <span className="text-slate-500 block text-[10px]">الاعتماد الرسمي:</span>
                <span className="text-slate-900 font-black">المدير العام والمالك</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
