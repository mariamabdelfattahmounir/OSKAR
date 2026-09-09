import React, { useState } from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import Button from '../../../design-system/components/Button';
import Input from '../../../design-system/components/Input';
import Card from '../../../design-system/components/Card';
import Badge from '../../../design-system/components/Badge';

export const QuestionnaireBuilder = ({ initialQuestions = [], onSave }) => {
  const { isRtl } = useI18n();

  const defaultQuestions = initialQuestions.length > 0 ? initialQuestions : [
    {
      id: 'Q1',
      type: 'mcq',
      textEn: 'How would you rate your current oral hygiene routine?',
      textAr: 'كيف تقيم روتين العناية بصحة فمك الحالي؟',
      required: true,
      optionsEn: ['Brush once daily', 'Brush twice or more daily', 'Occasional brushing', 'Rarely brush'],
      optionsAr: ['التنظيف بالفرشاة مرة يومياً', 'التنظيف مرتين أو أكثر يومياً', 'تنظيف متقطع', 'نادراً ما أنظف أسنان بالفرشاة'],
    },
    {
      id: 'Q2',
      type: 'likert_5',
      textEn: 'Dental pain interferes with your daily activities or work.',
      textAr: 'ألم الأسنان يعوق أنشطتك اليومية أو عملك.',
      required: true,
      optionsEn: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      optionsAr: ['أعارض بشدة', 'أعارض', 'محايد', 'أوافق', 'أوافق بشدة'],
    },
    {
      id: 'Q3',
      type: 'vas',
      textEn: 'Current Oral Discomfort / Sensitivity Scale (0-10)',
      textAr: 'مقياس الانزعاج / الحساسية الفموية الحالية (0 - 10)',
      required: false,
      minLabelEn: 'No Discomfort (0)',
      maxLabelEn: 'Unbearable Discomfort (10)',
      minLabelAr: 'لا يوجد انزعاج (0)',
      maxLabelAr: 'انزعاج شديد جداً (10)',
    },
    {
      id: 'Q4',
      type: 'open_text',
      textEn: 'Please state any chief dental complaint or previous treatments.',
      textAr: 'يرجى ذكر أي شكوى فموية رئيسية أو معالجات سابقة.',
      required: false,
      placeholderEn: 'Describe your current main symptom...',
      placeholderAr: 'صَف العرض الرئيسي الحالي لديك...',
    },
  ];

  const [questions, setQuestions] = useState(defaultQuestions);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Form states for new item
  const [qType, setQType] = useState('mcq');
  const [qTextEn, setQTextEn] = useState('');
  const [qTextAr, setQTextAr] = useState('');
  const [qRequired, setQRequired] = useState(true);
  const [qOptionsEn] = useState(['Option 1', 'Option 2', 'Option 3']);
  const [qOptionsAr] = useState(['الخيار 1', 'الخيار 2', 'الخيار 3']);

  const handleAddQuestion = () => {
    const newId = `Q${questions.length + 1}_${Date.now().toString().slice(-4)}`;
    const newQ = {
      id: newId,
      type: qType,
      textEn: qTextEn.trim() || `New Question #${questions.length + 1}`,
      textAr: qTextAr.trim() || `سؤال جديد #${questions.length + 1}`,
      required: qRequired,
      ...(qType === 'mcq' && { optionsEn: [...qOptionsEn], optionsAr: [...qOptionsAr] }),
      ...(qType === 'likert_5' && {
        optionsEn: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        optionsAr: ['أعارض بشدة', 'أعارض', 'محايد', 'أوافق', 'أوافق بشدة'],
      }),
      ...(qType === 'likert_7' && {
        optionsEn: ['Strongly Disagree', 'Disagree', 'Slightly Disagree', 'Neutral', 'Slightly Agree', 'Agree', 'Strongly Agree'],
        optionsAr: ['أعارض بشدة', 'أعارض', 'أعارض قليلاً', 'محايد', 'أوافق قليلاً', 'أوافق', 'أوافق بشدة'],
      }),
      ...(qType === 'vas' && {
        minLabelEn: 'Min (0)', maxLabelEn: 'Max (10)',
        minLabelAr: 'الحد الأدنى (0)', maxLabelAr: 'الحد الأقصى (10)',
      }),
      ...(qType === 'open_text' && {
        placeholderEn: 'Enter response...', placeholderAr: 'أدخل الإجابة...',
      }),
    };

    const updated = [...questions, newQ];
    setQuestions(updated);
    resetForm();
    if (onSave) onSave(updated);
  };

  const resetForm = () => {
    setQTextEn('');
    setQTextAr('');
    setQType('mcq');
    setQRequired(true);
  };

  const handleDeleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    if (onSave) onSave(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...questions];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setQuestions(updated);
    if (onSave) onSave(updated);
  };

  const handleMoveDown = (index) => {
    if (index === questions.length - 1) return;
    const updated = [...questions];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setQuestions(updated);
    if (onSave) onSave(updated);
  };

  const handleSaveAll = () => {
    if (onSave) onSave(questions);
    setSaveMessage(isRtl ? 'تم حفظ الاستبيان التفاعلي بنجاح!' : 'Interactive Questionnaire Saved Successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <Card variant="outlined" padding="lg" className="space-y-6 bg-surface-container-lowest">
      {/* Builder Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-container-high pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Icon name="edit_note" className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-on-surface">
              {isRtl ? 'منشئ الاستبيان السريري التفاعلي (CS-16)' : 'Interactive Clinical Questionnaire Builder (CS-16)'}
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {isRtl
              ? 'إضافة، تعديل، إعادة ترتيب الأسئلة، وتحديد نوع الفقرة (MCQ, Likert 1-5, Likert 1-7, VAS, Open Text).'
              : 'Add, edit, reorder questions, and configure items (MCQ, Likert 1-5, Likert 1-7, VAS, Open Text).'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? 'primary' : 'outlined'}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Icon name={previewMode ? 'edit' : 'visibility'} className="w-4 h-4 mr-1" />
            {previewMode ? (isRtl ? 'وضع التعديل' : 'Edit Mode') : (isRtl ? 'معاينة المشارك' : 'Preview Mode')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveAll}>
            <Icon name="save" className="w-4 h-4 mr-1" />
            {isRtl ? 'حفظ الاستبيان' : 'Save Questionnaire'}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm flex items-center gap-2">
          <Icon name="check_circle" className="w-4 h-4" />
          {saveMessage}
        </div>
      )}

      {/* Mode Switch: Preview vs Builder */}
      {previewMode ? (
        <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
          <h4 className="font-bold text-sm text-on-surface border-b pb-2 flex items-center justify-between">
            <span>{isRtl ? 'معاينة نموذج إجابة المشارك' : 'Participant Response Preview Form'}</span>
            <Badge variant="teal">{questions.length} {isRtl ? 'أسئلة' : 'Questions'}</Badge>
          </h4>
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-surface-container-lowest rounded-lg border border-surface-container-high space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm text-on-surface">
                  {idx + 1}. {isRtl ? q.textAr : q.textEn}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </span>
                <Badge variant="outline" className="text-xs uppercase">{q.type}</Badge>
              </div>

              {/* Render Question Input Preview */}
              {q.type === 'mcq' && (
                <div className="space-y-2 pl-4">
                  {(isRtl ? q.optionsAr : q.optionsEn).map((opt, i) => (
                    <label key={i} className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                      <input type="radio" name={`prev_${q.id}`} className="text-emerald-600 focus:ring-emerald-500" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {(q.type === 'likert_5' || q.type === 'likert_7') && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {(isRtl ? q.optionsAr : q.optionsEn).map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="p-2 border border-surface-container-high rounded text-xs text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-on-surface-variant"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'vas' && (
                <div className="space-y-2 pt-2">
                  <input type="range" min="0" max="10" defaultValue="5" className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-xs text-on-surface-variant font-mono">
                    <span>{isRtl ? q.minLabelAr : q.minLabelEn}</span>
                    <span>{isRtl ? q.maxLabelAr : q.maxLabelEn}</span>
                  </div>
                </div>
              )}

              {q.type === 'open_text' && (
                <textarea
                  rows={2}
                  disabled
                  placeholder={isRtl ? q.placeholderAr : q.placeholderEn}
                  className="w-full p-2 border border-surface-container-high rounded text-xs bg-surface-container-low text-on-surface-variant"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-on-surface flex items-center justify-between">
              <span>{isRtl ? 'قائمة الأسئلة الحالية' : 'Current Question Inventory'}</span>
              <span className="text-xs text-on-surface-variant font-normal">
                {isRtl ? 'استخدم الأسهم لإعادة الترتيب' : 'Use arrows to reorder items'}
              </span>
            </h4>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600">#{idx + 1}</span>
                    <Badge variant="secondary" className="text-xs uppercase font-mono">{q.type}</Badge>
                    {q.required && <Badge variant="red" className="text-xs">{isRtl ? 'إلزامي' : 'Required'}</Badge>}
                  </div>
                  <p className="text-sm font-bold text-on-surface">{isRtl ? q.textAr : q.textEn}</p>
                  <p className="text-xs text-on-surface-variant dir-ltr">{isRtl ? q.textEn : q.textAr}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 self-end sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    title={isRtl ? 'تحريك للأعلى' : 'Move Up'}
                  >
                    <Icon name="arrow_upward" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === questions.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    title={isRtl ? 'تحريك للأسفل' : 'Move Down'}
                  >
                    <Icon name="arrow_downward" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Icon name="delete" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Question Section */}
          <div className="p-4 border-2 border-dashed border-surface-container-high rounded-xl space-y-4 bg-surface-container-lowest">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Icon name="add_circle" className="w-4 h-4 text-emerald-600" />
              {isRtl ? 'إضافة سؤال جديد للاستبيان' : 'Add New Question to Instrument'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  {isRtl ? 'نوع السؤال' : 'Question Type'}
                </label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                  className="w-full p-2 border border-surface-container-high rounded-lg text-sm bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="mcq">{isRtl ? 'خيارات متعددة (MCQ)' : 'Multiple Choice (MCQ)'}</option>
                  <option value="likert_5">{isRtl ? 'مقياس ليكرت 5 نقاط' : 'Likert Scale 1-5'}</option>
                  <option value="likert_7">{isRtl ? 'مقياس ليكرت 7 نقاط' : 'Likert Scale 1-7'}</option>
                  <option value="vas">{isRtl ? 'مقياس الألم البصري (VAS 0-10)' : 'Visual Analog Scale (VAS 0-10)'}</option>
                  <option value="open_text">{isRtl ? 'نص مفتوح (Open Text)' : 'Open Text'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="q_req"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="q_req" className="text-xs font-semibold text-on-surface">
                  {isRtl ? 'سؤال إلزامي والإجابة مطلوبة' : 'Required Question'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isRtl ? 'نص السؤال بالإنجليزية' : 'Question Text (English)'}
                placeholder="e.g. Rate your dental comfort post-op..."
                value={qTextEn}
                onChange={(e) => setQTextEn(e.target.value)}
              />
              <Input
                label={isRtl ? 'نص السؤال بالعربية' : 'Question Text (Arabic)'}
                placeholder="مثال: كيف تقيم درجة الارتياح بعد العملية..."
                value={qTextAr}
                onChange={(e) => setQTextAr(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleAddQuestion}>
                <Icon name="add" className="w-4 h-4 mr-1" />
                {isRtl ? 'إضافة السؤال للنماذج' : 'Add Question Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionnaireBuilder;
