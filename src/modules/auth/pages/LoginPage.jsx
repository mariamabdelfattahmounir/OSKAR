import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const LoginPage = () => {
  const { isRtl } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg(isRtl ? 'يرجى إدخال البريد الإلكتروني الأكاديمي.' : 'Please enter your academic email.');
      return;
    }

    const res = login(email);
    if (res.success && res.user) {
      navigate(res.user.defaultRoute);
    } else {
      setErrorMsg(res.error || (isRtl ? 'بيانات البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email address or password.'));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Header & Official Logo Asset (NO typed text duplication) */}
        <div className="text-center space-y-4">
          <img
            src="/assets/logo/Logo_LightMode.png"
            className="oskar-logo-img mx-auto dark:hidden h-12 w-auto object-contain"
            alt="OSKAR Medstat"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
          <img
            src="/assets/logo/Logo_DarkMode.png"
            className="oskar-logo-img mx-auto hidden dark:block h-12 w-auto object-contain"
            alt="OSKAR Medstat"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {isRtl ? 'مرحباً بك مجدداً' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRtl ? 'تسجيل الدخول إلى حسابك في منصة أوسكار للأبحاث السريرية' : 'Sign in to your OSKAR Medstat Research Account'}
          </p>
        </div>

        {/* Error Alert Container */}
        {errorMsg && (
          <div
            id="login-error-msg"
            className="p-4 rounded-xl text-sm font-semibold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/60 transition-all flex items-center gap-2"
          >
            <Icon name="error" size="sm" className="shrink-0" />
            <span id="login-error-text">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form id="oskar-login-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="login-email">
              {isRtl ? 'البريد الإلكتروني الأكاديمي' : 'Academic Email'}
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              placeholder="name@institution.edu"
              required
            />
          </div>

          <div className="form-group space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="login-password">
                {isRtl ? 'كلمة المرور' : 'Password'}
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs font-semibold text-primary hover:underline text-decoration-none"
              >
                {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </a>
            </div>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-lg hover:bg-teal-700 transition-all shadow-md active:scale-[0.99] text-sm cursor-pointer"
          >
            {isRtl ? 'تسجيل الدخول إلى المنصة' : 'Sign In to Platform'}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
          {isRtl ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
          <Link to="/auth/role-selection" className="font-bold text-primary hover:underline text-decoration-none">
            {isRtl ? 'إنشاء حساب' : 'Create Account'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


