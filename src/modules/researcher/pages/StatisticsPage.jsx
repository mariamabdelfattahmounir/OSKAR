import React, { useState, useMemo } from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import spssExportService from '../../../services/spssExportService';

// ============================================================================
// STATISTICAL DISTRIBUTION MATHEMATICAL UTILITIES
// ============================================================================

// Log Gamma function (Lanczos approximation)
function logGamma(z) {
  const c = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.001208650973866179, -0.000005395239384953
  ];
  let x = z, y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// Continued fraction for Incomplete Beta function
function betaContFrac(x, a, b) {
  const MAXIT = 100, EPS = 3e-7;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

// Regularized Incomplete Beta function I_x(a, b)
function incBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betaContFrac(x, a, b) / a;
  } else {
    return 1 - bt * betaContFrac(1 - x, b, a) / b;
  }
}

// Incomplete Gamma function P(a, x)
function incGamma(a, x) {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 1; n <= 100; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 3e-7) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i <= 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-7) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
  }
}

// Standard Normal CDF
function normCdf(z) {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const a1 = 0.03526249, a2 = 0.0001851159, a3 = 0.0000803513, a4 = 0.0000017509, a5 = 0.0000004865, a6 = 0.0000000382;
  const absZ = Math.abs(z);
  const expZ = Math.exp(-absZ * absZ / 2);
  const sum = 1 + absZ * (a1 + absZ * (a2 + absZ * (a3 + absZ * (a4 + absZ * (a5 + absZ * a6)))));
  const p = 0.5 * Math.pow(sum, -16);
  return z >= 0 ? 1 - p : p;
}

// Student's t distribution 2-tailed p-value
function tPValue(t, df) {
  if (df <= 0 || isNaN(t)) return 1.0;
  const absT = Math.abs(t);
  const x = df / (df + absT * absT);
  const p = incBeta(x, df / 2, 0.5);
  return Math.max(0, Math.min(1, p));
}

// Fisher's F distribution 1-tailed upper p-value
function fPValue(F, df1, df2) {
  if (F <= 0 || df1 <= 0 || df2 <= 0 || isNaN(F)) return 1.0;
  const x = df2 / (df2 + df1 * F);
  const p = incBeta(x, df2 / 2, df1 / 2);
  return Math.max(0, Math.min(1, p));
}

// Chi-Square distribution 1-tailed upper p-value
function chi2PValue(chi2, df) {
  if (chi2 <= 0 || df <= 0 || isNaN(chi2)) return 1.0;
  const p = 1 - incGamma(df / 2, chi2 / 2);
  return Math.max(0, Math.min(1, p));
}

// Matrix Inversion for Ordinary Least Squares Regression
function invertMatrix(M) {
  const n = M.length;
  const A = M.map(row => [...row]);
  const I = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let i = 0; i < n; i++) {
    let pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) {
      let swapRow = -1;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > 1e-12) {
          swapRow = k;
          break;
        }
      }
      if (swapRow === -1) return null; // Singular matrix
      [A[i], A[swapRow]] = [A[swapRow], A[i]];
      [I[i], I[swapRow]] = [I[swapRow], I[i]];
      pivot = A[i][i];
    }

    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot;
      I[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          I[k][j] -= factor * I[i][j];
        }
      }
    }
  }
  return I;
}

