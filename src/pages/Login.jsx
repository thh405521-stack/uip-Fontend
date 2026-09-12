import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, ApiError } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import AuthLayout from '../layouts/AuthLayout';
import Icon from '../components/Icon';
import { roleHome } from '../config/roleHome';
import { useTranslations } from '../context/LanguageContext';
import i18nCommon from '../i18n/common';
import i18nPage from '../i18n/auth/login';

const translations = { ...i18nCommon, ...i18nPage };

export default function Login() {
  const t = useTranslations(translations);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  // Register.jsx / ResetPassword.jsx redirect here with a flash message in
  // location.state, same as Session::flash('success', ...) + a web redirect
  // would show via auth_flash() on the PHP side.
  const [success] = useState(location.state?.success ?? null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.requiresTwoFactor) {
        navigate('/auth/two-factor', { state: { csrfToken: result.csrfToken } });
        return;
      }
      navigate(roleHome(result.role));
    } catch (err) {
      setError(err instanceof ApiError ? errorMessage(err) : t('Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title={t('Welcome back')} subtitle={t('Sign in to access your dashboard')} error={error} success={success}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">{t('Email')}</label>
          <div className="input-icon-wrap">
            <span className="input-icon"><Icon name="mail" size={17} /></span>
            <input
              className="form-input has-icon-start"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">{t('Password')}</label>
          <div className="input-icon-wrap">
            <span className="input-icon"><Icon name="lock" size={17} /></span>
            <input
              className="form-input has-icon-start has-icon-end"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="input-icon-end"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t('Hide password') : t('Show password')}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={17} />
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'end', marginBottom: 'var(--space-4)' }}>
          <Link to="/auth/forgot-password" className="text-caption" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {t('Forgot password?')}
          </Link>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? t('Signing in…') : t('Sign in')}
        </button>
      </form>

      <div className="auth-footer-link">
        {t("Don't have an account?")} <Link to="/auth/register">{t('Create one')}</Link>
      </div>
    </AuthLayout>
  );
}
