import Icon from './Icon';
import Dropdown from './Dropdown';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Trimmed down from the full platform's Topbar: this standalone build has
 * no /api/v1/notifications endpoint and no profile/settings pages, so the
 * notification bell + those dropdown links are dropped. Search box,
 * theme/locale toggles, and the logout menu are kept unmodified.
 */
export default function Topbar({ user, onMenuClick, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useLanguage();
  const initial = (user?.full_name || user?.role || '?').charAt(0).toUpperCase();

  return (
    <header className="topbar glass-panel glass-panel--flat">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button className="topbar__icon-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <Icon name="menu" size={20} />
        </button>
      </div>

      <div className="topbar__actions">
        <button
          type="button"
          className="topbar__icon-btn"
          onClick={toggleLocale}
          aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          title={locale === 'ar' ? 'English' : 'العربية'}
        >
          <Icon name="globe" size={18} />
        </button>

        <button
          type="button"
          className="topbar__icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          aria-pressed={theme === 'dark'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>

        <Dropdown
          trigger={
            <button className="dropdown__item" style={{ width: 'auto', gap: 'var(--space-2)' }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 'var(--text-small)',
                }}
              >
                {initial}
              </span>
              <Icon name="chevron-down" size={14} />
            </button>
          }
        >
          <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <p className="text-small" style={{ margin: 0, fontWeight: 600 }}>{user?.full_name || user?.role}</p>
            {user?.email && <p className="text-caption" style={{ margin: 0 }}>{user.email}</p>}
          </div>
          <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
          <button
            type="button"
            className="dropdown__item"
            style={{ color: 'var(--color-danger)', width: '100%', textAlign: 'start' }}
            onClick={onLogout}
          >
            <Icon name="logout" size={16} /> Log out
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
