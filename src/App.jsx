import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLoading from './components/PageLoading';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import DataAnalysisDashboard from './pages/data-analysis/DataAnalysisDashboard';

// Trimmed down from the full UIP platform's App.jsx: this standalone build
// only ships two screens — the Login page and the Data Analysis Dashboard —
// wired to a standalone Laravel backend with the exact same auth + dashboard
// contract as the original.
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/auth/login" replace />} />
                  <Route path="/auth/login" element={<Login />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/data-analysis/dashboard" element={<DataAnalysisDashboard />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/auth/login" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
