import React, { useState } from 'react';
import { CertificateRequest, Student } from '../types';
import { formatDateAr } from '../utils/security';
import { downloadCertificatePdf } from '../utils/pdfHelper';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  certificate: CertificateRequest;
  student: Student;
  onClose: () => void;
}

export const OfficialCertificateModal: React.FC<Props> = ({
  certificate,
  student,
  onClose,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const fileName =
    certificate.uploadedPdf?.fileName ||
    `شهادة_مدرسية_رسمية_${student.fullName.replace(/\s+/g, '_')}_2026.pdf`;

  const uploadInfo = certificate.uploadedPdf || {
    fileName,
    fileSize: '348 KB',
    uploadedAt: certificate.processedAt || '2026-10-04',
    uploadedBy: 'أمانة مدرسة نوار محمد الابتدائية',
    sourceNote:
      'مستخرجة من الأرضية الرقمية لوزارة التربية الوطنية وممسوحة ضوئياً بعد الختم والتوقيع الإداري',
  };

  const handleDownload = () => {
    downloadCertificatePdf(uploadInfo.fileName, certificate.uploadedPdf?.fileDataUrl, {
      studentName: student.fullName,
      refNumber: certificate.refNumber,
      academicYear: certificate.academicYear || student.academicYear,
      purpose: certificate.purpose,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-800 overflow-hidden my-4 flex flex-col max-h-[95vh]">
        {/* TOP BAR / CONTROLS (Hidden in Print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-800/50 rounded-lg text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">
                  معاينة وثيقة الـ PDF الممسوحة ضوئياً
                </span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-mono">
                  {uploadInfo.fileSize || '348 KB'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                مستخرجة من النظام الرقمي لوزارة التربية الوطنية · ممسوحة ضوئياً ومرفوعة من إدارة المؤسسة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom & Rotate controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-slate-300">
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-400">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRotate}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors border-r border-slate-700 cursor-pointer"
                title="تدوير الصفحة"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              title="تحميل ملف PDF المرفوع من الإدارة"
            >
              <Download className="w-3.5 h-3.5" />
              تحميل ملف PDF
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer"
              title="طباعة الملف"
            >
              <Printer className="w-3.5 h-3.5" />
              طباعة
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METADATA STRIP: CONFIRMING SCANNED UPLOAD FROM ADMINISTRATION */}
        <div className="print:hidden px-5 py-2.5 bg-emerald-950/40 border-b border-emerald-900/50 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              الملف المرفوع:{' '}
              <strong className="font-mono text-white">{uploadInfo.fileName}</strong>
            </span>
            <span className="text-emerald-400/60 font-mono">({uploadInfo.fileSize || '348 KB'})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-300/80">
            <span>تاريخ الرفع: {uploadInfo.uploadedAt}</span>
            <span>·</span>
            <span>القناة: أمانة مدرسة نوار محمد الابتدائية (تيارت)</span>
          </div>
        </div>

        {/* DOCUMENT PREVIEW CONTAINER */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/90 flex-1 print:p-0 print:bg-white print:overflow-visible">
          {/* If the admin actually uploaded a real file (data URL) */}
          {certificate.uploadedPdf?.fileDataUrl ? (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-slate-700 p-2">
              {certificate.uploadedPdf.fileDataUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={certificate.uploadedPdf.fileDataUrl}
                  title="وثيقة الشهادة المدرسية الممسوحة ضوئياً"
                  className="w-full h-[650px] border-0 rounded"
                />
              ) : (
                <img
                  src={certificate.uploadedPdf.fileDataUrl}
                  alt="الشهادة المدرسية الرسمية الممسوحة ضوئياً"
                  className="w-full h-auto rounded transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'top center',
                  }}
                />
              )}
            </div>
          ) : (
            /* Scanned Official Document Facsimile (Visual representation of the scanned PDF from Ministry digital platform) */
            <div
              className="max-w-2xl mx-auto bg-stone-50 text-slate-900 rounded-sm shadow-2xl border border-stone-300 p-8 sm:p-12 relative font-serif print:shadow-none print:border-none print:p-0 transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'top center',
                backgroundImage: 'radial-gradient(#f1f0eb 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Scanner Registration Marks */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-stone-400"></div>
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-stone-400"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-stone-400"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-stone-400"></div>

              {/* Watermark Notice */}
              <div className="print:hidden absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
                <div className="text-4xl font-black text-slate-900 rotate-[-30deg] text-center uppercase tracking-widest">
                  DOCUMENT NUMÉRISÉ PAR L'ÉCOLE
                  <br />
                  وزارة التربية الوطنية
                </div>
              </div>

              {/* Header: Republic & Ministry of National Education */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <p className="text-sm font-bold text-slate-900 tracking-wider">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </p>
                <p className="text-xs font-bold text-slate-800">
                  وزارة التربية الوطنية
                </p>
                <div className="flex justify-between items-end text-xs text-slate-700 mt-3 px-1 font-sans">
                  <div className="text-right space-y-0.5">
                    <p>مديرية التربية لولاية تيارت</p>
                    <p>مفتشية التعليم الابتدائي - المقاطعة الثالثة</p>
                    <p className="font-bold text-slate-900">مدرسة نوار محمد الابتدائية</p>
                  </div>
                  <div className="text-center font-mono text-[10px] text-slate-600 bg-stone-100 px-3 py-1 rounded border border-stone-300">
                    <span className="font-bold text-slate-800">النظام الرقمي لوزارة التربية الوطنية</span>
                    <br />
                    <span>PLATEFORME NUMÉRIQUE AMATTI</span>
                  </div>
                  <div className="text-left space-y-0.5 dir-ltr text-[11px] text-slate-600">
                    <p>RÉPUBLIQUE ALGÉRIENNE</p>
                    <p>Direction de l'Éducation - Tiaret</p>
                    <p>Éc. Prim. Nouar Mohamed</p>
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center my-6">
                <div className="inline-block border-2 border-slate-950 px-10 py-2 rounded-xs bg-stone-100">
                  <h1 className="text-2xl font-black text-slate-950 tracking-wider">
                    شـــهـــادة مــــدرســـيـــة
                  </h1>
                  <p className="text-xs font-sans tracking-widest text-slate-600 mt-0.5">
                    CERTIFICAT DE SCOLARITÉ
                  </p>
                </div>
                <div className="mt-2 text-xs font-mono text-slate-600">
                  الرقم التسلسلي بالأرضية الرقمية: <strong className="text-slate-950">{certificate.refNumber}</strong>
                </div>
              </div>

              {/* Official Content extracted from national education digital platform */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-900 my-6 font-medium text-justify">
                <p>
                  تشهد السيدة <span className="font-bold">مديرة مدرسة نوار محمد الابتدائية بتيارت</span>، أن التلميذ(ة):
                </p>

                <div className="bg-stone-100 border border-stone-300 p-4 rounded-xs space-y-2 text-sm font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p>
                      <span className="text-slate-600">الاسم واللقب:</span>{' '}
                      <span className="font-bold text-slate-950 text-base">{student.fullName}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">رقم التسجيل بالنظام الرقمي:</span>{' '}
                      <span className="font-mono font-bold text-slate-950">{student.registrationNumber}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p>
                      <span className="text-slate-600">تاريخ ومكان الميلاد:</span>{' '}
                      <span className="font-semibold text-slate-950">
                        {formatDateAr(student.dateOfBirth)} بـ {student.placeOfBirth}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-600">رقم عقد الميلاد:</span>{' '}
                      <span className="font-mono font-semibold text-slate-950">{student.birthCertificateNo}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200">
                    <p>
                      <span className="text-slate-600">المستوى والقسم:</span>{' '}
                      <span className="font-bold text-slate-950">{student.grade} ({student.classroom})</span>
                    </p>
                    <p>
                      <span className="text-slate-600">الموسم الدراسي:</span>{' '}
                      <span className="font-bold text-slate-950">{student.academicYear}</span>
                    </p>
                  </div>
                </div>

                <p>
                  يتابع / تتابع دراسته(ا) بصفة منتظمة بمدرسة نوار محمد الابتدائية خلال الموسم الدراسي الحالي{' '}
                  <span className="font-bold text-slate-950">{student.academicYear}</span>.
                </p>
                <p>
                  سُلمت هذه الشهادة لولي الأمر المعني بناءً على طلبه لاستعمالها في الغرض الإداري الموضح:{' '}
                  <span className="font-bold underline underline-offset-4 text-slate-950">
                    {certificate.purpose}
                  </span>.
                </p>
              </div>

              {/* Scanned Official Stamps & Signature */}
              <div className="pt-6 mt-8 border-t border-stone-300 font-sans">
                <div className="flex justify-between items-end px-2">
                  {/* National Ministry Barcode */}
                  <div className="text-center space-y-1">
                    <div className="border border-stone-400 p-2 bg-white rounded-xs space-y-1">
                      <div className="h-8 w-28 bg-slate-950 flex items-center justify-between px-1">
                        <div className="w-1 h-full bg-white"></div>
                        <div className="w-0.5 h-full bg-white"></div>
                        <div className="w-1.5 h-full bg-white"></div>
                        <div className="w-0.5 h-full bg-white"></div>
                        <div className="w-2 h-full bg-white"></div>
                        <div className="w-0.5 h-full bg-white"></div>
                        <div className="w-1 h-full bg-white"></div>
                      </div>
                      <span className="text-[9px] font-mono block text-slate-600 font-bold">DZ-MIN-EDU-AMS</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono">وثيقة ممسوحة ضوئياً بعد الختم</p>
                  </div>

                  {/* Date & Director Stamp */}
                  <div className="text-center space-y-2">
                    <p className="text-xs text-slate-800">
                      حرر بتيارت في:{' '}
                      <span className="font-bold text-slate-950">
                        {formatDateAr(certificate.processedAt || new Date().toISOString())}
                      </span>
                    </p>
                    <div>
                      <p className="text-xs font-bold text-slate-950">
                        ختم وتوقيع مديرة المؤسسة
                      </p>
                      <div className="h-16 flex items-center justify-center">
                        <div className="border-2 border-emerald-900/90 rounded-full px-4 py-1 text-xs text-emerald-950 font-bold rotate-[-6deg] bg-emerald-100/60 shadow-xs border-dashed">
                          مدرسة نوار محمد الابتدائية
                          <br />
                          <span className="text-[10px] text-emerald-900 font-mono">ولاية تيارت · الختم الرسمي للإدارة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2 border-t border-stone-300 text-center">
                  <p className="text-[10px] text-slate-500 font-sans">
                    ملاحظة تنظيمية: هذه الشهادة مستخرجة حصراً من النظام الرقمي الرسمي لوزارة التربية الوطنية، وتم مسحها ضوئياً ورفعها بواسطة إدارة المدرسة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR (Hidden in print) */}
        <div className="print:hidden px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              ملف رسمي تم استخراجه ومسحه ضوئياً ورفعه من طرف إدارة المؤسسة إلى فضاء الولي.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              تحميل الملف
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
