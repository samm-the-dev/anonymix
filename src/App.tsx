import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { SessionHomePage } from '@/pages/SessionHomePage';
import { SessionViewPage } from '@/pages/SessionViewPage';
import { CreateSessionPage } from '@/pages/CreateSessionPage';
import { JoinSessionPage } from '@/pages/JoinSessionPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';
import { TermsPage } from '@/pages/TermsPage';

const PENDING_PATH_KEY = 'anonymix-pending-path';

function AppRoutes() {
  const { user, player, loading, needsProfile } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Stash current path when not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/') {
      localStorage.setItem(PENDING_PATH_KEY, location.pathname);
    }
  }, [loading, user, location.pathname]);

  // Restore pending path after auth + profile complete
  useEffect(() => {
    if (player) {
      const pending = localStorage.getItem(PENDING_PATH_KEY);
      if (pending) {
        localStorage.removeItem(PENDING_PATH_KEY);
        navigate(pending, { replace: true });
      }
    }
  }, [player, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (needsProfile) return <ProfileSetupPage />;
  if (!player) return null;

  return (
    <Routes>
      <Route path="create" element={<CreateSessionPage />} />
      <Route path="join/:sessionId" element={<JoinSessionPage />} />
      <Route element={<Layout />}>
        <Route index element={<SessionHomePage />} />
        <Route path="session/:sessionId" element={<SessionViewPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<AuthProvider><AppRoutes /></AuthProvider>} />
      </Routes>
    </BrowserRouter>
  );
}
