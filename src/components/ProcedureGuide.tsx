import React from 'react';
import { FileText, Calendar, Clock, AlertTriangle, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';

interface Props {
  onGoToService: (service: string) => void;
}

export const ProcedureGuide: React.FC<Props> = ({ onGoToService }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          دليل الإجراءات والوثائق المدرسية
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          دليل إرشادي يوضح الشروط، الوثائق المطلوبة والآجال الزمنية لمعالجة الخدمات المدرسية بمدرسة نوار محمد الابتدائية بتيارت.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Procedure 1: School Certificate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">1. طلب شهادة مدرسية</h3>
              <span className="text-[11px] text-emerald-700 font-semibold">أجل المعالجة: فوري إلى 48 ساعة</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">الضوابط وإجراءات الاستخراج:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>الشهادة المدرسية تصدر حصراً من <strong>النظام الرقمي الرسمي لوزارة التربية الوطنية</strong>.</li>
              <li>تقوم إدارة المؤسسة باستخراجها، وتوقيعها وختمها بالختم الرسمي، ومسحها ضوئياً (Scanner).</li>
              <li>تقوم الإدارة إما برفع ملف الـ PDF الممسوح ضوئياً إلى حسابكم للتحميل والطباعة، أو تحديد موعد لاستلام النسخة الورقية مباشرة من المؤسسة.</li>
              <li>تحديد الغرض من الشهادة (الضمان الاجتماعي CNAS، بطاقة التعريف، ملف رياضي...).</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToService('certificates')}
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              تقديم طلب شهادة الآن <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Procedure 2: Appointment with Staff */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">2. طلب مقابلة الأستاذ أو المديرة</h3>
              <span className="text-[11px] text-blue-700 font-semibold">أجل التأكيد: خلال 24 ساعة</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">الضوابط التنظيمية:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>لقاء الأساتذة يتم حصرياً خارج فترات تدريس التلاميذ (خلال ساعات الاستقبال الرسمية).</li>
              <li>مقابلة المديرة أيام الثلاثاء صباحاً أو عبر موعد مسبق مؤكد في هذه المنصة.</li>
              <li>الالتزام بالحضور في التوقيت المحدد لتفادي إلغاء الموعد.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToService('appointments')}
              className="text-xs font-bold text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              حجز موعد لقاء <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Procedure 3: Absence Justification */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3. تبرير الغياب والتأخر</h3>
              <span className="text-[11px] text-rose-700 font-semibold">أجل الإيداع: خلال 48 ساعة من تاريخ الغياب</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">المبررات القانونية المقبولة:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>الشهادة الطبية الصادرة عن طبيب محلف أو العيادة المتعددة الخدمات.</li>
              <li>العذر العائلي الاضطراري المكتوب من الولي الشرعي.</li>
              <li>لا يلغي الإشعار الإلكتروني بالغياب الالتزام القانوني بتقديم التبرير الرسمي.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToService('attendance')}
              className="text-xs font-bold text-rose-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              سجل الغيابات والتبرير <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Procedure 4: Inquiries & Appeals */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">4. إيداع انشغال أو شكوى</h3>
              <span className="text-[11px] text-amber-700 font-semibold">أجل المعالجة: 48 إلى 72 ساعة</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">مسار المعالجة:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>الحصول على رقم تتبع مرجعي فوري عند الإيداع.</li>
              <li>التوجيه التلقائي للمصلحة المعنية (تربوية، إطعام، صحة، مرافق).</li>
              <li>إشعار الولي فور تسجيل الإجراء المتخذ، مع إمكانية التقييم وإغلاق التذكرة.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onGoToService('inquiries')}
              className="text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              تسجيل انشغال الآن <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
