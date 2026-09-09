import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const SampleSizePage = () => {
  const { isRtl } = useI18n();

  // State parameters
  const [selectedStudy, setSelectedStudy] = useState('STD-2026-001');
  const [methodology, setMethodology] = useState('rct');
  const [testType, setTestType] = useState('independent_t_test');
  const [alpha, setAlpha] = useState('0.05');
  const [power, setPower] = useState('0.80');
  const [ratio, setRatio] = useState('1.0');
  const [dropout, setDropout] = useState(15);

  // Dynamic model parameters
  const [effectSize, setEffectSize] = useState(0.50);
  const [p1, setP1] = useState(0.50);
  const [p2, setP2] = useState(0.30);
  const [groupsK, setGroupsK] = useState(3);
  const [effectF, setEffectF] = useState(0.25);
  const [effectW, setEffectW] = useState(0.30);
  const [marginE, setMarginE] = useState(0.05);
  const [prevP, setPrevP] = useState(0.50);
  const [nonInfDiff, setNonInfDiff] = useState(0.20);
  const [nonInfMargin, setNonInfMargin] = useState(0.15);

  // UI & Calculation States
  const [isFormulaExpanded, setIsFormulaExpanded] = useState(true);
  const [isRefExpanded, setIsRefExpanded] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [modalState, setModalState] = useState(null); // 'trial_available' | 'trial_exhausted' | null
  
  // Active calculated result state driven by form submission/calculate action
  const [submittedRes, setSubmittedRes] = useState(null);

  // Quantile approximation for Standard Normal Distribution
  const normInv = useCallback((p) => {
    if (p <= 0 || p >= 1) return 1.96;
    const a1 = -39.69683028665376, a2 = 220.9460984245205, a3 = -275.9285104469687;
    const a4 = 138.3577518672690, a5 = -30.66479806614716, a6 = 2.506628277459239;
    const b1 = -54.47609879822406, b2 = 161.5858368580409, b3 = -155.6989798598866;
    const b4 = 66.80131188771972, b5 = -13.28068155288572;
    const c1 = -0.007784894002430293, c2 = -0.3223964580411365, c3 = -2.400758277161838;
    const c4 = -2.549732539343734, c5 = 4.374664141464968, c6 = 2.938163982698783;
    const d1 = 0.007784695709041462, d2 = 0.3224671290700398, d3 = 2.445134137142996, d4 = 3.754408661907416;

    const p_low = 0.02425, p_high = 1 - p_low;
    let q, r;

    if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
             (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }, []);

  // Synchronize study and methodology dropdowns
  const handleStudyChange = (e) => {
    const sId = e.target.value;
    setSelectedStudy(sId);
    if (sId === 'STD-2026-001') {
      setMethodology('rct');
      setTestType('independent_t_test');
    } else if (sId === 'STD-2026-002') {
      setMethodology('retrospective');
      setTestType('independent_t_test');
    } else if (sId === 'STD-2026-003') {
      setMethodology('cross_sectional');
      setTestType('cross_sectional_margin');
    }
  };

  const handleMethodologyChange = (e) => {
    const meth = e.target.value;
    setMethodology(meth);
    if (meth === 'cross_sectional') {
      setTestType('cross_sectional_margin');
    } else if (testType === 'cross_sectional_margin') {
      setTestType('independent_t_test');
    }
  };

  // Perform Calculation logic with strict validation
  const runCalculation = useCallback(() => {
    const alphaVal = parseFloat(alpha);
    const powerVal = parseFloat(power);
    const ratioVal = parseFloat(ratio);
    const dropRate = Math.max(0, Math.min(50, parseFloat(dropout) || 0)) / 100.0;

    if (isNaN(alphaVal) || alphaVal <= 0 || alphaVal >= 0.5) {
      throw new Error(isRtl ? 'مستوى المعنوية α يجب أن يكون بين 0.001 و 0.20' : 'Significance level α must be between 0.001 and 0.20.');
    }
    if (testType !== 'cross_sectional_margin') {
      if (isNaN(powerVal) || powerVal <= 0.4 || powerVal >= 1.0) {
        throw new Error(isRtl ? 'القوة الإحصائية يجب أن تكون بين 50% و 99%' : 'Target power must be between 50% and 99%.');
      }
    }

    const z_a = normInv(1.0 - alphaVal / 2.0);
    const z_b = normInv(powerVal);

    let n1 = 0, n2 = 0, totalN = 0;
    let formulaStr = '', whyStr = '', references = [], paramRows = [];

    if (testType === 'independent_t_test') {
      const d = parseFloat(effectSize);
      if (isNaN(d) || d <= 0) throw new Error(isRtl ? 'حجم الأثر يجب أن يكون أكبر من الصفر' : 'Effect size must be greater than zero.');
      const nRaw = 2.0 * Math.pow((z_a + z_b) / d, 2);
      n1 = Math.ceil(nRaw);
      n2 = Math.ceil(n1 * ratioVal);
      totalN = n1 + n2;
      formulaStr = `n_group = 2 * [(Z_{1-α/2} + Z_{1-β}) / d]^2`;
      whyStr = isRtl
        ? `مقارنة مجموعتين مستقلتين لمتغير مستمر وفقاً لمعادلة اختبار t المستقل. Z_{1-α/2}=${z_a.toFixed(3)}, Z_{1-β}=${z_b.toFixed(3)}, d=${d}.`
        : `Two independent groups with a continuous outcome map to the classical two-sample t-test equation. Z_{1-α/2}=${z_a.toFixed(3)}, Z_{1-β}=${z_b.toFixed(3)}, d=${d}.`;
      references = [
        'Chow, Shao & Wang (2008). Sample Size Calculations in Clinical Research. 2nd Ed.',
        'ICH E9 Statistical Principles for Clinical Trials (FDA/EMA Guidelines).'
      ];
      paramRows = [
        { param: isRtl ? 'مستوى المعنوية (α)' : 'Significance (α)', val: alphaVal, impact: `Z_{1-α/2} = ${z_a.toFixed(3)}` },
        { param: isRtl ? 'القوة الإحصائية (1-β)' : 'Power (1-β)', val: `${(powerVal * 100).toFixed(0)}%`, impact: `Z_{1-β} = ${z_b.toFixed(3)}` },
        { param: isRtl ? 'حجم الأثر (d)' : 'Effect Size (d)', val: d, impact: "Cohen's d" },
      ];
    } else if (testType === 'paired_t_test') {
      const d = parseFloat(effectSize);
      if (isNaN(d) || d <= 0) throw new Error(isRtl ? 'حجم الأثر للأزواج يجب أن يكون أكبر من الصفر' : 'Paired effect size must be greater than zero.');
      const nRaw = Math.pow((z_a + z_b) / d, 2);
      n1 = Math.ceil(nRaw);
      n2 = n1;
      totalN = n1;
      formulaStr = `n_pairs = [(Z_{1-α/2} + Z_{1-β}) / d_dz]^2`;
      whyStr = isRtl
        ? `اختبار t المزدوج يستخدم متوسط الفروق مقسوماً على الانحراف المعياري للفروق.`
        : `Paired t-test uses the mean difference divided by standard deviation of differences.`;
      references = [
        'Rosner B (2015). Fundamentals of Biostatistics. 8th Ed.',
        'Altman DG (1991). Practical Statistics for Medical Research.'
      ];
      paramRows = [
        { param: isRtl ? 'مستوى المعنوية (α)' : 'Significance (α)', val: alphaVal, impact: `Z_{1-α/2} = ${z_a.toFixed(3)}` },
        { param: isRtl ? 'القوة الإحصائية (1-β)' : 'Power (1-β)', val: `${(powerVal * 100).toFixed(0)}%`, impact: `Z_{1-β} = ${z_b.toFixed(3)}` },
        { param: isRtl ? 'حجم الأثر للأزواج (d)' : 'Paired Effect (d)', val: d, impact: 'Mean Diff / SD Diff' },
      ];
    } else if (testType === 'two_proportion_z_test') {
      const valP1 = parseFloat(p1);
      const valP2 = parseFloat(p2);
      if (isNaN(valP1) || valP1 <= 0 || valP1 >= 1) throw new Error(isRtl ? 'النسبة المبدئية P1 يجب أن تكون بين 0 و 1' : 'Baseline proportion P1 must be between 0 and 1.');
      if (isNaN(valP2) || valP2 <= 0 || valP2 >= 1) throw new Error(isRtl ? 'النسبة المستهدفة P2 يجب أن تكون بين 0 و 1' : 'Intervention proportion P2 must be between 0 and 1.');
      if (Math.abs(valP1 - valP2) < 0.001) {
        throw new Error(isRtl ? 'النسبتان P1 و P2 يجب أن تختلفا لحساب الفارق' : 'Proportions P1 and P2 must be different.');
      }
      const pBar = (valP1 + valP2) / 2.0;
      const qBar = 1.0 - pBar;
      const num = z_a * Math.sqrt(2 * pBar * qBar) + z_b * Math.sqrt(valP1 * (1 - valP1) + valP2 * (1 - valP2));
      const nRaw = Math.pow(num / (valP1 - valP2), 2);
      n1 = Math.ceil(nRaw);
      n2 = Math.ceil(n1 * ratioVal);
      totalN = n1 + n2;
      formulaStr = `n_group = [Z_a √(2 p̄ q̄) + Z_b √(p1 q1 + p2 q2)]^2 / (p1 - p2)^2`;
      whyStr = isRtl
        ? `اختبار Z للنسبتين المستقلتين يقارن الفارق بين معدلين P1=${valP1} و P2=${valP2}.`
        : `Two-proportion Z-test evaluates difference between independent rates P1=${valP1} vs P2=${valP2}.`;
      references = [
        'Fleiss JL, Levin B, Paik MC (2003). Statistical Methods for Rates and Proportions.',
        'Chow, Shao & Wang (2008).'
      ];
      paramRows = [
        { param: isRtl ? 'النسبة المبدئية P1' : 'P1 Baseline', val: `${(valP1 * 100).toFixed(0)}%`, impact: isRtl ? 'نسبة الشواهد' : 'Control proportion' },
        { param: isRtl ? 'النسبة المستهدفة P2' : 'P2 Intervention', val: `${(valP2 * 100).toFixed(0)}%`, impact: isRtl ? 'نسبة العلاج المستهدف' : 'Target proportion' },
      ];
    } else if (testType === 'anova') {
      const k = parseInt(groupsK, 10);
      const f = parseFloat(effectF);
      if (isNaN(k) || k < 3) throw new Error(isRtl ? 'عدد مجموعات ANOVA يجب أن يكون 3 أو أكثر' : 'Number of ANOVA groups (k) must be >= 3.');
      if (isNaN(f) || f <= 0) throw new Error(isRtl ? 'حجم الأثر f يجب أن يكون أكبر من الصفر' : 'Effect size f must be greater than zero.');
      const nRaw = Math.pow((z_a + z_b) / f, 2) / (2 * k) + 2;
      n1 = Math.ceil(nRaw);
      n2 = n1;
      totalN = n1 * k;
      formulaStr = `n_group = [(Z_{1-α/2} + Z_{1-β}) / f]^2 / (2 k) + 2`;
      whyStr = isRtl
        ? `يقارن تحليل التباين الأحادي ANOVA بين k=${k} من متوسطات المجموعات المستقلة باستخدام حجم الأثر f=${f}.`
        : `One-way ANOVA compares k=${k} independent group means using Cohen's f effect size = ${f}.`;
      references = [
        'Cohen J (1988). Statistical Power Analysis for the Behavioral Sciences. 2nd Ed.',
        'Maxwell SE, Delaney HD (2004). Designing Experiments and Analyzing Data.'
      ];
      paramRows = [
        { param: isRtl ? 'عدد المجموعات (k)' : 'Groups (k)', val: k, impact: isRtl ? 'المجموعات المستقلة' : 'Independent arms' },
        { param: isRtl ? 'حجم الأثر (Cohen\'s f)' : 'Effect Size (f)', val: f, impact: 'SD of means / pooled SD' },
      ];
    } else if (testType === 'chi_square') {
      const w = parseFloat(effectW);
      if (isNaN(w) || w <= 0) throw new Error(isRtl ? 'حجم الأثر w يجب أن يكون أكبر من الصفر' : 'Effect size w must be greater than zero.');
      const nRaw = Math.pow(z_a + z_b, 2) / Math.pow(w, 2);
      totalN = Math.ceil(nRaw);
      n1 = Math.ceil(totalN / 2);
      n2 = totalN - n1;
      formulaStr = `N = (Z_{1-α/2} + Z_{1-β})^2 / w^2`;
      whyStr = isRtl
        ? `حساب حجم العينة لاختبار كاي تربيع للتوافق بناءً على حجم أثر كوهين w=${w}.`
        : `Chi-square contingency test sample size based on Cohen's w effect size = ${w}.`;
      references = [
        'Agresti A (2007). An Introduction to Categorical Data Analysis. 2nd Ed.',
        'Cohen J (1988).'
      ];
      paramRows = [
        { param: isRtl ? 'مستوى المعنوية (α)' : 'Significance (α)', val: alphaVal, impact: `Z_{1-α/2} = ${z_a.toFixed(3)}` },
        { param: isRtl ? 'حجم الأثر (w)' : 'Effect Size (w)', val: w, impact: "Cohen's w" },
      ];
    } else if (testType === 'cross_sectional_margin') {
      const eVal = parseFloat(marginE);
      const prevVal = parseFloat(prevP);
      if (isNaN(eVal) || eVal <= 0 || eVal > 0.20) throw new Error(isRtl ? 'هامش الخطأ e يجب أن يكون أكبر من 0 وأقل من 0.20' : 'Margin of error e must be > 0 and <= 0.20.');
      if (isNaN(prevVal) || prevVal <= 0 || prevVal >= 1) throw new Error(isRtl ? 'الانتشار المتوقع P يجب أن يكون بين 0 و 1' : 'Expected prevalence P must be between 0 and 1.');
      const nRaw = (Math.pow(z_a, 2) * prevVal * (1.0 - prevVal)) / Math.pow(eVal, 2);
      n1 = Math.ceil(nRaw);
      n2 = n1;
      totalN = n1;
      formulaStr = `N = [Z_{1-α/2}^2 * P * (1 - P)] / e^2`;
      whyStr = isRtl
        ? `حجم عينة المسح المقطعي يستند لمعادلة هامش الخطأ المطبقة للنسب السكانية (Daniel 1999). Z_{1-α/2}=${z_a.toFixed(3)}, P=${prevVal}, e=${eVal}.`
        : `Cross-sectional survey sampling size uses the standard population proportion margin of error formula (Daniel 1999). Z_{1-α/2}=${z_a.toFixed(3)}, P=${prevVal}, e=${eVal}.`;
      references = [
        'Daniel WW (1999). Biostatistics: A Foundation for Analysis in the Health Sciences. 7th Ed.',
        'Lwanga SK, Lemeshow S (1991). Sample Size Determination in Health Studies: A Practical Manual (WHO).'
      ];
      paramRows = [
        { param: isRtl ? 'مستوى المعنوية (α)' : 'Significance (α)', val: alphaVal, impact: `Z_{1-α/2} = ${z_a.toFixed(3)}` },
        { param: isRtl ? 'هامش الخطأ (e)' : 'Margin of Error (e)', val: `${(eVal * 100).toFixed(1)}%`, impact: isRtl ? 'دقة التقدير المطلوبة' : 'Precision bound' },
        { param: isRtl ? 'الانتشار المتوقع (P)' : 'Expected Prevalence (P)', val: `${(prevVal * 100).toFixed(0)}%`, impact: isRtl ? 'النسبة المبدئية' : 'Prior proportion' },
      ];
    } else if (testType === 'non_inferiority') {
      const d = parseFloat(nonInfDiff);
      const margin = parseFloat(nonInfMargin);
      if (isNaN(d) || d <= 0) throw new Error(isRtl ? 'الفارق المتوقع d يجب أن يكون أكبر من الصفر' : 'Expected difference d must be > 0.');
      if (isNaN(margin) || margin <= 0) throw new Error(isRtl ? 'هامش عدم الأقلية δ يجب أن يكون أكبر من الصفر' : 'Non-inferiority margin δ must be > 0.');
      const denom = Math.max(0.001, Math.abs(d - margin));
      const z_a_one_sided = normInv(1.0 - alphaVal);
      const nRaw = 2.0 * Math.pow((z_a_one_sided + z_b) / denom, 2);
      n1 = Math.ceil(nRaw);
      n2 = n1;
      totalN = n1 * 2;
      formulaStr = `n_group = 2 * [(Z_{1-α} + Z_{1-β}) / (d - δ)]^2`;
      whyStr = isRtl
        ? `تقيم تجارب عدم الأقلية ما إذا كان العلاج الجديد ليس أسوأ من المراقبة بهامش δ.`
        : `Non-inferiority trials evaluate whether the new therapy is no worse than control by margin δ.`;
      references = [
        'ICH E10 Choice of Control Group in Clinical Trials',
        'Piaggio et al. (2006) CONSORT extension for non-inferiority trials.'
      ];
      paramRows = [
        { param: isRtl ? 'الفارق المتوقع (d)' : 'Mean Diff (d)', val: d, impact: isRtl ? 'الفارق الملاحظ' : 'Expected difference' },
        { param: isRtl ? 'هامش عدم الأقلية (δ)' : 'Margin (δ)', val: margin, impact: isRtl ? 'حد عدم الأقلية' : 'Non-inferiority bound' },
      ];
    }

    const adjTotalN = Math.ceil(totalN / (1.0 - dropRate));

    return {
      n1,
      n2,
      totalN,
      adjTotalN,
      formulaStr,
      whyStr,
      references,
      paramRows,
      dropRate,
      dropout,
    };
  }, [alpha, power, ratio, dropout, testType, effectSize, p1, p2, groupsK, effectF, effectW, marginE, prevP, nonInfDiff, nonInfMargin, normInv, isRtl]);

  // Initial calculation load
  useEffect(() => {
    try {
      const initialRes = runCalculation();
      setSubmittedRes(initialRes);
    } catch {
      // Ignore initial silent errors
    }
  }, [runCalculation]);

  // Submit Handler for Calculate Button
  const handleRequestCalc = (e) => {
    e.preventDefault();
    try {
      const res = runCalculation();
      setValidationError('');
      setSubmittedRes(res);
    } catch (err) {
      setValidationError(err.message || (isRtl ? 'افتراضات إحصائية غير صالحة' : 'Invalid statistical inputs.'));
    }
  };

  const handleModalConfirm = () => {
    if (modalState === 'trial_available') {
      localStorage.setItem('oskar_samplesize_trial_used', 'true');
    }
    setModalState(null);
  };

  const res = submittedRes || {
    n1: 0,
    n2: 0,
    totalN: 0,
    adjTotalN: 0,
    formulaStr: '',
    whyStr: '',
    references: [],
    paramRows: [],
    dropRate: 0,
    dropout: 15,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-900 dark:text-gray-100 font-sans antialiased" id="sample-size-app">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-gray-700/60 pb-5 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-semibold uppercase tracking-wider whitespace-nowrap">
          <Icon name="calculate" size="sm" />
          <span>
            {isRtl ? 'حاسبة حجم العينة والقوة الإحصائية — OSKAR MedStat' : 'OSKAR Biostatistical Power & Sample Size Calculator'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isRtl ? 'حاسبة حجم العينة والقوة الإحصائية' : 'Sample Size & Power Calculator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-2xl mt-1 leading-relaxed">
              {isRtl
                ? 'حساب حجم العينة والقوة الإحصائية وفقًا لمعايير الجمعية الدولية للمواءمة وتوجيهات ICH E9 والمنشورات الأكاديمية.'
                : 'Determine scientifically rigorous sample sizes, statistical power, and attrition adjustments according to ICH E9 and biostatistical standards.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer"
            >
              <Icon name="print" size="sm" />
              <span>{isRtl ? 'طباعة / تصدير التقرير PDF' : 'Print / Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Study Context Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-gray-700/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="folder_open" size="sm" className="text-primary dark:text-teal-400" />
              <span>{isRtl ? 'البروتوكول المستهدف' : 'Target Study Protocol'}</span>
            </label>
            <select
              value={selectedStudy}
              onChange={handleStudyChange}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-xs text-slate-900 dark:text-white font-medium transition-all cursor-pointer"
            >
              <option value="STD-2026-001">STD-2026-001: Comparative Efficacy of Triple-Drug Immunotherapy</option>
              <option value="STD-2026-002">STD-2026-002: Retrospective Cohort Analysis of Cardiac Biomarkers</option>
              <option value="STD-2026-003">STD-2026-003: Cross-Sectional Survey of Burnout Syndrome</option>
              <option value="CUSTOM">{isRtl ? 'حساب حر مسترد من البروتوكول' : 'Standalone Protocol Calculation'}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="schema" size="sm" className="text-primary dark:text-teal-400" />
              <span>{isRtl ? 'منهجية تصميم الدراسة' : 'Study Design Methodology'}</span>
            </label>
            <select
              value={methodology}
              onChange={handleMethodologyChange}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-xs text-slate-900 dark:text-white font-medium transition-all cursor-pointer"
            >
              <option value="rct">{isRtl ? 'تجربة عشوائية محكمة' : 'Randomized Controlled Trial (RCT)'}</option>
              <option value="prospective">{isRtl ? 'دراسة مستقبلية ملاحظاتية' : 'Prospective Cohort Study'}</option>
              <option value="retrospective">{isRtl ? 'دراسة استعادية أرشيفية' : 'Retrospective Archival Study'}</option>
              <option value="cross_sectional">{isRtl ? 'دراسة مسحية مقطعية' : 'Cross-Sectional Survey'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Parameters Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-700/60 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-700 gap-2">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 min-w-0 truncate">
              <Icon name="tune" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
              <span className="truncate">{isRtl ? 'الافتراضات والمعايير الإحصائية' : 'Statistical Assumptions & Inputs'}</span>
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-teal-300 font-mono font-semibold whitespace-nowrap shrink-0">
              ICH E9 / WHO
            </span>
          </div>

          <form onSubmit={handleRequestCalc} className="space-y-4 text-xs">
            {/* Statistical Test Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap">
                {isRtl ? 'النموذج الإحصائي المستهدف' : 'Statistical Test Model'}
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-slate-900 dark:text-white font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
              >
                <option value="independent_t_test">
                  {isRtl ? 'مقارنة متوسطين مستقلين (Independent t-Test)' : 'Comparing 2 Means (Independent Two-Sample t-Test)'}
                </option>
                <option value="paired_t_test">
                  {isRtl ? 'مقارنة متوسطين مرتبطين (Paired t-Test)' : 'Comparing 2 Means (Paired Samples t-Test)'}
                </option>
                <option value="two_proportion_z_test">
                  {isRtl ? 'مقارنة نسبتين مستقلتين (Two Proportions Z-Test)' : 'Comparing 2 Proportions (Two-Proportions Z-Test)'}
                </option>
                <option value="anova">
                  {isRtl ? 'تحليل التباين الأحادي (One-Way ANOVA)' : 'ANOVA (Comparing >2 Independent Means)'}
                </option>
                <option value="chi_square">
                  {isRtl ? 'اختبار كاي تربيع للتوافق (Chi-Square Test)' : 'Chi-Square Test (Goodness of Fit / Contingency)'}
                </option>
                <option value="cross_sectional_margin">
                  {isRtl ? 'المسح المقطعي والانتشار (Cross-Sectional Survey)' : 'Cross-Sectional Survey (Margin of Error & Prevalence)'}
                </option>
                <option value="non_inferiority">
                  {isRtl ? 'تجارب عدم الأقلية (Non-Inferiority Trial)' : 'Non-Inferiority Trial (Margin Testing)'}
                </option>
              </select>
            </div>

            {/* Common Parameter Row: Alpha & Power */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap truncate">
                  {isRtl ? 'مستوى المعنوية (α)' : 'Confidence Level (α)'}
                </label>
                <select
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-slate-900 dark:text-white font-mono text-xs cursor-pointer"
                >
                  <option value="0.05">α = 0.05 (95% {isRtl ? 'ثقة' : 'Confidence'})</option>
                  <option value="0.01">α = 0.01 (99% {isRtl ? 'ثقة' : 'Confidence'})</option>
                  <option value="0.001">α = 0.001 (99.9% {isRtl ? 'ثقة' : 'Confidence'})</option>
                  <option value="0.10">α = 0.10 (90% {isRtl ? 'ثقة' : 'Confidence'})</option>
                </select>
              </div>

              {testType !== 'cross_sectional_margin' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap truncate">
                    {isRtl ? 'القوة الإحصائية (1-β)' : 'Target Power (1-β)'}
                  </label>
                  <select
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-slate-900 dark:text-white font-mono text-xs cursor-pointer"
                  >
                    <option value="0.80">80% {isRtl ? 'قوة' : 'Power'} (0.80)</option>
                    <option value="0.85">85% {isRtl ? 'قوة' : 'Power'} (0.85)</option>
                    <option value="0.90">90% {isRtl ? 'قوة' : 'Power'} (0.90)</option>
                    <option value="0.95">95% {isRtl ? 'قوة' : 'Power'} (0.95)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Dynamic Model Specific Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-gray-700/60">
              {(testType === 'independent_t_test' || testType === 'paired_t_test') && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-900 dark:text-gray-200 flex items-center justify-between text-xs whitespace-nowrap">
                    <span>{isRtl ? 'حجم الأثر (Cohen\'s d)' : 'Effect Size (Cohen\'s d)'}</span>
                    <span className="text-[10px] text-primary dark:text-teal-400 font-mono">
                      {isRtl ? 'صغير=0.2، متوسط=0.5، كبير=0.8' : 'Small=0.2, Med=0.5, Large=0.8'}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    max="3.0"
                    step="0.05"
                    value={effectSize}
                    onChange={(e) => setEffectSize(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
              )}

              {testType === 'two_proportion_z_test' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'النسبة المبدئية (P1)' : 'Baseline Proportion (P1)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      max="0.99"
                      step="0.05"
                      value={p1}
                      onChange={(e) => setP1(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'النسبة المستهدفة (P2)' : 'Intervention Proportion (P2)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      max="0.99"
                      step="0.05"
                      value={p2}
                      onChange={(e) => setP2(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {testType === 'anova' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'عدد المجموعات (k)' : 'Number of Groups (k)'}
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      step="1"
                      value={groupsK}
                      onChange={(e) => setGroupsK(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'حجم الأثر (Cohen\'s f)' : 'Effect Size (Cohen\'s f)'}
                    </label>
                    <input
                      type="number"
                      min="0.05"
                      max="1.5"
                      step="0.05"
                      value={effectF}
                      onChange={(e) => setEffectF(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {testType === 'chi_square' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-900 dark:text-gray-200 flex items-center justify-between text-xs whitespace-nowrap">
                    <span>{isRtl ? 'حجم الأثر (Cohen\'s w)' : 'Effect Size (Cohen\'s w)'}</span>
                    <span className="text-[10px] text-primary dark:text-teal-400 font-mono">
                      {isRtl ? 'صغير=0.1، متوسط=0.3، كبير=0.5' : 'Small=0.1, Med=0.3, Large=0.5'}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    max="1.5"
                    step="0.05"
                    value={effectW}
                    onChange={(e) => setEffectW(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
              )}

              {testType === 'cross_sectional_margin' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'هامش الخطأ (e)' : 'Margin of Error (e)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      max="0.20"
                      step="0.01"
                      value={marginE}
                      onChange={(e) => setMarginE(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'الانتشار المتوقع (P)' : 'Expected Prevalence (P)'}
                    </label>
                    <input
                      type="number"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={prevP}
                      onChange={(e) => setPrevP(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {testType === 'non_inferiority' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'الفارق المتوقع (d)' : 'Expected Diff (d)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      max="2.0"
                      step="0.05"
                      value={nonInfDiff}
                      onChange={(e) => setNonInfDiff(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-900 dark:text-gray-200 text-xs whitespace-nowrap truncate">
                      {isRtl ? 'هامش عدم الأقلية (δ)' : 'Non-Inf Margin (δ)'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      max="1.0"
                      step="0.05"
                      value={nonInfMargin}
                      onChange={(e) => setNonInfMargin(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Common Parameter Row: Ratio & Dropout */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-gray-700/60">
              {testType !== 'paired_t_test' && testType !== 'cross_sectional_margin' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap truncate">
                    {isRtl ? 'نسبة التوزيع (N2/N1)' : 'Allocation Ratio (N2/N1)'}
                  </label>
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-gray-700/60 focus:border-primary outline-none text-slate-900 dark:text-white font-mono text-xs cursor-pointer"
                  >
                    <option value="1.0">1.0 ({isRtl ? 'مجموعات متساوية 1:1' : 'Equal 1:1 Groups'})</option>
                    <option value="2.0">2.0 ({isRtl ? '2:1 توزيع المجموعات' : '2:1 Allocation'})</option>
                    <option value="0.5">0.5 ({isRtl ? '1:2 توزيع المجموعات' : '1:2 Allocation'})</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap truncate">
                  {isRtl ? 'نسبة التسرب المتوقعة (%)' : 'Expected Dropout (%)'}
                </label>
                <div className="relative flex items-center h-10">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={dropout}
                    onChange={(e) => setDropout(e.target.value)}
                    className="w-full h-full px-3 pr-8 rounded-xl border border-slate-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary text-slate-900 dark:text-white font-mono text-xs"
                  />
                  <span className="absolute right-3 text-slate-500 dark:text-gray-400 font-mono text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                <Icon name="warning" size="sm" className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full h-11 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center justify-center gap-2 mt-4 whitespace-nowrap cursor-pointer"
            >
              <Icon name="calculate" size="sm" />
              <span>{isRtl ? 'حساب حجم العينة الموصى به' : 'Calculate Recommended N'}</span>
            </button>
          </form>
        </div>

        {/* Right Results & Scientific Rationale Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Output Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-gray-700/60 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-700 gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap truncate">
                  {isRtl ? 'نتيجة حجم العينة الموصى بها' : 'Recommended Sample Size Result'}
                </h2>
                <span className="text-xs text-slate-500 dark:text-gray-400 block truncate">
                  {isRtl
                    ? `${testType} • α = ${alpha}, القوة = ${(parseFloat(power) * 100).toFixed(0)}%`
                    : `${testType} • α = ${alpha}, ${(parseFloat(power) * 100).toFixed(0)}% Power`}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold whitespace-nowrap shrink-0">
                {isRtl ? 'الحالة: معادلة مصادق عليها' : 'Status: Validated Formula'}
              </span>
            </div>

            {/* Sample Size Result KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700/60 space-y-1 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block whitespace-nowrap truncate">
                  {isRtl ? 'حجم المجموعة (N1 / N2)' : 'Group Size (N1 / N2)'}
                </span>
                <div className="text-xl font-extrabold text-primary dark:text-teal-300 font-mono">
                  {testType === 'cross_sectional_margin' || testType === 'chi_square' || testType === 'paired_t_test'
                    ? `${res.totalN}`
                    : `${res.n1} / ${res.n2}`}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block whitespace-nowrap truncate">
                  {isRtl ? 'لكل ذراع (قبل التعديل)' : 'per arm (Unadjusted)'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/10 dark:bg-teal-950/30 border border-primary/20 space-y-1 text-center shadow-xs">
                <span className="text-[11px] font-bold text-primary dark:text-teal-300 uppercase tracking-wider block whitespace-nowrap truncate">
                  {isRtl ? 'الحجم المستهدف المعدل' : 'Adjusted Target N'}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-primary dark:text-teal-300 font-mono">
                  {res.adjTotalN}
                </div>
                <span className="text-[10px] text-primary dark:text-teal-400 font-semibold block whitespace-nowrap truncate">
                  {isRtl ? `يشمل تعديل نسبة الانسحاب ${res.dropout || dropout}%` : `includes ${res.dropout || dropout}% Attrition`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700/60 space-y-1 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block whitespace-nowrap truncate">
                  {isRtl ? 'الحد الأدنى المطلوب N' : 'Minimum Required N'}
                </span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {res.totalN}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block whitespace-nowrap truncate">
                  {isRtl ? 'إجمالي الحالات المطلوبة' : 'Raw sample size'}
                </span>
              </div>
            </div>

            {/* Calculation Assumptions Summary Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider whitespace-nowrap">
                {isRtl ? 'تفاصيل المعايير والتضخم الإحصائي' : 'Parameters & Inflation Breakdown'}
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border border-slate-200 dark:border-gray-700 rounded-xl">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 whitespace-nowrap">{isRtl ? 'المعيار' : 'Parameter'}</th>
                      <th className="p-2.5 whitespace-nowrap">{isRtl ? 'القيمة المدخلة' : 'Entered Value'}</th>
                      <th className="p-2.5 whitespace-nowrap">{isRtl ? 'القيمة الإحصائية / الأثر' : 'Formula Quantile / Impact'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60 font-mono text-slate-800 dark:text-gray-200">
                    {res.paramRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold">{row.param}</td>
                        <td className="p-2.5">{row.val}</td>
                        <td className="p-2.5">{row.impact}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 dark:bg-teal-950/20 font-bold">
                      <td className="p-2.5 text-primary dark:text-teal-300">
                        {isRtl ? 'تضخم نسبة الانسحاب' : 'Attrition Inflation'}
                      </td>
                      <td className="p-2.5 text-primary dark:text-teal-300">{res.dropout || dropout}%</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400">
                        +{res.adjTotalN - res.totalN} {isRtl ? 'حالة إضافية' : 'subjects added'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Collapsible Formula & Rationale Section */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700 text-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
                className="w-full p-3 flex items-center justify-between text-left font-bold text-primary dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name="functions" size="sm" className="shrink-0" />
                  <span className="truncate">{isRtl ? 'المعادلة العلمية والمسوغ الرياضي' : 'Scientific Formula & Mathematical Rationale'}</span>
                </div>
                <Icon
                  name="expand_more"
                  size="sm"
                  className={`transition-transform shrink-0 ${isFormulaExpanded ? '' : '-rotate-90'}`}
                />
              </button>
              {isFormulaExpanded && (
                <div className="p-3 pt-0 space-y-2 border-t border-slate-200 dark:border-gray-700/60">
                  <div className="font-mono text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 text-primary dark:text-teal-300 overflow-x-auto">
                    {res.formulaStr}
                  </div>
                  <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-[11px]">
                    {res.whyStr}
                  </p>
                </div>
              )}
            </div>

            {/* Collapsible Citations Section */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700 text-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsRefExpanded(!isRefExpanded)}
                className="w-full p-3 flex items-center justify-between text-left font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name="menu_book" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                  <span className="truncate">{isRtl ? 'الاستشهاد الأكاديمي والمراجع المعتمدة' : 'Academic Literature Citation & Standards'}</span>
                </div>
                <Icon
                  name="expand_more"
                  size="sm"
                  className={`transition-transform shrink-0 ${isRefExpanded ? '' : '-rotate-90'}`}
                />
              </button>
              {isRefExpanded && (
                <div className="p-3 pt-0 space-y-1.5 border-t border-slate-200 dark:border-gray-700/60">
                  <ul className="text-[11px] text-slate-600 dark:text-gray-400 space-y-1 list-disc list-inside font-mono">
                    {res.references.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => alert(isRtl ? 'تم حفظ المعاملات الإحصائية في ملف البروتوكول' : 'Saved parameter to study protocol')}
                className="px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary dark:text-teal-300 font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Icon name="bookmark_add" size="sm" className="shrink-0" />
                <span>{isRtl ? 'حفظ المعيار في بروتوكول الدراسة' : 'Save Parameter to Study Protocol'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Free Trial Modal */}
      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-gray-700 shadow-2xl overflow-hidden p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setModalState(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <Icon name="close" size="md" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center shrink-0">
                <Icon name={modalState === 'trial_available' ? 'workspace_premium' : 'lock'} size="md" />
              </div>
              <div className="space-y-1 flex-1 pr-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {modalState === 'trial_available'
                    ? isRtl ? 'حساب حجم العينة — تتوفر تجربة مجانية' : 'Sample Size Calculation — Free Trial Available'
                    : isRtl ? 'تم استخدام التجربة المجانية' : 'Your Free Trial Has Been Used'}
                </h3>
                <span className={`inline-block text-[10px] font-semibold font-mono px-2.5 py-0.5 rounded-full ${
                  modalState === 'trial_available'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {modalState === 'trial_available'
                    ? isRtl ? 'تجربة متاحة' : 'Available Trial Calculation'
                    : isRtl ? 'تجربة مستنفدة' : 'Trial Used'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
              {modalState === 'trial_available'
                ? isRtl
                  ? 'أنت على وشك استخدام التجربة المجانية المتاحة لحساب حجم العينة والقوة الإحصائية لهذا البروتوكول البحثي.'
                  : 'You are about to use your available Sample Size calculation trial for this research protocol.'
                : isRtl
                  ? 'لقد تم استخدام التجربة المجانية لحاسبة حجم العينة. لمتابعة إجراء الحسابات الإحصائية وحفظ المعايير للبروتوكولات، يرجى الاشتراك في إحدى باقات OSKAR.'
                  : 'Your available free trial for the Sample Size & Power Calculator has already been used. To continue using the calculator, choose a plan that includes this service.'}
            </p>

            {modalState === 'trial_available' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700/60 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'الميزات المتضمنة في النتيجة:' : 'Included with Calculation Result:'}
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                    <span>{isRtl ? 'الحد الأدنى الموصى به لحجم العينة' : 'Recommended minimum sample size (Raw N)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                    <span>{isRtl ? 'الحجم المستهدف المعدل لنسبة الانسحاب' : 'Attrition & dropout-adjusted target N'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                    <span>{isRtl ? 'المعادلة الإحصائية والمسوغ الرياضي' : 'Scientific formula & mathematical rationale'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                    <span>{isRtl ? 'المراجع العلمية والاستشهادات الأكاديمية (ICH E9 / WHO)' : 'Academic literature citations & standards (ICH E9 / WHO)'}</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-primary/5 dark:bg-teal-950/20 border border-primary/20 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Icon name="verified" size="sm" className="text-primary dark:text-teal-400 shrink-0" />
                <span className="font-bold text-primary dark:text-teal-300">
                  {isRtl ? 'تعرفة خدمة حساب حجم العينة والقوة الإحصائية:' : 'Sample Size Calculation Pricing:'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-[11px] text-slate-700 dark:text-gray-300 pt-1 border-t border-primary/10">
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-primary/10 flex items-center justify-between">
                  <span>{isRtl ? 'حساب حجم العينة الأساسي' : 'Basic Sample Size'}</span>
                  <span className="font-bold font-mono text-primary dark:text-teal-300">$20 / calc</span>
                </div>
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-primary/10 flex items-center justify-between">
                  <span>{isRtl ? 'حساب حجم العينة المتقدم' : 'Advanced Sample Size'}</span>
                  <span className="font-bold font-mono text-primary dark:text-teal-300">$35 / calc</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setModalState(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                {modalState === 'trial_available'
                  ? isRtl ? 'إلغاء' : 'Cancel'
                  : isRtl ? 'العودة للحاسبة' : 'Back to Calculator'}
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Icon name={modalState === 'trial_available' ? 'play_arrow' : 'shopping_bag'} size="sm" />
                <span>
                  {modalState === 'trial_available'
                    ? isRtl ? 'المتابعة وإجراء الحساب' : 'Continue Calculation'
                    : isRtl ? 'عرض الباقات والأسعار' : 'View Pricing & Plans'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleSizePage;
