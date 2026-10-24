/**
 * Bulletproof Print Utility for Browser, Iframes, and Preview environments
 * Solves iframe sandbox blocks, dark-mode CSS issues, and multi-page pagination.
 */

export interface PrintDocumentOptions {
  title: string;
  subtitle?: string;
  storeName?: string;
  storeLogoUrl?: string;
  documentNumber?: string;
  date?: string;
  contentHtml: string;
  footerNotes?: string;
}

type PrintListener = (options: PrintDocumentOptions) => void;
const printListeners: Set<PrintListener> = new Set();

export const subscribeToPrint = (callback: PrintListener) => {
  printListeners.add(callback);
  return () => {
    printListeners.delete(callback);
  };
};

export const generateFullPrintHtml = (options: PrintDocumentOptions): string => {
  const {
    title,
    subtitle = '',
    storeName = 'سوق مصر الكبرى',
    documentNumber = '',
    date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
    contentHtml,
    footerNotes = 'مستند رسمي معتمد صادر عن المنظومة المحاسبية والمخزنية المتكاملة'
  } = options;

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - ${storeName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 15mm 12mm;
      }
      body {
        font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 24px;
        color: #0f172a;
        background: #ffffff;
        font-size: 11.5px;
        line-height: 1.5;
        direction: rtl;
      }
      .header-container {
        border-bottom: 2px solid #0f172a;
        padding-bottom: 12px;
        margin-bottom: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .brand-title {
        font-size: 20px;
        font-weight: 900;
        color: #0f172a;
        margin: 0;
      }
      .report-title {
        font-size: 16px;
        font-weight: 800;
        color: #1e293b;
        margin: 4px 0 0 0;
      }
      .meta-info {
        text-align: left;
        font-size: 11px;
        color: #475569;
      }
      .badge {
        display: inline-block;
        background-color: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 10.5px;
        font-weight: 700;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        margin-bottom: 14px;
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
      th, td {
        border: 1px solid #cbd5e1;
        padding: 7px 9px;
        text-align: right;
        vertical-align: middle;
      }
      th {
        background-color: #f8fafc !important;
        color: #0f172a;
        font-weight: 800;
        font-size: 11px;
      }
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .font-bold { font-weight: 700; }
      .font-black { font-weight: 900; }
      .text-emerald { color: #047857; }
      .text-rose { color: #b91c1c; }
      .text-amber { color: #b45309; }
      .bg-light { background-color: #f8fafc; }
      .summary-card {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .footer-sign {
        margin-top: 24px;
        padding-top: 12px;
        border-top: 1px dashed #cbd5e1;
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #64748b;
      }
      .signature-box {
        text-align: center;
        width: 180px;
        padding-top: 25px;
        border-top: 1px dotted #94a3b8;
      }
      .no-print, .print\\:hidden {
        display: none !important;
      }
      .print-actions-bar {
        background: #1e293b;
        color: white;
        padding: 12px 18px;
        border-radius: 12px;
        margin-bottom: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .print-btn {
        background: #f59e0b;
        color: #0f172a;
        font-weight: 800;
        padding: 8px 18px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 12px;
      }
      @media print {
        .print-actions-bar { display: none !important; }
        body { padding: 0 !important; }
      }
    </style>
  </head>
  <body>
    <div class="print-actions-bar">
      <div><strong>مستند جاهز للطباعة والحفظ</strong> - اضغط على زر الطباعة أو اضغط Ctrl+P في الكيبورد لحفظه كملف PDF</div>
      <button class="print-btn" onclick="window.print()">🖨️ طباعة الآن / حفظ كـ PDF</button>
    </div>

    <div class="header-container">
      <div>
        <div class="brand-title">${storeName}</div>
        <div class="report-title">${title}</div>
        ${subtitle ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${subtitle}</div>` : ''}
      </div>
      <div class="meta-info">
        <div><strong>تاريخ الإصدار:</strong> ${date}</div>
        ${documentNumber ? `<div><strong>رقم المرجع / الإذن:</strong> <span class="badge font-mono">${documentNumber}</span></div>` : ''}
        <div><strong>نظام التشغيل:</strong> ERP المخازن والمالية المعتمد</div>
      </div>
    </div>

    <div class="content-body">
      ${contentHtml}
    </div>

    <div class="footer-sign">
      <div>${footerNotes} - صفحة رسمية معتمدة</div>
      <div>طبع بواسطة: مستخدم النظام المعتمد</div>
      <div>التاريخ والوقت: ${new Date().toLocaleString('ar-EG')}</div>
    </div>

    <div style="margin-top: 35px; display: flex; justify-content: space-between; padding: 0 20px;">
      <div class="signature-box">
        <div>أمين المخزن / المحاسب</div>
      </div>
      <div class="signature-box">
        <div>المراجع / مسؤول التدقيق</div>
      </div>
      <div class="signature-box">
        <div>اعتماد الإدارة العامة</div>
      </div>
    </div>

    <script>
      // Auto trigger print when loaded directly in standalone tab
      window.onload = function() {
        setTimeout(function() {
          try {
            window.focus();
            window.print();
          } catch(e) {}
        }, 400);
      };
    </script>
  </body>
</html>`;
};

export const triggerIframePrint = (fullHtml: string): void => {
  if (typeof document === 'undefined') return;
  try {
    // Remove existing print iframes if any
    const existingIframes = document.querySelectorAll('.nilemart-print-iframe');
    existingIframes.forEach(el => el.remove());

    const iframe = document.createElement('iframe');
    iframe.className = 'nilemart-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = '0';
    iframe.style.opacity = '0.01';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-999';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print intercepted, user can still use modal print button', e);
        }
        setTimeout(() => {
          try {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          } catch (_) {}
        }, 8000);
      }, 400);
    }
  } catch (err) {
    console.error('Print iframe error:', err);
  }
};

export const printDocumentHtml = (options: PrintDocumentOptions, triggerDirect = false): void => {
  const fullHtml = generateFullPrintHtml(options);

  // 1. Notify GlobalPrintModal so user has full visual sheet preview & PDF export
  printListeners.forEach(cb => {
    try {
      cb(options);
    } catch (e) {
      console.error(e);
    }
  });

  // 2. Also dispatch custom event for fallback
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nilemart_open_print_modal', { detail: options }));
  }

  // 3. If direct print requested or supported, also trigger isolated iframe print
  if (triggerDirect) {
    triggerIframePrint(fullHtml);
  }
};

/**
 * Print directly from a React element Ref
 */
export const printElementRef = (
  elementRef: React.RefObject<HTMLElement | null>,
  title: string,
  options?: Partial<PrintDocumentOptions>
): void => {
  if (!elementRef.current) {
    window.print();
    return;
  }
  const contentHtml = elementRef.current.innerHTML;
  printDocumentHtml({
    title,
    contentHtml,
    ...options
  });
};