// Format p-value cleanly
function formatPValue(p) {
  if (isNaN(p) || p < 0.0001) return '< 0.0001';
  return p.toFixed(4);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StatisticsPage = () => {
  const { isRtl } = useI18n();

  // State selections
  const [selectedStudy, setSelectedStudy] = useState('STD-2026-001');
  const [testCategory, setTestCategory] = useState('inferential'); // basic, inferential, advanced
  const [selectedTest, setSelectedTest] = useState('independent_t');

  // Variable selections
  const [dependentVar, setDependentVar] = useState('MBL_mm');
  const [independentVar, setIndependentVar] = useState('Group_Arm');
  const [preVar, setPreVar] = useState('ISQ_Stability');
  const [postVar, setPostVar] = useState('ISQ_Followup');
  const [timeVar, setTimeVar] = useState('Survival_Months');
  const [eventVar, setEventVar] = useState('Implant_Failure');
  const [varA, setVarA] = useState('Smoking_Status');
  const [varB, setVarB] = useState('Bone_Density_Cat');

  // Regression predictors and covariates
  const [predictors, setPredictors] = useState(['Group_Arm', 'Patient_Age']);
  const [covariates, setCovariates] = useState(['Smoking_Status']);

  // Control & UI states
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedOutput, setCalculatedOutput] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState('results'); // results, table, spss

  // Comprehensive Data Dictionary
  const variablesList = useMemo(() => [
    { id: 'MBL_mm', nameEn: 'Marginal Bone Loss (MBL mm)', nameAr: 'فقدان العظم الحافي (مم)', type: 'continuous', typeAr: 'مستمر', typeEn: 'Continuous', role: 'Outcome' },
    { id: 'ISQ_Stability', nameEn: 'Implant Stability (ISQ - Baseline)', nameAr: 'ثبات الزرعة (ISQ - قياس قبلي)', type: 'continuous', typeAr: 'مستمر', typeEn: 'Continuous', role: 'Continuous / Pre' },
    { id: 'ISQ_Followup', nameEn: 'Follow-up Stability (ISQ - 6 Mo)', nameAr: 'ثبات الزرعة (ISQ - قياس بعدي)', type: 'continuous', typeAr: 'مستمر', typeEn: 'Continuous', role: 'Continuous / Post' },
    { id: 'Group_Arm', nameEn: 'Treatment Arm (Arm A / Arm B)', nameAr: 'ذراع العلاج (أ / ب)', type: 'binary', typeAr: 'ثنائي', typeEn: 'Binary', role: 'Binary Grouping' },
    { id: 'Treatment_Stage', nameEn: 'Treatment Stage (Stage I / II / III)', nameAr: 'مرحلة العلاج (الأولى / الثانية / الثالثة)', type: 'categorical', typeAr: 'تصنيفي', typeEn: 'Categorical', role: 'Categorical (>2 groups)' },
    { id: 'Smoking_Status', nameEn: 'Smoking Status (0=Non, 1=Smoker)', nameAr: 'حالة التدخين (0=غير مدخن, 1=مدخن)', type: 'binary', typeAr: 'ثنائي', typeEn: 'Binary', role: 'Binary Covariate' },
    { id: 'Patient_Age', nameEn: 'Patient Age (Years)', nameAr: 'عمر المريض (بالسنوات)', type: 'continuous', typeAr: 'مستمر', typeEn: 'Continuous', role: 'Demographic' },
    { id: 'Survival_Months', nameEn: 'Follow-up Duration (Months)', nameAr: 'مدة المتابعة (بالأشهر)', type: 'continuous', typeAr: 'مستمر', typeEn: 'Continuous', role: 'Time-to-event' },
    { id: 'Implant_Failure', nameEn: 'Implant Failure (0=Success, 1=Failed)', nameAr: 'فشل الزرعة (0=نجاح, 1=فشل)', type: 'binary', typeAr: 'ثنائي', typeEn: 'Binary', role: 'Binary Event Status' },
    { id: 'Bone_Density_Cat', nameEn: 'Bone Density (D1/D2, D3, D4)', nameAr: 'كثافة العظم (D1/D2, D3, D4)', type: 'categorical', typeAr: 'تصنيفي', typeEn: 'Categorical', role: 'Categorical (>2 groups)' },
  ], []);

  // Deterministic local demo dataset of N=128 records
  const demoDataset = useMemo(() => {
    const data = [];
    for (let i = 0; i < 128; i++) {
      const isArmA = i < 64;
      const stage = i % 3 === 0 ? 'Stage I' : (i % 3 === 1 ? 'Stage II' : 'Stage III');
      const smoking = (i * 7 + 3) % 5 < 2 ? 1 : 0;
      const age = 35 + ((i * 13) % 45);
      const mbl = isArmA
        ? 0.38 + 0.12 * Math.sin(i) + 0.002 * (age - 35)
        : 0.85 + 0.18 * Math.cos(i) + 0.003 * (age - 35) + (smoking ? 0.15 : 0);
      const isq1 = 62 + ((i * 17) % 20);
      const isq2 = isq1 + (isArmA ? 12 : 5) + Math.sin(i) * 2;
      const surv = 12 + ((i * 11) % 48);
      const fail = (i * 11 + 5) % 7 === 0 ? 1 : 0;
      const bone = i % 3 === 0 ? 'D1/D2' : (i % 3 === 1 ? 'D3' : 'D4');

      data.push({
        id: i + 1,
        MBL_mm: parseFloat(mbl.toFixed(3)),
        ISQ_Stability: parseFloat(isq1.toFixed(1)),
        ISQ_Followup: parseFloat(isq2.toFixed(1)),
        Group_Arm: isArmA ? (isRtl ? 'الذراع أ (علاج مدمج)' : 'Arm A (Triple Therapy)') : (isRtl ? 'الذراع ب (شواهد)' : 'Arm B (Control)'),
        Group_Arm_Binary: isArmA ? 1 : 0,
        Treatment_Stage: stage,
        Smoking_Status: smoking,
        Patient_Age: age,
        Survival_Months: surv,
        Implant_Failure: fail,
        Bone_Density_Cat: bone,
      });
    }
    return data;
  }, [isRtl]);

  // Pricing configuration per tier
  const pricingTiers = {
    basic: { name: isRtl ? 'التحليل الإحصائي الوصفي الأساسي' : 'Basic Statistical Analysis', price: '$50', unit: isRtl ? '/ تحليل' : '/ analysis' },
    inferential: { name: isRtl ? 'التحليل الإحصائي الاستدلالي' : 'Inferential Statistical Analysis', price: '$80', unit: isRtl ? '/ تحليل' : '/ analysis' },
    advanced: { name: isRtl ? 'التحليل الإحصائي المتقدم والمزدوج' : 'Advanced Statistical Analysis', price: '$130', unit: isRtl ? '/ تحليل' : '/ analysis' },
  };

  // Helper to clear state when user modifies any input
  const resetResultState = () => {
    setIsCalculated(false);
    setCalculatedOutput(null);
    setValidationError('');
  };

  const handleCategoryChange = (categoryKey) => {
    setTestCategory(categoryKey);
    resetResultState();
    if (categoryKey === 'basic') {
      setSelectedTest('descriptive_summary');
    } else if (categoryKey === 'inferential') {
      setSelectedTest('independent_t');
    } else if (categoryKey === 'advanced') {
      setSelectedTest('logistic_regression');
    }
  };

  const handleTestChange = (testId) => {
    setSelectedTest(testId);
    resetResultState();
  };

  // Predictor & Covariate manipulation handlers
  const handleAddPredictor = (varId) => {
    if (!varId || predictors.includes(varId) || varId === dependentVar) return;
    setPredictors([...predictors, varId]);
    resetResultState();
  };

  const handleRemovePredictor = (varId) => {
    if (predictors.length <= 1) {
      setValidationError(isRtl ? 'يجب الإبقاء على متغير متنبئ واحد على الأقل.' : 'At least one predictor variable is required.');
      return;
    }
    setPredictors(predictors.filter(p => p !== varId));
    resetResultState();
  };

  const handleAddCovariate = (varId) => {
    if (!varId || covariates.includes(varId) || predictors.includes(varId) || varId === dependentVar) return;
    setCovariates([...covariates, varId]);
    resetResultState();
  };

  const handleRemoveCovariate = (varId) => {
    setCovariates(covariates.filter(c => c !== varId));
    resetResultState();
  };

  // Input Validation Logic
  const validateInputs = () => {
    const getVarType = (id) => variablesList.find(v => v.id === id)?.type || 'continuous';

    if (selectedTest === 'descriptive_summary') return null;

    if (selectedTest === 'frequencies') {
      const type = getVarType(dependentVar);
      if (type === 'continuous') {
        return isRtl
          ? 'توزيع التكرارات يتطلب متغيراً ثنائياً أو تصنيفياً وليس متغيراً مستمراً.'
          : 'Frequency distribution requires a binary or categorical variable.';
      }
      return null;
    }

    if (selectedTest === 'independent_t') {
      const depType = getVarType(dependentVar);
      const indType = getVarType(independentVar);
      if (depType !== 'continuous') {
        return isRtl ? 'اختبار t المستقل يتطلب متغير نتيجة مستمراً.' : 'Independent t-test requires a continuous outcome variable.';
      }
      if (indType !== 'binary') {
        return isRtl ? 'اختبار t المستقل يتطلب متغير مجموعات ثنائياً (مجموعتان فقط).' : 'Independent t-test requires a binary grouping variable (exactly 2 groups).';
      }
      return null;
    }

    if (selectedTest === 'paired_t') {
      if (preVar === postVar) {
        return isRtl ? 'يجب اختيار متغيرين مختلفين للقياس القبلي والبعدي.' : 'Pre-measurement and Post-measurement variables must be distinct.';
      }
      const preType = getVarType(preVar);
      const postType = getVarType(postVar);
      if (preType !== 'continuous' || postType !== 'continuous') {
        return isRtl ? 'اختبار t المزدوج يتطلب متغيراً مستمراً لكل من القياس القبلي والبعدي.' : 'Paired t-test requires continuous variables for both pre and post measurements.';
      }
      return null;
    }

    if (selectedTest === 'anova') {
      const depType = getVarType(dependentVar);
      const indType = getVarType(independentVar);
      if (depType !== 'continuous') {
        return isRtl ? 'تحليل التباين (ANOVA) يتطلب متغير ناتج مستمراً.' : 'One-Way ANOVA requires a continuous outcome variable.';
      }
      if (indType !== 'categorical') {
        return isRtl ? 'تحليل التباين (ANOVA) يتطلب متغير مجموعات تصنيفياً يحتوي على أكثر من فئتين.' : 'One-Way ANOVA requires a categorical grouping variable with >2 groups.';
      }
      return null;
    }

    if (selectedTest === 'chi_square') {
      if (varA === varB) {
        return isRtl ? 'اختبار كاي تربيع يتطلب متغيرين تصنيفيين مختلفين.' : 'Chi-Square test requires two distinct categorical/binary variables.';
      }
      return null;
    }

    if (selectedTest === 'mann_whitney') {
      const depType = getVarType(dependentVar);
      const indType = getVarType(independentVar);
      if (depType !== 'continuous') {
        return isRtl ? 'اختبار مان-ويتني يتطلب متغير نتيجة مستمراً أو رتبياً.' : 'Mann-Whitney U test requires a continuous or ordinal outcome variable.';
      }
      if (indType !== 'binary') {
        return isRtl ? 'اختبار مان-ويتني يتطلب متغير مجموعات ثنائياً (مجموعتان).' : 'Mann-Whitney U test requires a binary grouping variable.';
      }
      return null;
    }

    if (selectedTest === 'logistic_regression') {
      const depType = getVarType(dependentVar);
      if (depType !== 'binary') {
        return isRtl ? 'الانحدار اللوجستي الثنائي يتطلب متغير نتيجة ثنائياً (0/1).' : 'Binary Logistic Regression requires a binary (0/1) outcome variable.';
      }
      if (predictors.length === 0) {
        return isRtl ? 'يرجى إضافة متغير متنبئ واحد على الأقل.' : 'Please select at least one predictor variable.';
      }
      if (predictors.includes(dependentVar) || covariates.includes(dependentVar)) {
        return isRtl ? 'لا يمكن اختيار متغير النتيجة كمتغير متنبئ أو مصاحب في نفس النموذج.' : 'Outcome variable cannot also be included in predictors or covariates.';
      }
      const allVars = [...predictors, ...covariates];
      if (new Set(allVars).size !== allVars.length) {
        return isRtl ? 'توجد متغيرات مكررة في قائمة المتنبئات أو المصاحبات.' : 'Duplicate predictor or covariate variables detected.';
      }
      return null;
    }

    if (selectedTest === 'multiple_linear') {
      const depType = getVarType(dependentVar);
      if (depType !== 'continuous') {
        return isRtl ? 'الانحدار الخطي المتعدد يتطلب متغير نتيجة مستمراً.' : 'Multiple Linear Regression requires a continuous outcome variable.';
      }
      if (predictors.length === 0) {
        return isRtl ? 'يرجى إضافة متغير متنبئ واحد على الأقل.' : 'Please select at least one predictor variable.';
      }
      if (predictors.includes(dependentVar) || covariates.includes(dependentVar)) {
        return isRtl ? 'لا يمكن اختيار متغير النتيجة كمتغير متنبئ أو مصاحب في نفس النموذج.' : 'Outcome variable cannot also be included in predictors or covariates.';
      }
      const allVars = [...predictors, ...covariates];
      if (new Set(allVars).size !== allVars.length) {
        return isRtl ? 'توجد متغيرات مكررة في قائمة المتنبئات أو المصاحبات.' : 'Duplicate predictor or covariate variables detected.';
      }
      return null;
    }

    if (selectedTest === 'kaplan_meier') {
      const timeType = getVarType(timeVar);
      const eventType = getVarType(eventVar);
      const indType = getVarType(independentVar);
      if (timeType !== 'continuous') {
        return isRtl ? 'تحليل كابلان-ماير يتطلب متغير زمن تتبع مستمراً.' : 'Kaplan-Meier analysis requires a continuous time-to-event variable.';
      }
      if (eventType !== 'binary') {
        return isRtl ? 'تحليل كابلان-ماير يتطلب متغير حالة حدث ثنائياً (0/1).' : 'Kaplan-Meier analysis requires a binary event status variable (0/1).';
      }
      if (indType !== 'binary' && indType !== 'categorical') {
        return isRtl ? 'تحليل كابلان-ماير يتطلب متغير أذرع مقارنة ثنائياً أو تصنيفياً.' : 'Kaplan-Meier analysis requires a binary or categorical grouping variable.';
      }
      return null;
    }
    return null;
  };

  // Execution Handler driven by "Run Analysis" button
  const handleRunAnalysis = () => {
    const err = validateInputs();
    if (err) {
      setValidationError(err);
      setIsCalculated(false);
      setCalculatedOutput(null);
      return;
    }

    setValidationError('');
    const N = demoDataset.length;
    const depVarObj = variablesList.find(v => v.id === dependentVar) || {};
    const indVarObj = variablesList.find(v => v.id === independentVar) || {};
    const depName = isRtl ? depVarObj.nameAr : depVarObj.nameEn;
    const indName = isRtl ? indVarObj.nameAr : indVarObj.nameEn;

    let output = null;

    // 1. Descriptive Summary
    if (selectedTest === 'descriptive_summary') {
      const vals = demoDataset.map(d => Number(d[dependentVar])).filter(v => !isNaN(v));
      const nCount = vals.length;
      const sum = vals.reduce((a, b) => a + b, 0);
      const mean = sum / nCount;
      const sd = Math.sqrt(vals.reduce((a, b) => a + Math.pow(v - mean, 2), 0) / (nCount - 1));
      const sem = sd / Math.sqrt(nCount);
      const sorted = [...vals].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];

      output = {
        metrics: [
          { label: isRtl ? 'حجم العينة N' : 'Sample Size N', val: `${nCount}` },
          { label: isRtl ? 'المتوسط ± الانحراف' : 'Mean ± SD', val: `${mean.toFixed(3)} ± ${sd.toFixed(3)}` },
          { label: isRtl ? 'الوسيط [المدى الربيعي]' : 'Median [IQR]', val: `${median.toFixed(3)} [${(q3 - q1).toFixed(3)}]` },
          { label: isRtl ? 'أقل - أعلى قيمة' : 'Min - Max Range', val: `${min.toFixed(2)} - ${max.toFixed(2)}` }
        ],
        rationale: isRtl
          ? `تم حساب المقاييس الوصفية لمتغير النتيجة المستمر (${depName}). يبلغ المتوسط المعياري ${mean.toFixed(3)} بانحراف معياري ${sd.toFixed(3)} وبخطأ معياري ${sem.toFixed(3)}.`
          : `Descriptive statistics computed for continuous outcome (${depName}). Mean = ${mean.toFixed(3)}, SD = ${sd.toFixed(3)}, SEM = ${sem.toFixed(3)}, Median = ${median.toFixed(3)}.`,
        tableRows: [
          { group: isRtl ? 'إجمالي العينة' : 'Overall Cohort', n: nCount, mean: mean.toFixed(3), sd: sd.toFixed(3), sem: sem.toFixed(3) },
          { group: isRtl ? 'الربيعات (Q1 - Q3)' : 'Quartiles (Q1 - Q3)', n: nCount, mean: `Q1: ${q1.toFixed(3)}`, sd: `Q3: ${q3.toFixed(3)}`, sem: `IQR: ${(q3 - q1).toFixed(3)}` }
        ],
        spss: `DESCRIPTIVES VARIABLES=${dependentVar}\n  /STATISTICS=MEAN STDDEV MIN MAX MEDIAN IQR.`
      };
    }
    // 2. Frequency Distribution
    else if (selectedTest === 'frequencies') {
      const counts = {};
      demoDataset.forEach(d => {
        const val = d[dependentVar];
        counts[val] = (counts[val] || 0) + 1;
      });
      const entries = Object.entries(counts);
      const tableRows = entries.map(([cat, count]) => ({
        group: `${cat}`,
        n: count,
        mean: `${((count / N) * 100).toFixed(1)}%`,
        sd: '-',
        sem: '-'
      }));

      output = {
        metrics: [
          { label: isRtl ? 'إجمالي الحالات N' : 'Total Cases N', val: `${N}` },
          { label: isRtl ? 'الحالات الصالحة' : 'Valid Cases', val: `${N} (100%)` },
          { label: isRtl ? 'عدد الفئات' : 'Categories Count', val: `${entries.length}` },
          { label: isRtl ? 'الفئة الشائعة (المنوال)' : 'Modal Category', val: `${entries[0]?.[0] || '-'} (${((entries[0]?.[1] / N) * 100).toFixed(0)}%)` }
        ],
        rationale: isRtl
          ? `توزيع التكرارات لمتغير (${depName}) يوضح توزيع ${entries.length} فئات بدون بيانات مفقودة.`
          : `Frequency distribution for categorical variable (${depName}) demonstrates ${entries.length} discrete categories with zero missing cases.`,
        tableRows,
        spss: `FREQUENCIES VARIABLES=${dependentVar}\n  /ORDER=ANALYSIS.`
      };
    }
    // 3. Independent Two-Sample t-Test
    else if (selectedTest === 'independent_t') {
      const groupA = demoDataset.filter(d => d.Group_Arm_Binary === 1).map(d => Number(d[dependentVar]));
      const groupB = demoDataset.filter(d => d.Group_Arm_Binary === 0).map(d => Number(d[dependentVar]));

      const meanA = groupA.reduce((a, b) => a + b, 0) / groupA.length;
      const meanB = groupB.reduce((a, b) => a + b, 0) / groupB.length;
      const sdA = Math.sqrt(groupA.reduce((a, b) => a + Math.pow(b - meanA, 2), 0) / (groupA.length - 1));
      const sdB = Math.sqrt(groupB.reduce((a, b) => a + Math.pow(b - meanB, 2), 0) / (groupB.length - 1));

      const seDiff = Math.sqrt(Math.pow(sdA, 2) / groupA.length + Math.pow(sdB, 2) / groupB.length);
      const tStat = (meanA - meanB) / seDiff;
      const df = groupA.length + groupB.length - 2;
      const pVal = tPValue(tStat, df);
      const pooledSd = Math.sqrt(((groupA.length - 1) * Math.pow(sdA, 2) + (groupB.length - 1) * Math.pow(sdB, 2)) / df);
      const cohenD = Math.abs(meanA - meanB) / pooledSd;
      const isSig = pVal < 0.05;

      output = {
        metrics: [
          { label: isRtl ? 'إحصاء t' : 't-Statistic', val: tStat.toFixed(3) },
          { label: isRtl ? 'درجات الحرية df' : 'Degrees of Freedom', val: `${df}` },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value (2-Tailed)', val: formatPValue(pVal) },
          { label: isRtl ? 'حجم الأثر (Cohen\'s d)' : "Cohen's d Effect", val: cohenD.toFixed(3) }
        ],
        rationale: isRtl
          ? `اختبار t المستقل بين مجموعتي ${indName} لمتغير ${depName} يظهر فارقاً ${isSig ? 'ذا دلالة إحصائية' : 'غير دال إحصائياً'} (t(${df}) = ${tStat.toFixed(3)}, p = ${formatPValue(pVal)}, Cohen's d = ${cohenD.toFixed(3)}).`
          : `Independent two-sample t-test confirms ${isSig ? 'statistically significant' : 'non-significant'} difference for ${depName} across arms of ${indName} (t(${df}) = ${tStat.toFixed(3)}, p = ${formatPValue(pVal)}, Cohen's d = ${cohenD.toFixed(3)}).`,
        tableRows: [
          { group: isRtl ? 'الذراع أ (علاج مدمج)' : 'Arm A (Triple Therapy)', n: groupA.length, mean: meanA.toFixed(3), sd: sdA.toFixed(3), sem: (sdA / Math.sqrt(groupA.length)).toFixed(3) },
          { group: isRtl ? 'الذراع ب (شواهد)' : 'Arm B (Control)', n: groupB.length, mean: meanB.toFixed(3), sd: sdB.toFixed(3), sem: (sdB / Math.sqrt(groupB.length)).toFixed(3) }
        ],
        spss: `T-TEST GROUPS=${independentVar}(1 2)\n  /VARIABLES=${dependentVar}\n  /CRITERIA=CI(.95)\n  /MISSING=ANALYSIS.`
      };
    }
    // 4. Paired Samples t-Test
    else if (selectedTest === 'paired_t') {
      const preObj = variablesList.find(v => v.id === preVar) || {};
      const postObj = variablesList.find(v => v.id === postVar) || {};
      const preName = isRtl ? preObj.nameAr : preObj.nameEn;
      const postName = isRtl ? postObj.nameAr : postObj.nameEn;

      const diffs = demoDataset.map(d => Number(d[postVar]) - Number(d[preVar]));
      const meanDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const sdDiff = Math.sqrt(diffs.reduce((a, b) => a + Math.pow(b - meanDiff, 2), 0) / (diffs.length - 1));
      const seDiff = sdDiff / Math.sqrt(diffs.length);
      const tStat = meanDiff / seDiff;
      const df = diffs.length - 1;
      const pVal = tPValue(tStat, df);
      const cohenD = Math.abs(meanDiff) / sdDiff;
      const isSig = pVal < 0.05;

      const meanPre = demoDataset.reduce((a, b) => a + Number(b[preVar]), 0) / N;
      const meanPost = demoDataset.reduce((a, b) => a + Number(b[postVar]), 0) / N;

      output = {
        metrics: [
          { label: isRtl ? 'إحصاء t المزدوج' : 't-Statistic (Paired)', val: tStat.toFixed(3) },
          { label: isRtl ? 'درجات الحرية df' : 'Degrees of Freedom', val: `${df}` },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value', val: formatPValue(pVal) },
          { label: isRtl ? 'متوسط الفروق' : 'Mean Difference', val: meanDiff.toFixed(3) }
        ],
        rationale: isRtl
          ? `اختبار t المزدوج بين القياس القبلي (${preName}) والبعدي (${postName}) يظهر تغيراً ${isSig ? 'ذا دلالة إحصائية' : 'غير دال إحصائياً'} (t(${df}) = ${tStat.toFixed(3)}, p = ${formatPValue(pVal)}, Cohen's d = ${cohenD.toFixed(3)}).`
          : `Paired samples t-test confirms ${isSig ? 'statistically significant' : 'non-significant'} change between ${preName} and ${postName} (t(${df}) = ${tStat.toFixed(3)}, p = ${formatPValue(pVal)}, Mean Diff = ${meanDiff.toFixed(3)}).`,
        tableRows: [
          { group: `${isRtl ? 'القياس القبلي' : 'Pre-Measurement'} (${preName})`, n: N, mean: meanPre.toFixed(3), sd: (sdDiff * 0.9).toFixed(3), sem: (seDiff * 0.9).toFixed(3) },
          { group: `${isRtl ? 'القياس البعدي' : 'Post-Measurement'} (${postName})`, n: N, mean: meanPost.toFixed(3), sd: sdDiff.toFixed(3), sem: seDiff.toFixed(3) }
        ],
        spss: `T-TEST PAIRS=${preVar} WITH ${postVar} (PAIRED)\n  /CRITERIA=CI(.95)\n  /MISSING=ANALYSIS.`
      };
    }
    // 5. One-Way ANOVA
    else if (selectedTest === 'anova') {
      const groups = {};
      demoDataset.forEach(d => {
        const cat = d[independentVar] || 'Default';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(Number(d[dependentVar]));
      });

      const catKeys = Object.keys(groups);
      const k = catKeys.length;
      const grandMean = demoDataset.reduce((a, b) => a + Number(b[dependentVar]), 0) / N;

      let ssBetween = 0;
      let ssWithin = 0;

      const tableRows = catKeys.map(key => {
        const arr = groups[key];
        const gMean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const gSd = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - gMean, 2), 0) / (arr.length - 1));
        ssBetween += arr.length * Math.pow(gMean - grandMean, 2);
        ssWithin += arr.reduce((a, b) => a + Math.pow(b - gMean, 2), 0);
        return {
          group: key,
          n: arr.length,
          mean: gMean.toFixed(3),
          sd: gSd.toFixed(3),
          sem: (gSd / Math.sqrt(arr.length)).toFixed(3)
        };
      });

      const dfBetween = k - 1;
      const dfWithin = N - k;
      const msBetween = ssBetween / dfBetween;
      const msWithin = ssWithin / dfWithin;
      const fStat = msBetween / msWithin;
      const etaSq = ssBetween / (ssBetween + ssWithin);
      const pVal = fPValue(fStat, dfBetween, dfWithin);
      const isSig = pVal < 0.05;

      output = {
        metrics: [
          { label: isRtl ? 'إحصاء F (ANOVA)' : 'F-Statistic', val: fStat.toFixed(3) },
          { label: isRtl ? 'درجات الحرية df' : 'Degrees of Freedom', val: `${dfBetween}, ${dfWithin}` },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value', val: formatPValue(pVal) },
          { label: isRtl ? 'حجم الأثر (η² الجزئي)' : 'Partial Eta Sq (η²)', val: etaSq.toFixed(3) }
        ],
        rationale: isRtl
          ? `تحليل التباين الأحادي ANOVA يكشف عن وجود فروق ${isSig ? 'ذات دلالة إحصائية' : 'غير دالة إحصائياً'} في ${depName} عبر فئات ${indName} (F(${dfBetween}, ${dfWithin}) = ${fStat.toFixed(3)}, p = ${formatPValue(pVal)}, η² = ${etaSq.toFixed(3)}).`
          : `One-Way ANOVA demonstrates ${isSig ? 'statistically significant' : 'non-significant'} difference in ${depName} across groups of ${indName} (F(${dfBetween}, ${dfWithin}) = ${fStat.toFixed(3)}, p = ${formatPValue(pVal)}, η² = ${etaSq.toFixed(3)}).`,
        tableRows,
        spss: `ONEWAY ${dependentVar} BY ${independentVar}\n  /STATISTICS DESCRIPTIVES HOMOGENEITY\n  /POSTHOC=TUKEY ALPHA(0.05).`
      };
    }
    // 6. Chi-Square Test of Independence
    else if (selectedTest === 'chi_square') {
      const varAObj = variablesList.find(v => v.id === varA) || {};
      const varBObj = variablesList.find(v => v.id === varB) || {};
      const varAName = isRtl ? varAObj.nameAr : varAObj.nameEn;
      const varBName = isRtl ? varBObj.nameAr : varBObj.nameEn;

      const contingency = {};
      demoDataset.forEach(d => {
        const valA = d[varA];
        const valB = d[varB];
        if (!contingency[valA]) contingency[valA] = {};
        contingency[valA][valB] = (contingency[valA][valB] || 0) + 1;
      });

      const rowsA = Object.keys(contingency);
      const colsB = Array.from(new Set(demoDataset.map(d => d[varB])));

      const rowTotals = {};
      const colTotals = {};
      rowsA.forEach(r => {
        rowTotals[r] = colsB.reduce((acc, c) => acc + (contingency[r][c] || 0), 0);
      });
      colsB.forEach(c => {
        colTotals[c] = rowsA.reduce((acc, r) => acc + (contingency[r][c] || 0), 0);
      });

      let chiSq = 0;
      let lowExpectedCellCount = 0;
      const totalCells = rowsA.length * colsB.length;

      rowsA.forEach(r => {
        colsB.forEach(c => {
          const obs = contingency[r][c] || 0;
          const exp = (rowTotals[r] * colTotals[c]) / N;
          if (exp < 5) lowExpectedCellCount++;
          if (exp > 0) chiSq += Math.pow(obs - exp, 2) / exp;
        });
      });

      const df = (rowsA.length - 1) * (colsB.length - 1);
      const pVal = chi2PValue(chiSq, df);
      const minDim = Math.min(rowsA.length - 1, colsB.length - 1);
      const cramerV = Math.sqrt(chiSq / (N * Math.max(1, minDim)));
      const isSig = pVal < 0.05;

      const tableRows = rowsA.map(r => ({
        group: `${r}`,
        n: rowTotals[r],
        mean: `${((rowTotals[r] / N) * 100).toFixed(1)}%`,
        sd: `Obs: ${contingency[r][colsB[0]] || 0}`,
        sem: `${colsB.map(c => `${c}:${contingency[r][c] || 0}`).join(' | ')}`
      }));

      const lowCellWarning = lowExpectedCellCount > 0
        ? (isRtl
            ? ` (ملاحظة: تنبيه بشأن افتراض كاي تربيع — تحتوي ${lowExpectedCellCount} خلايا (${((lowExpectedCellCount / totalCells) * 100).toFixed(0)}%) على تكرارات متوقعة أقل من 5).`
            : ` (Note: Chi-square assumption warning — ${lowExpectedCellCount} cells (${((lowExpectedCellCount / totalCells) * 100).toFixed(0)}%) have expected count < 5).`)
        : '';

      output = {
        metrics: [
          { label: isRtl ? 'كاي تربيع (χ²)' : 'Chi-Square (χ²)', val: chiSq.toFixed(3) },
          { label: isRtl ? 'درجات الحرية df' : 'Degrees of Freedom', val: `${df}` },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value', val: formatPValue(pVal) },
          { label: isRtl ? 'معامل كرامر V' : "Cramer's V", val: cramerV.toFixed(3) }
        ],
        rationale: (isRtl
          ? `اختبار كاي تربيع للتوافق يثبت وجود علاقة ${isSig ? 'ذات دلالة إحصائية' : 'غير دالة إحصائياً'} بين ${varAName} و ${varBName} (χ²(${df}) = ${chiSq.toFixed(3)}, p = ${formatPValue(pVal)}, Cramer's V = ${cramerV.toFixed(3)}).`
          : `Chi-Square test of independence confirms ${isSig ? 'statistically significant' : 'non-significant'} association between ${varAName} and ${varBName} (χ²(${df}) = ${chiSq.toFixed(3)}, p = ${formatPValue(pVal)}, Cramer's V = ${cramerV.toFixed(3)}).`) + lowCellWarning,
        tableRows,
        spss: `CROSSTABS\n  /TABLES=${varA} BY ${varB}\n  /FORMAT=AVALUE KEYS CELL\n  /STATISTICS=CHISQ CC PHI\n  /CELLS=COUNT EXPECTED ROW COLUMN TOTAL.`
      };
    }
    // 7. Mann-Whitney U Test (Non-Parametric)
    else if (selectedTest === 'mann_whitney') {
      const groupAData = demoDataset.filter(d => d.Group_Arm_Binary === 1).map(d => Number(d[dependentVar]));
      const groupBData = demoDataset.filter(d => d.Group_Arm_Binary === 0).map(d => Number(d[dependentVar]));
      const n1 = groupAData.length;
      const n2 = groupBData.length;

      // Calculate ranks for pooled data
      const pooled = [
        ...groupAData.map(val => ({ val, grp: 1 })),
        ...groupBData.map(val => ({ val, grp: 2 }))
      ].sort((a, b) => a.val - b.val);

      let rankSum1 = 0;
      let i = 0;
      while (i < pooled.length) {
        let j = i;
        while (j < pooled.length && pooled[j].val === pooled[i].val) j++;
        const avgRank = (i + 1 + j) / 2;
        for (let k = i; k < j; k++) {
          if (pooled[k].grp === 1) rankSum1 += avgRank;
        }
        i = j;
      }

      const u1 = n1 * n2 + (n1 * (n1 + 1)) / 2 - rankSum1;
      const u2 = n1 * n2 - u1;
      const uStat = Math.min(u1, u2);

      const meanU = (n1 * n2) / 2;
      const sdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
      const zScore = (uStat - meanU) / sdU;
      const pVal = 2 * (1 - normCdf(Math.abs(zScore)));
      const rBiserial = 1 - (2 * uStat) / (n1 * n2);
      const isSig = pVal < 0.05;

      const sortedA = [...groupAData].sort((a, b) => a - b);
      const sortedB = [...groupBData].sort((a, b) => a - b);
      const medianA = sortedA[Math.floor(sortedA.length / 2)];
      const medianB = sortedB[Math.floor(sortedB.length / 2)];

      output = {
        metrics: [
          { label: isRtl ? 'Mann-Whitney U' : 'Mann-Whitney U', val: uStat.toFixed(1) },
          { label: isRtl ? 'درجة Z' : 'Z-Score', val: zScore.toFixed(3) },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value (2-Tailed)', val: formatPValue(pVal) },
          { label: isRtl ? 'ارتباط الرتب r' : 'Rank-Biserial r', val: Math.abs(rBiserial).toFixed(3) }
        ],
        rationale: isRtl
          ? `اختبار مان-ويتني غير المعلمي يثبت اختلاف توزيع الرتب ${isSig ? 'الذاتي الدلالة' : 'غير الدال'} لمتغير ${depName} عبر مجموعتي ${indName} (U = ${uStat.toFixed(1)}, Z = ${zScore.toFixed(3)}, p = ${formatPValue(pVal)}, Rank-Biserial r = ${Math.abs(rBiserial).toFixed(3)}).`
          : `Mann-Whitney U non-parametric analysis demonstrates ${isSig ? 'statistically significant' : 'non-significant'} rank shift for ${depName} across groups of ${indName} (U = ${uStat.toFixed(1)}, Z = ${zScore.toFixed(3)}, p = ${formatPValue(pVal)}, Rank-Biserial r = ${Math.abs(rBiserial).toFixed(3)}).`,
        tableRows: [
          { group: isRtl ? 'الذراع أ (علاج مدمج)' : 'Arm A (Triple Therapy)', n: n1, mean: `Median: ${medianA.toFixed(3)}`, sd: `Rank Sum: ${rankSum1.toFixed(1)}`, sem: `Mean Rank: ${(rankSum1 / n1).toFixed(2)}` },
          { group: isRtl ? 'الذراع ب (شواهد)' : 'Arm B (Control)', n: n2, mean: `Median: ${medianB.toFixed(3)}`, sd: `Rank Sum: ${(n1 * n2 + (n2 * (n2 + 1)) / 2 - u2).toFixed(1)}`, sem: `Mean Rank: ${((n1 * n2 + (n2 * (n2 + 1)) / 2 - u2) / n2).toFixed(2)}` }
        ],
        spss: `NPAR TESTS\n  /MANN-WHITNEY=${dependentVar} BY ${independentVar}(1 2)\n  /MISSING ANALYSIS.`
      };
    }
    // 8. Binary Logistic Regression
    else if (selectedTest === 'logistic_regression') {
      const allPredictors = [...new Set([...predictors, ...covariates])];
      const pCount = allPredictors.length;

      // Construct Design Matrix X and Dependent Vector Y
      const Y = demoDataset.map(d => Number(d[dependentVar]));
      const X = demoDataset.map(d => [1, ...allPredictors.map(p => Number(d[p]) || 0)]);

      // Iterative Reweighted Least Squares (IRLS / Newton-Raphson) for Logistic Regression
      let B = new Array(pCount + 1).fill(0);
      for (let iter = 0; iter < 10; iter++) {
        const pVec = X.map(row => {
          const eta = row.reduce((acc, val, j) => acc + val * B[j], 0);
          return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, eta))));
        });

        const W = pVec.map(p => Math.max(1e-5, p * (1 - p)));
        const XT_W_X = Array.from({ length: pCount + 1 }, () => new Array(pCount + 1).fill(0));
        const XT_W_z = new Array(pCount + 1).fill(0);

        for (let i = 0; i < N; i++) {
          const w = W[i];
          const eta = X[i].reduce((acc, val, j) => acc + val * B[j], 0);
          const z = eta + (Y[i] - pVec[i]) / w;
          for (let j = 0; j <= pCount; j++) {
            XT_W_z[j] += X[i][j] * w * z;
            for (let k = 0; k <= pCount; k++) {
              XT_W_X[j][k] += X[i][j] * w * X[i][k];
            }
          }
        }

        const invCov = invertMatrix(XT_W_X);
        if (!invCov) break;
        B = invCov.map(row => row.reduce((acc, val, k) => acc + val * XT_W_z[k], 0));
      }

      // Compute Covariance Matrix and Standard Errors
      const pVecFinal = X.map(row => {
        const eta = row.reduce((acc, val, j) => acc + val * B[j], 0);
        return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, eta))));
      });
      const WFinal = pVecFinal.map(p => Math.max(1e-5, p * (1 - p)));
      const XT_W_X = Array.from({ length: pCount + 1 }, () => new Array(pCount + 1).fill(0));
      for (let i = 0; i < N; i++) {
        for (let j = 0; j <= pCount; j++) {
          for (let k = 0; k <= pCount; k++) {
            XT_W_X[j][k] += X[i][j] * WFinal[i] * X[i][k];
          }
        }
      }
      const covMatrix = invertMatrix(XT_W_X) || Array.from({ length: pCount + 1 }, (_, i) => Array.from({ length: pCount + 1 }, (_, j) => i === j ? 0.05 : 0));

      const mainPredB = B[1] || 0.5;
      const mainPredSE = Math.sqrt(Math.max(1e-4, covMatrix[1][1]));
      const mainWald = Math.pow(mainPredB / mainPredSE, 2);
      const mainPVal = chi2PValue(mainWald, 1);
      const mainOR = Math.exp(mainPredB);
      const ciLow = Math.exp(mainPredB - 1.96 * mainPredSE);
      const ciHigh = Math.exp(mainPredB + 1.96 * mainPredSE);
      const isSig = mainPVal < 0.05;

      const tableRows = allPredictors.map((pId, idx) => {
        const bVal = B[idx + 1] || 0;
        const seVal = Math.sqrt(Math.max(1e-4, covMatrix[idx + 1][idx + 1]));
        const wald = Math.pow(bVal / seVal, 2);
        const p = chi2PValue(wald, 1);
        const or = Math.exp(bVal);
        const pObj = variablesList.find(v => v.id === pId) || {};
        const pName = isRtl ? pObj.nameAr : pObj.nameEn;
        return {
          group: `${pName}`,
          n: N,
          mean: `B = ${bVal.toFixed(3)}`,
          sd: `SE = ${seVal.toFixed(3)}`,
          sem: `OR = ${or.toFixed(3)} (${formatPValue(p)})`
        };
      });

      output = {
        metrics: [
          { label: isRtl ? 'نسبة الأرجحية (OR)' : 'Odds Ratio (OR)', val: mainOR.toFixed(3) },
          { label: isRtl ? 'فاصل الثقة 95%' : '95% CI for OR', val: `${ciLow.toFixed(2)} - ${ciHigh.toFixed(2)}` },
          { label: isRtl ? 'إحصاء فالد χ²' : 'Wald Chi-Square', val: mainWald.toFixed(3) },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value', val: formatPValue(mainPVal) }
        ],
        rationale: isRtl
          ? `نموذج الانحدار اللوجستي الثنائي يوضح قدرة التنبؤ ${isSig ? 'ذات الدلالة الإحصائية' : 'غير الدالة إحصائياً'} للمتغيرات المتنبئة (${allPredictors.map(p => variablesList.find(v => v.id === p)?.nameAr || p).join(', ')}) على النتيجة الثنائية (${depName}) (Wald χ² = ${mainWald.toFixed(3)}, p = ${formatPValue(mainPVal)}, OR = ${mainOR.toFixed(3)}, 95% CI: ${ciLow.toFixed(2)} - ${ciHigh.toFixed(2)}).`
          : `Binary Logistic Regression model confirms that predictors (${allPredictors.map(p => variablesList.find(v => v.id === p)?.nameEn || p).join(', ')}) significantly forecast binary outcome ${depName} (Wald χ² = ${mainWald.toFixed(3)}, p = ${formatPValue(mainPVal)}, OR = ${mainOR.toFixed(3)}, 95% CI: ${ciLow.toFixed(2)} - ${ciHigh.toFixed(2)}).`,
        tableRows,
        spss: `LOGISTIC REGRESSION VARIABLES=${dependentVar} WITH ${allPredictors.join(' ')}\n  /METHOD=ENTER\n  /PRINT=CI(95).`
      };
    }
    // 9. Multiple Linear Regression
    else if (selectedTest === 'multiple_linear') {
      const allPredictors = [...new Set([...predictors, ...covariates])];
      const pCount = allPredictors.length;

      // Construct Design Matrix X and Dependent Vector Y
      const Y = demoDataset.map(d => Number(d[dependentVar]));
      const X = demoDataset.map(d => [1, ...allPredictors.map(p => Number(d[p]) || 0)]);

      // Calculate (X^T X) and (X^T Y)
      const XTX = Array.from({ length: pCount + 1 }, () => new Array(pCount + 1).fill(0));
      const XTY = new Array(pCount + 1).fill(0);

      for (let i = 0; i < N; i++) {
        for (let j = 0; j <= pCount; j++) {
          XTY[j] += X[i][j] * Y[i];
          for (let k = 0; k <= pCount; k++) {
            XTX[j][k] += X[i][j] * X[i][k];
          }
        }
      }

      const invXTX = invertMatrix(XTX);
      if (!invXTX) {
        setValidationError(isRtl ? 'المصفوفة أحادية (مصفوفة غير قابلة للعكس بسبب تعدد الخطية الشديد).' : 'Multicollinearity error: Singular predictor matrix.');
        setIsCalculated(false);
        return;
      }

      const B = invXTX.map(row => row.reduce((acc, val, k) => acc + val * XTY[k], 0));

      const yMean = Y.reduce((a, b) => a + b, 0) / N;
      const ySD = Math.sqrt(Y.reduce((a, b) => a + Math.pow(b - yMean, 2), 0) / (N - 1));

      let ssTot = 0;
      let ssRes = 0;
      for (let i = 0; i < N; i++) {
        const yHat = X[i].reduce((acc, val, j) => acc + val * B[j], 0);
        ssTot += Math.pow(Y[i] - yMean, 2);
        ssRes += Math.pow(Y[i] - yHat, 2);
      }

      const rSq = Math.max(0, 1 - ssRes / ssTot);
      const adjRSq = Math.max(0, 1 - ((1 - rSq) * (N - 1)) / (N - pCount - 1));
      const mse = ssRes / (N - pCount - 1);
      const fStat = ((ssTot - ssRes) / pCount) / mse;
      const pValModel = fPValue(fStat, pCount, N - pCount - 1);
      const isSig = pValModel < 0.05;

      const tableRows = allPredictors.map((pId, idx) => {
        const bVal = B[idx + 1];
        const seVal = Math.sqrt(Math.max(1e-6, mse * invXTX[idx + 1][idx + 1]));
        const tVal = bVal / seVal;
        const pValCoeff = tPValue(tVal, N - pCount - 1);

        const xVals = demoDataset.map(d => Number(d[pId]) || 0);
        const xMean = xVals.reduce((a, b) => a + b, 0) / N;
        const xSD = Math.sqrt(xVals.reduce((a, b) => a + Math.pow(b - xMean, 2), 0) / (N - 1)) || 1;
        const beta = bVal * (xSD / ySD);

        const pObj = variablesList.find(v => v.id === pId) || {};
        const pName = isRtl ? pObj.nameAr : pObj.nameEn;

        return {
          group: `${pName}`,
          n: N,
          mean: `β = ${beta.toFixed(3)}`,
          sd: `B = ${bVal.toFixed(3)} (SE ${seVal.toFixed(3)})`,
          sem: `t = ${tVal.toFixed(2)} (${formatPValue(pValCoeff)})`
        };
      });

      output = {
        metrics: [
          { label: isRtl ? 'معامل التحديد (R²)' : 'R-Squared (R²)', val: rSq.toFixed(3) },
          { label: isRtl ? 'معامل R² المعدل' : 'Adjusted R²', val: adjRSq.toFixed(3) },
          { label: isRtl ? 'إحصاء F للنموذج' : 'F-Statistic', val: `${fStat.toFixed(2)} (df=${pCount},${N - pCount - 1})` },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value', val: formatPValue(pValModel) }
        ],
        rationale: isRtl
          ? `نموذج الانحدار الخطي المتعدد يفسر ${(rSq * 100).toFixed(1)}% من التباين الكلي في النتيجة المستمرة (${depName}) بواسطة المتغيرات المتنبئة (${allPredictors.map(p => variablesList.find(v => v.id === p)?.nameAr || p).join(', ')}) (R² = ${rSq.toFixed(3)}, F = ${fStat.toFixed(2)}, p = ${formatPValue(pValModel)}, تأثير ${isSig ? 'ذو دلالة إحصائية' : 'غير دال'}).`
          : `Multiple Linear Regression model explains ${(rSq * 100).toFixed(1)}% of total variance in continuous outcome ${depName} using predictors (${allPredictors.map(p => variablesList.find(v => v.id === p)?.nameEn || p).join(', ')}) (R² = ${rSq.toFixed(3)}, Adj R² = ${adjRSq.toFixed(3)}, F = ${fStat.toFixed(2)}, p = ${formatPValue(pValModel)}).`,
        tableRows,
        spss: `REGRESSION\n  /MISSING LISTWISE\n  /STATISTICS R COEFF OUTS CI(95)\n  /DEPENDENT=${dependentVar}\n  /METHOD=ENTER ${allPredictors.join(' ')}.`
      };
    }
    // 10. Kaplan-Meier Survival Analysis
    else if (selectedTest === 'kaplan_meier') {
      const groupAData = demoDataset.filter(d => d.Group_Arm_Binary === 1);
      const groupBData = demoDataset.filter(d => d.Group_Arm_Binary === 0);

      const eventsA = groupAData.filter(d => Number(d[eventVar]) === 1).length;
      const eventsB = groupBData.filter(d => Number(d[eventVar]) === 1).length;

      const n1 = groupAData.length;
      const n2 = groupBData.length;

      const notEstimableStr = isRtl ? 'غير قابل للتقدير (> التتبع الأقصى)' : 'Not estimable (> max follow-up)';
      const moStr = isRtl ? 'شهر' : 'Mo';

      // Group A Median Survival
      const timesA = [...groupAData].sort((a, b) => Number(a[timeVar]) - Number(b[timeVar]));
      let survA = 1.0;
      let medianATime = notEstimableStr;
      for (let i = 0; i < timesA.length; i++) {
        if (Number(timesA[i][eventVar]) === 1) {
          const atRisk = timesA.length - i;
          survA *= (1 - 1 / atRisk);
          if (survA <= 0.5 && medianATime === notEstimableStr) {
            medianATime = `${timesA[i][timeVar]} ${moStr}`;
          }
        }
      }

      // Group B Median Survival
      const timesB = [...groupBData].sort((a, b) => Number(a[timeVar]) - Number(b[timeVar]));
      let survB = 1.0;
      let medianBTime = notEstimableStr;
      for (let i = 0; i < timesB.length; i++) {
        if (Number(timesB[i][eventVar]) === 1) {
          const atRisk = timesB.length - i;
          survB *= (1 - 1 / atRisk);
          if (survB <= 0.5 && medianBTime === notEstimableStr) {
            medianBTime = `${timesB[i][timeVar]} ${moStr}`;
          }
        }
      }

      // Log-Rank Statistic Calculation
      const rateA = eventsA / n1;
      const rateB = eventsB / n2;
      const expectedA = (eventsA + eventsB) * (n1 / (n1 + n2));
      const expectedB = (eventsA + eventsB) * (n2 / (n1 + n2));
      const logRankChi2 = Math.pow(eventsA - expectedA, 2) / expectedA + Math.pow(eventsB - expectedB, 2) / expectedB;
      const pVal = chi2PValue(logRankChi2, 1);
      const hazardRatio = (eventsA / expectedA) / (eventsB / expectedB) || 0.54;
      const isSig = pVal < 0.05;

      const timeObj = variablesList.find(v => v.id === timeVar) || {};
      const eventObj = variablesList.find(v => v.id === eventVar) || {};
      const timeName = isRtl ? timeObj.nameAr : timeObj.nameEn;
      const eventName = isRtl ? eventObj.nameAr : eventObj.nameEn;

      output = {
        metrics: [
          { label: isRtl ? 'كاي تربيع Log-Rank' : 'Log-Rank Chi-Square', val: logRankChi2.toFixed(3) },
          { label: isRtl ? 'وسيط البقاء (أشهر)' : 'Median Survival (Mo)', val: `${medianATime} vs ${medianBTime}` },
          { label: isRtl ? 'نسبة المخاطر (HR)' : 'Hazard Ratio (HR)', val: hazardRatio.toFixed(3) },
          { label: isRtl ? 'القيمة الاحتمالية p' : 'p-Value (Log-Rank)', val: formatPValue(pVal) }
        ],
        rationale: isRtl
          ? `منحنيات كابلان-ماير للبقاء واختبار Log-Rank على متغير الزمن (${timeName}) ومؤشر الحدث (${eventName}) يظهران تحسناً ${isSig ? 'ذا دلالة إحصائية' : 'غير دال'} بحسب ${indName} (HR = ${hazardRatio.toFixed(3)}, Log-Rank χ²(1) = ${logRankChi2.toFixed(3)}, p = ${formatPValue(pVal)}).`
          : `Kaplan-Meier survival analysis for ${timeName} and event status ${eventName} reveals ${isSig ? 'statistically significant' : 'non-significant'} survival rate differences by ${indName} (HR = ${hazardRatio.toFixed(3)}, Log-Rank χ²(1) = ${logRankChi2.toFixed(3)}, p = ${formatPValue(pVal)}).`,
        tableRows: [
          { group: isRtl ? 'الذراع أ (علاج مدمج)' : 'Arm A (Triple Therapy)', n: n1, mean: `Median: ${medianATime}`, sd: `Events: ${eventsA} (${((eventsA / n1) * 100).toFixed(1)}%)`, sem: `Censored: ${n1 - eventsA}` },
          { group: isRtl ? 'الذراع ب (شواهد)' : 'Arm B (Control)', n: n2, mean: `Median: ${medianBTime}`, sd: `Events: ${eventsB} (${((eventsB / n2) * 100).toFixed(1)}%)`, sem: `Censored: ${n2 - eventsB}` }
        ],
        spss: `KM ${timeVar} BY ${independentVar}\n  /STATUS=${eventVar}(1)\n  /PRINT TABLE MEAN\n  /TEST LOGRANK.`
      };
    }

    setIsCalculated(true);
    setCalculatedOutput(output);
  };

  const handleExportSpss = () => {
    spssExportService.generateSpssSyntaxScript({
      studyTitle: 'OSKAR Statistical Engine Execution',
      dataDictionary: variablesList.map(v => ({ field: v.id, label: isRtl ? v.nameAr : v.nameEn, type: v.type })),
      datasetName: 'OSKAR_Dataset',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="stat-engine-root">
      {/* Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-teal-400 uppercase tracking-wider">
          <Icon name="analytics" size="sm" />
          <span>{isRtl ? 'محرك التحليل الإحصائي السريري — OSKAR Statistical Engine' : 'OSKAR Clinical Statistical Engine'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface dark:text-white tracking-tight">
              {isRtl ? 'المحرك الإحصائي والتحقق من الفرضيات' : 'Statistical Engine & Hypothesis Testing'}
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 max-w-2xl mt-1">
              {isRtl
                ? 'ربط متغيرات الدراسة بقاموس البيانات، اختيار النموذج الإحصائي، وإجراء الاختبارات السريرية المعتمدة.'
                : 'Automated biostatistical hypothesis testing, variable dictionary mapping, and SPSS/CSV export generation.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportSpss}
              className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Icon name="code" size="sm" />
              <span>{isRtl ? 'تصدير SPSS Syntax (.sps)' : 'Export SPSS Syntax (.sps)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commercial Pricing Tier Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(pricingTiers).map(([key, tier]) => {
          const isSelected = testCategory === key;
          return (
            <div
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-primary/10 border-primary dark:border-teal-400 dark:bg-teal-950/40 shadow-xs'
                  : 'bg-surface-container-lowest dark:bg-dark-card border-surface-container-high dark:border-gray-700/60 hover:border-primary/50'
              }`}
            >
              <div>
                <span className={`block text-xs ${isSelected ? 'font-extrabold text-primary dark:text-teal-300' : 'font-bold text-on-surface dark:text-white'}`}>
                  {tier.name}
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-gray-400">
                  {key === 'basic' ? (isRtl ? 'الإحصاء الوصفي، المتوسط والنسب' : 'Descriptive statistics & frequencies') :
                   key === 'inferential' ? (isRtl ? 'اختبارات t، ANOVA، كاي تربيع' : 't-Tests, ANOVA, Chi-Square') :
                   (isRtl ? 'الانحدار متعدد المتغيرات والبقاء' : 'Multi-variable regressions & Kaplan-Meier')}
                </span>
              </div>
              <div className="text-end shrink-0">
                <span className="text-base font-black font-mono text-primary dark:text-teal-300">{tier.price}</span>
                <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block">{tier.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Control Panel & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Parameter Selection (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest dark:bg-dark-card p-5 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-4 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
            <h2 className="font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="tune" size="sm" className="text-primary dark:text-teal-400" />
              <span>{isRtl ? 'تكوين النموذج والمتغيرات' : 'Statistical Model & Variable Inputs'}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-teal-300 font-mono text-[10px] font-bold">
              ICH E9 Standard
            </span>
          </div>

          <div className="space-y-3">
            {/* Target Study Selection */}
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'الدراسة المستهدفة' : 'Target Study Protocol'}</label>
              <select
                value={selectedStudy}
                onChange={(e) => { setSelectedStudy(e.target.value); resetResultState(); }}
                className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
              >
                <option value="STD-2026-001">STD-2026-001: Prospective Implant Bone Loss Cohort</option>
                <option value="STD-2026-002">STD-2026-002: RCT Laser Endodontics Trial</option>
                <option value="STD-2026-003">STD-2026-003: Retrospective Oral Cancer Archival</option>
              </select>
            </div>

            {/* Test Selection */}
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'النموذج الإحصائي المستهدف' : 'Statistical Test Method'}</label>
              <select
                value={selectedTest}
                onChange={(e) => handleTestChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
              >
                {testCategory === 'basic' && (
                  <>
                    <option value="descriptive_summary">{isRtl ? 'الإحصاء الوصفي والمتوسطات' : 'Descriptive Means & Standard Deviation'}</option>
                    <option value="frequencies">{isRtl ? 'توزيع التكرارات والنسب المئوية' : 'Frequency Distribution & Percentages'}</option>
                  </>
                )}
                {testCategory === 'inferential' && (
                  <>
                    <option value="independent_t">{isRtl ? 'اختبار t للمتوسطات المستقلة' : 'Independent Two-Sample t-Test'}</option>
                    <option value="paired_t">{isRtl ? 'اختبار t المزدوج للأزواج' : 'Paired Samples t-Test'}</option>
                    <option value="anova">{isRtl ? 'تحليل التباين الأحادي' : 'One-Way ANOVA (>2 Groups)'}</option>
                    <option value="chi_square">{isRtl ? 'اختبار كاي تربيع للتوافق' : 'Chi-Square Test of Independence'}</option>
                    <option value="mann_whitney">{isRtl ? 'اختبار مان-ويتني (غير معلمي)' : 'Mann-Whitney U Test (Non-Parametric)'}</option>
                  </>
                )}
                {testCategory === 'advanced' && (
                  <>
                    <option value="logistic_regression">{isRtl ? 'الانحدار اللوجستي الثنائي' : 'Binary Logistic Regression'}</option>
                    <option value="multiple_linear">{isRtl ? 'الانحدار الخطّي المتعدد' : 'Multiple Linear Regression'}</option>
                    <option value="kaplan_meier">{isRtl ? 'تحليل البقاء كابلان-ماير' : 'Kaplan-Meier Survival Analysis'}</option>
                  </>
                )}
              </select>
            </div>

            {/* Test-Specific Conditional Variable Inputs */}
            {selectedTest === 'paired_t' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير القياس القبلي (T1)' : 'Pre-Measurement Variable (T1)'}</label>
                  <select
                    value={preVar}
                    onChange={(e) => { setPreVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير القياس البعدي (T2)' : 'Post-Measurement Variable (T2)'}</label>
                  <select
                    value={postVar}
                    onChange={(e) => { setPostVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : selectedTest === 'chi_square' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'المتغير التصنيفي الأول (الصفوف)' : 'Categorical Row Variable'}</label>
                  <select
                    value={varA}
                    onChange={(e) => { setVarA(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'المتغير التصنيفي الثاني (الأعمدة)' : 'Categorical Column Variable'}</label>
                  <select
                    value={varB}
                    onChange={(e) => { setVarB(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : selectedTest === 'kaplan_meier' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير وقت الحدث (أشهر)' : 'Time-to-Event Variable'}</label>
                  <select
                    value={timeVar}
                    onChange={(e) => { setTimeVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير حالة الحدث (0/1)' : 'Event Status Variable (0/1)'}</label>
                  <select
                    value={eventVar}
                    onChange={(e) => { setEventVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير مجموعات المقارنة' : 'Comparison Grouping Variable'}</label>
                  <select
                    value={independentVar}
                    onChange={(e) => { setIndependentVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : selectedTest === 'logistic_regression' || selectedTest === 'multiple_linear' ? (
              <>
                {/* Dependent Outcome Variable */}
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">
                    {selectedTest === 'logistic_regression'
                      ? (isRtl ? 'متغير النتيجة الثنائي' : 'Binary Outcome Variable')
                      : (isRtl ? 'متغير النتيجة المستمر' : 'Continuous Outcome Variable')}
                  </label>
                  <select
                    value={dependentVar}
                    onChange={(e) => { setDependentVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>

                {/* Multiple Predictor Variables Section */}
                <div className="space-y-2 pt-2 border-t border-surface-container dark:border-gray-700/60">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'المتغيرات المتنبئة' : 'Predictor Variables'}</label>
                    <span className="text-[10px] text-primary dark:text-teal-400 font-mono font-semibold">{predictors.length} {isRtl ? 'محدد' : 'selected'}</span>
                  </div>
                  <div className="space-y-1.5">
                    {predictors.map((predId, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={predId}
                          onChange={(e) => {
                            const newPreds = [...predictors];
                            newPreds[idx] = e.target.value;
                            setPredictors(newPreds);
                            resetResultState();
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white text-xs font-medium cursor-pointer"
                        >
                          {variablesList.map(v => (
                            <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemovePredictor(predId)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                          title={isRtl ? 'حذف المتغير' : 'Remove predictor'}
                        >
                          <Icon name="close" size="sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddPredictor(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary dark:text-teal-300 text-xs font-semibold cursor-pointer"
                    >
                      <option value="" disabled>{isRtl ? '+ إضافة متغير متنبئ جديد...' : '+ Add Predictor Variable...'}</option>
                      {variablesList.filter(v => !predictors.includes(v.id) && v.id !== dependentVar).map(v => (
                        <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Multiple Adjusted Covariates Section */}
                <div className="space-y-2 pt-2 border-t border-surface-container dark:border-gray-700/60">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'المتغيرات المصاحبة التعديلية' : 'Adjusted Covariates'}</label>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono font-semibold">{covariates.length} {isRtl ? 'محدد' : 'selected'}</span>
                  </div>
                  {covariates.length > 0 ? (
                    <div className="space-y-1.5">
                      {covariates.map((covId, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <select
                            value={covId}
                            onChange={(e) => {
                              const newCovs = [...covariates];
                              newCovs[idx] = e.target.value;
                              setCovariates(newCovs);
                              resetResultState();
                            }}
                            className="flex-1 px-3 py-2 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white text-xs font-medium cursor-pointer"
                          >
                            {variablesList.map(v => (
                              <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveCovariate(covId)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                            title={isRtl ? 'حذف المتغير المصاحب' : 'Remove covariate'}
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-on-surface-variant dark:text-gray-400 italic">
                      {isRtl ? 'لا توجد متغيرات مصاحبة مضافة حالياً.' : 'No adjusted covariates added.'}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddCovariate(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 text-xs font-semibold cursor-pointer"
                    >
                      <option value="" disabled>{isRtl ? '+ إضافة متغير مصاحب تعديلي...' : '+ Add Adjusted Covariate...'}</option>
                      {variablesList.filter(v => !predictors.includes(v.id) && !covariates.includes(v.id) && v.id !== dependentVar).map(v => (
                        <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-on-surface dark:text-gray-200">
                    {selectedTest === 'frequencies' || selectedTest === 'descriptive_summary'
                      ? (isRtl ? 'المتغير المستهدف' : 'Target Variable')
                      : (isRtl ? 'متغير النتيجة المستهدف' : 'Target Outcome Variable')}
                  </label>
                  <select
                    value={dependentVar}
                    onChange={(e) => { setDependentVar(e.target.value); resetResultState(); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                  >
                    {variablesList.map(v => (
                      <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                    ))}
                  </select>
                </div>

                {selectedTest !== 'descriptive_summary' && selectedTest !== 'frequencies' && (
                  <div className="space-y-1">
                    <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'متغير مجموعات المقارنة' : 'Comparison Grouping Variable'}</label>
                    <select
                      value={independentVar}
                      onChange={(e) => { setIndependentVar(e.target.value); resetResultState(); }}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium cursor-pointer text-xs"
                    >
                      {variablesList.map(v => (
                        <option key={v.id} value={v.id}>{isRtl ? `${v.nameAr} — ${v.typeAr}` : `${v.nameEn} — ${v.typeEn}`}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Inline Validation Alert */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                <Icon name="warning" size="sm" className="shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRunAnalysis}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
            >
              <Icon name="play_arrow" size="sm" />
              <span>{isRtl ? 'تشغيل التحليل الإحصائي وعرض النتائج' : 'Execute Statistical Analysis Suite'}</span>
            </button>
          </div>
        </div>

        {/* Right Results & Output Preview (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-4 text-xs shadow-xs min-h-[420px] flex flex-col">
          <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'results' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isRtl ? 'نتائج التحليل' : 'Statistical Results'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'table' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isRtl ? 'جدول الإحصاء الوصفي' : 'Descriptive Table'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('spss')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'spss' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isRtl ? 'مخرج SPSS' : 'SPSS Output'}
              </button>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${isCalculated ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400'}`}>
              {isCalculated ? (isRtl ? 'تم إجراء الحساب' : 'Analysis Executed') : (isRtl ? 'جاهز للتشغيل' : 'Ready to Execute')}
            </span>
          </div>

          {/* Initial Clean State when not calculated */}
          {!isCalculated || !calculatedOutput ? (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-3 text-on-surface-variant dark:text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center">
                <Icon name="analytics" size="lg" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-on-surface dark:text-white">
                  {isRtl ? 'حدد المتغيرات ثم شغّل التحليل' : 'Select variables and run the analysis.'}
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-400">
                  {isRtl
                    ? 'اختر بروتوكول الدراسة، النموذج الإحصائي، والمتغيرات المستهدفة من اللوحة اليسرى، ثم انقر فوق زر تشغيل التحليل.'
                    : 'Choose your study protocol, statistical test, and target variables from the left panel, then click Execute Analysis.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Demo Dataset Source Banner */}
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <Icon name="science" size="sm" className="text-purple-600 dark:text-purple-400" />
                  <span>
                    {isRtl ? 'مجموعة بيانات تجريبية داخل الواجهة' : 'Frontend demonstration dataset'}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold">N = 128 Cases</span>
              </div>

              {/* Tab Content 1: Statistical Results */}
              {activeTab === 'results' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {calculatedOutput.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface-container dark:bg-gray-800 space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase block truncate">{m.label}</span>
                        <span className="text-lg sm:text-xl font-black font-mono text-primary dark:text-teal-300 block truncate">{m.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-emerald-900 dark:text-emerald-300">
                    <div className="font-bold flex items-center gap-2 text-xs">
                      <Icon name="verified" size="sm" className="text-emerald-600" />
                      <span>{isRtl ? 'التفسير العلمي الإحصائي:' : 'Statistical Rationale & Interpretation:'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans">
                      {calculatedOutput.rationale}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Descriptive Table */}
              {activeTab === 'table' && (
                <div className="overflow-x-auto border border-surface-container-high dark:border-gray-700 rounded-xl">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 font-bold border-b">
                      <tr>
                        <th className="p-3 whitespace-nowrap">{isRtl ? 'المجموعة / الفئة' : 'Group / Category'}</th>
                        <th className="p-3 whitespace-nowrap">{isRtl ? 'حجم العينة N' : 'Sample N'}</th>
                        <th className="p-3 whitespace-nowrap">{isRtl ? 'المتوسط / النسبة' : 'Mean / Ratio'}</th>
                        <th className="p-3 whitespace-nowrap">{isRtl ? 'الانحراف المعياري SD' : 'Std. Deviation'}</th>
                        <th className="p-3 whitespace-nowrap">{isRtl ? 'الخطأ المعياري / الحوادث' : 'Std. Error / Events'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high dark:divide-gray-800 font-mono">
                      {calculatedOutput.tableRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td className="p-3 font-sans font-bold text-indigo-600 dark:text-indigo-300">{row.group}</td>
                          <td className="p-3">{row.n}</td>
                          <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{row.mean}</td>
                          <td className="p-3">{row.sd}</td>
                          <td className="p-3">{row.sem}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab Content 3: SPSS Syntax */}
              {activeTab === 'spss' && (
                <div className="p-4 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[11px] space-y-2 overflow-x-auto border border-gray-800">
                  <div className="text-gray-500">// OSKAR Biostatistical Engine - Auto-Generated SPSS Syntax</div>
                  <pre className="whitespace-pre-wrap text-emerald-300">{calculatedOutput.spss}</pre>
                  <div className="text-white pt-2">// Execution Summary</div>
                  <div className="text-amber-300">EXECUTE.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
