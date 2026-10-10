import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  Printer,
  UserCheck,
  Users,
  Search,
  Filter,
  BarChart3,
  Send,
  Lock,
  Upload,
  Download,
} from 'lucide-react';
import { maskNIN, formatDateAr } from '../utils/security';
import { downloadCertificatePdf } from '../utils/pdfHelper';
import { CertificateStatus, InquiryCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    certificates,
    updateCertificateStatus,
    issueCertificateAsPDF,
    uploadAndSendCertificatePdf,
    scheduleCertificatePickup,
    rejectCertificate,
    appointments,
    updateAppointmentStatus,
    inquiries,
    respondToInquiry,
    updateInquiryStatus,
    attendance,
    recordAttendance,
    reviewJustification,
    announcements,
    publishAnnouncement,
    summons,
    createSummon,
    students,
    parent,
    setPreviewCertificate,
  } = useSchool();

  const [adminTab, setAdminTab] = useState<
    'overview' | 'certificates' | 'appointments' | 'inquiries' | 'attendance' | 'announcements' | 'summons' | 'parents' | 'security'
  >('overview');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | InquiryCategory>('all');

  // New Announcement Form State
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnGrade, setNewAnnGrade] = useState('all');
  const [newAnnCategory, setNewAnnCategory] = useState<'general' | 'exams' | 'schedule' | 'events'>('general');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'important' | 'urgent'>('normal');

  // New Summon Form State
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [summonStudentId, setSummonStudentId] = useState(students[0]?.id || '');
  const [summonReason, setSummonReason] = useState('');
  const [summonDate, setSummonDate] = useState('');
  const [summonTime, setSummonTime] = useState('10:00 صباحاً');
  const [summonOffice, setSummonOffice] = useState('مكتب المديرة');

  // Record Attendance Form State
  const [showAttModal, setShowAttModal] = useState(false);
  const [attStudentId, setAttStudentId] = useState(students[0]?.id || '');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attSession, setAttSession] = useState<'morning' | 'afternoon'>('morning');
  const [attType, setAttType] = useState<'absence' | 'lateness'>('absence');

  // Respond to Inquiry State
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');

  // Certificate Upload Scanned PDF Modal State
  const [showUploadPdfModal, setShowUploadPdfModal] = useState(false);
  const [selectedCertForUpload, setSelectedCertForUpload] = useState<any>(null);
  const [scannedPdfFileName, setScannedPdfFileName] = useState('');
  const [scannedPdfFileSize, setScannedPdfFileSize] = useState('348 KB');
  const [scannedPdfFileDataUrl, setScannedPdfFileDataUrl] = useState<string | undefined>(undefined);
  const [scannedPdfSourceNote, setScannedPdfSourceNote] = useState('مستخرجة من الأرضية الرقمية لوزارة التربية الوطنية وممسوحة ضوئياً بعد الختم والتوقيع');

  // Certificate Pickup Scheduling Modal State
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedCertForPickup, setSelectedCertForPickup] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState('2026-10-18');
  const [pickupTime, setPickupTime] = useState('10:30 صباحاً');
  const [pickupOffice, setPickupOffice] = useState('مكتب أمانة المديرة (شباك التمدرس)');
  const [pickupNotes, setPickupNotes] = useState('يرجى الاستظهار ببطاقة التعريف الوطنية للولي أو الدفتر العائلي عند الاستلام بالمؤسسة');

  // Certificate Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCertForReject, setSelectedCertForReject] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('عدم استكمال الوثائق المطلوبة في الملف المدرسي');

  // Category labels in Arabic
  const categoryNames: Record<InquiryCategory, string> = {
    educational: 'تربوي وبيداغوجي',
    behavioral: 'سلوكي وانضباطي',
    administrative: 'إداري ووثائق',
    health: 'صحي وطبي',
    canteen: 'إطعام مدرسي',
    transport_facilities: 'نقل ومرافق',
  };

  // KPIs
  const pendingCertsCount = certificates.filter((c) => c.status === 'pending' || c.status === 'processing').length;
  const pendingAppsCount = appointments.filter((a) => a.status === 'pending').length;
  const openInquiriesCount = inquiries.filter((i) => i.status !== 'closed').length;
  const pendingJustificationsCount = attendance.filter((a) => a.isJustified && a.justificationStatus === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              لوحة التحكم المركزية لإدارة المدرسة
            </h2>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              صلاحيات المديرة (م. بن عيسى)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            مدرسة نوار محمد الابتدائية · مديرية التربية لولاية تيارت · النظام الإداري الموحد
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAttModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5" />
            تسجيل غياب تلميذ
          </button>
          <button
            onClick={() => setShowAnnModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            نشر إعلان رسمي
          </button>
          <button
            onClick={() => setShowSummonModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            إصدار استدعاء ولي
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-right">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>طلبات الشهادات المعلقة</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{pendingCertsCount}</div>
          <p className="text-[11px] text-slate-400">تنتظر التدقيق والمصادقة</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>المواعيد قيد البرمجة</span>
            <Calendar className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{pendingAppsCount}</div>
          <p className="text-[11px] text-slate-400">طلب لقاء من الأولياء</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>الانشغالات المفتوحة</span>
            <MessageSquare className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{openInquiriesCount}</div>
          <p className="text-[11px] text-slate-400">تتطلب دراسة وتوجيهاً</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>تبريرات الغياب المنتظرة</span>
            <Clock className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{pendingJustificationsCount}</div>
          <p className="text-[11px] text-slate-400">شهادات طبية وأعذار للمصادقة</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          نظرة عامة والمهام العاجلة
        </button>
        <button
          onClick={() => setAdminTab('certificates')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'certificates'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          إدارة طلبات الشهادات ({certificates.length})
        </button>
        <button
          onClick={() => setAdminTab('appointments')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'appointments'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          جدولة المواعيد ({appointments.length})
        </button>
        <button
          onClick={() => setAdminTab('inquiries')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'inquiries'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          معالجة الانشغالات ({inquiries.length})
        </button>
        <button
          onClick={() => setAdminTab('attendance')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'attendance'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الغيابات والتبريرات ({attendance.length})
        </button>
        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'announcements'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          نشر الإعلانات ({announcements.length})
        </button>
        <button
          onClick={() => setAdminTab('summons')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'summons'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          استدعاءات الأولياء ({summons.length})
        </button>
        <button
          onClick={() => setAdminTab('parents')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'parents'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          حسابات الأولياء والتلاميذ
        </button>
        <button
          onClick={() => setAdminTab('security')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            adminTab === 'security'
              ? 'bg-white text-emerald-950 border-t-2 border-emerald-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          سجل الأمان والامتثال (18-07)
        </button>
      </div>

      {/* ADMIN TAB 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Tasks: Certificates needing validation */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  طلبات شهادات تنتظر المصادقة
                </h4>
                <button onClick={() => setAdminTab('certificates')} className="text-xs text-emerald-800 hover:underline">
                  فتح القسم
                </button>
              </div>

              {certificates.filter((c) => c.status === 'pending' || c.status === 'processing').length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">تمت معالجة كافة طلبات الشهادات المدرسية.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {certificates
                    .filter((c) => c.status === 'pending' || c.status === 'processing')
                    .map((cert) => (
                      <div key={cert.id} className="py-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{cert.studentName}</span>
                            <span className="text-slate-500 mr-2">({cert.parentName})</span>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{cert.refNumber}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          الغرض: <strong>{cert.purpose}</strong> · الطلب: {cert.deliveryMethod === 'digital' ? 'الولي يفضل نسخة رقمية' : 'الولي يفضل استلام ورقي بالمؤسسة'}
                        </p>
                        <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              setSelectedCertForUpload(cert);
                              setScannedPdfFileName(`شهادة_مدرسية_${cert.studentName.replace(/\s+/g, '_')}_2026.pdf`);
                              setShowUploadPdfModal(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                            title="رفع ملف الشهادة الممسوحة ضوئياً (المستخرجة من الأرضية الرقمية) وإرسالها PDF للولي"
                          >
                            <Upload className="w-3 h-3" />
                            رفع الشهادة PDF وإرسالها
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCertForPickup(cert);
                              setShowPickupModal(true);
                            }}
                            className="px-2.5 py-1 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                            title="تحديد موعد للولي لاستلام النسخة الورقية الموقعة والمختومة من المؤسسة"
                          >
                            <Calendar className="w-3 h-3" />
                            تحديد موعد استلام
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCertForReject(cert);
                              setShowRejectModal(true);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 rounded text-[11px] cursor-pointer"
                          >
                            رفض الطلب
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pending Appointments */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-800" />
                  طلبات مواعيد تنتظر التحديد والتأكيد
                </h4>
                <button onClick={() => setAdminTab('appointments')} className="text-xs text-blue-800 hover:underline">
                  فتح القسم
                </button>
              </div>

              {appointments.filter((a) => a.status === 'pending').length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">لا توجد طلبات مواعيد معلقة.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {appointments
                    .filter((a) => a.status === 'pending')
                    .map((app) => (
                      <div key={app.id} className="py-2.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{app.parentName} (تلميذ: {app.studentName})</span>
                          <span className="text-[11px] font-mono text-slate-500">{app.preferredDate}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] truncate">{app.subject}</p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                app.id,
                                'confirmed',
                                app.preferredDate,
                                '10:00 صباحاً',
                                'تم تأكيد الموعد بمكتب الإدارة'
                              )
                            }
                            className="px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer"
                          >
                            تأكيد الموعد (10:00 صباحاً)
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Attendance Justifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-800" />
              تبريرات غياب مودعة من الأولياء تتطلب مراجعة قانونية
            </h4>
            {attendance.filter((a) => a.isJustified && a.justificationStatus === 'pending').length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">لا توجد تبريرات جديدة تنتظر المصادقة.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {attendance
                  .filter((a) => a.isJustified && a.justificationStatus === 'pending')
                  .map((att) => (
                    <div key={att.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">
                          {att.studentName} ({att.grade}) - غياب يوم {formatDateAr(att.date)}
                        </div>
                        <p className="text-slate-600 mt-0.5">
                          السبب المذكور: <strong>{att.justificationReason}</strong> ({att.justificationAttachment})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reviewJustification(att.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded text-xs cursor-pointer"
                        >
                          قبول التبرير وتعديل السجل
                        </button>
                        <button
                          onClick={() => reviewJustification(att.id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded text-xs cursor-pointer"
                        >
                          رفض التبرير
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN TAB 2: CERTIFICATES MANAGEMENT */}
      {adminTab === 'certificates' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل طلبات الشهادات المدرسية
              </h3>
              <p className="text-slate-500">
                الشهادة تستخرج حصراً من النظام الرقمي للوزارة وتُمسح ضوئياً بعد الختم والتوقيع، لترفع PDF للولي أو يُحدد موعد لاستلامها حضورياً.
              </p>
            </div>
            <div className="text-slate-500 font-mono">
              إجمالي الطلبات: {certificates.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 font-bold font-mono">الرقم المرجعي</th>
                  <th className="p-3 font-bold">اسم التلميذ</th>
                  <th className="p-3 font-bold">اسم الولي</th>
                  <th className="p-3 font-bold">الغرض</th>
                  <th className="p-3 font-bold">تاريخ الإيداع</th>
                  <th className="p-3 font-bold">طريقة الاستلام المفضلة</th>
                  <th className="p-3 font-bold">الحالة</th>
                  <th className="p-3 font-bold text-center">الإجراء الإداري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => {
                  const student = students.find((s) => s.id === cert.studentId) || students[0];
                  return (
                    <tr key={cert.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-950">{cert.refNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{cert.studentName}</td>
                      <td className="p-3 text-slate-600">{cert.parentName}</td>
                      <td className="p-3 text-slate-700">{cert.purpose}</td>
                      <td className="p-3 font-mono text-slate-500">{cert.requestedAt}</td>
                      <td className="p-3 text-slate-600">
                        {cert.deliveryMethod === 'digital' ? 'ملف PDF ممسوح ضوئياً' : 'استلام ورقي بالمؤسسة'}
                      </td>
                      <td className="p-3">
                        {cert.status === 'ready_pdf' || (cert.status === 'ready' && cert.deliveryMethod === 'digital') ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3 h-3 text-emerald-700" />
                              تم رفع ملف PDF الممسوح ضوئياً
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                              {cert.uploadedPdf?.fileName || 'شهادة_مدرسية_رسمية.pdf'}
                            </div>
                          </div>
                        ) : cert.status === 'ready_pickup' || (cert.status === 'ready' && cert.deliveryMethod === 'in_person') ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] bg-blue-100 text-blue-800">
                              <Calendar className="w-3 h-3 text-blue-700" />
                              موعد استلام حضوري محدد
                            </span>
                            <div className="text-[10px] text-blue-900 font-semibold">
                              {cert.pickupAppointmentDate} ({cert.pickupAppointmentTime})
                            </div>
                          </div>
                        ) : cert.status === 'rejected' ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-rose-100 text-rose-800">
                              مرفوضة
                            </span>
                            {cert.rejectionReason && (
                              <div className="text-[10px] text-rose-700">{cert.rejectionReason}</div>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-amber-100 text-amber-800">
                            في انتظار قرار الإدارة
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-1.5 space-x-reverse whitespace-nowrap">
                        {cert.status !== 'ready_pdf' && cert.status !== 'ready_pickup' && cert.status !== 'ready' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedCertForUpload(cert);
                                setScannedPdfFileName(`شهادة_مدرسية_${cert.studentName.replace(/\s+/g, '_')}_2026.pdf`);
                                setShowUploadPdfModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                              title="رفع ملف الشهادة الممسوحة ضوئياً (المستخرجة من الأرضية الرقمية) وإرسالها PDF للولي"
                            >
                              <Upload className="w-3 h-3" />
                              رفع الشهادة PDF
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCertForPickup(cert);
                                setShowPickupModal(true);
                              }}
                              className="px-2.5 py-1 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                              title="تحديد موعد لاستلام النسخة بالمؤسسة"
                            >
                              <Calendar className="w-3 h-3" />
                              تحديد موعد استلام
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCertForReject(cert);
                                setShowRejectModal(true);
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 rounded text-[11px] cursor-pointer"
                            >
                              رفض
                            </button>
                          </>
                        )}
                        {(cert.status === 'ready_pdf' || cert.status === 'ready_pickup' || cert.status === 'ready') && (
                          <div className="flex items-center justify-center gap-1.5">
                            {cert.status === 'ready_pdf' && (
                              <>
                                <button
                                  onClick={() => setPreviewCertificate(cert)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                  title="معاينة ملف PDF الممسوح ضوئياً"
                                >
                                  <FileText className="w-3 h-3" />
                                  معاينة الملف الممسوح
                                </button>
                                <button
                                  onClick={() =>
                                    downloadCertificatePdf(
                                      cert.uploadedPdf?.fileName || `شهادة_${student.fullName}.pdf`,
                                      cert.uploadedPdf?.fileDataUrl,
                                      {
                                        studentName: student.fullName,
                                        refNumber: cert.refNumber,
                                        academicYear: student.academicYear,
                                        purpose: cert.purpose,
                                      }
                                    )
                                  }
                                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                  title="تحميل ملف PDF"
                                >
                                  <Download className="w-3 h-3" />
                                  تحميل
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCertForUpload(cert);
                                    setScannedPdfFileName(cert.uploadedPdf?.fileName || `شهادة_${cert.studentName}.pdf`);
                                    setShowUploadPdfModal(true);
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] cursor-pointer"
                                  title="إعادة رفع أو استبدال الملف الممسوح"
                                >
                                  إعادة رفع
                                </button>
                              </>
                            )}

                            {cert.status === 'ready_pickup' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedCertForPickup(cert);
                                    setShowPickupModal(true);
                                  }}
                                  className="px-2.5 py-1 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer"
                                  title="تعديل موعد الاستلام"
                                >
                                  تعديل الموعد
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCertForUpload(cert);
                                    setScannedPdfFileName(`شهادة_مدرسية_${cert.studentName.replace(/\s+/g, '_')}_2026.pdf`);
                                    setShowUploadPdfModal(true);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                                  title="رفع نسخة PDF أيضاً للولي"
                                >
                                  <Upload className="w-3 h-3" />
                                  رفع PDF أيضاً
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN TAB 3: APPOINTMENTS MANAGEMENT */}
      {adminTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                تنظيم وجدولة لقاءات الأولياء
              </h3>
              <p className="text-slate-500">
                برمجة المقابلات مع المديرة والأساتذة لتفادي تشتيت الحصص الدراسية.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <div key={app.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      طلب لقاء من: {app.parentName}
                    </span>
                    <span className="text-slate-500">مع ({app.targetName})</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {app.status === 'confirmed' ? 'موعد مؤكد' : 'في الانتظار'}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    التاريخ المفضل من الولي: {app.preferredDate} ({app.preferredPeriod === 'morning' ? 'صباحاً' : 'مساءً'})
                  </span>
                </div>

                <p className="text-slate-700 font-medium">موضوع اللقاء: {app.subject}</p>

                {app.confirmedDate && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg flex items-center justify-between font-bold">
                    <span>الموعد المبرمج رسمياً: {formatDateAr(app.confirmedDate)} على الساعة {app.confirmedTime}</span>
                    <span className="text-xs font-normal text-slate-600">{app.notes}</span>
                  </div>
                )}

                {app.status === 'pending' && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateAppointmentStatus(
                          app.id,
                          'confirmed',
                          app.preferredDate,
                          '10:30 صباحاً',
                          'تم تحديد اللقاء بقاعة الاستقبال بالمؤسسة'
                        )
                      }
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      تأكيد الموعد على 10:30 صباحاً
                    </button>
                    <button
                      onClick={() =>
                        updateAppointmentStatus(
                          app.id,
                          'confirmed',
                          app.preferredDate,
                          '14:30 مساءً',
                          'تم تحديد اللقاء بقاعة الاستقبال بالمؤسسة'
                        )
                      }
                      className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      تأكيد الموعد على 14:30 مساءً
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 4: INQUIRIES & COMPLAINTS WORKFLOW */}
      {adminTab === 'inquiries' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                نظام توجيه ومعالجة الانشغالات والشكاوى
              </h3>
              <p className="text-slate-500">
                تسجيل الردود الرسمية، توجيه الانشغالات للمصالح، وتتبع رضا الأولياء.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">تصنيف:</span>
              <select
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value as any)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                <option value="all">جميع المجالات</option>
                <option value="educational">تربوي وبيداغوجي</option>
                <option value="canteen">إطعام مدرسي</option>
                <option value="health">صحي وطبي</option>
                <option value="behavioral">سلوكي</option>
                <option value="administrative">إداري</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {inquiries
              .filter((inq) => inquiryFilter === 'all' || inq.category === inquiryFilter)
              .map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                        {inq.refCode}
                      </span>
                      <span className="font-bold text-slate-900">{inq.subject}</span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {categoryNames[inq.category]}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{inq.createdAt}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-600">
                      <strong>الولي:</strong> {inq.parentName} · <strong>التلميذ:</strong> {inq.studentName || 'عام'}
                    </p>
                    <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {inq.details}
                    </p>
                    {inq.attachmentName && (
                      <p className="text-emerald-800 text-[11px] font-medium">📎 مرفق: {inq.attachmentName}</p>
                    )}
                  </div>

                  {/* Previous responses */}
                  {inq.responses.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="font-bold text-slate-700 block text-[11px]">الردود المسجلة:</span>
                      {inq.responses.map((resp) => (
                        <div key={resp.id} className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900 text-[11px]">
                            <span>{resp.authorName} ({resp.authorRole})</span>
                            <span className="font-mono text-slate-400">{resp.createdAt}</span>
                          </div>
                          <p className="text-slate-700">{resp.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin Reply Form */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                    <label className="font-bold text-slate-800">تسجيل رد رسمي من إدارة المدرسة:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="اكتب الإجراء المتخذ أو الرد الرسمي..."
                        value={activeInquiryId === inq.id ? adminReply : ''}
                        onChange={(e) => {
                          setActiveInquiryId(inq.id);
                          setAdminReply(e.target.value);
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        onClick={() => {
                          if (!adminReply.trim()) return;
                          respondToInquiry(inq.id, adminReply, 'السيدة م. بن عيسى', 'مديرة المدرسة');
                          setAdminReply('');
                          setActiveInquiryId(null);
                        }}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                      >
                        إرسال الرد الرسمي
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 5: ATTENDANCE & JUSTIFICATION AUDIT */}
      {adminTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل الغيابات والتأخرات اليومي للمدرسة
              </h3>
              <p className="text-slate-500">
                تسجيل الغياب، تبليغ الأولياء فورياً، ومراجعة التبريرات الطبية والنظامية.
              </p>
            </div>
            <button
              onClick={() => setShowAttModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              تسجيل غياب تلميذ جديد
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 font-bold">التلميذ</th>
                  <th className="p-3 font-bold">القسم</th>
                  <th className="p-3 font-bold">التاريخ</th>
                  <th className="p-3 font-bold">الفترة</th>
                  <th className="p-3 font-bold">النوع</th>
                  <th className="p-3 font-bold">إشعار الولي</th>
                  <th className="p-3 font-bold">التبرير</th>
                  <th className="p-3 font-bold text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                    <td className="p-3 text-slate-600">{att.grade}</td>
                    <td className="p-3 font-mono text-slate-700">{att.date}</td>
                    <td className="p-3">{att.session === 'morning' ? 'الصباحية' : 'المسائية'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${att.type === 'absence' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {att.type === 'absence' ? 'غياب' : 'تأخر'}
                      </span>
                    </td>
                    <td className="p-3">
                      {att.parentAcknowledged ? (
                        <span className="text-emerald-700 font-bold">أقر بالاطلاع</span>
                      ) : (
                        <span className="text-slate-400">مرسل (لم يُقر بعد)</span>
                      )}
                    </td>
                    <td className="p-3">
                      {att.isJustified ? (
                        <span className="text-slate-700">
                          {att.justificationReason} ({att.justificationStatus === 'approved' ? 'مقبول' : 'معلق'})
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold">غير مبرر</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {att.isJustified && att.justificationStatus === 'pending' && (
                        <button
                          onClick={() => reviewJustification(att.id, 'approved')}
                          className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          مصادقة على المبرر
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN TAB 6: ANNOUNCEMENTS PUBLISHER */}
      {adminTab === 'announcements' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                نشر وتوجيه الإعلانات المدرسية
              </h3>
              <p className="text-slate-500">
                إرسال الإعلانات العامة أو المخصصة لكل قسم لتجنب إزعاج غير المعنيين.
              </p>
            </div>
            <button
              onClick={() => setShowAnnModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إنشاء إعلان رسمي جديد
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.map((ann) => (
              <div key={ann.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {ann.targetGrade === 'all' ? 'جميع الأقسام' : ann.targetGrade}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      ann.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ann.priority === 'urgent' ? 'عاجل' : ann.priority === 'important' ? 'هام' : 'عادي'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{ann.date}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 7: SUMMONS ISSUANCE */}
      {adminTab === 'summons' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل استدعاءات أولياء التلاميذ
              </h3>
              <p className="text-slate-500">
                حفظ الاستدعاءات الرسمية وتواريخ إرسالها وتتبع الإقرار بالاطلاع من الولي.
              </p>
            </div>
            <button
              onClick={() => setShowSummonModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إصدار استدعاء ولي جديد
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {summons.map((sum) => (
              <div key={sum.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">استدعاء الولي: {sum.parentName}</span>
                    <span className="text-slate-600">(التلميذ: {sum.studentName})</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">تاريخ الإرسال: {sum.sentDate}</span>
                </div>
                <p className="text-slate-800">سبب الاستدعاء: {sum.reason}</p>
                <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between text-[11px]">
                  <span>موعد الحضور: {formatDateAr(sum.scheduledDate)} ({sum.scheduledTime}) بـ {sum.office}</span>
                  <span className={`font-bold ${sum.status === 'acknowledged' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {sum.status === 'acknowledged' ? `تم إقرار الولي بالاطلاع (${sum.acknowledgedAt})` : 'في انتظار اطلاع الولي'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 8: PARENTS & STUDENTS DIRECTORY */}
      {adminTab === 'parents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل الأولياء والتلاميذ المربوطين بالحسابات
              </h3>
              <p className="text-slate-500">
                التحقق من صفة الولي الشرعي وتأمين المعطيات الشخصية وفق القانون 18-07.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{parent.fullName}</h4>
                <p className="text-slate-500">
                  الهاتف: {parent.phone} · البريد: {parent.email} · العنوان: {parent.address}
                </p>
              </div>
              <div className="text-left">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold text-xs">
                  حساب مفعل ومتحقق
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  رقم التعريف المحمي: {maskNIN(parent.nin)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block mb-2">الأبناء المربوطون بهذا الحساب:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {students.map((st) => (
                  <div key={st.id} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">{st.fullName}</div>
                    <div className="text-slate-500">{st.grade} ({st.classroom})</div>
                    <div className="text-slate-400 font-mono text-[10px]">تسجيل: {st.registrationNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 9: SECURITY & ALGERIAN LAW 18-07 AUDIT */}
      {adminTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 text-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                سجل الامتثال الأمني والتشريعي (القانون رقم 18-07)
              </h3>
              <p className="text-slate-500">
                متابعة تدابير حماية المعطيات ذات الطابع الشخصي للقصر وأوليائهم بمدرسة نوار محمد بتيارت.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-800" />
                حماية أرقام التعريف الوطنية (NIN)
              </h4>
              <p className="text-emerald-900 leading-relaxed">
                جميع أرقام التعريف الوطنية مشفرة ومحجوبة تلقائياً في واجهات العرض (تظهر بصيغة: {maskNIN(parent.nin)})، ولا يتم فك تشفيرها إلا عند المصادقة الرسمية التلقائية.
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-800" />
                عزل بيانات التلاميذ ومنع النشر العام
              </h4>
              <p className="text-blue-900 leading-relaxed">
                لا تحتوي أي صفحة عامة على أسماء التلاميذ أو غياباتهم أو علاماتهم؛ ولا يمكن للولي الاطلاع إلا على ملفات أبنائه المعتمدين حصرياً.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">سجل عمليات التدقيق الإداري (Audit Trail):</h4>
            <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
              <li>[2026-10-10 08:15:22] تسجيل دخول المديرة (م. بن عيسى) - جلسة آمنة HTTPS.</li>
              <li>[2026-10-10 08:20:04] مصادقة وإصدار الشهادة رقم CERT-2026-089 للتلميذة سارة نوار.</li>
              <li>[2026-10-10 08:35:10] إرسال إشعار غياب مؤمن إلى هاتف الولي: 0661234567.</li>
              <li>[2026-10-10 09:02:45] مراجعة وقبول مبرر الغياب الطبي للتلميذ يوسف نوار.</li>
            </ul>
          </div>
        </div>
      )}

      {/* NEW ANNOUNCEMENT MODAL */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">نشر إعلان مدرسي جديد</h4>
              <button onClick={() => setShowAnnModal(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAnnTitle || !newAnnContent) return;
                publishAnnouncement({
                  title: newAnnTitle,
                  content: newAnnContent,
                  targetGrade: newAnnGrade,
                  category: newAnnCategory,
                  priority: newAnnPriority,
                });
                setShowAnnModal(false);
                setNewAnnTitle('');
                setNewAnnContent('');
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الإعلان *</label>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="مثال: رزنامة اختبارات الفصل الثاني..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الفئة المستهدفة *</label>
                <select
                  value={newAnnGrade}
                  onChange={(e) => setNewAnnGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="all">جميع أقسام المدرسة</option>
                  <option value="السنة الأولى ابتدائي">السنة الأولى ابتدائي فقط</option>
                  <option value="السنة الثانية ابتدائي">السنة الثانية ابتدائي فقط</option>
                  <option value="السنة الثالثة ابتدائي">السنة الثالثة ابتدائي فقط</option>
                  <option value="السنة الرابعة ابتدائي">السنة الرابعة ابتدائي فقط</option>
                  <option value="السنة الخامسة ابتدائي">السنة الخامسة ابتدائي فقط</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التصنيف</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e) => setNewAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="general">إعلان عام</option>
                    <option value="exams">اختبارات وتقويم</option>
                    <option value="schedule">توقيت ودوام</option>
                    <option value="events">أنشطة ورحلات</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الأهمية</label>
                  <select
                    value={newAnnPriority}
                    onChange={(e) => setNewAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="normal">عادي</option>
                    <option value="important">هام</option>
                    <option value="urgent">عاجل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">نص الإعلان *</label>
                <textarea
                  rows={4}
                  required
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder="اكتب نص الإعلان الموجه للأولياء..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  نشر الإعلان الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SUMMON MODAL */}
      {showSummonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-amber-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">إصدار استدعاء رسمي لولي الأمر</h4>
              <button onClick={() => setShowSummonModal(false)} className="text-amber-200 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!summonReason || !summonDate) return;
                createSummon({
                  studentId: summonStudentId,
                  reason: summonReason,
                  scheduledDate: summonDate,
                  scheduledTime: summonTime,
                  office: summonOffice,
                });
                setShowSummonModal(false);
                setSummonReason('');
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">التلميذ المعني *</label>
                <select
                  value={summonStudentId}
                  onChange={(e) => setSummonStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.grade}) - ولي أمره: {parent.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">سبب الاستدعاء *</label>
                <textarea
                  rows={3}
                  required
                  value={summonReason}
                  onChange={(e) => setSummonReason(e.target.value)}
                  placeholder="سبب الاستدعاء (انضباط، تشاور بيداغوجي، ملف صحي...)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تاريخ الحضور *</label>
                  <input
                    type="date"
                    required
                    value={summonDate}
                    onChange={(e) => setSummonDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التوقيت</label>
                  <input
                    type="text"
                    value={summonTime}
                    onChange={(e) => setSummonTime(e.target.value)}
                    placeholder="10:00 صباحاً"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">مكان الاستقبال</label>
                <input
                  type="text"
                  value={summonOffice}
                  onChange={(e) => setSummonOffice(e.target.value)}
                  placeholder="مكتب المديرة"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSummonModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  إرسال الاستدعاء للولي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD ATTENDANCE MODAL */}
      {showAttModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-rose-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">تسجيل غياب أو تأخر تلميذ</h4>
              <button onClick={() => setShowAttModal(false)} className="text-rose-200 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                recordAttendance({
                  studentId: attStudentId,
                  date: attDate,
                  session: attSession,
                  type: attType,
                });
                setShowAttModal(false);
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">التلميذ *</label>
                <select
                  value={attStudentId}
                  onChange={(e) => setAttStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الفترة</label>
                  <select
                    value={attSession}
                    onChange={(e) => setAttSession(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="morning">الفترة الصباحية</option>
                    <option value="afternoon">الفترة المسائية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">النوع</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2 border rounded-lg text-center cursor-pointer ${attType === 'absence' ? 'border-rose-700 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="at"
                      checked={attType === 'absence'}
                      onChange={() => setAttType('absence')}
                      className="hidden"
                    />
                    تسجيل غياب
                  </label>
                  <label className={`p-2 border rounded-lg text-center cursor-pointer ${attType === 'lateness' ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="at"
                      checked={attType === 'lateness'}
                      onChange={() => setAttType('lateness')}
                      className="hidden"
                    />
                    تسجيل تأخر
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  تسجيل وإرسال إشعار للولي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD SCANNED CERTIFICATE PDF MODAL */}
      {showUploadPdfModal && selectedCertForUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-300" />
                  رفع الشهادة المدرسية الممسوحة ضوئياً (ملف PDF)
                </h4>
                <p className="text-[11px] text-emerald-200 mt-0.5">
                  التلميذ(ة): {selectedCertForUpload.studentName} · الولي: {selectedCertForUpload.parentName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUploadPdfModal(false);
                  setSelectedCertForUpload(null);
                }}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadAndSendCertificatePdf(selectedCertForUpload.id, {
                  fileName: scannedPdfFileName || `شهادة_مدرسية_رسمية_${selectedCertForUpload.studentName.replace(/\s+/g, '_')}_2026.pdf`,
                  fileSize: scannedPdfFileSize || '348 KB',
                  fileDataUrl: scannedPdfFileDataUrl,
                  sourceNote: scannedPdfSourceNote,
                });
                setShowUploadPdfModal(false);
                setSelectedCertForUpload(null);
                setScannedPdfFileDataUrl(undefined);
              }}
              className="p-5 space-y-3.5"
            >
              {/* Important Ministry Guidelines Note */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  إجراء تنظيمي رسمي (منشور وزارة التربية الوطنية):
                </span>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  تُستخرج الشهادة المدرسية الرسمية حصراً من <strong>النظام الرقمي لوزارة التربية الوطنية (الأرضية الرقمية)</strong>، ثم يتم طبعها وتوقيعها وختمها بختم المؤسسة، ومسحها ضوئياً (Scanner) ورفعها هنا كملف PDF لإرسالها مباشرة إلى حساب الولي.
                </p>
              </div>

              {/* File Upload Dropzone */}
              <div className="border-2 border-dashed border-emerald-700/40 rounded-xl p-5 text-center bg-slate-50/70 hover:bg-emerald-50/30 transition-colors space-y-2">
                <FileText className="w-8 h-8 mx-auto text-emerald-700" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800 text-xs">
                    اختر ملف الشهادة الممسوحة ضوئياً بصيغة PDF أو صورة المسح الضوئي
                  </p>
                  <p className="text-[10px] text-slate-500">
                    يمكنكم استعراض الملف من جهاز الكمبيوتر الموصول بالماسح الضوئي (Scanner)
                  </p>
                </div>

                <div className="pt-1">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setScannedPdfFileName(file.name);
                        setScannedPdfFileSize(`${(file.size / 1024).toFixed(0)} KB`);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setScannedPdfFileDataUrl(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                </div>

                {scannedPdfFileDataUrl && (
                  <div className="mt-2 p-2 bg-emerald-100/70 text-emerald-900 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>تم تحميل الملف وقراءته بنجاح من جهازكم، وجاهز للإرسال للولي</span>
                  </div>
                )}
              </div>

              {/* File details input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم الملف المرفوع *</label>
                <input
                  type="text"
                  required
                  value={scannedPdfFileName}
                  onChange={(e) => setScannedPdfFileName(e.target.value)}
                  placeholder="شهادة_مدرسية_رسمية_سارة_نوار_2026.pdf"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-emerald-800 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ملاحظة المصدر الإداري للشهادة</label>
                <input
                  type="text"
                  value={scannedPdfSourceNote}
                  onChange={(e) => setScannedPdfSourceNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadPdfModal(false);
                    setSelectedCertForUpload(null);
                    setScannedPdfFileDataUrl(undefined);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  تأكيد الرفع وإرسال ملف PDF للولي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE CERTIFICATE PICKUP MODAL */}
      {showPickupModal && selectedCertForPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">تحديد موعد لاستلام الشهادة المدرسية</h4>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  التلميذ(ة): {selectedCertForPickup.studentName} · الولي: {selectedCertForPickup.parentName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPickupModal(false);
                  setSelectedCertForPickup(null);
                }}
                className="text-blue-200 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                scheduleCertificatePickup(
                  selectedCertForPickup.id,
                  pickupDate,
                  pickupTime,
                  pickupOffice,
                  pickupNotes
                );
                setShowPickupModal(false);
                setSelectedCertForPickup(null);
              }}
              className="p-5 space-y-3.5"
            >
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 space-y-1">
                <span className="font-bold block">الغرض من الشهادة:</span>
                <p>{selectedCertForPickup.purpose}</p>
                <p className="text-[10px] font-mono text-slate-500">الرقم المرجعي: {selectedCertForPickup.refNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تاريخ الاستلام المحدد بالمؤسسة *</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">توقيت الاستلام *</label>
                  <input
                    type="text"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="مثال: 10:30 صباحاً"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">مكتب الاستقبال بالمدرسة *</label>
                <input
                  type="text"
                  required
                  value={pickupOffice}
                  onChange={(e) => setPickupOffice(e.target.value)}
                  placeholder="مكتب أمانة المديرة (شباك التمدرس)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تعليمات للولي عند الحضور</label>
                <textarea
                  rows={2}
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="الوثائق المطلوبة عند الاستلام..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPickupModal(false);
                    setSelectedCertForPickup(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  تأكيد وبرمجة موعد الاستلام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT CERTIFICATE MODAL */}
      {showRejectModal && selectedCertForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-rose-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">رفض طلب الشهادة المدرسية</h4>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedCertForReject(null);
                }}
                className="text-rose-200 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                rejectCertificate(selectedCertForReject.id, rejectReason);
                setShowRejectModal(false);
                setSelectedCertForReject(null);
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">سبب الرفض الإداري *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="وضح سبب رفض الطلب ليظهر في فضاء الولي..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedCertForReject(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  تأكيد رفض الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
