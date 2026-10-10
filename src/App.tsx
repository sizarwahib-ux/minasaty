import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/Header';
import { PublicHome } from './components/PublicHome';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ProcedureGuide } from './components/ProcedureGuide';
import { OfficialCertificateModal } from './components/OfficialCertificateModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { MapPin, Phone, Mail, ShieldCheck, Award } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { role, setRole, previewCertificate, setPreviewCertificate, students } = useSchool();
  const [activeView, setActiveView] = useState<string>('home');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  const handleNavigateToService = (tab: string) => {
    setDashboardTab(tab);
    setActiveView('dashboard');
  };

  const previewStudent = previewCertificate
    ? students.find((s) => s.id === previewCertificate.studentId) || students[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] text-slate-800">
      {/* Top Bar and Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && role === 'public' && (
          <PublicHome
            onGoToService={(tab) => {
              setRole('parent');
              handleNavigateToService(tab);
            }}
            onOpenPrivacy={() => setShowPrivacy(true)}
          />
        )}

        {activeView === 'guide' && (
          <ProcedureGuide
            onGoToService={(tab) => {
              if (role === 'public') setRole('parent');
              handleNavigateToService(tab);
            }}
          />
        )}

        {activeView === 'announcements' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                لوحة الإعلانات والمستجدات المدرسية
              </h2>
              <p className="text-xs text-slate-600">
                متابعة البلاغات الرسمية، مواقيت الامتحانات، وتوجيهات إدارة مدرسة نوار محمد بتيارت.
              </p>
            </div>
            <PublicHome
              onGoToService={(tab) => {
                setRole('parent');
                handleNavigateToService(tab);
              }}
              onOpenPrivacy={() => setShowPrivacy(true)}
            />
          </div>
        )}

        {activeView === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                بيانات المؤسسة والتواصل
              </h2>
              <p className="text-xs text-slate-600">
                مدرسة نوار محمد الابتدائية · مديرية التربية لولاية تيارت
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  <span>الموقع الجغرافي</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  حي التفاح 1، بالقرب من عيادة النور، تيارت
                  <br />
                  ولاية تيارت 14000، الجزائر
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Phone className="w-5 h-5 text-blue-800" />
                  <span>الاتصال والاستقبال</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  أرقام الهاتف قيد المراجعة والتحيين من طرف الإدارة.
                  <br />
                  يمكن حجز موعد استقبال أو التواصل عبر المنصة الرقمية.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Mail className="w-5 h-5 text-amber-800" />
                  <span>المراسلات الإلكترونية</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  ecole.nouar.tiaret@education.gov.dz
                  <br />
                  contact.nouar.primaire@gmail.com
                </p>
              </div>
            </div>
          </div>
        )}

        {(activeView === 'dashboard' || role !== 'public') && activeView !== 'guide' && activeView !== 'contact' && (
          <>
            {role === 'parent' && (
              <ParentDashboard
                initialTab={dashboardTab}
                onOpenPrivacy={() => setShowPrivacy(true)}
              />
            )}
            {role === 'admin' && <AdminDashboard />}
            {role === 'teacher' && <TeacherDashboard />}
          </>
        )}
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="space-y-1">
            <p className="text-slate-300 font-bold">
              الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية
            </p>
            <p className="text-slate-500">
              مديرية التربية لولاية تيارت · مفتشية التعليم الابتدائي للمقاطعة الثالثة · مدرسة نوار محمد الابتدائية
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              حماية المعطيات الشخصية (قانون 18-07)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('guide')}
              className="hover:text-slate-200 cursor-pointer"
            >
              دليل الخدمات
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('contact')}
              className="hover:text-slate-200 cursor-pointer"
            >
              معلومات الاتصال
            </button>
          </div>
        </div>
      </footer>

      {/* Official Certificate Modal */}
      {previewCertificate && previewStudent && (
        <OfficialCertificateModal
          certificate={previewCertificate}
          student={previewStudent}
          onClose={() => setPreviewCertificate(null)}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
