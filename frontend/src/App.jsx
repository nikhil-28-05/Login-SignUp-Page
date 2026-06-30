import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import BrandPanel from './components/BrandPanel';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import DashboardView from './components/DashboardView';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'signup'

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--parchment)',
        color: 'var(--ink-text)'
      }}>
        <div className="btn-submit loading" style={{ background: 'none', color: 'var(--ink-text)', cursor: 'default' }}>
          <span className="spinner" style={{ display: 'block', borderTopColor: 'var(--ink)' }}></span>
          <span className="btn-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.08em' }}>
            VERIFYING SECURE KEY...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardView />;
  }

  return (
    <div className="shell">
      <BrandPanel isSignup={view === 'signup'} />
      {view === 'login' ? (
        <LoginForm onToggleView={setView} />
      ) : (
        <SignupForm onToggleView={setView} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
