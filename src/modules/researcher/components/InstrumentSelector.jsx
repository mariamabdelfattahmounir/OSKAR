import React, { useState } from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import Card from '../../../design-system/components/Card';
import Badge from '../../../design-system/components/Badge';

export const InstrumentSelector = ({ selectedInstruments = ['OHIP-14'], onToggleInstrument }) => {
  const { isRtl } = useI18n();

  const instruments = [
    {
      id: 'OHIP-14',
      titleEn: 'OHIP-14 (Oral Health Impact Profile)',
      titleAr: 'مقياس OHIP-14 لقياس جودة الحياة الفموية',
      itemsCount: 14,
      descEn: 'Validated 14-item instrument measuring functional limitation, physical pain, psychological discomfort, and disability.',
      descAr: 'أداة معتمدة من 14 فقرة تقيس التقييد الوظيفي، الألم الجسدي، الانزعاج النفسي، والإعاقة الفموية.',
      sampleItemsEn: [
        'Have you had trouble pronouncing any words because of problems with your teeth or mouth?',
        'Have you felt that your sense of taste has worsened because of problems with your teeth or mouth?',
        'Have you had painful aches in your mouth?',
        'Have you found it uncomfortable to eat any foods because of problems with your teeth or mouth?',
      ],
      sampleItemsAr: [
        'هل واجهت صعوبة في نطق أي كلمات بسبب مشاكل في أسنانك أو فمك؟',
        'هل شعرت أن حاسة التذوق لديك قد ساءت بسبب مشاكل في أسنانك أو فمك؟',
        'هل عانيت من آلام موجعة في فمك؟',
        'هل وجدت أنه من غير المريح تناول أي أطعمة بسبب مشاكل في أسنانك أو فمك؟',
      ],
    },
    {
      id: 'GOHAI',
      titleEn: 'GOHAI (General Oral Health Assessment Index)',
      titleAr: 'مقياس GOHAI للتقييم الفموي العام',
      itemsCount: 12,
      descEn: '12-item self-reported measure designed to assess oral health problems in older adults.',
      descAr: 'مقياس تقرير ذاتي من 12 فقرة مصمم لتقييم مشاكل الصحة الفموية لدى كبار السن والبالغين.',
      sampleItemsEn: [
        'How often did you limit the kinds or amounts of food you eat because of problems with your teeth or dentures?',
        'How often did you have trouble biting or chewing any edible food?',
        'How often were you able to swallow comfortably?',
      ],
      sampleItemsAr: [
        'كم مرة حددت أنواع أو كميات الطعام التي تأكلها بسبب مشاكل في أسنانك أو طقم الأسنان؟',
        'كم مرة واجهت صعوبة في قضم أو مضغ أي طعام؟',
        'كم مرة كنت قادراً على البلع براحة؟',
      ],
    },
    {
      id: 'PROMIS-10',
      titleEn: 'PROMIS-10 Global Health Instrument',
      titleAr: 'مقياس PROMIS-10 العالمي للصحة العامة',
      itemsCount: 10,
      descEn: 'Standardized 10-item global health instrument assessing overall physical, mental, and social health.',
      descAr: 'أداة معيارية من 10 فقرات لتقييم الصحة العامة البدنية والنفسية والاجتماعية.',
      sampleItemsEn: [
        'In general, how would you rate your overall quality of life?',
        'In general, how would you rate your mental health, including your mood and your ability to think?',
      ],
      sampleItemsAr: [
        'بشكل عام، كيف تقيم جودة حياتك الإجمالية؟',
        'بشكل عام، كيف تقيم صحتك النفسية والعقلية بما في ذلك مزاجك وقدرتك على التفكير؟',
      ],
    },
  ];

  const [expandedId, setExpandedId] = useState('OHIP-14');

  return (
    <Card variant="outlined" padding="lg" className="space-y-4 bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Icon name="verified" className="w-5 h-5" />
          </span>
          <h4 className="font-bold text-sm text-on-surface">
            {isRtl ? 'المقاييس السريرية المعتمدة (CS-17 Standard Instruments)' : 'Standard Validated Instruments (CS-17)'}
          </h4>
        </div>
        <Badge variant="emerald">{selectedInstruments.length} {isRtl ? 'محددة' : 'Selected'}</Badge>
      </div>

      <div className="space-y-3">
        {instruments.map((inst) => {
          const isSelected = selectedInstruments.includes(inst.id);
          const isExpanded = expandedId === inst.id;

          return (
            <div
              key={inst.id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                  : 'border-surface-container-high bg-surface-container-low hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleInstrument && onToggleInstrument(inst.id)}
                    className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-on-surface">{isRtl ? inst.titleAr : inst.titleEn}</h5>
                      <Badge variant="outline" className="text-xs">{inst.itemsCount} {isRtl ? 'فقرات' : 'Items'}</Badge>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{isRtl ? inst.descAr : inst.descEn}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                  className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high"
                  title={isRtl ? 'معاينة فقرات المقياس' : 'Preview items'}
                >
                  <Icon name={isExpanded ? 'expand_less' : 'expand_more'} className="w-5 h-5" />
                </button>
              </div>

              {/* Collapsible Sample Items Accordion */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-surface-container-high/60 pl-8 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                    {isRtl ? 'معاينة فقرات المقياس المعتمدة:' : 'Validated Item Preview Schema:'}
                  </span>
                  <ul className="space-y-1">
                    {(isRtl ? inst.sampleItemsAr : inst.sampleItemsEn).map((item, idx) => (
                      <li key={idx} className="text-xs text-on-surface-variant flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default InstrumentSelector;
