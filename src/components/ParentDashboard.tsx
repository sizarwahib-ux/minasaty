import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Clock,
  ShieldCheck,
  UserCheck,
  Plus,
  CheckCircle,
  AlertCircle,
  Printer,
  ChevronDown,
  Star,
  Send,
  BookOpen,
  ClipboardList,
  Mail,
  ThumbsUp,
  User,
  GraduationCap,
  ExternalLink,
  Download,
} from 'lucide-react';
import { maskNIN, formatDateAr } from '../utils/security';
import { downloadCertificatePdf } from '../utils/pdfHelper';
import { InquiryCategory } from '../types';

interface Props {
  initialTab?: string;
  onOpenPrivacy: () => void;
}

export const ParentDashboard: React.FC<Props> = ({ initialTab = 'overview', onOpenPrivacy }) => {
  const {
    parent,
    students,
    selectedStudentId,
    setSelectedStudentId,
    selectedStudent,
    certificates,
    requestCertificate,
    appointments,
    requestAppointment,
    inquiries,
    submitInquiry,
    respondToInquiry,
    rateInquiry,
    attendance,
    submitJustification,
    acknowledgeAttendance,
    announcements,
    acknowledgeAnnouncement,
    summons,
    acknowledgeSummon,
    evaluations,
    homework,
    toggleHomeworkCompleted,
    messages,
    sendMessage,
    markMessageRead,
    submitSurvey,
    updateParentProfile,
    addNewChild,
    setPreviewCertificate,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Modal States
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPurpose, setCertPurpose] = useState('ملف الضمان الاجتماعي (CNAS)');
  const [certDelivery, setCertDelivery] = useState<'digital' | 'in_person'>('digital');
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  const [showAppModal, setShowAppModal] = useState(false);
  const [appTarget, setAppTarget] = useState<'teacher' | 'principal'>('teacher');
  const [appSubject, setAppSubject] = useState('');
  const [appDate, setAppDate] = useState('');
  const [appPeriod, setAppPeriod] = useState<'morning' | 'afternoon'>('morning');
  const [appSuccessMsg, setAppSuccessMsg] = useState('');

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inqCategory, setInqCategory] = useState<InquiryCategory>('educational');
  const [inqSubject, setInqSubject] = useState('');
  const [inqDetails, setInqDetails] = useState('');
  const [inqAttachment, setInqAttachment] = useState('');
  const [inqSuccessCode, setInqSuccessCode] = useState('');

  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Justification Modal
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [justifyAttendanceId, setJustifyAttendanceId] = useState('');
  const [justifyReason, setJustifyReason] = useState('');
  const [justifyType, setJustifyType] = useState<'medical' | 'family' | 'travel' | 'other'>('medical');
  const [justifyFileName, setJustifyFileName] = useState('');
  const [justifySuccess, setJustifySuccess] = useState(false);

  // Add child modal
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildBirthDate, setNewChildBirthDate] = useState('');
  const [newChildBirthPlace, setNewChildBirthPlace] = useState('تيارت');
  const [newChildGrade, setNewChildGrade] = useState('السنة الأولى ابتدائي');
  const [newChildClassroom, setNewChildClassroom] = useState('الفوج 1');

  // Direct Message State
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [msgReceiver, setMsgReceiver] = useState('إدارة المدرسة');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');

  // Profile Edit
  const [editPhone, setEditPhone] = useState(parent.phone);
  const [editEmail, setEditEmail] = useState(parent.email);
  const [editAddress, setEditAddress] = useState(parent.address);
  const [profileSaved, setProfileSaved] = useState(false);

  // Filtered Data for Active Student
  const currentStudent = selectedStudent || students[0];
  const studentCerts = certificates.filter((c) => c.studentId === currentStudent?.id);
  const studentApps = appointments.filter((a) => a.studentId === currentStudent?.id);
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);
  const studentEvaluation = evaluations.find((e) => e.studentId === currentStudent?.id);
  const studentHomework = homework.filter(
    (h) => !h.studentId || h.studentId === currentStudent?.id || h.grade === currentStudent?.grade
  );
  const studentSummons = summons.filter((s) => s.studentId === currentStudent?.id);

  // Category labels in Arabic
  const categoryNames: Record<InquiryCategory, string> = {
    educational: 'تربوي وبيداغوجي',
    behavioral: 'سلوكي وانضباطي',
    administrative: 'إداري ووثائق',
    health: 'صحي وطبي',
    canteen: 'إطعام مدرسي ومطعم',
    transport_facilities: 'نقل ومرافق مدرسية',
  };

  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;
    requestCertificate({
      studentId: currentStudent.id,
      purpose: certPurpose,
      deliveryMethod: certDelivery,
    });
    setCertSuccessMsg('تم إيداع طلب الشهادة بنجاح! يتم التدقيق وإشعاركم فور الجاهزية.');
    setTimeout(() => {
      setCertSuccessMsg('');
      setShowCertModal(false);
    }, 1800);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !appSubject || !appDate) return;
    requestAppointment({
      studentId: currentStudent.id,
      targetRole: appTarget,
      targetName: appTarget === 'principal' ? 'السيدة مديرة المدرسة' : currentStudent.teacherName,
      subject: appSubject,
      preferredDate: appDate,
      preferredPeriod: appPeriod,
    });
    setAppSuccessMsg('تم تسجيل طلب الموعد بنجاح، وستتلقى تأكيد التوقيت الدقيق من الإدارة قريباً.');
    setTimeout(() => {
      setAppSuccessMsg('');
      setShowAppModal(false);
      setAppSubject('');
    }, 1800);
  };

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqSubject || !inqDetails) return;
    const ref = submitInquiry({
      studentId: currentStudent?.id,
      category: inqCategory,
      subject: inqSubject,
      details: inqDetails,
      attachmentName: inqAttachment || undefined,
    });
    setInqSuccessCode(ref);
    setTimeout(() => {
      setInqSuccessCode('');
      setShowInquiryModal(false);
      setInqSubject('');
      setInqDetails('');
      setInqAttachment('');
    }, 2200);
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName) return;
    addNewChild({
      fullName: newChildName,
      gender: 'male',
      dateOfBirth: newChildBirthDate || '2018-05-10',
      placeOfBirth: newChildBirthPlace,
      birthCertificateNo: `${Math.floor(1000 + Math.random() * 9000)}/2018`,
      registrationNumber: `2025/${Math.floor(100 + Math.random() * 900)}`,
      grade: newChildGrade,
      classroom: newChildClassroom,
      academicYear: '2025/2026',
      teacherName: 'الأستاذ المشرف على الفوج',
    });
    setShowAddChildModal(false);
    setNewChildName('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateParentProfile(editPhone, editEmail, editAddress);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Card with NIN Masking and Multi-Child Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                مرحباً بك، {parent.fullName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                حساب ولي مفعل ومتحقق منه
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>
                رقم التعريف الوطني (المحمي): <strong className="font-mono text-slate-700">{maskNIN(parent.nin)}</strong>
              </span>
              <span>·</span>
              <span>
                الهاتف: <strong className="font-mono text-slate-700 dir-ltr">{parent.phone}</strong>
              </span>
              <span>·</span>
              <button
                onClick={onOpenPrivacy}
                className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                حماية البيانات 18-07
              </button>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCertModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              طلب شهادة مدرسية
            </button>
            <button
              onClick={() => setShowAppModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              حجز موعد
            </button>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              تسجيل انشغال
            </button>
          </div>
        </div>

        {/* Multi-Child Selector Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              الأبناء المتمدرسون:
            </span>
            {students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{student.fullName}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                    ({student.grade})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAddChildModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة ابن آخر للحساب
          </button>
        </div>

        {/* Selected Child Snapshot Card */}
        {currentStudent && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-800" />
                <span className="font-bold text-slate-900 text-sm">{currentStudent.fullName}</span>
                <span className="text-slate-500 font-mono">({currentStudent.registrationNumber})</span>
              </div>
              <p className="text-slate-600">
                {currentStudent.grade} · {currentStudent.classroom} · الأستاذ المشرف: <strong className="text-slate-800">{currentStudent.teacherName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ ومكان الميلاد</span>
                <span className="font-semibold text-slate-800">{formatDateAr(currentStudent.dateOfBirth)} بتيارت</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الموسم الدراسي</span>
                <span className="font-semibold text-slate-800">{currentStudent.academicYear}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          نظرة عامة والخدمات
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الشهادات المدرسية ({studentCerts.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          المواعيد واللقاءات ({studentApps.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الانشغالات والشكاوى ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الغيابات وتبريرها ({studentAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          المسار الدراسي والواجبات
        </button>
        <button
          onClick={() => setActiveTab('summons')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'summons'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الاستدعاءات والإشعارات ({studentSummons.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          صندوق المراسلات ({messages.filter((m) => !m.read).length} جديد)
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          استطلاع الرأي والاقتراحات
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-emerald-900 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          تحديث بيانات الولي
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Unacknowledged Alerts Banner */}
          {studentAttendance.some((a) => !a.parentAcknowledged) && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-900 text-sm">
                    إشعار غياب مسجل للتلميذ {currentStudent?.fullName}
                  </h4>
                  <p className="text-xs text-rose-800">
                    تم تسجيل غياب في الفترة الأخيرة. يرجى تأكيد الاطلاع وإرسال تبرير الغياب إلكترونياً لتفادي الإجراءات النظامية.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
              >
                تبرير الغياب الآن
              </button>
            </div>
          )}

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Certificate Status Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  أحدث الشهادات المدرسية
                </h4>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className="text-xs text-emerald-800 hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              {studentCerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد طلبات شهادات حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {studentCerts.slice(0, 2).map((cert) => (
                    <div key={cert.id} className="p-2.5 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">{cert.purpose}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{cert.refNumber}</div>
                      </div>
                      <div className="text-left">
                        {cert.status === 'ready_pdf' || (cert.status === 'ready' && cert.deliveryMethod === 'digital') ? (
                          <button
                            onClick={() => setPreviewCertificate(cert)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            تحميل PDF
                          </button>
                        ) : cert.status === 'ready_pickup' || (cert.status === 'ready' && cert.deliveryMethod === 'in_person') ? (
                          <button
                            onClick={() => setActiveTab('certificates')}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded cursor-pointer"
                          >
                            <Calendar className="w-3 h-3" />
                            موعد الاستلام
                          </button>
                        ) : cert.status === 'rejected' ? (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            مرفوضة
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            قيد المعالجة
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Appointments Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-800" />
                  المواعيد واللقاءات
                </h4>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs text-blue-800 hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              {studentApps.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد مواعيد مسجلة.</p>
              ) : (
                <div className="space-y-2">
                  {studentApps.slice(0, 2).map((app) => (
                    <div key={app.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{app.targetName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                          {app.status === 'confirmed' ? 'موعد مؤكد' : 'قيد الدراسة'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{app.subject}</p>
                      {app.confirmedDate && (
                        <p className="text-[11px] font-bold text-emerald-800">
                          الموعد: {formatDateAr(app.confirmedDate)} ({app.confirmedTime})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Inquiries Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-800" />
                  متابعة الانشغالات
                </h4>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-amber-800 hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              {inquiries.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد انشغالات مسجلة.</p>
              ) : (
                <div className="space-y-2">
                  {inquiries.slice(0, 2).map((inq) => (
                    <div key={inq.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 text-[10px]">{inq.refCode}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                          {inq.status === 'resolved' ? 'تم الرد' : inq.status === 'in_progress' ? 'قيد المعالجة' : 'جديد'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">{inq.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* School Announcements for Child's Grade */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-800" />
              إعلانات تهم قسم {currentStudent?.grade}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements
                .filter((a) => a.targetGrade === 'all' || a.targetGrade === currentStudent?.grade)
                .map((ann) => (
                  <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900">{ann.title}</h5>
                      <span className="text-[10px] font-mono text-slate-500">{ann.date}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      {ann.acknowledgedByParent ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          تم تأكيد الاطلاع
                        </span>
                      ) : (
                        <button
                          onClick={() => acknowledgeAnnouncement(ann.id)}
                          className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline cursor-pointer"
                        >
                          تأكيد الاطلاع على الإعلان
                        </button>
                      )}
                      <span className="text-slate-400 font-mono text-[10px]">
                        {ann.targetGrade === 'all' ? 'عام' : ann.targetGrade}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                طلبات الشهادات المدرسية والوثائق
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                تُستخرج الشهادة حصراً من النظام الرقمي لوزارة التربية الوطنية، وتقوم الإدارة بمسحها ضوئياً ورفعها PDF لحسابكم أو تحديد موعد لاستلامها حضورياً.
              </p>
            </div>
            <button
              onClick={() => setShowCertModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              تقديم طلب شهادة جديدة
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>سجل طلبات الشهادات السابقة ({studentCerts.length})</span>
              <span className="text-slate-500">الموسم الدراسي: 2025/2026</span>
            </div>

            {studentCerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-400" />
                <p>لم يتم تقديم أي طلب شهادة لهذا التلميذ حتى الآن.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentCerts.map((cert) => {
                  const isPdfReady =
                    cert.status === 'ready_pdf' ||
                    (cert.status === 'ready' && cert.deliveryMethod === 'digital');
                  const isPickupReady =
                    cert.status === 'ready_pickup' ||
                    (cert.status === 'ready' && cert.deliveryMethod === 'in_person');

                  return (
                    <div key={cert.id} className="p-5 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{cert.purpose}</span>
                          <span className="font-mono text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded font-semibold">
                            {cert.refNumber}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          تاريخ تقديم الطلب: {formatDateAr(cert.requestedAt)}
                        </span>
                      </div>

                      {/* Case 1: Uploaded Scanned PDF by Administration */}
                      {isPdfReady && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-950 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>تم رفع الشهادة المدرسية الرسمية (ملف PDF ممسوح ضوئياً) من طرف الإدارة</span>
                            </div>
                            <span className="text-[11px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded shrink-0">
                              جاهزة للتحميل والطباعة فوراً
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs space-y-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-slate-600 font-mono flex items-center gap-1.5 font-bold">
                                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                {cert.uploadedPdf?.fileName || `شهادة_مدرسية_رسمية_${cert.studentName}.pdf`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                الحجم: {cert.uploadedPdf?.fileSize || '348 KB'} · تاريخ الرفع: {cert.uploadedPdf?.uploadedAt || cert.processedAt || '2026-10-04'}
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-900 pt-1 border-t border-slate-100">
                              المصدر: {cert.uploadedPdf?.sourceNote || 'مستخرجة من النظام الرقمي لوزارة التربية الوطنية وممسوحة ضوئياً بعد الختم والتوقيع الإداري.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              onClick={() =>
                                downloadCertificatePdf(
                                  cert.uploadedPdf?.fileName || `شهادة_مدرسية_رسمية_${currentStudent?.fullName || 'التلميذ'}.pdf`,
                                  cert.uploadedPdf?.fileDataUrl,
                                  {
                                    studentName: cert.studentName,
                                    refNumber: cert.refNumber,
                                    academicYear: cert.academicYear || currentStudent?.academicYear || '2025/2026',
                                    purpose: cert.purpose,
                                  }
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                            >
                              <Download className="w-3.5 h-3.5" />
                              تحميل ملف PDF المرفوع
                            </button>
                            <button
                              onClick={() => setPreviewCertificate(cert)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-900 font-semibold rounded-lg cursor-pointer transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              معاينة الملف الممسوح ضوئياً
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case 2: Scheduled for In-Person Pickup */}
                      {isPickupReady && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-950 font-bold">
                              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>تم تجهيز الشهادة المدرسية وتحديد موعد لاستلامها مباشرة من المؤسسة</span>
                            </div>
                            <span className="text-[11px] bg-blue-200 text-blue-950 font-bold px-2 py-0.5 rounded">
                              موعد استلام رسمي محدد
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block">تاريخ الاستلام بالمؤسسة:</span>
                              <strong className="text-blue-950 font-bold text-xs">
                                {formatDateAr(cert.pickupAppointmentDate || cert.pickupDate || '2026-10-18')}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">التوقيت:</span>
                              <strong className="text-blue-950 font-bold text-xs">
                                {cert.pickupAppointmentTime || '10:30 صباحاً'}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">شباك الاستلام بالمدرسة:</span>
                              <strong className="text-blue-950 font-bold text-xs">
                                {cert.pickupOffice || 'مكتب أمانة المديرة (شباك التمدرس)'}
                              </strong>
                            </div>
                          </div>

                          <p className="text-blue-900 text-[11px]">
                            📌 <strong>تعليمات الإدارة للولي:</strong> {cert.pickupNotes || 'يرجى الاستظهار ببطاقة التعريف الوطنية للولي أو الدفتر العائلي عند الحضور بالمؤسسة.'}
                          </p>

                          {cert.uploadedPdf?.fileDataUrl && (
                            <div className="pt-1">
                              <button
                                onClick={() => setPreviewCertificate(cert)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                معاينة النسخة الممسوحة ضوئياً أيضاً
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Case 3: Processing / Pending */}
                      {!isPdfReady && !isPickupReady && cert.status !== 'rejected' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-slate-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>
                              الطلب قيد المعالجة الإدارية · تقوم إدارة المؤسسة باستخراج الشهادة من النظام الرقمي ومسحها ضوئياً لرفعها PDF لحسابكم، أو تحديد موعد لاستلامها حضورياً من أمانة المدرسة.
                            </span>
                          </div>
                          <span className="text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded text-[11px]">
                            قيد المراجعة
                          </span>
                        </div>
                      )}

                      {/* Case 4: Rejected */}
                      {cert.status === 'rejected' && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-1 text-rose-900">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                              تم رفض طلب الشهادة من طرف الإدارة
                            </span>
                            <span className="bg-rose-200 text-rose-950 px-2 py-0.5 rounded text-[11px]">
                              مرفوضة
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-800">
                            <strong>سبب الرفض:</strong> {cert.rejectionReason || 'عدم استكمال البيانات في الملف المدرسي للتلميذ.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                حجز موعد مع الأستاذ أو المديرة
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                تنظيم اللقاءات التربوية والإدارية لضمان حسن الاستقبال وتفادي فترات التدريس.
              </p>
            </div>
            <button
              onClick={() => setShowAppModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              طلب موعد جديد
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              قائمة المواعيد ({studentApps.length})
            </div>

            {studentApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-400" />
                <p>لا توجد طلبات مواعيد مسجلة لهذا التلميذ.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentApps.map((app) => (
                  <div key={app.id} className="p-4 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          لقاء مع: {app.targetName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status === 'confirmed' ? 'تم تأكيد الموعد' : 'قيد الدراسة والبرمجة'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        تاريخ تقديم الطلب: {formatDateAr(app.requestedAt)}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-medium">موضوع اللقاء: {app.subject}</p>
                    
                    <div className="bg-slate-50 p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 border border-slate-100">
                      <div>
                        <span className="text-slate-500">الفترة المقترحة من الولي:</span>{' '}
                        <strong className="text-slate-800">{formatDateAr(app.preferredDate)} ({app.preferredPeriod === 'morning' ? 'صباحاً' : 'مساءً'})</strong>
                      </div>
                      {app.confirmedDate && (
                        <div className="text-emerald-900 font-bold">
                          الموعد المعتمد من المؤسسة: {formatDateAr(app.confirmedDate)} على الساعة {app.confirmedTime}
                        </div>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-500 italic">ملاحظات الإدارة: {app.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INQUIRIES & COMPLAINTS */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                نظام معالجة الانشغالات والشكاوى
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                تتبع رسمي لكل انشغال برقم مرجعي، مع توجيهه للمصلحة المختصة والرد المعلل.
              </p>
            </div>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              تسجيل انشغال جديد
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tickets List (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <div className="p-3.5 bg-slate-50 font-bold text-xs text-slate-700 border-b border-slate-200">
                قائمة الانشغالات المسجلة ({inquiries.length})
              </div>
              {inquiries.map((inq) => {
                const isSelected = selectedInquiryId === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected ? 'bg-amber-50/60 border-r-4 border-amber-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-900">{inq.refCode}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {categoryNames[inq.category]}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs truncate">{inq.subject}</h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{formatDateAr(inq.createdAt)}</span>
                      <span className={`font-semibold ${inq.status === 'resolved' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {inq.status === 'resolved' ? 'تمت الإجابة' : inq.status === 'closed' ? 'مغلق ومقيّم' : 'قيد المعالجة'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ticket Details & Conversation (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              {(() => {
                const currentInq = inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
                if (!currentInq) {
                  return (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      اختر انشغالاً من القائمة لمتابعة تفاصيله والردود الرسمية.
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 text-xs">
                    <div className="border-b border-slate-200 pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded">
                          الرقم المرجعي: {currentInq.refCode}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          تاريخ التسجيل: {formatDateAr(currentInq.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 pt-1">{currentInq.subject}</h4>
                      <p className="text-[11px] text-slate-500">
                        المجال: <strong>{categoryNames[currentInq.category]}</strong> · المعني: <strong>{currentInq.studentName || 'عام'}</strong>
                      </p>
                    </div>

                    {/* Original Parent Text */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 block">نص الانشغال المودع:</span>
                      <p className="text-slate-800 leading-relaxed">{currentInq.details}</p>
                      {currentInq.attachmentName && (
                        <p className="text-[11px] text-emerald-800 font-medium">
                          📎 وثيقة مرفقة: {currentInq.attachmentName}
                        </p>
                      )}
                    </div>

                    {/* School Official Responses */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-slate-900 text-xs">سجل الردود والإجراءات المتخذة:</h5>
                      {currentInq.responses.length === 0 ? (
                        <p className="text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                          طلبكم قيد الدراسة لدى المصلحة المعنية، وسيتم إشعاركم فور تسجيل الرد الرسمي.
                        </p>
                      ) : (
                        currentInq.responses.map((resp) => (
                          <div
                            key={resp.id}
                            className={`p-3.5 rounded-xl border space-y-1.5 ${
                              resp.isOfficial
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{resp.authorName} ({resp.authorRole})</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {formatDateAr(resp.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-800 leading-relaxed">{resp.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Parent Follow-up Reply */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <label className="block font-semibold text-slate-700">إضافة تعقيب أو معلومة إضافية للرد:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="اكتب تعقيبك هنا..."
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-800"
                        />
                        <button
                          onClick={() => {
                            if (!replyText.trim()) return;
                            respondToInquiry(currentInq.id, replyText, parent.fullName, 'ولي الأمر');
                            setReplyText('');
                          }}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                        >
                          إرسال
                        </button>
                      </div>
                    </div>

                    {/* Satisfaction Rating Component */}
                    {currentInq.status === 'resolved' && !currentInq.satisfactionRating && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>تقييم طريقة معالجة الانشغال (قياس رضا الولي):</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          هل تمت معالجة طلبك بما يرضيك؟ ساعدنا في تحسين خدمات المدرسة.
                        </p>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRatingStars(star)}
                              className={`p-1 rounded cursor-pointer ${
                                star <= ratingStars ? 'text-amber-500' : 'text-slate-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="font-bold text-slate-700 mr-2">{ratingStars} من 5</span>
                        </div>
                        <input
                          type="text"
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="ملاحظات حول طريقة المعالجة (اختياري)..."
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                        <button
                          onClick={() => {
                            rateInquiry(currentInq.id, ratingStars, ratingComment);
                            setRatingComment('');
                          }}
                          className="px-4 py-1.5 bg-amber-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                        >
                          تأكيد التقييم وإغلاق الانشغال
                        </button>
                      </div>
                    )}

                    {currentInq.satisfactionRating && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
                        <span>تم إغلاق الانشغال وتقييمه من طرفكم: {currentInq.satisfactionRating} / 5</span>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ATTENDANCE & JUSTIFICATION */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل الغيابات والتأخرات وتبريرها إلكترونياً
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                متابعة دقيقة لحضور وغياب التلميذ(ة) <span className="font-bold text-emerald-900">{currentStudent?.fullName}</span>.
              </p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
              إجمالي الغيابات: <strong className="text-slate-900">{studentAttendance.filter((a) => a.type === 'absence').length}</strong> · التأخرات: <strong className="text-slate-900">{studentAttendance.filter((a) => a.type === 'lateness').length}</strong>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              سجل الغيابات والتأخرات المسجلة
            </div>

            {studentAttendance.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                سجل التلميذ نظيف، لم يتم تسجيل أي غياب أو تأخر.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentAttendance.map((record) => (
                  <div key={record.id} className="p-4 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-2.5 py-0.5 rounded ${
                          record.type === 'absence' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {record.type === 'absence' ? 'تسجيل غياب' : 'تسجيل تأخر'}
                        </span>
                        <span className="font-bold text-slate-900">
                          {formatDateAr(record.date)} - الفترة {record.session === 'morning' ? 'الصباحية' : 'المسائية'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {record.parentAcknowledged ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            تم الإقرار بالاطلاع
                          </span>
                        ) : (
                          <button
                            onClick={() => acknowledgeAttendance(record.id)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold text-[11px] cursor-pointer"
                          >
                            تأكيد الاطلاع على الإشعار
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Justification Status */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      {record.isJustified ? (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800">
                            المبرر المقدم: {record.justificationReason}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            النوع: {record.justificationType === 'medical' ? 'شهادة طبية' : 'عذر عائلي'} · تاريخ الإيداع: {formatDateAr(record.justificationDate || record.date)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-rose-700 font-semibold">
                          الغياب غير مبرر حتى الآن.
                        </p>
                      )}

                      <div>
                        {record.isJustified ? (
                          record.justificationStatus === 'approved' ? (
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[11px]">
                              مبرر ومقبول من الإدارة
                            </span>
                          ) : (
                            <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-bold text-[11px]">
                              التبرير قيد مراجعة الإدارة
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              setJustifyAttendanceId(record.id);
                              setShowJustifyModal(true);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                          >
                            إرسال تبرير الغياب إلكترونياً
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: ACADEMIC & HOMEWORK */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* Evaluations / Report Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  كشف التقييمات والنتائج الرسمية - {currentStudent?.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentStudent?.grade} · الفصل الأول الدراسي 2025/2026
                </p>
              </div>

              {studentEvaluation && (
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-950 font-bold text-sm">
                    المعدل العام: {studentEvaluation.generalAverage.toFixed(2)} / 10
                  </div>
                  <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-blue-950 font-bold text-sm">
                    الرتبة: {studentEvaluation.rank} من {studentEvaluation.classSize}
                  </div>
                </div>
              )}
            </div>

            {studentEvaluation ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2.5 font-bold">المادة التعليمية</th>
                        <th className="p-2.5 font-bold font-mono">العلامة / 10</th>
                        <th className="p-2.5 font-bold">ملاحظات الأستاذ(ة)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentEvaluation.subjects.map((sub, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">{sub.name}</td>
                          <td className="p-2.5 font-mono font-bold text-emerald-900">{sub.score}</td>
                          <td className="p-2.5 text-slate-600">{sub.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-1 text-xs">
                  <p className="text-emerald-900">
                    <strong>ملاحظة مجلس الأساتذة:</strong> {studentEvaluation.teacherRemarks}
                  </p>
                  <p className="text-emerald-950 font-bold">
                    قرار المديرة: {studentEvaluation.principalDecision}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-4 text-center">
                سيتم إتاحة كشف النقاط لهذا التلميذ فور اعتماده رسمياً في نهاية الفصل.
              </p>
            )}
          </div>

          {/* Homework Diary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-800" />
              مفكرة الواجبات المنزلية والأنشطة الأسبوعية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentHomework.map((hw) => (
                <div key={hw.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{hw.subject}: {hw.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">أجل التسليم: {hw.dueDate}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{hw.description}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <button
                      onClick={() => toggleHomeworkCompleted(hw.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        hw.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {hw.isCompleted ? 'تم إنجاز الواجب' : 'تحديد كمكتمل بالبيت'}
                    </button>
                    <span className="text-[10px] text-slate-400">{hw.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SUMMONS & BULLETINS */}
      {activeTab === 'summons' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-800" />
              سجل استدعاءات الولي الرسمية
            </h3>
            {studentSummons.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">لا توجد استدعاءات رسمية مسجلة.</p>
            ) : (
              <div className="space-y-3">
                {studentSummons.map((sum) => (
                  <div key={sum.id} className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>استدعاء رسمي من إدارة مدرسة نوار محمد</span>
                      <span className="font-mono text-[10px] text-slate-500">تاريخ الإرسال: {sum.sentDate}</span>
                    </div>
                    <p className="text-slate-800 font-medium">سبب الاستدعاء: {sum.reason}</p>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-rose-950">
                        موعد الحضور بالمؤسسة: {formatDateAr(sum.scheduledDate)} ({sum.scheduledTime})
                      </span>
                      <span className="text-slate-600">المكان: {sum.office}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      {sum.status === 'acknowledged' ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          تم الإقرار بالاطلاع في: {sum.acknowledgedAt}
                        </span>
                      ) : (
                        <button
                          onClick={() => acknowledgeSummon(sum.id)}
                          className="px-4 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                        >
                          تأكيد الاطلاع وتأكيد الحضور
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: DIRECT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                صندوق المراسلات المباشرة مع المؤسسة
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                قناة تواصل رسمية موثقة بين ولي الأمر والطاقم الإداري والتربوي.
              </p>
            </div>
            <button
              onClick={() => setShowNewMsgModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
              إرسال رسالة جديدة
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">صندوق الرسائل فارغ.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => markMessageRead(msg.id)}
                  className={`p-4 space-y-1.5 text-xs cursor-pointer transition-colors ${
                    !msg.read ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{msg.senderName} ({msg.senderRole})</span>
                    <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                  </div>
                  <h5 className="font-semibold text-slate-800">{msg.subject}</h5>
                  <p className="text-slate-600 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 9: FEEDBACK & SURVEYS */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-800" />
              استطلاع رأي الأولياء وصندوق اقتراحات تحسين المدرسة
            </h3>
            <p className="text-xs text-slate-600">
              رأيكم محل تقدير مستمر لتطوير ظروف التمدرس والوجبات المدرسية ومرافق مدرسة نوار محمد الابتدائية.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSurvey('جودة الخدمات المدرسية والمطعم', 5, 'شكراً لجهود الإدارة والطاقم التربوي في تيارت.');
                alert('شكراً لكم، تم إرسال ملاحظاتكم واقتراحاتكم إلى إدارة المدرسة.');
              }}
              className="space-y-4 pt-2 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مجال الاقتراح أو التقييم
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option>المطعم المدرسي والوجبات الساخنة</option>
                  <option>الأنشطة الثقافية والرياضية اللاصفية</option>
                  <option>النظافة والمرافق الصحية والمكتبة المدرسية</option>
                  <option>أوقات الدوام والتواصل الإلكتروني</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اقتراحك أو ملاحظتك البناءة
                </label>
                <textarea
                  rows={3}
                  placeholder="أدخل مقترحاتك لتطوير المدرسة..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
              >
                إرسال الاقتراح للإدارة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 10: UPDATE PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">
              تحديث بيانات الاتصال للولي
            </h3>
            <p className="text-slate-600">
              تأكد من صحة رقم الهاتف والبريد الإلكتروني لاستقبال الإشعارات ومراسلات المدرسة.
            </p>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                تم حفظ التعديلات بنجاح.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم الكامل للولي (ثابت)</label>
                <input
                  type="text"
                  disabled
                  value={parent.fullName}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم التعريف الوطني (محمي)</label>
                <input
                  type="text"
                  disabled
                  value={maskNIN(parent.nin)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف المحمول *</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">العنوان السكني</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
              >
                حفظ التحديثات
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">طلب شهادة مدرسية إلكترونية</h4>
              <button onClick={() => setShowCertModal(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            {certSuccessMsg ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-900">{certSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateCert} className="p-5 space-y-3.5 text-xs">
                {/* Official Regulation Notice */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    تنبيه تنظيمي رسمي:
                  </span>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    تصدر الشهادة المدرسية حصراً من <strong>النظام الرقمي لوزارة التربية الوطنية</strong>. تتولى إدارة المؤسسة استخراجها وتوقيعها وختمها ومسحها ضوئياً.
                    يمكنكم طلب رفعها كملف PDF للتحميل، أو تحديد موعد لاستلامها حضورياً.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التلميذ المعني</label>
                  <input
                    type="text"
                    disabled
                    value={currentStudent?.fullName || ''}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الغرض من الشهادة *</label>
                  <select
                    value={certPurpose}
                    onChange={(e) => setCertPurpose(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option>ملف الضمان الاجتماعي (CNAS)</option>
                    <option>ملف بطاقة التعريف الوطنية البيومترية</option>
                    <option>ملف النادي الرياضي أو الكشافة</option>
                    <option>ملف المنحة المدرسية الخاصة</option>
                    <option>ملف التأشيرة / السفر العائلي</option>
                    <option>غرض إداري آخر</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">طريقة الاستلام المفضلة من الإدارة *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className={`p-3 border rounded-xl cursor-pointer text-right flex flex-col justify-between transition-colors ${certDelivery === 'digital' ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          name="del"
                          checked={certDelivery === 'digital'}
                          onChange={() => setCertDelivery('digital')}
                          className="text-emerald-800"
                        />
                        <span className="font-bold text-xs">رفع ملف PDF ممسوح ضوئياً</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        تقوم الإدارة باستخراج الشهادة ومسحها ضوئياً ورفعها بصيغة PDF لحسابكم لتحميلها وطباعتها فوراً.
                      </p>
                    </label>

                    <label className={`p-3 border rounded-xl cursor-pointer text-right flex flex-col justify-between transition-colors ${certDelivery === 'in_person' ? 'border-blue-800 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          name="del"
                          checked={certDelivery === 'in_person'}
                          onChange={() => setCertDelivery('in_person')}
                          className="text-blue-800"
                        />
                        <span className="font-bold text-xs">تحديد موعد للاستلام بالمؤسسة</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal">
                        تقوم الإدارة ببرمجة موعد دقيق (يوم وتوقيت) لاستلام النسخة الورقية الموقعة والمختومة مباشرة.
                      </p>
                    </label>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    إيداع الطلب
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REQUEST APPOINTMENT MODAL */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-blue-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">حجز موعد لقاء رسمي بالمدرسة</h4>
              <button onClick={() => setShowAppModal(false)} className="text-blue-200 hover:text-white">✕</button>
            </div>
            {appSuccessMsg ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle className="w-10 h-10 text-blue-600 mx-auto" />
                <p className="font-bold text-slate-900">{appSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateAppointment} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الطرف المطلوب لقاؤه *</label>
                  <select
                    value={appTarget}
                    onChange={(e) => setAppTarget(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="teacher">أستاذ القسم ({currentStudent?.teacherName})</option>
                    <option value="principal">السيدة مديرة المدرسة (م. بن عيسى)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">موضوع اللقاء بالتفصيل *</label>
                  <input
                    type="text"
                    required
                    value={appSubject}
                    onChange={(e) => setAppSubject(e.target.value)}
                    placeholder="مثال: مناقشة التحصيل في مادة الرياضيات..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">اليوم المقترح *</label>
                    <input
                      type="date"
                      required
                      value={appDate}
                      onChange={(e) => setAppDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">الفترة المفضلة</label>
                    <select
                      value={appPeriod}
                      onChange={(e) => setAppPeriod(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="morning">الفترة الصباحية (10:00 - 11:30)</option>
                      <option value="afternoon">الفترة المسائية (14:00 - 15:30)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAppModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    إرسال طلب الموعد
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NEW INQUIRY MODAL */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-amber-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">تسجيل انشغال أو شكوى جديدة</h4>
              <button onClick={() => setShowInquiryModal(false)} className="text-amber-200 hover:text-white">✕</button>
            </div>
            {inqSuccessCode ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-slate-900 text-sm">تم تسجيل الانشغال بنجاح!</h5>
                <p className="font-mono text-emerald-800 font-bold text-base">رقم المتابعة: {inqSuccessCode}</p>
                <p className="text-slate-500">تم توجيه انشغالكم وسيصلكم الرد والإشعار خلال 24 إلى 48 ساعة.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateInquiry} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">مجال الانشغال *</label>
                  <select
                    value={inqCategory}
                    onChange={(e) => setInqCategory(e.target.value as InquiryCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="educational">تربوي وبيداغوجي (المناهج والأساتذة)</option>
                    <option value="behavioral">سلوكي وانضباطي (التعامل والزملاء)</option>
                    <option value="administrative">إداري (الشهادات والملفات)</option>
                    <option value="health">صحي وطبي (الوقاية والحساسية)</option>
                    <option value="canteen">إطعام مدرسي (المطعم والوجبات)</option>
                    <option value="transport_facilities">نقل ومرافق مدرسية (الأقسام والساحة)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">عنوان أو ملخص الانشغال *</label>
                  <input
                    type="text"
                    required
                    value={inqSubject}
                    onChange={(e) => setInqSubject(e.target.value)}
                    placeholder="مثال: استفسار حول وجبات المطعم..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تفاصيل الانشغال *</label>
                  <textarea
                    rows={4}
                    required
                    value={inqDetails}
                    onChange={(e) => setInqDetails(e.target.value)}
                    placeholder="يرجى كتابة التفاصيل والوقائع بوضوح..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">إرفاق وثيقة (اختياري)</label>
                  <input
                    type="text"
                    value={inqAttachment}
                    onChange={(e) => setInqAttachment(e.target.value)}
                    placeholder="اسم الملف المرفق (شهادة طبية، تقرير...)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    إيداع الانشغال والحصول على رقم التتبع
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* JUSTIFY ATTENDANCE MODAL */}
      {showJustifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-rose-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">تبرير الغياب إلكترونياً</h4>
              <button onClick={() => setShowJustifyModal(false)} className="text-rose-200 hover:text-white">✕</button>
            </div>
            {justifySuccess ? (
              <div className="p-6 text-center text-xs space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-slate-900">تم إرسال تبرير الغياب بنجاح!</h5>
                <p className="text-slate-500">تم تحويل الملف لمكتب الإدارة للمصادقة وتعديل سجل الغياب.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!justifyReason) return;
                  submitJustification(justifyAttendanceId, justifyReason, justifyType, justifyFileName);
                  setJustifySuccess(true);
                  setTimeout(() => {
                    setJustifySuccess(false);
                    setShowJustifyModal(false);
                    setJustifyReason('');
                  }, 1800);
                }}
                className="p-5 space-y-3.5 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">نوع المبرر *</label>
                  <select
                    value={justifyType}
                    onChange={(e) => setJustifyType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="medical">شهادة طبية / فحص في العيادة</option>
                    <option value="family">ظرف عائلي قاهر</option>
                    <option value="travel">سفر اضطراري</option>
                    <option value="other">عذر قهري آخر</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">شرح سبب الغياب بالتفصيل *</label>
                  <textarea
                    rows={3}
                    required
                    value={justifyReason}
                    onChange={(e) => setJustifyReason(e.target.value)}
                    placeholder="اكتب سبب الغياب..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم الوثيقة المرفقة (شهادة طبية مثلاً)</label>
                  <input
                    type="text"
                    value={justifyFileName}
                    onChange={(e) => setJustifyFileName(e.target.value)}
                    placeholder="شهادة_طبية_مؤرخة.pdf"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJustifyModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    تأكيد وإرسال التبرير
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD CHILD MODAL */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">إضافة ابن متمدرس جديد إلى الحساب</h4>
              <button onClick={() => setShowAddChildModal(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddChild} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم ولقب التلميذ *</label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="مثال: أمين نوار"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المستوى</label>
                  <select
                    value={newChildGrade}
                    onChange={(e) => setNewChildGrade(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option>السنة الأولى ابتدائي</option>
                    <option>السنة الثانية ابتدائي</option>
                    <option>السنة الثالثة ابتدائي</option>
                    <option>السنة الرابعة ابتدائي</option>
                    <option>السنة الخامسة ابتدائي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الفوج</label>
                  <select
                    value={newChildClassroom}
                    onChange={(e) => setNewChildClassroom(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option>الفوج 1</option>
                    <option>الفوج 2</option>
                    <option>الفوج 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">مكان الميلاد</label>
                  <input
                    type="text"
                    value={newChildBirthPlace}
                    onChange={(e) => setNewChildBirthPlace(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  ربط التلميذ بالحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW DIRECT MESSAGE MODAL */}
      {showNewMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">إرسال مراسلة جديدة</h4>
              <button onClick={() => setShowNewMsgModal(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!msgSubject || !msgBody) return;
                sendMessage(msgReceiver, msgSubject, msgBody, parent.fullName, 'ولي الأمر');
                setShowNewMsgModal(false);
                setMsgSubject('');
                setMsgBody('');
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الجهة المرسل إليها *</label>
                <select
                  value={msgReceiver}
                  onChange={(e) => setMsgReceiver(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option>إدارة المدرسة (الأمانة العامة)</option>
                  <option>أستاذ القسم ({currentStudent?.teacherName})</option>
                  <option>مسؤول المطعم والأنشطة</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الموضوع *</label>
                <input
                  type="text"
                  required
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="موضوع المراسلة..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">نص الرسالة *</label>
                <textarea
                  rows={4}
                  required
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  placeholder="اكتب رسالتك الرسمية هنا..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMsgModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
