/**
 * Sidebar/topbar nav config — trimmed down from the full UIP platform's
 * navConfig.js to just the Data Analysis Portal (data_analyst role), since
 * this standalone build only ships the Login screen + Data Analysis
 * Dashboard. Same shape as the original (getNavConfig/ROLE_LABELS/
 * SECTION_TITLES/portalPrefix) so Sidebar.jsx, Topbar.jsx, and
 * BottomNav.jsx work unmodified.
 */

const RAW_CONFIGS = {
  data_analyst: {
    main: [
      { key: 'dashboard', en: 'Dashboard', ar: 'لوحة التحكم', icon: 'dashboard', route: '/data-analysis/dashboard', built: true },
    ],
  },
  admin: {
    main: [
      { key: 'dashboard', en: 'Dashboard', ar: 'لوحة التحكم', icon: 'dashboard', route: '/data-analysis/dashboard', built: true },
    ],
  },
};

export function getNavConfig(role) {
  return RAW_CONFIGS[role] || RAW_CONFIGS.data_analyst;
}

export const ROLE_LABELS = {
  data_analyst: { en: 'Data Analysis Portal', ar: 'بوابة تحليل البيانات' },
  admin: { en: 'Data Analysis Portal', ar: 'بوابة تحليل البيانات' },
};

export const SECTION_TITLES = {
  main: { en: 'Workspace', ar: 'مساحة العمل' },
};

// Mirrors config('roles.portal_prefixes') on the backend — data_analyst's
// portal lives at /data-analysis/*, not /data_analyst/*.
const PORTAL_PREFIX_OVERRIDES = {
  data_analyst: 'data-analysis',
};

export function portalPrefix(role) {
  return PORTAL_PREFIX_OVERRIDES[role] || role || 'data-analysis';
}
