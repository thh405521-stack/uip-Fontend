import Icon from '../components/Icon';
import AuthClock from '../components/AuthClock';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, useTranslations } from '../context/LanguageContext';
import i18nCommon from '../i18n/common';
import i18nPage from '../i18n/layouts/auth-layout';

const translations = { ...i18nCommon, ...i18nPage };

/**
 * Shared shell for every unauthenticated screen (login, register,
 * forgot/reset password, two-factor, verify/confirm-email, select-role) —
 * ported from auth_layout_open()/auth_layout_close() in
 * app/Views/layouts/auth-layout.php (see src/styles/css/pages/auth.css for
 * where the classes come from). Renders the split brand panel + form card,
 * `error`/`success` render the same `.auth-alert` PHP's auth_flash() shows.
 * Includes the live clock (AuthClock) and the ar/en language switch, both
 * ported 1:1 from the PHP topbar. `title`/`subtitle` are passed in already
 * translated by the calling page (each auth page owns its own strings);
 * everything rendered directly in this file runs through its own dict
 * (i18n/layouts/auth-layout.js) so it doesn't go stale when the switch
 * above is clicked.
 */
export default function AuthLayout({ title, subtitle, error, success, children }) {
  const t = useTranslations(translations);
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useLanguage();
  const isAr = locale === 'ar';

  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <div className="auth-brand-panel__glow auth-brand-panel__glow--1" />
        <div className="auth-brand-panel__glow auth-brand-panel__glow--2" />
        <div className="auth-brand-panel__dots" />

        <div className="auth-brand-panel__content">
          <div className="auth-brand-panel__logo">
            <img src="/images/logo/uip-mark.png" alt="UIP" />
            <div>
              <div className="auth-brand-panel__logo-name">UIP</div>
              <span className="auth-brand-panel__logo-tag">UNIVERSITY INNOVATION PLATFORM</span>
            </div>
          </div>

          <h2 className="auth-brand-panel__headline">
            {t('Where graduation projects meet real opportunity')}
          </h2>
          <p className="auth-brand-panel__sub">
            {t('A national platform connecting students, universities, companies, researchers, and investors around university innovation — with AI-assisted evaluation and discovery.')}
          </p>

          <ul className="auth-brand-feature-list">
            <li>
              <span className="auth-brand-feature-icon"><Icon name="sparkles" size={18} /></span>
              <div>
                <strong>{t('AI-powered project evaluation')}</strong>
                <span>{t('Readiness scores and smart insights for every project submitted.')}</span>
              </div>
            </li>
            <li>
              <span className="auth-brand-feature-icon"><Icon name="building" size={18} /></span>
              <div>
                <strong>{t('Verified university network')}</strong>
                <span>{t('Direct access to accredited universities, companies, and investors.')}</span>
              </div>
            </li>
            <li>
              <span className="auth-brand-feature-icon"><Icon name="shield" size={18} /></span>
              <div>
                <strong>{t('Enterprise-grade security')}</strong>
                <span>{t('Two-factor auth, audit logs, and file encryption protect every account.')}</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="auth-brand-panel__footer">
          <Icon name="lock" size={14} />
          <span>{t('Your data is encrypted and protected under industry-standard security practices.')}</span>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-panel__topbar">
          <div className="auth-mobile-brand">
            <img src="/images/logo/uip-mark.png" alt="UIP" />
            <span>UIP</span>
          </div>
          <AuthClock />
          <div className="auth-topbar__actions">
            <button
              type="button"
              className="auth-icon-btn"
              onClick={toggleLocale}
              title={isAr ? 'English' : 'العربية'}
            >
              <Icon name="globe" size={15} />
              <span className="label">{isAr ? 'EN' : 'AR'}</span>
            </button>
            <button
              type="button"
              className="auth-icon-btn"
              onClick={toggleTheme}
              aria-label={t('Toggle dark / light mode')}
              title={t('Toggle dark / light mode')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
            </button>
          </div>
        </div>

        <div className="auth-form-panel__scroll">
          <div className="auth-card">
            {title && <h1 className="text-h2">{title}</h1>}
            {subtitle && (
              <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                {subtitle}
              </p>
            )}

            {error && (
              <div className="auth-alert auth-alert--error">
                <Icon name="alert-triangle" size={16} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="auth-alert auth-alert--success">
                <Icon name="check-circle" size={16} />
                <span>{success}</span>
              </div>
            )}

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
