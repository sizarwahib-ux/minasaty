import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">
              ميثاق حماية المعطيات والخصوصية (القانون رقم 18-07)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
            تلتزم إدارة <strong>مدرسة نوار محمد الابتدائية بتيارت</strong> بالامتثال التام للتشريع الجزائري المتعلق بحماية المعطيات ذات الطابع الشخصي، ولا سيما <strong>القانون رقم 18-07 المؤرخ في 10 جوان 2018</strong> المعدل والمتمم.
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-slate-100 rounded-md text-emerald-800 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1. حماية رقم التعريف الوطني (NIN)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  لا يتم إظهار رقم التعريف الوطني للولي كاملاً في أي واجهة مستخدم، ويقتصر استخدامه على المطابقة الرسمية المشفرة مع قواعد بيانات وزارة التربية الوطنية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-slate-100 rounded-md text-emerald-800 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2. حماية بيانات القصر والتلاميذ</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  يُمنع منعاً باتاً نشر قوائم التلاميذ، غياباتهم، استدعاءاتهم أو نتائجهم في صفحات عامة. يحق فقط للولي الشرعي المسجل والتحقق من صفته الاطلاع الحصري على بيانات أبنائه.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-slate-100 rounded-md text-emerald-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">3. حصر الصلاحيات الإدارية وسجل العمليات</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  تخضع جميع عمليات الدخول، وتعديل الحسابات، وتسجيل الغيابات للرقابة والتدقيق الزمني، ولا يمكن للموظفين الوصول إلا للبيانات الضرورية لأداء مهامهم البيداغوجية والإدارية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-slate-100 rounded-md text-emerald-800 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">4. ضوابط إشعارات الغياب</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  لا يُعتبر عدم وصول الإشعار الإلكتروني أو عدم فتحه دليلاً قانونياً على علم الولي بالغياب؛ حيث تبقى الإجراءات النظامية والإرساليات الكتابية سارية المفعول عند الاقتضاء وفق التنظيم المدرسي الجزائري.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            فهمت وموافق
          </button>
        </div>
      </div>
    </div>
  );
};
