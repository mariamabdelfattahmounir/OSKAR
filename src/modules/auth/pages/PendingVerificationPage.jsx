import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { useAuth } from '../../../contexts/AuthContext';

export const PendingVerificationPage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreWorkspace = () => {
    if (user?.defaultRoute) {
      navigate(user.defaultRoute);
    } else {
      navigate('/researcher/dashboard');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center text-center space-y-8 font-sans">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-teal-900/40 text-primary dark:text-teal-300 text-xs font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="font-bold tracking-wider uppercase">
          {isRtl ? 'حالة الطلب: قيد المراجعة الإدارية' : 'STATUS: APPLICATION PENDING REVIEW'}
        </span>
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold tracking-tight">
          {isRtl ? 'طلب الحساب قيد التدقيق والأعتماد' : 'Application Under Review'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 max-w-lg leading-relaxed">
          {isRtl
            ? 'تمت إضافة جميع وثائق وملفات التسجيل (الخطوات 1، 2، و3) بنجاح وهي قيد الاعتماد الإداري الأكاديمي.'
            : 'Your entire registration package (Steps 01, 02, and 03) has been successfully submitted and is awaiting final administrative sign-off.'}
        </p>
      </div>

      {/* Application Progress Checklist */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-left rtl:text-right space-y-4">
        <h2 className="text-xs font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider">
          {isRtl ? 'تقدم خطوات الطلب' : 'Application Progress'}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Icon name="check_circle" size="md" className="text-primary dark:text-teal-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRtl ? '01 معلومات التسجيل والتعريف' : '01 Registration Info'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  {isRtl ? 'تم تقديم البيانات الشخصية والمؤسسية' : 'Personal and institutional profile submitted'}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-primary dark:text-teal-300 font-bold px-2 py-0.5 rounded bg-primary/10">
              {isRtl ? 'مكتمل' : 'COMPLETED'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Icon name="check_circle" size="md" className="text-primary dark:text-teal-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRtl ? '02 التحقق والوثائق المؤسسية' : '02 Document Verification'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  {isRtl ? 'تم التحقق من النطاق وتوثيق الهوية' : 'Institutional domain and credentials verified'}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-primary dark:text-teal-300 font-bold px-2 py-0.5 rounded bg-primary/10">
              {isRtl ? 'مكتمل' : 'COMPLETED'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Icon name="check_circle" size="md" className="text-primary dark:text-teal-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRtl ? '03 النطاق والامتثال الأخلاقي' : '03 Research Scope'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  {isRtl ? 'تم تحديد مجال البحث والتوثيق' : 'Protocol access and therapeutic area defined'}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-primary dark:text-teal-300 font-bold px-2 py-0.5 rounded bg-primary/10">
              {isRtl ? 'مكتمل' : 'COMPLETED'}
            </span>
          </div>
        </div>
      </div>

      {/* Turn-around time notice */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 text-left rtl:text-right flex flex-col gap-3 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Icon name="schedule" size="sm" className="text-primary dark:text-teal-300 shrink-0 mt-0.5" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {isRtl ? 'الوقت المتوقع للاعتماد: 24–48 ساعة.' : 'Estimated turn-around time: 24–48 hours.'}
          </span>
        </div>
        <div className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
          <Icon name="mail" size="sm" className="text-primary dark:text-teal-300 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {isRtl
              ? 'سيصلك إشعار بالبريد الإلكتروني المؤسسي فور تفعيل مساحة عملك في المنصة.'
              : 'We will send an email confirmation to your institutional address as soon as your workspace is active.'}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <button
          onClick={handleExploreWorkspace}
          type="button"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isRtl ? 'الانتقال إلى مساحة العمل التجريبية' : 'Explore Platform Workspace'}</span>
          <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
        </button>

        <Link
          to="/login"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-decoration-none text-center"
        >
          {isRtl ? 'العودة لتسجيل الدخول' : 'Return to Login'}
        </Link>
      </div>
    </div>
  );
};

export default PendingVerificationPage;
