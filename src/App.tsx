import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { SessionHomePage } from '@/pages/SessionHomePage';
import { SessionStubPage } from '@/pages/SessionStubPage';
import { CreateSessionPage } from '@/pages/CreateSessionPage';
import { JoinSessionPage } from '@/pages/JoinSessionPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';

function AppRoutes() {
  const { user, player, loading, needsProfile } = useAuthContext();

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
        <Route path="session/:sessionId" element={<SessionStubPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
