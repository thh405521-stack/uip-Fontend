import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { getNavConfig, ROLE_LABELS, SECTION_TITLES } from '../config/navConfig';
import { useLanguage } from '../context/LanguageContext';

// Ported from uip_sidebar() in app/Views/layouts/sidebar.php.
export default function Sidebar({ role, isOpen, onClose }) {
  const { locale } = useLanguage();
  const sections = getNavConfig(role);
  const roleLabel = ROLE_LABELS[role]?.[locale] || ROLE_LABELS[role]?.en || 'UIP';

  return (
    <aside className={`sidebar glass-panel glass-panel--flat${isOpen ? ' is-open' : ''}`}>
      <div className="sidebar__brand">
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-on-primary)',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          U
        </span>
        <div className="sidebar__brand-text">
          <div className="text-h3" style={{ lineHeight: 1 }}>{roleLabel}</div>
          <span className="text-caption">UIP</span>
        </div>
        <button type="button" className="sidebar__close-btn" onClick={onClose} aria-label="Close menu">
          <Icon name="x" size={18} />
        </button>
      </div>

      <nav className="sidebar__nav">
        {Object.entries(sections).map(([sectionKey, items]) => (
          <div key={sectionKey}>
            <div className="sidebar__section-title">
              {SECTION_TITLES[sectionKey]?.[locale] || SECTION_TITLES[sectionKey]?.en || sectionKey}
            </div>
            {items.map((item) => (
              <NavLink
                key={item.key}
                to={item.built ? item.route : '#'}
                className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
                onClick={(e) => {
                  if (!item.built) e.preventDefault();
                }}
                aria-disabled={!item.built || undefined}
              >
                <Icon name={item.icon} size={18} />
                <span>{item[locale] || item.en}</span>
                {!item.built && (
                  <span
                    className="badge badge-coming-soon"
                    style={{ marginInlineStart: 'auto', fontSize: 9, padding: '2px 6px' }}
                  >
                    {locale === 'ar' ? 'قريباً' : 'Soon'}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
