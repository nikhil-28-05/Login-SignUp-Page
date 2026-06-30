import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardView = () => {
  const { user, token, logout, isVerifying, serverError, checkVerification } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState("Checking…");

  const getMaskedToken = (t) => {
    if (!t) return "—";
    return `${t.slice(0, 14)}…${t.slice(-6)}`;
  };

  useEffect(() => {
    if (isVerifying) {
      setVerificationStatus("Checking…");
    } else if (serverError) {
      setVerificationStatus("Could not verify (server unreachable)");
    } else {
      setVerificationStatus("Verified by server");
    }
  }, [isVerifying, serverError]);

  return (
    <div className="dash-shell">
      <div className="dash-topbar">
        <div className="brand-mark">
          <span className="dot"></span> Vaultline
        </div>
        <button className="btn-ghost" onClick={logout}>Sign out</button>
      </div>

      <main className="dash-main">
        <p className="kicker">Authenticated session</p>
        <h1>Welcome, <span id="userEmail">{user?.email || "member"}</span></h1>
        <p>This page is only reachable with a valid token, verified server-side by the <code>/pages/dashboard</code> route's auth middleware.</p>

        <div className="dash-card">
          <div className="row">
            <span>Status</span>
            <span style={{ 
              color: serverError ? 'var(--rust)' : (isVerifying ? 'var(--brass)' : 'var(--sage)'),
              fontWeight: 500
            }}>
              {verificationStatus}
            </span>
          </div>
          <div className="row">
            <span>Token</span>
            <span title={token}>{getMaskedToken(token)}</span>
          </div>
          <div className="row">
            <span>Endpoint</span>
            <span>GET /pages/dashboard</span>
          </div>
        </div>

        {serverError && (
          <div style={{ marginTop: '24px' }}>
            <button 
              className="btn-ghost" 
              style={{ color: 'var(--ink-text)', borderColor: 'var(--parchment-dim)' }}
              onClick={checkVerification}
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Retry Verification"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardView;
