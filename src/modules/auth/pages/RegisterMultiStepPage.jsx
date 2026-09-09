import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { useAuth } from '../../../contexts/AuthContext';

export const RegisterMultiStepPage = () => {
  const { isRtl } = useI18n();
  const { role = 'researcher', step = 'step-01' } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const stepNumber = step.includes('02') ? 2 : step.includes('03') ? 3 : 1;

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Elena',
    lastName: 'Vance-Roosevelt',
    workEmail: 'e.vance@jhmi.edu',
    password: 'MedStat2025!Shield',
    institution: 'Johns Hopkins Medicine',
    professionalTitle: 'Associate Professor of Oncology',
    specialization: 'oncology',
    orcidId: '0000-0002-1825-0097',
    verificationCode: '749201',
    scope: 'Clinical Trials & Longitudinal Cohorts',
    termsConsent: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const roleTitleMap = {
    researcher: isRtl ? 'الباحث الرئيسي' : 'Researcher / Investigator',
    reviewer: isRtl ? 'المقيم الأكاديمي' : 'Reviewer / Peer Evaluator',
    supervisor: isRtl ? 'المشرف السريري' : 'Supervisor / Sign-off Authority',
    institution: isRtl ? 'المؤسسة البحثية' : 'Institution / Organization',
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.firstName || !formData.lastName || !formData.workEmail || !formData.password) {
      setErrorMsg(isRtl ? 'يرجى إكمال الحقول المطلوبة.' : 'Please fill in all required fields marked with an asterisk (*).');
      return;
    }
    navigate(`/auth/register/${role}/step-02`);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    navigate(`/auth/register/${role}/step-03`);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    // Simulate complete registration & login
    login(formData.workEmail);
    navigate('/auth/pending');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Role Sub-Header Bar */}
      <div className="w-full py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary dark:text-teal-300 rounded font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>ROLE: {role.toUpperCase()}</span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider">LEVEL 3 CLEARANCE</span>
          <span className="text-slate-400">•</span>
          <span className="inline-flex items-center gap-1 text-primary dark:text-teal-400 font-semibold">
            <Icon name="lock" size="sm" /> Encrypted Audit Trail Active
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary dark:text-teal-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-primary dark:bg-teal-400"></span>
          <span>FEDERATED SYNC: SYNCED (LIVE)</span>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="w-full grid grid-cols-3 gap-3 mb-8">
        {[
          { num: 1, labelEn: 'Identification', labelAr: 'البيانات الشخصية' },
          { num: 2, labelEn: 'Verification', labelAr: 'التحقق المؤسسي' },
          { num: 3, labelEn: 'Research Scope', labelAr: 'النطاق البحثي' },
        ].map((stepItem) => {
          const isActive = stepNumber === stepItem.num;
          const isDone = stepNumber > stepItem.num;

          return (
            <div
              key={stepItem.num}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs justify-center font-bold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-gray-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  isActive
                    ? 'bg-white text-primary'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-300'
                }`}
              >
                0{stepItem.num}
              </span>
              <span className="truncate uppercase">{isRtl ? stepItem.labelAr : stepItem.labelEn}</span>
            </div>
          );
        })}
      </div>

      {/* Headline Context Block */}
      <div className="flex flex-col gap-2 mb-8 text-center items-center">
        <span className="text-xs font-semibold text-primary dark:text-teal-400 tracking-widest uppercase">
          Protocol Registration Stage • 21 CFR Part 11 Compliant
        </span>
        <h1 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold tracking-tight">
          {isRtl ? `إنشاء حساب ${roleTitleMap[role]}` : `Create ${roleTitleMap[role]} Account`}
        </h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          {isRtl
            ? 'أدخل بياناتك الأكاديمية والسريرية المعتمدة للحصول على تصريح استخدام المنصة والتحليل الإحصائي.'
            : 'Enter your verified academic credentials and clinical affiliation to gain accredited access to multi-center trials and statistical workspaces.'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6">
          <Icon name="warning" size="sm" className="shrink-0" />
          <span className="text-xs font-bold">{errorMsg}</span>
        </div>
      )}

      {/* STEP 1 FORM */}
      {stepNumber === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'البيانات الشخصية والتعريفية' : 'Primary Identification'}
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {isRtl ? 'الحقول بعلامة * إجبارية' : 'Fields with * are required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                  {isRtl ? 'الاسم الأول' : 'First Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                  {isRtl ? 'اسم العائلة' : 'Last Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                {isRtl ? 'البريد الإلكتروني المؤسسي' : 'Work Academic Email'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.workEmail}
                onChange={(e) => handleInputChange('workEmail', e.target.value)}
                placeholder="name@institution.edu"
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                {isRtl ? 'كلمة المرور' : 'Security Passcode'} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                02
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isRtl ? 'الاعتماد المؤسسي والتخصص' : 'Institutional Credentials'}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                {isRtl ? 'المؤسسة / الجامعة' : 'Primary Institutional Affiliation'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                  {isRtl ? 'المسمى الأكاديمي' : 'Academic / Professional Title'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.professionalTitle}
                  onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                  {isRtl ? 'التخصص الطبي الدقيق' : 'Primary Medical Specialization'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
                >
                  <option value="oncology">Oncology &amp; Solid Tumor</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="endodontics">Endodontics &amp; Dentistry</option>
                  <option value="biostatistics">Biostatistics</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-primary hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? 'المتابعة للخطوة التالية' : 'Proceed to Step 02 (Verification)'}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 FORM */}
      {stepNumber === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'التحقق من البريد والهوية المؤسسية' : 'Institutional & Email Verification'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
              {isRtl
                ? `تم إرسال رمز التحقق الأكاديمي إلى البريد: ${formData.workEmail}`
                : `An institutional verification OTP code has been dispatched to: ${formData.workEmail}`}
            </p>

            <div className="flex flex-col gap-2 max-w-sm">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                {isRtl ? 'رمز التحقق (OTP Code)' : '6-Digit Verification Code'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.verificationCode}
                onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-center font-mono font-bold tracking-widest text-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-primary hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? 'تأكيد الرمز والمتابعة' : 'Verify & Proceed to Step 03'}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3 FORM */}
      {stepNumber === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'تحديد النطاق والبروتوكول السريري' : 'Research Scope & Ethics Attestation'}
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-gray-200">
                {isRtl ? 'مجال الأبحاث والتجارب الرئيسية' : 'Primary Clinical Research Focus'}
              </label>
              <input
                type="text"
                value={formData.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsConsent}
                onChange={(e) => handleInputChange('termsConsent', e.target.checked)}
                className="mt-1 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                {isRtl
                  ? 'أقر بصحة البيانات المرفقة والامتثال لمعايير الأخلاقيات البحثية والممارسة السريرية الجيدة (GCP).'
                  : 'I confirm the accuracy of all submitted credentials and certify full compliance with Good Clinical Practice (GCP) and IRB guidelines.'}
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="verified" size="sm" />
              <span>{isRtl ? 'إكمال التسجيل وإرسال الطلب' : 'Complete Registration & Submit Credential File'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterMultiStepPage;
