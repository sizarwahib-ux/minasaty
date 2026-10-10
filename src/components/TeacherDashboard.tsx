import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  ClipboardList,
  MessageSquare,
  Plus,
  Send,
} from 'lucide-react';
import { formatDateAr } from '../utils/security';

export const TeacherDashboard: React.FC = () => {
  const {
    students,
    attendance,
    recordAttendance,
    appointments,
    updateAppointmentStatus,
    homework,
    addHomework,
    inquiries,
    respondToInquiry,
  } = useSchool();

  const [teacherTab, setTeacherTab] = useState<'roster' | 'attendance' | 'homework' | 'appointments' | 'inquiries'>('roster');

  // New Homework Form State
  const [showHwModal, setShowHwModal] = useState(false);
  const [hwSubject, setHwSubject] = useState('اللغة العربية');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  // Pedagogical teacher inquiries
  const teacherInquiries = inquiries.filter((i) => i.category === 'educational');
  const teacherAppointments = appointments.filter((a) => a.targetRole === 'teacher');

  const myStudents = students.filter((s) => s.grade === 'السنة الخامسة ابتدائي');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              فضاء الأستاذ: أحمد بلقاسم
            </h2>
            <span className="text-xs bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full font-bold">
              أستاذ اللغة العربية والتربية الإسلامية
            </span>
          </div>
          <p className="text-xs text-slate-500">
            القسم المشرف عليه: <strong className="text-slate-800">السنة الخامسة ابتدائي (الفوج 1)</strong> · مدرسة نوار محمد بتيارت
          </p>
        </div>

        <button
          onClick={() => setShowHwModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          تكليف بواجب منزلي جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setTeacherTab('roster')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            teacherTab === 'roster'
              ? 'bg-white text-blue-900 border-t-2 border-blue-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          قائمة تلاميذ القسم ({myStudents.length})
        </button>
        <button
          onClick={() => setTeacherTab('attendance')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            teacherTab === 'attendance'
              ? 'bg-white text-blue-900 border-t-2 border-blue-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          تسجيل الغياب السريع
        </button>
        <button
          onClick={() => setTeacherTab('homework')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            teacherTab === 'homework'
              ? 'bg-white text-blue-900 border-t-2 border-blue-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الواجبات والمهام ({homework.length})
        </button>
        <button
          onClick={() => setTeacherTab('appointments')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            teacherTab === 'appointments'
              ? 'bg-white text-blue-900 border-t-2 border-blue-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          مواعيد لقاء الأولياء ({teacherAppointments.length})
        </button>
        <button
          onClick={() => setTeacherTab('inquiries')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            teacherTab === 'inquiries'
              ? 'bg-white text-blue-900 border-t-2 border-blue-800 border-x border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الانشغالات البيداغوجية ({teacherInquiries.length})
        </button>
      </div>

      {/* ROSTER TAB */}
      {teacherTab === 'roster' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                دفتر تلامذة الفوج (السنة الخامسة 1)
              </h3>
              <p className="text-slate-500">
                الموسم الدراسي 2025/2026 · مدرسة نوار محمد الابتدائية
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 font-bold">اسم ولقب التلميذ</th>
                  <th className="p-3 font-bold font-mono">رقم التسجيل</th>
                  <th className="p-3 font-bold">تاريخ ومكان الميلاد</th>
                  <th className="p-3 font-bold">المعدل الفصلي</th>
                  <th className="p-3 font-bold text-center">تسجيل غياب اليوم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{st.registrationNumber}</td>
                    <td className="p-3 text-slate-600">{formatDateAr(st.dateOfBirth)} بـ {st.placeOfBirth}</td>
                    <td className="p-3 font-mono font-bold text-emerald-800">9.00 / 10</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          recordAttendance({
                            studentId: st.id,
                            date: new Date().toISOString().split('T')[0],
                            session: 'morning',
                            type: 'absence',
                          });
                          alert(`تم تسجيل غياب التلميذ(ة) ${st.fullName} وإشعار الولي فورياً.`);
                        }}
                        className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded cursor-pointer"
                      >
                        تسجيل غياب
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ATTENDANCE TAB */}
      {teacherTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-base">
            المناداة اليومية وتسجيل الحضور والغياب
          </h3>
          <p className="text-slate-500">
            بنقرة واحدة يتم إشعار ولي الأمر بالغياب مع توثيق الفترة الزمنية.
          </p>

          <div className="space-y-3">
            {myStudents.map((st) => (
              <div key={st.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{st.fullName}</span>
                  <span className="text-slate-500 block text-[11px]">{st.grade} - الفوج 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      recordAttendance({
                        studentId: st.id,
                        date: new Date().toISOString().split('T')[0],
                        session: 'morning',
                        type: 'absence',
                      });
                      alert(`تم تسجيل غياب ${st.fullName}`);
                    }}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-bold cursor-pointer"
                  >
                    تسجيل غياب (صباح)
                  </button>
                  <button
                    onClick={() => {
                      recordAttendance({
                        studentId: st.id,
                        date: new Date().toISOString().split('T')[0],
                        session: 'morning',
                        type: 'lateness',
                      });
                      alert(`تم تسجيل تأخر ${st.fullName}`);
                    }}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-bold cursor-pointer"
                  >
                    تسجيل تأخر
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOMEWORK TAB */}
      {teacherTab === 'homework' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                مفكرة الواجبات المنزلية والأنشطة الأسبوعية
              </h3>
              <p className="text-slate-500">
                تظهر مباشرة في فضاء الولي مع إمكانية متابعة إنجاز التلميذ في البيت.
              </p>
            </div>
            <button
              onClick={() => setShowHwModal(true)}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة واجب
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homework.map((hw) => (
              <div key={hw.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{hw.subject}: {hw.title}</span>
                  <span className="font-mono text-[10px] text-slate-400">أجل: {hw.dueDate}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{hw.description}</p>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200">
                  {hw.grade}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {teacherTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-base">
            طلبات لقاء الأولياء الموجهة للأستاذ أحمد بلقاسم
          </h3>
          <div className="divide-y divide-slate-100">
            {teacherAppointments.map((app) => (
              <div key={app.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>الولي: {app.parentName} (تلميذ: {app.studentName})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {app.status === 'confirmed' ? 'مؤكد' : 'في الانتظار'}
                  </span>
                </div>
                <p className="text-slate-700">{app.subject}</p>
                {app.confirmedDate && (
                  <p className="text-emerald-800 font-bold">
                    الموعد: {formatDateAr(app.confirmedDate)} على الساعة {app.confirmedTime}
                  </p>
                )}
                {app.status === 'pending' && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        app.id,
                        'confirmed',
                        app.preferredDate,
                        '11:00 صباحاً',
                        'تم تأكيد اللقاء بقاعة الأساتذة'
                      )
                    }
                    className="px-3 py-1 bg-blue-800 text-white rounded font-bold text-[11px] cursor-pointer"
                  >
                    تأكيد الموعد على 11:00 صباحاً
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {teacherTab === 'inquiries' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-base">
            الانشغالات والاستفسارات التربوية الموجهة لأستاذ المادة
          </h3>
          <div className="space-y-3">
            {teacherInquiries.map((inq) => (
              <div key={inq.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{inq.subject}</span>
                  <span className="font-mono text-amber-800">{inq.refCode}</span>
                </div>
                <p className="text-slate-700">{inq.details}</p>
                <div className="pt-2 border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="اكتب رد الأستاذ التربوي..."
                    id={`teach-reply-${inq.id}`}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`teach-reply-${inq.id}`) as HTMLInputElement;
                      if (!input || !input.value.trim()) return;
                      respondToInquiry(inq.id, input.value, 'الأستاذ أحمد بلقاسم', 'أستاذ القسم');
                      input.value = '';
                    }}
                    className="px-4 py-1.5 bg-blue-800 text-white rounded-lg font-bold cursor-pointer"
                  >
                    إرسال الرد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW HOMEWORK MODAL */}
      {showHwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-4 bg-blue-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">تكليف بواجب منزلي جديد</h4>
              <button onClick={() => setShowHwModal(false)} className="text-blue-200 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!hwTitle || !hwDesc) return;
                addHomework({
                  grade: 'السنة الخامسة ابتدائي',
                  subject: hwSubject,
                  title: hwTitle,
                  description: hwDesc,
                  dueDate: hwDueDate || '2026-10-15',
                });
                setShowHwModal(false);
                setHwTitle('');
                setHwDesc('');
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">المادة التعليمية *</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option>اللغة العربية</option>
                  <option>الرياضيات</option>
                  <option>التربية الإسلامية</option>
                  <option>التربية العلمية والتكنولوجية</option>
                  <option>التاريخ والجغرافيا</option>
                  <option>التربية المدنية</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان النشاط / التمرين *</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="مثال: حل التمرين رقم 2 ص 35"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تفاصيل المطلوب من التلميذ *</label>
                <textarea
                  rows={3}
                  required
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  placeholder="تعليمات إنجاز الواجب في كراس النشاطات..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">أجل التسليم</label>
                <input
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHwModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  نشر الواجب في مفكرة الأولياء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
