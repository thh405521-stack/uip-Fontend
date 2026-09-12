import { useEffect, useState } from 'react';
import { api, errorMessage } from '../../api/client';
import Icon from '../../components/Icon';
import { useTranslations, useLanguage } from '../../context/LanguageContext';
import i18nCommon from '../../i18n/common';
import i18nPage from '../../i18n/data-analysis/dashboard';

const translations = { ...i18nCommon, ...i18nPage };

/**
 * Mirrors app/Views/data-analysis/dashboard.php, talking to the real JSON
 * API (app/Controllers/Api/DataAnalysisDashboardApiController.php,
 * /api/v1/data-analysis/dashboard — new, thin wrapper added alongside this
 * page; reuses DataAnalysisDashboardService::overview()/savedDashboardsFor()/
 * recentExportsFor() exactly as the server-rendered view already does).
 * Same isDataAnalyst() gate (data_analyst OR admin) already enforced
 * server-side.
 *
 * The "Segments" header link (/data-analysis/segments) is now included,
 * matching the PHP view — Data Segments has a real JSON API as of this
 * migration batch (App\Controllers\Api\DataAnalysisSegmentsApiController).
 */

const ROLE_COLORS = ['var(--uip-indigo-600)', 'var(--uip-teal-600)', 'var(--color-accent)', 'var(--uip-coral-600)', 'var(--uip-gold-600)', 'var(--color-primary)'];

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-caption" style={{ margin: 0 }}>{label}</p>
        <p className="text-h2" style={{ margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

export default function DataAnalysisDashboard() {
  const t = useTranslations(translations);
  const { locale } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/v1/data-analysis/dashboard')
      .then((json) => setData(json.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-small">{t('Loading…')}</p>;
  if (error) return <p style={{ color: 'var(--color-danger)' }}>{error}</p>;
  if (!data) return null;

  const kpis = data.kpis || { total_users: 0, new_users_this_month: 0, verified_universities: 0, approval_rate: 0 };
  const userGrowth = data.user_growth || [];
  const usersByRole = data.users_by_role || [];
  const categoryDist = data.category_dist || [];
  const leaderboard = data.leaderboard || [];
  const trends = data.trends || [];
  const universityMap = data.university_map || {};
  const savedDashboards = data.saved_dashboards || [];
  const recentExports = data.recent_exports || [];

  const maxGrowth = userGrowth.length ? Math.max(1, ...userGrowth.map((p) => p.value)) : 1;
  const maxRole = usersByRole.length ? Math.max(1, ...usersByRole.map((p) => p.value)) : 1;
  const maxCat = categoryDist.length ? Math.max(1, ...categoryDist.map((c) => c.value)) : 1;
  const maxUniProjects = leaderboard.length ? Math.max(1, ...leaderboard.map((u) => u.projects)) : 1;

  const label = (obj) => obj?.[locale] || obj?.en || '';

  return (
    <>
      <div className="page-header animate-rise-in">
        <div className="page-header__title">
          <h1 className="text-h1">{t('Data Analysis Dashboard')}</h1>
          <p className="text-small">
            {locale === 'ar'
              ? 'نفس مصدر البيانات الموحّد للمنصة، مع أدوات تصدير وتقسيم مخصّصة للمحلل.'
              : "The platform's single source of truth for metrics, plus analyst-only export and segmentation tools."}
          </p>
        </div>

      </div>

      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard label="Registered Users" value={Number(kpis.total_users || 0).toLocaleString()} icon="users" accent="var(--uip-indigo-600)" />
        <StatCard label="New Users (This Month)" value={kpis.new_users_this_month || 0} icon="trend" accent="var(--uip-teal-600)" />
        <StatCard label="Platform Approval Rate" value={`${kpis.approval_rate || 0}%`} icon="check-circle" accent="var(--uip-gold-600)" />
        <StatCard label="Verified Universities" value={kpis.verified_universities || 0} icon="building" accent="var(--uip-coral-600)" />
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card glass-panel">
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-5)' }}>{t('New User Growth per Month')}</h2>
            {userGrowth.length ? (
              <div className="chart-bars">
                {userGrowth.map((point, i) => {
                  const h = Math.max(6, Math.round((point.value / maxGrowth) * 100));
                  return (
                    <div className="chart-bars__col" key={i}>
                      <span className="text-caption text-mono">{point.value}</span>
                      <div style={{ width: '100%', maxWidth: 36, height: `${h}%`, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', background: 'linear-gradient(180deg, var(--color-primary), var(--color-accent))' }} />
                      <span className="text-caption">{label(point.label)}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-caption">{t('Not enough data yet.')}</p>}
          </div>

          <div className="card glass-panel">
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-5)' }}>{t('Users by Role')}</h2>
            {usersByRole.length ? (
              <div className="chart-bars chart-bars--sm">
                {usersByRole.map((point, i) => {
                  const h = Math.max(6, Math.round((point.value / maxRole) * 100));
                  return (
                    <div className="chart-bars__col" key={i}>
                      <span className="text-caption text-mono">{point.value}</span>
                      <div style={{ width: '100%', maxWidth: 36, height: `${h}%`, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', background: ROLE_COLORS[i % ROLE_COLORS.length] }} />
                      <span className="text-caption">{label(point.label)}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-caption">{t('No users yet.')}</p>}
          </div>

          <div className="card glass-panel">
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-5)' }}>{t('Project Distribution by Category')}</h2>
            {categoryDist.length ? categoryDist.map((c, i) => {
              const pct = Math.round((c.value / maxCat) * 100);
              return (
                <div key={i} style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="text-small">{label(c.label)}</span>
                    <span className="text-caption text-mono">{c.value}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--glass-bg)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-full)', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
                  </div>
                </div>
              );
            }) : <p className="text-caption">{t('No projects yet.')}</p>}
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card glass-panel">
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-4)' }}>{t('Universities Ranked by Project Volume')}</h3>
            {leaderboard.length ? leaderboard.map((u, i) => {
              const pct = Math.round((u.projects / maxUniProjects) * 100);
              return (
                <div key={i} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span className="text-small">{label(u.university)}</span>
                    <span className="text-caption text-mono">{u.projects}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--glass-bg)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-full)', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
                  </div>
                </div>
              );
            }) : <p className="text-caption">{t('No projects submitted yet.')}</p>}
          </div>

          <div className="card glass-panel">
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-1)' }}>{t('Growth Trends (30 days)')}</h3>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              {t('Submissions vs. the prior 30-day period, by category.')}
            </p>
            {trends.length ? trends.map((tr, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <p className="text-small" style={{ margin: 0 }}>{label(tr.label)}</p>
                  <span className="text-caption text-mono">{tr.current} {t('vs')} {tr.previous}</span>
                </div>
                {tr.growth_pct === null ? (
                  <span className="badge badge-neutral">{t('New')}</span>
                ) : (
                  <span className={`badge ${tr.growth_pct >= 0 ? 'badge-success' : 'badge-danger'}`}>
                    <Icon name={tr.growth_pct >= 0 ? 'trend' : 'chevron-down'} size={12} /> {(tr.growth_pct >= 0 ? '+' : '') + tr.growth_pct}%
                  </span>
                )}
              </div>
            )) : <p className="text-caption">{t('Not enough data yet to compute trends.')}</p>}
          </div>

          <div className="card glass-panel">
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-4)' }}>{t('University Growth Map')}</h3>
            {Object.keys(universityMap).length ? Object.entries(universityMap).slice(0, 6).map(([uniId, g]) => (
              <div key={uniId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-small text-mono">#{uniId}</span>
                <span className="text-caption">{g.current} {t('vs')} {g.previous}</span>
                {g.growth_pct === null ? (
                  <span className="badge badge-neutral">{t('New')}</span>
                ) : (
                  <span className={`badge ${g.growth_pct >= 0 ? 'badge-success' : 'badge-danger'}`}>{(g.growth_pct >= 0 ? '+' : '') + g.growth_pct}%</span>
                )}
              </div>
            )) : <p className="text-caption">{t('Not enough data yet.')}</p>}
          </div>

          <div className="card glass-panel">
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-3)' }}>{t('Recent Exports')}</h3>
            {recentExports.length ? recentExports.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-small">{String(e.export_type || '').replace(/_/g, ' ')}</span>
                <span className={`badge ${e.status === 'completed' ? 'badge-success' : 'badge-neutral'}`}>{e.status}</span>
              </div>
            )) : <p className="text-caption">{t('No exports yet.')}</p>}
          </div>

          <div className="card glass-panel">
            <h3 className="text-h3" style={{ marginBottom: 'var(--space-3)' }}>{t('My Saved Dashboards')}</h3>
            {savedDashboards.length ? savedDashboards.slice(0, 5).map((d) => (
              <div
                key={d.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}
              >
                <span className="text-small">{d.name}</span>
                {d.is_default ? <span className="badge badge-primary">{t('Default')}</span> : null}
              </div>
            )) : <p className="text-caption">{t('No saved dashboards yet.')}</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
