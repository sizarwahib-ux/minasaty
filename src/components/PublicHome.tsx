import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  CheckCircle,
  HelpCircle,
  Award,
  ChevronLeft,
} from 'lucide-react';
import { maskNIN } from '../utils/security';

interface Props {
  onGoToService: (serviceTab: string) => void;
  onOpenPrivacy: () => void;
}

export const PublicHome: React.FC<Props> = ({ onGoToService, onOpenPrivacy }) => {
  const { setRole, announcements, addNewChild } = useSchool();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Registration Form State
  const [regParentName, setRegParentName] = useState('');
  const [regStudentName, setRegStudentName] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regBirthPlace, setRegBirthPlace] = useState('تيارت');
  const [regGrade, setRegGrade] = useState('السنة الأولى ابتدائي');
  const [regClassroom, setRegClassroom] = useState('الفوج 1');
  const [regNIN, setRegNIN] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regParentName || !regStudentName || !regPhone) return;

    // Add student to system
    addNewChild({
      fullName: regStudentName,
      gender: 'male',
      dateOfBirth: regBirthDate || '2019-01-01',
      placeOfBirth: regBirthPlace,
      birthCertificateNo: `${Math.floor(1000 + Math.random() * 9000)}/2019`,
      registrationNumber: `2025/${Math.floor(100 + Math.random() * 900)}`,
      grade: regGrade,
      classroom: regClassroom,
      academicYear: '2025/2026',
      teacherName: 'الأستاذ المشرف على الفوج',
    });

    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setShowRegisterModal(false);
      setRole('parent');
      onGoToService('overview');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Official State Banner */}
      <div className="bg-emerald-950 text-emerald-100 py-3 px-4 border-b border-emerald-900/60 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية
        </p>
        <p className="text-xs text-emerald-300 mt-0.5">
          مديرية التربية لولاية تيارت · مفتشية التعليم الابتدائي للمقاطعة الثالثة · مدرسة نوار محمد الابتدائية
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Right Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                تيارت | فضاء الولي الرقمي الموحد
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  مرحباً بكم في <span className="text-emerald-900">فضاء الولي</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                  منصة إلكترونية لرقمنة وتسهيل التواصل بين إدارة مدرسة نوار محمد الابتدائية وأولياء التلاميذ، ومتابعة الطلبات المدرسية بكل شفافية وسرعة.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setRole('parent');
                    onGoToService('overview');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  الدخول إلى فضاء الولي
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-emerald-800" />
                  إنشاء حساب ولي جديد
                </button>
                <button
                  onClick={onOpenPrivacy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  حماية البيانات (قانون 18-07)
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center sm:text-right">
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-900">100%</div>
                  <div className="text-xs text-slate-500">معالجة رقمية للشهادات</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-900">24/48س</div>
                  <div className="text-xs text-slate-500">أجل الرد على الانشغالات</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-900">آمن ومشفّر</div>
                  <div className="text-xs text-slate-500">حماية المعطيات الشخصية</div>
                </div>
              </div>
            </div>

            {/* Left Column: Visual School Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-16/10">
                <img
                  src="/src/assets/images/school_building_courtyard_1791642294988.jpg"
                  alt="فناء مدرسة نوار محمد الابتدائية بتيارت"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <div className="text-xs font-bold text-emerald-400">مؤسسة تربوية نموذجية</div>
                    <div className="text-base font-bold">مدرسة نوار محمد الابتدائية – تيارت</div>
                    <div className="text-xs text-slate-300">بيئة تعليمية محفزة لنجاح وتألق أبنائكم وبناتكم</div>
                  </div>
                </div>
              </div>

              {/* Floating emblem stamp */}
              <div className="absolute -top-4 -right-4 w-18 h-18 rounded-full bg-white p-1 shadow-md border border-emerald-900/20 hidden sm:block">
                <img
                  src="/src/assets/images/school_emblem_logo_1791642281989.jpg"
                  alt="شعار المدرسة"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Electronic Services Catalog (Section 3 of requirements) */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              دليل الخدمات الإلكترونية المتاحة
            </h2>
            <p className="text-sm text-slate-600">
              اختر الخدمة المطلوبة لإتمام إجراءاتك المدرسية دون الحاجة للتنقل غير الضروري
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Service 1: School Certificate */}
            <div
              onClick={() => {
                setRole('parent');
                onGoToService('certificates');
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  طلب شهادة مدرسية
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تقديم طلب شهادة مدرسية إلكترونياً، حيث تستخرجها الإدارة من النظام الرقمي الرسمي وتمسحها ضوئياً لرفعها PDF أو برمجة موعد لاستلامها بالمؤسسة.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>إيداع الطلب ومتابعته</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 2: Appointments */}
            <div
              onClick={() => {
                setRole('parent');
                onGoToService('appointments');
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  حجز موعد رسمي
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  طلب لقاء مع أستاذ القسم أو السيدة مديرة المدرسة، اقتراح الفترة، وتأكيد الموعد المناسب بدون انتظار.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-800">
                <span>لقاء الأستاذ أو المديرة</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 3: Inquiries / Complaints */}
            <div
              onClick={() => {
                setRole('parent');
                onGoToService('inquiries');
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                  تسجيل انشغال أو شكوى
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  طرح انشغالاتكم في المجال التربوي، السلوكي، الإطعام، الصحي، أو المرافق والحصول على رقم تتبع مرجعي.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>تسجيل انشغال ومتابعة الرد</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 4: Notifications & Absences */}
            <div
              onClick={() => {
                setRole('parent');
                onGoToService('attendance');
              }}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center group-hover:bg-rose-800 group-hover:text-white transition-colors">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-900 transition-colors">
                  الإشعارات وتبرير الغياب
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  استقبال إشعارات الغياب والتأخر الفورية، ورفع شهادة تبرير الغياب إلكترونياً لمصادقة الإدارة.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-800">
                <span>الغيابات والتنبيهات المدرسية</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements & Calendar Split */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Announcements (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-800" />
                  أحدث الإعلانات والمستجدات المدرسية
                </h3>
                <span className="text-xs text-slate-500">الموسم الدراسي 2025/2026</span>
              </div>

              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <span>الفئة المستهدفة: {ann.targetGrade === 'all' ? 'جميع الأقسام' : ann.targetGrade}</span>
                      <span>·</span>
                      <span className={ann.priority === 'urgent' ? 'text-rose-600 font-bold' : ann.priority === 'important' ? 'text-amber-700 font-bold' : ''}>
                        {ann.priority === 'urgent' ? 'عاجل' : ann.priority === 'important' ? 'هام' : 'إعلان عادي'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* School Calendar Milestones (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-800" />
                  رزنامة المواعيد والمحطات التربوية
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>انطلاق اختبارات الفصل الأول</span>
                    <span className="font-mono text-blue-800">30 نوفمبر 2025</span>
                  </div>
                  <p className="text-xs text-slate-500">لجميع المستويات من السنة الأولى إلى الخامسة ابتدائي.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>عطلة الشتاء المدرسية</span>
                    <span className="font-mono text-emerald-800">18 ديسمبر 2025</span>
                  </div>
                  <p className="text-xs text-slate-500">تمتد إلى غاية 04 جانفي 2026 حسب الرزنامة الوزارية.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>امتحان تقييم المكتسبات (السنة 5)</span>
                    <span className="font-mono text-amber-800">ماي 2026</span>
                  </div>
                  <p className="text-xs text-slate-500">التقييمات البيداغوجية لمخرجات مرحلة التعليم الابتدائي.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>مجالس الأساتذة وتسليم الدفاتر</span>
                    <span className="font-mono text-slate-700">نهاية كل ثلاثي</span>
                  </div>
                  <p className="text-xs text-slate-500">لقاءات دورية مفتوحة بين الأولياء والأساتذة بالمؤسسة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Institution Details */}
      <section className="py-12 bg-slate-900 text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 p-1 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">مدرسة نوار محمد الابتدائية</h4>
                  <p className="text-xs text-slate-400">تيارت · قطاع التربية الوطنية</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                مؤسسة عمومية ابتدائية تقدم خدمات تعليمية وتربوية ذات جودة، وتعمل بالتنسيق الوثيق مع جمعية أولياء التلاميذ لضمان المرافقة المستمرة.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">بيانات الاتصال والعنوان</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>حي التفاح 1، بالقرب من عيادة النور، تيارت</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">الهاتف: أرقام المؤسسة قيد المراجعة والتحيين</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono">ecole.nouar.tiaret@education.gov.dz</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">أوقات العمل واستقبال الأولياء</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                الفترة الصباحية: 08:00 – 12:00
                <br />
                الفترة المسائية: 13:00 – 16:30
                <br />
                استقبال الأولياء بمكتب الإدارة: أيام الثلاثاء والخميس صباحاً أو عبر المواعيد المسبقة في هذه المنصة.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenPrivacy}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  السياسة الأمنية وحماية المعطيات الشخصية
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} مدرسة نوار محمد الابتدائية – تيارت · فضاء الولي الرقمي
          </div>
        </div>
      </section>

      {/* Registration Modal (Section 2 of requirements) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">إنشاء حساب ولي جديد في فضاء الولي</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  وفقاً للبيانات المعتمدة لدى إدارة مدرسة نوار محمد
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {registerSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-lg">تم إنشاء الحساب وربط التلميذ بنجاح!</h4>
                <p className="text-xs text-slate-600">
                  تم تسجيل حسابك وتوجيهك إلى فضاء الولي للاستفادة من كافة الخدمات المدرسية.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs">
                {/* Security Note on NIN */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">ملاحظة أمنية هامة:</span> يتم جمع رقم التعريف الوطني (NIN) فقط للتحقق من صلة القرابة الشرعية مع التلميذ طبقاً للقانون 18-07، ولن يظهر الرقم كاملاً في أي واجهة بعد التسجيل.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">الاسم واللقب للولي *</label>
                    <input
                      type="text"
                      required
                      value={regParentName}
                      onChange={(e) => setRegParentName(e.target.value)}
                      placeholder="مثال: عبد القادر نوار"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0661234567"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-800 dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">اسم ولقب التلميذ *</label>
                    <input
                      type="text"
                      required
                      value={regStudentName}
                      onChange={(e) => setRegStudentName(e.target.value)}
                      placeholder="مثال: سارة نوار"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">المستوى والفوج الدراسي *</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={regGrade}
                        onChange={(e) => setRegGrade(e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                      >
                        <option>السنة الأولى ابتدائي</option>
                        <option>السنة الثانية ابتدائي</option>
                        <option>السنة الثالثة ابتدائي</option>
                        <option>السنة الرابعة ابتدائي</option>
                        <option>السنة الخامسة ابتدائي</option>
                      </select>
                      <select
                        value={regClassroom}
                        onChange={(e) => setRegClassroom(e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                      >
                        <option>الفوج 1</option>
                        <option>الفوج 2</option>
                        <option>الفوج 3</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">تاريخ ومكان ميلاد التلميذ</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="date"
                        value={regBirthDate}
                        onChange={(e) => setRegBirthDate(e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={regBirthPlace}
                        onChange={(e) => setRegBirthPlace(e.target.value)}
                        placeholder="مكان الميلاد"
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      رقم التعريف الوطني للولي (NIN)
                    </label>
                    <input
                      type="text"
                      value={regNIN}
                      onChange={(e) => setRegNIN(e.target.value)}
                      placeholder="18 رقماً من بطاقة التعريف البيومترية"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-emerald-800"
                    />
                    {regNIN && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        سيظهر مشفراً كالتالي: <span className="font-mono font-bold text-slate-700">{maskNIN(regNIN)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني للولي</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-800"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  * إذا كان لديك أكثر من ابن متمدرس، يمكنك إضافة بقية الأبناء مباشرة من داخل حسابك بعد التسجيل.
                </p>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    تأكيد التسجيل وإنشاء الحساب
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
