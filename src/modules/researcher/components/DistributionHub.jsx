import React, { useState } from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import Button from '../../../design-system/components/Button';
import Card from '../../../design-system/components/Card';
import Badge from '../../../design-system/components/Badge';
import Input from '../../../design-system/components/Input';

export const DistributionHub = ({ surveyUrl = 'https://oskar-medstat.org/survey/live?id=CS-2026-881', targetN = 384, responseCount = 142 }) => {
  const { isRtl } = useI18n();

  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState(['clinic.patients@ksu.edu.sa', 'dentistry.cohort2026@ksu.edu.sa']);
  const [emailStatus, setEmailStatus] = useState('');
  const [activeTab, setActiveTab] = useState('link'); // 'link' | 'qr' | 'email' | 'dashboard'

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      setEmailList([...emailList, emailInput.trim()]);
      setEmailInput('');
      setEmailStatus(isRtl ? 'تم إضافة البريد الإلكتروني بنجاح' : 'Recipient email added successfully (Mock Provider UI)');
      setTimeout(() => setEmailStatus(''), 3000);
    }
  };

  const percentComplete = Math.min(100, Math.round((responseCount / targetN) * 100));

  return (
    <Card variant="outlined" padding="lg" className="space-y-6 bg-surface-container-lowest">
      {/* Distribution Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-container-high pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Icon name="share" className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-on-surface">
              {isRtl ? 'مركز قنوات التوزيع ومتابعة الاستجابة (CS-24)' : 'Multi-Channel Distribution & Response Hub (CS-24)'}
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {isRtl
              ? 'توزيع الاستبيان عبر الرابط العام، رمز QR، وإدارة دعوات البريد الإلكتروني المباشر مع لوحة متابعة فورية.'
              : 'Distribute survey via public URL, QR code, and direct email recipients with live response dashboard.'}
          </p>
        </div>
        <Badge variant={percentComplete >= 100 ? 'emerald' : 'teal'} className="self-start sm:self-center">
          {responseCount} / {targetN} {isRtl ? 'استجابات مكتملة' : 'Responses'} ({percentComplete}%)
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-surface-container-high space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'link'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Icon name="link" className="w-4 h-4" />
          {isRtl ? 'الرابط العام' : 'Public Web URL'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'qr'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Icon name="qr_code_2" className="w-4 h-4" />
          {isRtl ? 'رمز QR والطباعة' : 'QR Code Export'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'email'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Icon name="mail" className="w-4 h-4" />
          {isRtl ? 'دعوات البريد' : 'Direct Email Invites'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'dashboard'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Icon name="analytics" className="w-4 h-4" />
          {isRtl ? 'لوحة المتابعة الحية' : 'Live Dashboard'}
        </button>
      </div>

      {/* Tab 1: Web Link */}
      {activeTab === 'link' && (
        <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
          <h4 className="font-bold text-sm text-on-surface">{isRtl ? 'رابط الاستبيان العام المفتوح:' : 'Public Web Survey Link:'}</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={surveyUrl}
              className="flex-1 p-2.5 border border-surface-container-high rounded-lg text-xs font-mono bg-surface-container-lowest text-on-surface dir-ltr"
            />
            <Button variant="primary" size="sm" onClick={handleCopy}>
              <Icon name={copied ? 'check' : 'content_copy'} className="w-4 h-4 mr-1" />
              {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}
            </Button>
          </div>
          <p className="text-xs text-on-surface-variant">
            {isRtl
              ? 'هذا الرابط يعمل على جميع المتصفحات والأجهزة المحمولة مباشرة بدون تسجيل دخول.'
              : 'This link works directly across all mobile & desktop browsers without login.'}
          </p>
        </div>
      )}

      {/* Tab 2: QR Code */}
      {activeTab === 'qr' && (
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white p-2 rounded-xl border-2 border-emerald-500 shadow-sm flex items-center justify-center">
            {/* SVG QR Code Simulation */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="5" y="5" width="30" height="30" fill="#000" />
              <rect x="10" y="10" width="20" height="20" fill="#fff" />
              <rect x="15" y="15" width="10" height="10" fill="#000" />

              <rect x="65" y="5" width="30" height="30" fill="#000" />
              <rect x="70" y="10" width="20" height="20" fill="#fff" />
              <rect x="75" y="15" width="10" height="10" fill="#000" />

              <rect x="5" y="65" width="30" height="30" fill="#000" />
              <rect x="10" y="70" width="20" height="20" fill="#fff" />
              <rect x="15" y="75" width="10" height="10" fill="#000" />

              <rect x="45" y="45" width="10" height="10" fill="#009DA3" />
              <rect x="55" y="65" width="15" height="15" fill="#000" />
              <rect x="75" y="55" width="10" height="10" fill="#000" />
            </svg>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="font-bold text-sm text-on-surface">
              {isRtl ? 'رمز الاستجابة السريعة' : 'High-Resolution QR Code Export'}
            </h4>
            <p className="text-xs text-on-surface-variant max-w-md">
              {isRtl
                ? 'جاهز للتصدير والطباعة على الملصقات في العيادات أو صالات الانتظار.'
                : 'Ready for print export to clinical poster boards and waiting room kiosks.'}
            </p>
            <div className="flex gap-2 justify-center sm:justify-start pt-2">
              <Button variant="outlined" size="sm" onClick={() => alert(isRtl ? 'تحميل QR بصيغة PNG' : 'Downloading QR Code PNG')}>
                <Icon name="download" className="w-4 h-4 mr-1" />
                {isRtl ? 'تحميل PNG' : 'Download PNG'}
              </Button>
              <Button variant="outlined" size="sm" onClick={() => window.print()}>
                <Icon name="print" className="w-4 h-4 mr-1" />
                {isRtl ? 'طباعة الملصق' : 'Print Kiosk Poster'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Direct Email Invites */}
      {activeTab === 'email' && (
        <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Icon name="info" className="w-4 h-4" />
            <span>
              {isRtl
                ? 'ملاحظة: واجهة إدارة الدعوات تعمل عبر محاكاة الخدمة المحلية.'
                : 'Note: Invitation manager operates via Mock Provider Service Layer.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="e.g. participant@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1"
            />
            <Button variant="primary" size="sm" onClick={handleAddEmail}>
              <Icon name="add" className="w-4 h-4 mr-1" />
              {isRtl ? 'إضافة مستلم' : 'Add Recipient'}
            </Button>
          </div>

          {emailStatus && <p className="text-xs text-emerald-600 font-semibold">{emailStatus}</p>}

          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-bold text-on-surface">{isRtl ? 'قائمة المستلمين المستهدفة:' : 'Target Recipient Email List:'}</h5>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {emailList.map((email, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-surface-container-lowest rounded border border-surface-container-high text-xs text-on-surface font-mono">
                  <span>{email}</span>
                  <Badge variant="emerald">{isRtl ? 'جاهز للإرسال' : 'Queued'}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
          <h4 className="font-bold text-sm text-on-surface">{isRtl ? 'مشرات التوزيع المباشرة:' : 'Live Distribution Dashboard Metrics:'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-high">
              <span className="text-xs text-on-surface-variant">{isRtl ? 'الزيارات الكلية للرابط' : 'Total Link Visits'}</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">428</p>
            </div>
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-high">
              <span className="text-xs text-on-surface-variant">{isRtl ? 'الاستجابات المكتملة' : 'Completed Responses'}</span>
              <p className="text-xl font-bold text-teal-600 mt-1">{responseCount}</p>
            </div>
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-high">
              <span className="text-xs text-on-surface-variant">{isRtl ? 'معدل الإكمال' : 'Completion Rate'}</span>
              <p className="text-xl font-bold text-indigo-600 mt-1">33.1%</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-on-surface">
              <span>{isRtl ? 'التقدم نحو النطاق المستهدف N' : 'Progress toward Target N'}</span>
              <span>{responseCount} / {targetN} ({percentComplete}%)</span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DistributionHub;
