import React, { useState } from 'react';
import { useSchool, ActiveRole } from '../context/SchoolContext';
import { UserCheck, Shield, GraduationCap, Globe, LogOut, ChevronDown } from 'lucide-react';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<Props> = ({
  activeView,
  setActiveView,
  onOpenPrivacy,
}) => {
  const { role, setRole, parent } = useSchool();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleRoleChange = (newRole: ActiveRole) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    if (newRole === 'public') {
      setActiveView('home');
    } else {
      setActiveView('dashboard');
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'parent':
        return `فضاء الولي: ${parent.fullName}`;
      case 'admin':
        return 'لوحة إدارة المدرسة (المديرة)';
      case 'teacher':
        return 'فضاء الأستاذ (أحمد بلقاسم)';
      default:
        return 'الواجهة المدرسية العامة';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'parent':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-amber-600" />;
      case 'teacher':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      default:
        return <Globe className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Role Switcher Banner for Seamless Testing and Evaluation */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">الجمهورية الجزائرية الديمقراطية الشعبية</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium">مدرسة نوار محمد الابتدائية – تيارت</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden sm:inline">تبديل المعاينة التفاعلية:</span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => handleRoleChange('parent')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  role === 'parent'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ولي الأمر
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  role === 'admin'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                إدارة المدرسة
              </button>
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                أستاذ القسم
              </button>
              <button
                onClick={() => handleRoleChange('public')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  role === 'public'
                    ? 'bg-slate-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                الزائر العام
              </button>
            </div>
            <button
              onClick={onOpenPrivacy}
              className="text-[11px] text-emerald-400 hover:underline cursor-pointer hidden md:inline"
            >
              قانون حماية المعطيات 18-07
            </button>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single text element wordmark with logo mark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-700/20 shadow-xs shrink-0">
              <img
                src="/src/assets/images/school_emblem_logo_1791642281989.jpg"
                alt="شعار المدرسة"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setActiveView('home')}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 text-right cursor-pointer"
            >
              فضاء الولي الرقمي
            </button>
          </div>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'home' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                if (role === 'public') setRole('parent');
                setActiveView('dashboard');
              }}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'dashboard' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              الخدمات الإلكترونية
            </button>
            <button
              onClick={() => setActiveView('announcements')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'announcements' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              الإعلانات والرزنامة
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'guide' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              دليل الإجراءات
            </button>
            <button
              onClick={() => setActiveView('contact')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'contact' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              معلومات المؤسسة
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0 relative">
            {role === 'public' ? (
              <button
                onClick={() => handleRoleChange('parent')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                تسجيل الدخول إلى فضاء الولي
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {getRoleIcon()}
                  <span className="max-w-[140px] sm:max-w-[180px] truncate">{getRoleLabel()}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-slate-500 font-medium">
                      الحساب الحالي النشط:
                    </div>
                    <button
                      onClick={() => handleRoleChange('parent')}
                      className="w-full text-right px-4 py-2 hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-emerald-950">فضاء الولي (عبد القادر نوار)</span>
                      {role === 'parent' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className="w-full text-right px-4 py-2 hover:bg-amber-50 text-slate-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-amber-950">إدارة المدرسة (المديرة م. بن عيسى)</span>
                      {role === 'admin' && <span className="w-2 h-2 rounded-full bg-amber-600"></span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('teacher')}
                      className="w-full text-right px-4 py-2 hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-blue-950">أستاذ القسم (أحمد بلقاسم)</span>
                      {role === 'teacher' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => handleRoleChange('public')}
                        className="w-full text-right px-4 py-2 hover:bg-slate-50 text-rose-700 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج إلى الواجهة العامة</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
