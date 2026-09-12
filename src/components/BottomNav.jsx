import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { getNavConfig } from '../config/navConfig';
import { useLanguage } from '../context/LanguageContext';

// Trimmed down from the full platform's BottomNav: this standalone build
// only has one nav item (Dashboard), so there's no "More" overflow needed.
export default function BottomNav({ role }) {
  const { locale } = useLanguage();
  const sections = getNavConfig(role);
  const items = Object.values(sections).flat().filter((i) => i.built);

  return (
    <nav className="bottom-nav" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}>
      {items.map((item) => (
        <NavLink
          key={item.key}
          to={item.route}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <Icon name={item.icon} size={21} />
          <span>{item[locale] || item.en}</span>
        </NavLink>
      ))}
    </nav>
  );
}
