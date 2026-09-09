import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const RoleSelectionPage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false);

  const roles = [
    {
      id: 'researcher',
      tier: 'TIER 01',
      badgeEn: 'Clinical Research Lead',
      badgeAr: 'قائد أبحاث سريرية',
      titleEn: 'Researcher / Investigator',
      titleAr: 'باحث رئيسي / مستكشف سريري',
      descEn: 'For scientists, clinical trial leads, and medical researchers submitting and computing clinical studies.',
      descAr: 'للعلماء وقادة التجارب السريرية والباحثين الذين يقومون بإعداد وتحليل الدراسات الطبية.',
      icon: 'biotech',
      bulletsEn: [
        'Protocol creation & version tracking',
        'Dataset export with de-identification',
        'Parametric & nonparametric statistical engine',
      ],
      bulletsAr: [
        'إنشاء وتتبع نسخ البروتوكول البحثي',
        'تصدير البيانات مع إخفاء الهوية السريرية',
        'محرك الإحصاء المعلمي واللامعلمي',
      ],
      footerEn: 'GCP Level II Required',
      footerAr: 'يتطلب الممارسة السريرية الجيدة GCP II',
    },
    {
      id: 'reviewer',
      tier: 'TIER 02',
      badgeEn: 'Academic Reviewer',
      badgeAr: 'مقيم أكاديمي',
      titleEn: 'Reviewer / Peer Evaluator',
      titleAr: 'مقيم خبير / محكم أكاديمي',
      descEn: 'For qualified academic evaluators reviewing submitted methodologies, data schemas, and pre-print manuscripts.',
      descAr: 'للمحكمين الأكاديميين المعتمدين لمراجعة المنهجيات وهياكل البيانات والبروتوكولات.',
      icon: 'fact_check',
      bulletsEn: [
        'Double-blind clinical evaluations',
        'Protocol critique & margin recalculations',
        'Independent ethical safety assessment',
      ],
      bulletsAr: [
        'تقييمات سريرية مزدوجة التعمية',
        'مراجعة البروتوكول وحساب هامش الأخطاء',
        'تقييم مستقل للأمان والسلامة الأخلاقية',
      ],
      footerEn: 'ORCID Verification',
      footerAr: 'ربط وتأكيد حساب ORCID',
    },
    {
      id: 'supervisor',
      tier: 'TIER 03',
      badgeEn: 'Institutional Authority',
      badgeAr: 'سلطة إشرافية مؤسسية',
      titleEn: 'Supervisor / Sign-off Authority',
      titleAr: 'مشرف أكاديمي / سلطة اعتماد',
      descEn: 'For senior faculty, department heads, or medical lab directors authorizing regulatory submissions.',
      descAr: 'لأعضاء رؤساء الأقسام والمشرفين الأكاديميين ومدراء المعامل الطبية المعتمدين.',
      icon: 'verified',
      bulletsEn: [
        'Departmental study authorization',
        'Regulatory compliance sign-off',
        'Investigator delegation & auditing',
      ],
      bulletsAr: [
        'اعتماد واعتماد دراسات القسم',
        'التوقيع على الامتثال التنظيمي للأبحاث',
        'تفويض الباحثين والتدقيق الإشرافي',
      ],
      footerEn: 'Institutional Key Required',
      footerAr: 'مفتاح الاعتماد المؤسسي',
    },
    {
      id: 'institution',
      tier: 'TIER 04',
      badgeEn: 'Enterprise & University',
      badgeAr: 'مؤسسة / جامعة / مستشفى',
      titleEn: 'Institution / Organization',
      titleAr: 'مؤسسة / مركز أبحاث',
      descEn: 'For universities, teaching hospitals, clinical research centers, or enterprise pharmacology labs.',
      descAr: 'للجامعات والمستشفيات التعليمية ومراكز البحوث السريرية أو مختبرات الفحص المؤسسية.',
      icon: 'corporate_fare',
      bulletsEn: [
        'Multi-seat access provisioning',
        'Institutional domain auto-verification',
        'Consolidated grant & quota management',
      ],
      bulletsAr: [
        'إدارة وتوزيع باقات المقاعد المؤسسية',
        'التحقق التلقائي لنطاق المؤسسة الأكاديمي',
        'إدارة الحصص والميزانيات البحثية',
      ],
      footerEn: 'SAML 2.0 / SSO',
      footerAr: 'الدخول الموحد SAML 2.0 / SSO',
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setShowError(false);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      setShowError(true);
      return;
    }
    navigate(`/auth/register/${selectedRole}/step-01`);
  };

  return (
    <div className="w-full py-12 md:py-16 px-4 md:px-8 max-w-6xl mx-auto font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Step Indicator & System Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>{isRtl ? 'الخطوة 01 من 02 : تحديد الصفة الأكاديمية' : 'Step 01 of 02 : Role Identification'}</span>
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-gray-400 font-medium">Protocol G-24</span>
        </div>

        {/* Linear Clinical Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
          <div className="w-1/2 h-full bg-primary rounded-full transition-all duration-500"></div>
        </div>

        {/* Centered Header Hierarchy */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-teal-400">
            {isRtl ? 'تسلسل تصاريح الوصول الأكاديمي' : 'Authorization Hierarchy Entry'}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isRtl ? 'اختر صفة الحساب الأكاديمي' : 'Select Your Account Type'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 leading-relaxed">
            {isRtl
              ? 'حدد صفة حسابك الأكاديمية لتحديد أدوات بيئة العمل وصلاحيات الوصول المخصصة لدراساتك.'
              : 'Choose the role that best describes your primary activity on the clinical statistical infrastructure.'}
          </p>
        </div>

        {/* Validation Error Alert Container */}
        {showError && (
          <div className="w-full max-w-4xl mb-6 p-4 rounded-xl text-sm font-semibold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/60 flex items-center gap-3 shadow-sm transition-all">
            <Icon name="error" size="md" className="shrink-0" />
            <span>
              {isRtl
                ? 'يرجى اختيار الصفة الأكاديمية قبل المتابعة.'
                : 'Please select an academic role before continuing.'}
            </span>
          </div>
        )}

        {/* 2x2 Interactive Roles Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative flex flex-col justify-between p-6 lg:p-8 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? 'shadow-lg border-primary dark:border-teal-400 bg-primary/5 dark:bg-teal-900/20 ring-2 ring-primary dark:ring-teal-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 group-hover:scale-105'
                      }`}
                    >
                      <Icon name={role.icon} size="md" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-primary dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
                        {isRtl ? role.badgeAr : role.badgeEn}
                      </span>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                          <Icon name="check" size="sm" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-mono font-bold text-primary dark:text-teal-400 uppercase tracking-widest block mb-1">
                      {role.tier}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {isRtl ? role.titleAr : role.titleEn}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {isRtl ? role.descAr : role.descEn}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {(isRtl ? role.bulletsAr : role.bulletsEn).map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-gray-200">
                        <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-teal-400"></span>
                    <span>{isRtl ? role.footerAr : role.footerEn}</span>
                  </span>
                  <span className="text-primary dark:text-teal-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>{isRtl ? 'تهيئة' : 'Configure'}</span>
                    <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Panel & Assurance Strip */}
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <Icon name="policy" size="lg" className="text-primary dark:text-teal-400 shrink-0" />
            <div>
              <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white block">
                {isRtl ? 'هل تحتاج لترخيص تصاريح متعددة التخصصات؟' : 'Need multi-disciplinary clearance?'}
              </span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs md:text-sm text-primary dark:text-teal-400 font-medium hover:underline inline-flex items-center gap-1 text-decoration-none"
              >
                <span>
                  {isRtl
                    ? 'اطّلع على دليل الصفات الأكاديمية ومصفوفة الصلاحيات'
                    : 'Read our clinical role directory and access matrix'}
                </span>
                <Icon name="open_in_new" size="sm" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/login"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-decoration-none"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-teal-700 text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{isRtl ? 'المتابعة إلى التسجيل' : 'Continue to Registration'}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>

        {/* Footer Help & Login Link */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Icon name="lock" size="sm" className="text-primary dark:text-teal-400" />
            <span>
              {isRtl ? 'سجل هوية مشفر ومحمي بالكامل' : 'End-to-end encrypted identity ledger'}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span>{isRtl ? 'لديك حساب بالفعل؟' : 'Already registered?'}</span>
            <Link to="/login" className="text-primary dark:text-teal-400 font-bold hover:underline text-decoration-none">
              {isRtl ? 'تسجيل الدخول إلى بيئة OSKAR' : 'Sign into OSKAR workspace'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
